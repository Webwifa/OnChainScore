import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, Target, Zap, AlertTriangle } from 'lucide-react';

interface AIRecommendation {
  id: string;
  category: 'immediate' | 'short_term' | 'long_term';
  action: string;
  expectedImpact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  priority: number;
}

interface AIRecommendationsProps {
  isVisible: boolean;
  onClose: () => void;
  recommendations: AIRecommendation[];
  isLoading: boolean;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  isVisible,
  onClose,
  recommendations,
  isLoading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate': return <Zap className="w-4 h-4" />;
      case 'short_term': return <Clock className="w-4 h-4" />;
      case 'long_term': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBadge = (priority: number) => {
    const colors = {
      5: 'bg-red-500/20 text-red-300 border-red-500/30',
      4: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      3: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      2: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      1: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[priority as keyof typeof colors] || colors[1];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
                <p className="text-gray-400">Personalized suggestions to boost your OnChainScore</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-gray-700/30">
          <div className="flex space-x-2">
            {['all', 'immediate', 'short_term', 'long_term'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span className="capitalize">{category.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-gray-400">Analyzing your profile...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Recommendations</h3>
                  <p className="text-gray-400">You're doing great! Check back later for new suggestions.</p>
                </div>
              ) : (
                filteredRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-purple-500/30 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                          {getCategoryIcon(recommendation.category)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">
                              {recommendation.category.replace('_', ' ').toUpperCase()}
                            </h3>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityBadge(recommendation.priority)}`}>
                              Priority {recommendation.priority}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{recommendation.timeframe}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-400 font-bold text-lg">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{recommendation.expectedImpact}</span>
                        </div>
                        <p className={`text-sm font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                          {recommendation.difficulty.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <p className="text-white leading-relaxed mb-4">
                      {recommendation.action}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Expected Impact: +{recommendation.expectedImpact} points</span>
                        <span>•</span>
                        <span>Difficulty: {recommendation.difficulty}</span>
                      </div>
                      
                      <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30 hover:border-purple-500/50 font-medium">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/30 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Recommendations update daily based on your latest activity
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
