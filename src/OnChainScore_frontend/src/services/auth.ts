import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { DebugLogger } from '../utils/debug';

export interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: Principal | null;
  authClient: AuthClient | null;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initPromise: Promise<AuthClient> | null = null;

  async init(): Promise<AuthClient> {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (!this.authClient) {
      this.initPromise = AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      }).then(client => {
        this.authClient = client;
        this.initPromise = null;
        return client;
      });
      
      return this.initPromise;
    }
    return this.authClient;
  }

  async login(): Promise<{ success: boolean; identity?: Identity; principal?: Principal }> {
    try {
      // For local development without Internet Identity, return a mock successful login
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        DebugLogger.log('Auth', 'Mock login for local development');
        return { success: true };
      }

      const authClient = await this.init();
      
      // Get the correct identity provider URL
      const identityProvider = 'https://identity.ic0.app';
      
      DebugLogger.log('Auth', 'Starting login process', { identityProvider });
      
      return new Promise((resolve) => {
        authClient.login({
          identityProvider,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          onSuccess: () => {
            try {
              this.identity = authClient.getIdentity();
              const principal = this.identity.getPrincipal();
              
              // Validate principal
              if (principal.isAnonymous()) {
                DebugLogger.error('Auth', 'Received anonymous principal');
                resolve({ success: false });
                return;
              }
              
              DebugLogger.log('Auth', 'Authentication successful', {
                principalText: principal.toText(),
                principalBytes: principal.toUint8Array()
              });
              
              resolve({
                success: true,
                identity: this.identity,
                principal
              });
            } catch (error) {
              DebugLogger.error('Auth', 'Error processing authentication result', error);
              resolve({ success: false });
            }
          },
          onError: (error) => {
            DebugLogger.error('Auth', 'Authentication failed', error);
            resolve({ success: false });
          }
        });
      });
    } catch (error) {
      DebugLogger.error('Auth', 'Login initialization failed', error);
      return { success: false };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.authClient) {
        await this.authClient.logout();
        this.identity = null;
        DebugLogger.log('Auth', 'Logout successful');
      }
    } catch (error) {
      DebugLogger.error('Auth', 'Logout failed', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const authClient = await this.init();
      const isAuth = await authClient.isAuthenticated();
      DebugLogger.log('Auth', 'Authentication status check', { isAuthenticated: isAuth });
      return isAuth;
    } catch (error) {
      DebugLogger.error('Auth', 'Error checking authentication status', error);
      return false;
    }
  }

  async getIdentity(): Promise<Identity | null> {
    try {
      const authClient = await this.init();
      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        this.identity = identity;
        return identity;
      }
      return null;
    } catch (error) {
      DebugLogger.error('Auth', 'Error getting identity', error);
      return null;
    }
  }

  getPrincipal(): Principal | null {
    try {
      if (this.identity) {
        const principal = this.identity.getPrincipal();
        if (!principal.isAnonymous()) {
          return principal;
        }
      }
      return null;
    } catch (error) {
      DebugLogger.error('Auth', 'Error getting principal', error);
      return null;
    }
  }
}

export const authService = new AuthService();