import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, Brain, Zap, Shield } from 'lucide-react';
import { gsap } from 'gsap';

interface ScoreFactor {
  name: string;
  score: number;
  weight: number;
  summary: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
  confidence?: number;
  lastUpdate?: Date;
}

interface EnhancedScoreData {
  totalScore: number;
  loanEligibility: number;
  factors: ScoreFactor[];
  lastUpdated: Date;
  riskLevel?: 'low' | 'medium' | 'high';
  confidence?: number;
  improvementPotential?: number;
}

interface EnhancedScoreDisplayProps {
  scoreData: EnhancedScoreData;
  isAnimating: boolean;
}

const EnhancedScoreDisplay: React.FC<EnhancedScoreDisplayProps> = ({
  scoreData,
  isAnimating
}) => {
  const [selectedFactor, setSelectedFactor] = useState<ScoreFactor | null>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const factorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && scoreRef.current) {
      // Animate score counter
      gsap.fromTo(scoreRef.current, 
        { textContent: 0 },
        { 
          textContent: scoreData.totalScore,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            if (scoreRef.current) {
              scoreRef.current.textContent = Math.round(this.targets()[0].textContent).toString();
            }
          }
        }
      );

      // Animate factors
      if (factorsRef.current) {
        gsap.fromTo(factorsRef.current.children,
          { x: -50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.2,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }, [scoreData, isAnimating]);

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-400';
    if (score >= 650) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 750) return 'from-green-500 to-emerald-600';
    if (score >= 650) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Main Score Display */}
      <div className="relative">
        <div className={`bg-gradient-to-br ${getScoreGradient(scoreData.totalScore)} p-8 rounded-3xl shadow-2xl border border-white/10`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your OnChainScore</h2>
              <p className="text-white/80">Updated {scoreData.lastUpdated.toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-3">
              {scoreData.riskLevel && (
                <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getRiskColor(scoreData.riskLevel)}`}>
                  <Shield className="w-4 h-4 inline mr-1" />
                  {scoreData.riskLevel.toUpperCase()} RISK
                </div>
              )}
              {scoreData.confidence && (
                <div className="bg-white/20 px-3 py-1 rounded-lg text-sm font-medium text-white">
                  <Brain className="w-4 h-4 inline mr-1" />
                  {scoreData.confidence}% Confidence
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <div 
                  ref={scoreRef}
                  className={`text-6xl font-bold ${getScoreColor(scoreData.totalScore)}`}
                >
                  {scoreData.totalScore}
                </div>
                <div className="text-white/60 text-lg">/850</div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-white/80">
                  <span>Loan Eligibility</span>
                  <span className="font-bold">{formatCurrency(scoreData.loanEligibility)}</span>
                </div>
                
                {scoreData.improvementPotential && (
                  <div className="flex items-center justify-between text-white/80">
                    <span>Improvement Potential</span>
                    <span className="font-bold text-green-300">
                      <Zap className="w-4 h-4 inline mr-1" />
                      +{scoreData.improvementPotential} points
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Score Progress Circle */}
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${(scoreData.totalScore / 850) * 100}, 100`}
                  strokeLinecap="round"
                  fill="transparent"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {Math.round((scoreData.totalScore / 850) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Factors */}
      <div className="space-y-4" ref={factorsRef}>
        <h3 className="text-xl font-bold text-white">Score Breakdown</h3>
        
        {scoreData.factors.map((factor) => (
          <div
            key={factor.name}
            className={`bg-gray-800/50 border rounded-xl p-6 transition-all duration-300 cursor-pointer hover:bg-gray-800/70 ${
              selectedFactor?.name === factor.name 
                ? 'border-purple-500/50 bg-gray-800/70' 
                : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
            onClick={() => setSelectedFactor(selectedFactor?.name === factor.name ? null : factor)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold text-white">{factor.name}</h4>
                {factor.trend && getTrendIcon(factor.trend)}
                {factor.confidence && (
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                    {factor.confidence}% confidence
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  {Math.round(factor.weight * 100)}% weight
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(factor.score)}`}>
                  {factor.score}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-3">
              <div
                className={`bg-gradient-to-r ${getScoreGradient(factor.score)} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${(factor.score / 250) * 100}%` }}
              />
            </div>

            {/* Factor Summary */}
            <p className="text-gray-300 text-sm mb-3">{factor.summary}</p>

            {/* Expanded Details */}
            {selectedFactor?.name === factor.name && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current Score:</span>
                    <div className="font-bold text-white">{factor.score}/250</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Trend:</span>
                    <div className="flex items-center space-x-1 font-bold text-white">
                      {factor.trend && getTrendIcon(factor.trend)}
                      <span className="capitalize">{factor.trend || 'stable'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>
                    <div className="font-bold text-white">
                      {factor.lastUpdate ? factor.lastUpdate.toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedScoreDisplay;
