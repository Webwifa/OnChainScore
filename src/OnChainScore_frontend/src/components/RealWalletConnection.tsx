import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Wallet, Shield, CheckCircle, AlertCircle, Copy, ExternalLink, Loader } from 'lucide-react';
import { icpWalletService, WalletConnection } from '../services/icpWallet';
import { Identity } from '@dfinity/agent';

interface RealWalletConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: (wallet: WalletConnection) => void;
  connectedWallets: WalletConnection[];
  currentIdentity: Identity | null;
}

const RealWalletConnection: React.FC<RealWalletConnectionProps> = ({
  isOpen,
  onClose,
  onWalletConnect,
  connectedWallets,
  currentIdentity
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const walletsRef = useRef<HTMLDivElement>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableWallets = [
    {
      type: 'internet-identity',
      name: 'Internet Identity',
      icon: <Shield className="w-6 h-6" />,
      description: 'Already connected via main authentication',
      isAvailable: !!currentIdentity,
      isMainAuth: true
    },
    {
      type: 'plug',
      name: 'Plug Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Browser extension wallet for ICP',
      isAvailable: !!(window as any).ic?.plug,
      isMainAuth: false
    },
    {
      type: 'stoic',
      name: 'Stoic Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Web-based ICP wallet',
      isAvailable: !!(window as any).ic?.stoic,
      isMainAuth: false
    },
    {
      type: 'bitfinity',
      name: 'Bitfinity Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Multi-chain wallet with ICP support',
      isAvailable: !!(window as any).ic?.bitfinity,
      isMainAuth: false
    },
    {
      type: 'nfid',
      name: 'NFID',
      icon: <Shield className="w-6 h-6" />,
      description: 'NFT-based identity wallet',
      isAvailable: !!(window as any).ic?.nfid,
      isMainAuth: false
    }
  ];

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0, rotationY: 180 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationY: 0,
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      );

      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      if (walletsRef.current) {
        const walletCards = walletsRef.current.children;
        gsap.fromTo(walletCards,
          { opacity: 0, y: 30, rotationX: -45 },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0,
            duration: 0.5, 
            stagger: 0.1, 
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    } else {
      gsap.to(modalRef.current, {
        scale: 0,
        opacity: 0,
        rotationY: -180,
        duration: 0.4,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);

  const handleWalletConnect = async (walletType: string) => {
    setConnectingWallet(walletType);
    setError(null);

    try {
      let connection: WalletConnection | null = null;

      switch (walletType) {
        case 'internet-identity':
          if (currentIdentity) {
            connection = await icpWalletService.connectInternetIdentity(currentIdentity);
          }
          break;
        case 'plug':
          connection = await icpWalletService.connectPlug();
          break;
        case 'stoic':
          connection = await icpWalletService.connectStoic();
          break;
        default:
          throw new Error(`Wallet type ${walletType} not yet implemented`);
      }

      if (connection) {
        onWalletConnect(connection);
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet. Please ensure the wallet is installed and try again.');
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleDisconnect = async (walletType: string) => {
    try {
      await icpWalletService.disconnectWallet(walletType);
      // The parent component should handle removing from connectedWallets
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Wallet Connections</h2>
              <p className="text-gray-300">Manage your ICP wallet connections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <ExternalLink className="w-6 h-6 text-white rotate-45" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Connected Wallets */}
        {connectedWallets.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Connected Wallets</h3>
            <div className="space-y-3">
              {connectedWallets.map((wallet, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-500/10 border border-green-400/30 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400">
                      {wallet.type === 'internet-identity' ? <Shield className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="text-white font-medium">{wallet.name}</div>
                      <div className="text-green-400 text-sm flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} ICP
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm font-mono">
                        {wallet.principal.toString().slice(0, 8)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.principal.toString())}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Wallets */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Available Wallets</h3>
          <div ref={walletsRef} className="grid grid-cols-1 gap-4">
            {availableWallets
              .filter(wallet => !connectedWallets.some(cw => cw.type === wallet.type))
              .map((wallet, index) => (
              <button
                key={wallet.type}
                onClick={() => wallet.isAvailable ? handleWalletConnect(wallet.type) : null}
                disabled={!wallet.isAvailable || connectingWallet === wallet.type}
                className={`group p-6 backdrop-blur-lg border rounded-xl text-left transition-all duration-300 ${
                  wallet.isAvailable 
                    ? 'bg-white/5 border-white/10 hover:border-blue-400/30 hover:bg-white/10 cursor-pointer' 
                    : 'bg-gray-500/5 border-gray-500/20 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`transition-transform duration-200 ${
                    wallet.isAvailable ? 'text-blue-400 group-hover:scale-110' : 'text-gray-500'
                  }`}>
                    {connectingWallet === wallet.type ? (
                      <Loader className="w-6 h-6 animate-spin" />
                    ) : (
                      wallet.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-semibold">{wallet.name}</h4>
                      {wallet.isMainAuth && (
                        <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-400">
                          Main Auth
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {connectingWallet === wallet.type ? (
                        'Connecting...'
                      ) : wallet.isAvailable ? (
                        wallet.description
                      ) : (
                        'Not installed or available'
                      )}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>All wallet connections are secure and encrypted</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your private keys never leave your wallet. OnChainScore only reads public transaction data.
          </p>
        </div>
      </div>
    </>
  );
};

export default RealWalletConnection;