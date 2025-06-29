import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Loader, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';

interface RealIdentityViewProps {
  onConnect: (identity: any, principal: any) => void;
}

const RealIdentityView: React.FC<RealIdentityViewProps> = ({ onConnect }) => {
  const logoRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize breathing animation for the button
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { scale: 1 });
      
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Glowing border animation
      gsap.to(buttonRef.current, {
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)",
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Logo floating animation
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        y: -10,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await authService.login();
      
      if (result.success && result.identity && result.principal) {
        // CRITICAL: This triggers the morphing transition to the main dashboard
        onConnect(result.identity, result.principal);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setError('Failed to connect to Internet Identity. Please check your connection and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-10"
    >
      {/* Internet Identity Logo - This will morph into the Reputation Orb */}
      <div className="mb-12" id="identity-logo">
        <svg
          ref={logoRef}
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="text-blue-400"
          fill="currentColor"
        >
          {/* Internet Identity inspired logo that will morph */}
          <circle cx="60" cy="60" r="50" className="fill-blue-500/20 stroke-blue-400 stroke-2" />
          <circle cx="60" cy="60" r="30" className="fill-blue-500/40" />
          <circle cx="60" cy="60" r="15" className="fill-blue-400" />
          <path d="M60 20 L80 40 L60 60 L40 40 Z" className="fill-white/80" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">
        OnChain<span className="text-blue-400">Score</span>
      </h1>
      
      <p className="text-xl text-gray-300 mb-12 text-center max-w-md">
        Your Web3 credit identity on the Internet Computer
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl flex items-center space-x-3 max-w-md">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Connect Button with Real Internet Identity Integration */}
      <button
        ref={buttonRef}
        onClick={handleConnect}
        disabled={isConnecting}
        className="group relative px-8 py-4 bg-black/40 backdrop-blur-2xl border border-blue-500/30 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-3">
          {isConnecting ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Shield className="w-6 h-6" />
          )}
          <span>
            {isConnecting ? 'Connecting...' : 'Connect with Internet Identity'}
          </span>
        </div>
        
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-400/30 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Subtitle */}
      <p className="text-sm text-gray-400 mt-6 text-center">
        Secure, decentralized authentication via Internet Identity
      </p>

      {/* Connection Status */}
      {isConnecting && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm">Establishing secure connection...</span>
          </div>
        </div>
      )}

      {/* Development Mode Notice */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-xs">Development Mode - Using Local Internet Identity</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealIdentityView;