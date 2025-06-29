import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';

interface ScoreFactorDetailProps {
  factor: {
    name: 'Transaction Consistency' | 'DeFi Footprint' | 'Asset Diversity' | 'Governance Activity';
    score: number;
    weight: number;
    summary: string;
  } | null;
  isVisible: boolean;
  onClose: () => void;
}

const ScoreFactorDetail: React.FC<ScoreFactorDetailProps> = ({ 
  factor, 
  isVisible, 
  onClose 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    if (isVisible && factor) {
      // Slide up animation
      gsap.fromTo(panelRef.current, 
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          duration: 0.5, 
          ease: "power3.out" 
        }
      );

      // Animate the progress bar
      if (chartRef.current) {
        gsap.fromTo(chartRef.current,
          { width: "0%" },
          { 
            width: `${factor.score}%`, 
            duration: 1, 
            delay: 0.3, 
            ease: "power2.out" 
          }
        );
      }

      // Staggered text animation
      if (textRef.current) {
        const textElements = textRef.current.children;
        gsap.fromTo(textElements,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4, 
            stagger: 0.1, 
            delay: 0.2,
            ease: "power2.out" 
          }
        );
      }
    } else {
      // Slide down animation
      gsap.to(panelRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isVisible, factor]);

  if (!isVisible || !factor) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/20 p-6 z-50"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div ref={textRef}>
            <h3 className="text-2xl font-bold text-white">{factor.name}</h3>
            <p className="text-gray-300">Weight: {Math.round(factor.weight * 100)}% of total score</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Score visualization */}
        <div ref={textRef} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(factor.score)}`}>
              {factor.score}/100
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={chartRef}
              className={`h-full ${getProgressColor(factor.score)} rounded-full relative`}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Poor</span>
            <span className={getScoreColor(factor.score)}>
              {getScoreDescription(factor.score)}
            </span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Summary */}
        <div ref={textRef} className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">About This Factor</h4>
            <p className="text-gray-300 leading-relaxed">{factor.summary}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Impact on Your Score</h4>
            <p className="text-gray-300 leading-relaxed">
              This factor contributes <span className="text-blue-400 font-semibold">
              {Math.round(factor.weight * factor.score)} points</span> to your total OnChainScore of{' '}
              <span className="text-blue-400 font-semibold">785</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreFactorDetail;