import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, Zap, ExternalLink, TrendingUp, Target } from 'lucide-react';

interface Opportunity {
  dapp: string;
  action: string;
  impact: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
  description: string;
}

interface OpportunityEngineProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  isLoading: boolean;
  weakestArea: string;
}

const OpportunityEngine: React.FC<OpportunityEngineProps> = ({
  isOpen,
  onClose,
  opportunities,
  isLoading,
  weakestArea
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      // Modal entrance with 3D flip effect
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0, rotationX: -90 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationX: 0,
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      );

      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      // Staggered card animations when opportunities load
      if (!isLoading && opportunities.length > 0 && cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 50, rotationY: 45 },
          { 
            opacity: 1, 
            y: 0, 
            rotationY: 0,
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
        rotationX: 90,
        duration: 0.4,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen, isLoading, opportunities.length]);

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'defi': return <TrendingUp className="w-5 h-5" />;
      case 'governance': return <Target className="w-5 h-5" />;
      case 'staking': return <Zap className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Opportunity Engine</h2>
              <p className="text-gray-300">
                Personalized actions to boost your reputation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Weakness Analysis */}
        {weakestArea && (
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20 rounded-xl p-4 mb-6">
            <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-400" />
              <span>Focus Area Identified</span>
            </h3>
            <p className="text-gray-300">
              Your <span className="text-orange-400 font-semibold">{weakestArea}</span> score 
              has the most room for improvement. The opportunities below are specifically 
              tailored to strengthen this area.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">AI Analyzing Your Profile</p>
            <p className="text-gray-400">
              Scanning the Internet Computer ecosystem for personalized opportunities...
            </p>
          </div>
        )}

        {/* Opportunities Grid */}
        {!isLoading && opportunities.length > 0 && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-purple-400/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(opportunity.category)}
                    <span className="text-white font-semibold">{opportunity.dapp}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty}
                  </div>
                </div>

                {/* Action */}
                <h4 className="text-white font-semibold mb-2">{opportunity.action}</h4>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {opportunity.description}
                </p>

                {/* Impact & Timeframe */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Expected Impact</span>
                    <span className="text-green-400 font-semibold">{opportunity.impact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Timeframe</span>
                    <span className="text-blue-400">{opportunity.timeframe}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg text-purple-400 hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 transition-all duration-200 group-hover:scale-105">
                  <span>Take Action</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && opportunities.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Opportunities Found</h3>
            <p className="text-gray-400">
              Your reputation profile is already well-optimized! Check back later for new opportunities.
            </p>
          </div>
        )}

        {/* Footer */}
        {!isLoading && opportunities.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Opportunities are updated daily based on ecosystem changes and your activity patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityEngine;