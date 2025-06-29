import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Brain, HelpCircle, LogOut, Plus, Shield, Zap } from 'lucide-react';

interface ActionHubProps {
  onGetLoanIdeas: () => void;
  onExplainScore: () => void;
  onDisconnect: () => void;
  onMintSoulbound: () => void;
  isSimulationMode: boolean;
}

const ActionHub: React.FC<ActionHubProps> = ({
  onGetLoanIdeas,
  onExplainScore,
  onDisconnect,
  onMintSoulbound,
  isSimulationMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonsRef.current) return;

    const buttons = buttonsRef.current.children;

    if (isExpanded) {
      // Expand animation with enhanced effects
      gsap.to(hubRef.current, {
        scale: 1.2,
        rotation: 45,
        duration: 0.4,
        ease: "back.out(1.7)"
      });

      // Staggered button appearance with 3D effects
      gsap.fromTo(buttons,
        { 
          scale: 0, 
          opacity: 0,
          rotationY: 180,
          z: -100
        },
        { 
          scale: 1, 
          opacity: 1,
          rotationY: 0,
          z: 0,
          duration: 0.5, 
          stagger: 0.1,
          delay: 0.1,
          ease: "back.out(1.7)" 
        }
      );
    } else {
      // Collapse animation
      gsap.to(buttons, {
        scale: 0,
        opacity: 0,
        rotationY: -180,
        z: -100,
        duration: 0.2,
        stagger: 0.05
      });

      gsap.to(hubRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        delay: 0.1,
        ease: "power2.out"
      });
    }
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action buttons */}
      <div 
        ref={buttonsRef}
        className="absolute bottom-20 right-0 space-y-3"
      >
        <button
          onClick={onGetLoanIdeas}
          className="flex items-center justify-center w-14 h-14 bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 rounded-full text-purple-400 hover:bg-purple-500/30 hover:scale-110 transition-all duration-200 group"
          title="Find Opportunities"
        >
          <Zap className="w-6 h-6" />
        </button>

        <button
          onClick={onMintSoulbound}
          className="flex items-center justify-center w-14 h-14 bg-gold-500/20 backdrop-blur-lg border border-gold-400/30 rounded-full text-gold-400 hover:bg-gold-500/30 hover:scale-110 transition-all duration-200 group"
          title="Mint Reputation SBT"
        >
          <Shield className="w-6 h-6" />
        </button>

        <button
          onClick={onExplainScore}
          className="flex items-center justify-center w-14 h-14 bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 rounded-full text-blue-400 hover:bg-blue-500/30 hover:scale-110 transition-all duration-200 group"
          title="Explain My Score"
        >
          <HelpCircle className="w-6 h-6" />
        </button>

        <button
          onClick={onDisconnect}
          className="flex items-center justify-center w-14 h-14 bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-full text-red-400 hover:bg-red-500/30 hover:scale-110 transition-all duration-200 group"
          title="Disconnect"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Main hub button with simulation mode styling */}
      <button
        ref={hubRef}
        onClick={handleToggle}
        className={`flex items-center justify-center w-16 h-16 backdrop-blur-2xl rounded-full transition-all duration-300 group ${
          isSimulationMode 
            ? 'bg-gold-500/20 border border-gold-400/30 text-gold-400 hover:border-gold-400/50' 
            : 'bg-black/40 border border-white/20 text-white hover:border-blue-400/50'
        }`}
      >
        <Plus 
          className={`w-6 h-6 transition-transform duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`} 
        />
      </button>
    </div>
  );
};

export default ActionHub;