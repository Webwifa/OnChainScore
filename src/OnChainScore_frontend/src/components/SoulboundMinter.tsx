import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Sparkles, Check, ExternalLink } from 'lucide-react';

interface SoulboundMinterProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: {
    totalScore: number;
    loanEligibility: number;
    factors: Array<{
      name: string;
      score: number;
      weight: number;
    }>;
  };
  onMint: () => void;
}

const SoulboundMinter: React.FC<SoulboundMinterProps> = ({
  isOpen,
  onClose,
  scoreData,
  onMint
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const [mintingStage, setMintingStage] = useState<'preview' | 'minting' | 'complete'>('preview');
  const [mintedTokenId, setMintedTokenId] = useState<string>('');

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      // Modal entrance animation
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

  const handleMint = async () => {
    setMintingStage('minting');
    
    // Spectacular minting animation sequence
    if (tokenRef.current) {
      const mintingTimeline = gsap.timeline();
      
      // Stage 1: Token formation
      mintingTimeline
        .to(tokenRef.current, {
          scale: 1.5,
          rotation: 360,
          duration: 1,
          ease: "power2.out"
        })
        // Stage 2: Energy absorption effect
        .to(tokenRef.current, {
          boxShadow: "0 0 50px rgba(59, 130, 246, 0.8), 0 0 100px rgba(147, 51, 234, 0.6)",
          duration: 0.5,
          ease: "power2.inOut"
        })
        // Stage 3: Compression and morphing
        .to(tokenRef.current, {
          scale: 0.8,
          borderRadius: "50%",
          duration: 0.3,
          ease: "power2.in"
        })
        // Stage 4: Final expansion and completion
        .to(tokenRef.current, {
          scale: 1,
          borderRadius: "16px",
          duration: 0.4,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Generate mock token ID
            const tokenId = `SBT-${Date.now().toString(36).toUpperCase()}`;
            setMintedTokenId(tokenId);
            setMintingStage('complete');
            onMint();
          }
        });
    }
  };

  if (!isOpen) return null;

  const renderPreview = () => (
    <div className="text-center">
      <div className="mb-6">
        <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Mint Reputation SBT</h2>
        <p className="text-gray-300">
          Create a permanent, non-transferable token representing your OnChainScore
        </p>
      </div>

      {/* Token Preview */}
      <div
        ref={tokenRef}
        className="relative w-64 h-80 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl" />
        
        {/* Token Header */}
        <div className="relative z-10 text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold">OnChainScore SBT</h3>
          <p className="text-gray-400 text-sm">Soulbound Token</p>
        </div>

        {/* Score Display */}
        <div className="relative z-10 text-center mb-4">
          <div className="text-3xl font-bold text-white mb-1">{scoreData.totalScore}</div>
          <div className="text-sm text-gray-300">Reputation Score</div>
        </div>

        {/* Factor Breakdown */}
        <div className="relative z-10 space-y-2">
          {scoreData.factors.slice(0, 3).map((factor, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-400">{factor.name.split(' ')[0]}</span>
              <span className="text-white">{factor.score}</span>
            </div>
          ))}
        </div>

        {/* Sparkle effects */}
        <div className="absolute top-4 right-4">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Benefits */}
      <div className="text-left mb-6 space-y-3">
        <div className="flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-gray-300">Permanent proof of your Web3 reputation</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-gray-300">Composable across DeFi protocols</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-gray-300">Non-transferable and tamper-proof</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-600/20 border border-gray-500/30 rounded-xl text-gray-300 hover:bg-gray-600/30 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleMint}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          Mint SBT
        </button>
      </div>
    </div>
  );

  const renderMinting = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Minting Your SBT</h2>
        <p className="text-gray-300">
          Creating your permanent reputation token on the Internet Computer...
        </p>
      </div>

      <div className="space-y-3 text-left">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-300">Analyzing reputation data...</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-gray-300">Generating cryptographic proof...</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span className="text-gray-300">Minting on Internet Computer...</span>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">SBT Minted Successfully!</h2>
        <p className="text-gray-300">
          Your reputation is now permanently recorded on the Internet Computer
        </p>
      </div>

      <div className="bg-black/20 border border-green-400/30 rounded-xl p-4 mb-6">
        <div className="text-sm text-gray-400 mb-1">Token ID</div>
        <div className="font-mono text-green-400 text-lg">{mintedTokenId}</div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Score Captured</span>
          <span className="text-white font-semibold">{scoreData.totalScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Mint Date</span>
          <span className="text-white">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Network</span>
          <span className="text-white">Internet Computer</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-600/20 border border-gray-500/30 rounded-xl text-gray-300 hover:bg-gray-600/30 transition-all duration-200"
        >
          Close
        </button>
        <button
          className="flex-1 px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>View on Explorer</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {mintingStage === 'preview' && renderPreview()}
        {mintingStage === 'minting' && renderMinting()}
        {mintingStage === 'complete' && renderComplete()}
      </div>
    </div>
  );
};

export default SoulboundMinter;