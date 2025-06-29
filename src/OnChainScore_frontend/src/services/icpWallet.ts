import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// ICP Ledger Canister Interface
export interface ICPLedger {
  account_balance: (args: { account: Uint8Array }) => Promise<{ e8s: bigint }>;
  transfer: (args: {
    memo: bigint;
    amount: { e8s: bigint };
    fee: { e8s: bigint };
    from_subaccount?: Uint8Array;
    to: Uint8Array;
    created_at_time?: { timestamp_nanos: bigint };
  }) => Promise<{ Ok?: bigint; Err?: any }>;
}

// Plug Wallet Interface
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (options?: { whitelist?: string[]; host?: string }) => Promise<boolean>;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<void>;
        getPrincipal: () => Promise<Principal>;
        getBalance: () => Promise<number>;
        requestBalance: () => Promise<number>;
        agent: HttpAgent;
      };
    };
  }
}

export interface WalletConnection {
  type: 'internet-identity' | 'plug' | 'stoic' | 'bitfinity' | 'nfid';
  name: string;
  principal: Principal;
  balance: number;
  isConnected: boolean;
  agent?: HttpAgent;
}

class ICPWalletService {
  private readonly ICP_LEDGER_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
  private readonly WHITELIST = [this.ICP_LEDGER_CANISTER_ID];

  // Convert Principal to Account Identifier for ICP Ledger
  private principalToAccountId(principal: Principal, subAccount?: Uint8Array): Uint8Array {
    const sha224 = require('js-sha256').sha224;
    const principalBytes = principal.toUint8Array();
    const accountId = new Uint8Array(32);
    
    // Domain separator for account IDs
    const domainSeparator = new TextEncoder().encode('\x0Aaccount-id');
    const subAccountBytes = subAccount || new Uint8Array(32);
    
    const hash = sha224.create();
    hash.update(domainSeparator);
    hash.update(principalBytes);
    hash.update(subAccountBytes);
    
    const hashArray = hash.array();
    accountId.set(hashArray);
    
    return accountId;
  }

  async connectInternetIdentity(identity: Identity): Promise<WalletConnection> {
    const principal = identity.getPrincipal();
    const agent = new HttpAgent({ 
      identity,
      host: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
    });

    if (process.env.NODE_ENV === 'development') {
      await agent.fetchRootKey();
    }

    const balance = await this.getICPBalance(principal, agent);

    return {
      type: 'internet-identity',
      name: 'Internet Identity',
      principal,
      balance,
      isConnected: true,
      agent
    };
  }

  async connectPlug(): Promise<WalletConnection | null> {
    if (!window.ic?.plug) {
      throw new Error('Plug wallet not installed');
    }

    try {
      const connected = await window.ic.plug.requestConnect({
        whitelist: this.WHITELIST,
        host: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
      });

      if (!connected) {
        throw new Error('User rejected connection');
      }

      const principal = await window.ic.plug.getPrincipal();
      const balance = await window.ic.plug.requestBalance();

      return {
        type: 'plug',
        name: 'Plug Wallet',
        principal,
        balance: balance / 100000000, // Convert from e8s to ICP
        isConnected: true,
        agent: window.ic.plug.agent
      };
    } catch (error) {
      console.error('Plug connection failed:', error);
      return null;
    }
  }

  async connectStoic(): Promise<WalletConnection | null> {
    try {
      // Stoic wallet connection logic
      const StoicIdentity = (window as any).ic?.stoic?.identity;
      if (!StoicIdentity) {
        throw new Error('Stoic wallet not available');
      }

      const identity = await StoicIdentity.connect();
      const principal = identity.getPrincipal();
      const agent = new HttpAgent({ identity });

      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      const balance = await this.getICPBalance(principal, agent);

      return {
        type: 'stoic',
        name: 'Stoic Wallet',
        principal,
        balance,
        isConnected: true,
        agent
      };
    } catch (error) {
      console.error('Stoic connection failed:', error);
      return null;
    }
  }

  private async getICPBalance(principal: Principal, agent: HttpAgent): Promise<number> {
    try {
      const ledgerActor = Actor.createActor<ICPLedger>(
        ({ IDL }) => IDL.Service({
          account_balance: IDL.Func(
            [IDL.Record({ account: IDL.Vec(IDL.Nat8) })],
            [IDL.Record({ e8s: IDL.Nat64 })],
            ['query']
          )
        }),
        {
          agent,
          canisterId: this.ICP_LEDGER_CANISTER_ID
        }
      );

      const accountId = this.principalToAccountId(principal);
      const balance = await ledgerActor.account_balance({ account: accountId });
      
      // Convert from e8s to ICP (1 ICP = 100,000,000 e8s)
      return Number(balance.e8s) / 100000000;
    } catch (error) {
      console.error('Failed to get ICP balance:', error);
      return 0;
    }
  }

  async disconnectWallet(type: string): Promise<void> {
    switch (type) {
      case 'plug':
        if (window.ic?.plug) {
          await window.ic.plug.disconnect();
        }
        break;
      case 'stoic':
        // Stoic disconnect logic
        if ((window as any).ic?.stoic) {
          await (window as any).ic.stoic.disconnect();
        }
        break;
      default:
        // For Internet Identity, we handle this in the auth service
        break;
    }
  }
}

export const icpWalletService = new ICPWalletService();