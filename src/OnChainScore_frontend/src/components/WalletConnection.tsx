import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Wallet, Shield, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface WalletInfo {
  type: 'internet-identity' | 'plug' | 'stoic' | 'bitfinity' | 'nfid';
  name: string;
  icon: React.ReactNode;
  principal?: string;
  balance?: number;
  isConnected: boolean;
  isConnecting?: boolean;
}

interface WalletConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: (wallet: WalletInfo) => void;
  connectedWallets: WalletInfo[];
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  isOpen,
  onClose,
  onWalletConnect,
  connectedWallets
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const walletsRef = useRef<HTMLDivElement>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  const availableWallets: WalletInfo[] = [
    {
      type: 'internet-identity',
      name: 'Internet Identity',
      icon: <Shield className="w-6 h-6" />,
      isConnected: false
    },
    {
      type: 'plug',
      name: 'Plug Wallet',
      icon: <Wallet className="w-6 h-6" />,
      isConnected: false
    },
    {
      type: 'stoic',
      name: 'Stoic Wallet',
      icon: <Wallet className="w-6 h-6" />,
      isConnected: false
    },
    {
      type: 'bitfinity',
      name: 'Bitfinity Wallet',
      icon: <Wallet className="w-6 h-6" />,
      isConnected: false
    },
    {
      type: 'nfid',
      name: 'NFID',
      icon: <Shield className="w-6 h-6" />,
      isConnected: false
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

  const handleWalletConnect = async (wallet: WalletInfo) => {
    setConnectingWallet(wallet.type);
    
    // Simulate connection process
    setTimeout(() => {
      const connectedWallet: WalletInfo = {
        ...wallet,
        isConnected: true,
        principal: `${wallet.type}-${Math.random().toString(36).substr(2, 9)}`,
        balance: Math.floor(Math.random() * 10000) + 100
      };
      
      onWalletConnect(connectedWallet);
      setConnectingWallet(null);
    }, 2000);
  };

  const handleDisconnect = (walletType: string) => {
    // Handle wallet disconnection
    console.log(`Disconnecting ${walletType}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
              <p className="text-gray-300">Choose your preferred ICP wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <ExternalLink className="w-6 h-6 text-white rotate-45" />
          </button>
        </div>

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
                    {wallet.icon}
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
                      {wallet.balance?.toLocaleString()} ICP
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm font-mono">
                        {wallet.principal?.slice(0, 8)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.principal || '')}
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
          <div ref={walletsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableWallets
              .filter(wallet => !connectedWallets.some(cw => cw.type === wallet.type))
              .map((wallet, index) => (
              <button
                key={wallet.type}
                onClick={() => handleWalletConnect(wallet)}
                disabled={connectingWallet === wallet.type}
                className="group p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-blue-400 group-hover:scale-110 transition-transform duration-200">
                    {wallet.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{wallet.name}</div>
                    <div className="text-gray-400 text-sm">
                      {connectingWallet === wallet.type ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          <span>Connecting...</span>
                        </div>
                      ) : (
                        'Click to connect'
                      )}
                    </div>
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
            <span>Your wallet connection is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;