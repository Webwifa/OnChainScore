import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { EnhancedScoreData } from '../services/enhancedScoring';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';

interface AIAnalyticsDashboardProps {
  enhancedData: EnhancedScoreData;
  principal: Principal;
  onRecommendationClick: (recommendation: any) => void;
}

export default function AIAnalyticsDashboard({ 
  enhancedData, 
  principal, 
  onRecommendationClick 
}: AIAnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1_week' | '1_month' | '3_months' | '1_year'>('1_month');
  const [showDetails, setShowDetails] = useState(false);

  // Get prediction for selected timeframe
  const selectedPrediction = enhancedData.predictions.find(p => p.timeframe === selectedTimeframe);

  // Categorize recommendations
  const immediateRecommendations = enhancedData.recommendations.filter(r => r.category === 'immediate');
  const shortTermRecommendations = enhancedData.recommendations.filter(r => r.category === 'short_term');
  const longTermRecommendations = enhancedData.recommendations.filter(r => r.category === 'long_term');

  // Calculate score trends
  const getScoreTrend = (factor: any) => {
    switch (factor.trend) {
      case 'increasing':
        return { icon: TrendingUp, color: 'text-green-400', text: 'Improving' };
      case 'decreasing':
        return { icon: TrendingDown, color: 'text-red-400', text: 'Declining' };
      default:
        return { icon: BarChart3, color: 'text-yellow-400', text: 'Stable' };
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'high':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'hard':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Analytics Dashboard</h2>
            <p className="text-sm text-gray-400">
              Confidence: {enhancedData.confidenceLevel}% | 
              Data Points: {enhancedData.analysisMetadata.totalDataPoints} | 
              Analysis Time: {enhancedData.analysisMetadata.analysisTime}ms
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Current Score</h3>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {enhancedData.totalScore}
          </div>
          <div className="text-sm text-gray-400">
            Updated: {enhancedData.lastUpdated.toLocaleString()}
          </div>
        </div>

        {/* Confidence Level */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Confidence</h3>
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {enhancedData.confidenceLevel}%
          </div>
          <div className="text-sm text-gray-400">
            Analysis reliability score
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Risk Level</h3>
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className={`text-3xl font-bold mb-2 capitalize ${getRiskLevelColor(enhancedData.riskProfile.riskLevel).split(' ')[0]}`}>
            {enhancedData.riskProfile.riskLevel}
          </div>
          <div className="text-sm text-gray-400">
            Overall risk assessment
          </div>
        </div>
      </div>

      {/* Detailed Factor Analysis */}
      {showDetails && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Detailed Score Factors</h3>
          <div className="space-y-4">
            {enhancedData.factors.map((factor, index) => {
              const trend = getScoreTrend(factor);
              const TrendIcon = trend.icon;
              
              return (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-white">{factor.name}</h4>
                      <div className={`flex items-center space-x-1 ${trend.color}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-sm">{trend.text}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{factor.score}/100</div>
                      <div className="text-sm text-gray-400">Weight: {(factor.weight * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">{factor.impactAnalysis}</p>
                  
                  {factor.subFactors && factor.subFactors.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-300">Sub-factors:</h5>
                      {factor.subFactors.map((subFactor, subIndex) => (
                        <div key={subIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{subFactor.name}</span>
                          <span className="text-white">{subFactor.score}/100</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {/* Immediate Actions */}
          {immediateRecommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-2">🚨 Immediate Actions</h4>
              {immediateRecommendations.map((rec, index) => (
                <div key={index} className="border border-red-500/20 rounded-lg p-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{rec.action}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                      <span className="text-sm text-green-400">+{rec.expectedImpact} points</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Timeline: {rec.timeframe}</p>
                  <div className="space-y-1">
                    {rec.detailedSteps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onRecommendationClick(rec)}
                    className="mt-2 flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <span>Take Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Short-term Actions */}
          {shortTermRecommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-400 mb-2">⚡ Short-term Actions</h4>
              {shortTermRecommendations.map((rec, index) => (
                <div key={index} className="border border-yellow-500/20 rounded-lg p-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{rec.action}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                      <span className="text-sm text-green-400">+{rec.expectedImpact} points</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Timeline: {rec.timeframe}</p>
                  <button
                    onClick={() => onRecommendationClick(rec)}
                    className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Long-term Actions */}
          {longTermRecommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">🎯 Long-term Strategy</h4>
              {longTermRecommendations.map((rec, index) => (
                <div key={index} className="border border-blue-500/20 rounded-lg p-4 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{rec.action}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                      <span className="text-sm text-green-400">+{rec.expectedImpact} points</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Timeline: {rec.timeframe}</p>
                  <button
                    onClick={() => onRecommendationClick(rec)}
                    className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Predictions */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Score Predictions</h3>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="1_week">1 Week</option>
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="1_year">1 Year</option>
          </select>
        </div>

        {selectedPrediction && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {selectedPrediction.predictedScore}
                </div>
                <div className="text-sm text-gray-400">
                  Predicted score for {selectedTimeframe.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-purple-400">
                  {selectedPrediction.confidence}%
                </div>
                <div className="text-sm text-gray-400">
                  Confidence level
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Prediction Scenarios</h4>
              {selectedPrediction.scenarios.map((scenario, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{scenario.name}</h5>
                    <span className="text-sm text-purple-400">
                      {(scenario.probability * 100).toFixed(0)}% probability
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    Score range: {scenario.scoreRange[0]} - {scenario.scoreRange[1]}
                  </div>
                  <div className="space-y-1">
                    {scenario.requiredActions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                        <Info className="w-3 h-3" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk Analysis */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {enhancedData.riskProfile.volatilityScore}
            </div>
            <div className="text-sm text-gray-400">Volatility Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {enhancedData.riskProfile.liquidityRisk}
            </div>
            <div className="text-sm text-gray-400">Liquidity Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {enhancedData.riskProfile.counterpartyRisk}
            </div>
            <div className="text-sm text-gray-400">Counterparty Risk</div>
          </div>
        </div>

        {enhancedData.riskProfile.riskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Risk Factors</h4>
            <div className="space-y-2">
              {enhancedData.riskProfile.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
