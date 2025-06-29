import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { X, TrendingUp, Lightbulb } from 'lucide-react';

interface SimulatorControlProps {
  simulatedFactors: Array<{
    name: 'Transaction Consistency' | 'DeFi Footprint' | 'Asset Diversity' | 'Governance Activity';
    score: number;
    weight: number;
    summary: string;
  }>;
  isVisible: boolean;
  onClose: () => void;
  onSliderChange: (factor: string, value: number) => void;
  analystNote: string;
  isAnalyzing: boolean;
}

const SimulatorControl: React.FC<SimulatorControlProps> = ({
  simulatedFactors,
  isVisible,
  onClose,
  onSliderChange,
  analystNote,
  isAnalyzing
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const slidersRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    if (isVisible) {
      // Slide up animation with enhanced effects
      gsap.fromTo(panelRef.current, 
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          duration: 0.6, 
          ease: "power3.out" 
        }
      );

      // Staggered slider animations
      if (slidersRef.current) {
        const sliders = slidersRef.current.children;
        gsap.fromTo(sliders,
          { opacity: 0, x: -50 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    } else {
      gsap.to(panelRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  }, [isVisible]);

  // Animate analyst note when it changes
  useEffect(() => {
    if (noteRef.current && analystNote && !isAnalyzing) {
      gsap.fromTo(noteRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "power2.out" 
        }
      );
    }
  }, [analystNote, isAnalyzing]);

  if (!isVisible) return null;

  const simulationActions = [
    {
      name: 'DeFi Staking',
      factor: 'DeFi Footprint',
      min: 0,
      max: 50000,
      step: 1000,
      unit: 'ICP',
      description: 'Stake tokens in DeFi protocols'
    },
    {
      name: 'DAO Governance Votes',
      factor: 'Governance Activity',
      min: 0,
      max: 20,
      step: 1,
      unit: 'votes',
      description: 'Participate in governance decisions'
    },
    {
      name: 'Transaction Frequency',
      factor: 'Transaction Consistency',
      min: 0,
      max: 100,
      step: 5,
      unit: 'tx/month',
      description: 'Increase regular transaction activity'
    },
    {
      name: 'Asset Diversification',
      factor: 'Asset Diversity',
      min: 0,
      max: 15,
      step: 1,
      unit: 'tokens',
      description: 'Hold diverse token portfolio'
    }
  ];

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-gold-400/30 p-6 z-50"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-gold-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Reputation Simulator</h3>
              <p className="text-gray-300">Explore how actions impact your score</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Simulation Controls */}
        <div ref={slidersRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {simulationActions.map((action, index) => {
            const currentFactor = simulatedFactors.find(f => f.name === action.factor);
            const currentValue = currentFactor ? Math.floor(currentFactor.score * action.max / 100) : 0;

            return (
              <div key={action.name} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-semibold">{action.name}</h4>
                  <span className="text-blue-400 font-mono">
                    {currentValue.toLocaleString()} {action.unit}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                
                {/* Custom Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min={action.min}
                    max={action.max}
                    step={action.step}
                    value={currentValue}
                    onChange={(e) => onSliderChange(action.factor, parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-gold"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{action.min}</span>
                    <span>{action.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Analyst Note */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">AI Analyst's Note</h4>
          </div>
          
          <div ref={noteRef} className="text-gray-300 leading-relaxed">
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing impact...</span>
              </div>
            ) : analystNote ? (
              <p>{analystNote}</p>
            ) : (
              <p className="text-gray-500">Adjust the sliders above to see AI insights on how these actions would impact your reputation.</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider-gold::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }
        
        .slider-gold::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SimulatorControl;