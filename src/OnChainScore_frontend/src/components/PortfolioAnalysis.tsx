import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { EnhancedScoreData } from '../services/enhancedScoring';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity, 
  Zap,
  Shield,
  Target,
  Clock,
  AlertTriangle,
  Star
} from 'lucide-react';

interface PortfolioAnalysisProps {
  enhancedData: EnhancedScoreData;
  principal: Principal;
}

interface ProtocolData {
  name: string;
  icon: string;
  score: number;
  volume: number;
  activity: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: Date;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export default function PortfolioAnalysis({ enhancedData, principal }: PortfolioAnalysisProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('overview');
  const [protocolData, setProtocolData] = useState<ProtocolData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading protocol data
    const timer = setTimeout(() => {
      setProtocolData(generateProtocolData());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [principal]);

  const generateProtocolData = (): ProtocolData[] => {
    const protocols = [
      {
        name: 'Sonic DEX',
        icon: '🌊',
        score: 85,
        volume: 125000,
        activity: 92,
        riskLevel: 'low' as const,
        lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
        strengths: ['High liquidity provision', 'Consistent trading', 'Low slippage'],
        weaknesses: ['Limited trading pairs', 'Could increase volume'],
        recommendations: ['Explore new trading pairs', 'Consider LP strategies']
      },
      {
        name: 'NNS Governance',
        icon: '🏛️',
        score: 78,
        volume: 0,
        activity: 88,
        riskLevel: 'low' as const,
        lastActivity: new Date(Date.now() - 86400000), // 1 day ago
        strengths: ['Active voter', 'Long-term staking', 'Community participation'],
        weaknesses: ['Could create proposals', 'Neuron diversity'],
        recommendations: ['Consider creating proposals', 'Diversify neuron following']
      },
      {
        name: 'OpenChat',
        icon: '💬',
        score: 65,
        volume: 0,
        activity: 45,
        riskLevel: 'low' as const,
        lastActivity: new Date(Date.now() - 259200000), // 3 days ago
        strengths: ['Community member', 'Helpful responses'],
        weaknesses: ['Low activity', 'Limited group participation'],
        recommendations: ['Increase daily activity', 'Join more communities']
      },
      {
        name: 'Cycles Minting',
        icon: '⚡',
        score: 55,
        volume: 50000,
        activity: 35,
        riskLevel: 'medium' as const,
        lastActivity: new Date(Date.now() - 604800000), // 1 week ago
        strengths: ['Regular cycles management', 'Efficient usage'],
        weaknesses: ['Infrequent top-ups', 'Could optimize usage'],
        recommendations: ['Set up automated top-ups', 'Monitor cycle efficiency']
      }
    ];

    return protocols;
  };

  const getOverallPortfolioStats = () => {
    const totalScore = protocolData.reduce((sum, p) => sum + p.score, 0) / protocolData.length;
    const totalVolume = protocolData.reduce((sum, p) => sum + p.volume, 0);
    const avgActivity = protocolData.reduce((sum, p) => sum + p.activity, 0) / protocolData.length;
    const riskDistribution = protocolData.reduce((acc, p) => {
      acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalScore,
      totalVolume,
      avgActivity,
      riskDistribution,
      activeProtocols: protocolData.filter(p => p.activity > 50).length,
      totalProtocols: protocolData.length
    };
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return 'text-green-400';
    if (activity >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Recently';
  };

  const portfolioStats = getOverallPortfolioStats();

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <PieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Multi-Protocol Portfolio Analysis</h2>
            <p className="text-sm text-gray-400">
              Comprehensive analysis across {portfolioStats.totalProtocols} Internet Computer protocols
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Portfolio Score</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {portfolioStats.totalScore.toFixed(0)}
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${portfolioStats.totalVolume.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Avg Activity</span>
            </div>
            <div className={`text-2xl font-bold ${getActivityColor(portfolioStats.avgActivity)}`}>
              {portfolioStats.avgActivity.toFixed(0)}%
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Active Protocols</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {portfolioStats.activeProtocols}/{portfolioStats.totalProtocols}
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Risk Distribution</h4>
          <div className="flex space-x-2">
            {Object.entries(portfolioStats.riskDistribution).map(([level, count]) => (
              <div key={level} className="flex-1">
                <div className={`px-3 py-2 rounded-lg text-center ${getRiskLevelColor(level)}`}>
                  <div className="font-semibold">{count}</div>
                  <div className="text-xs capitalize">{level} Risk</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Tabs */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setSelectedProtocol('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProtocol === 'overview'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          {protocolData.map((protocol) => (
            <button
              key={protocol.name}
              onClick={() => setSelectedProtocol(protocol.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedProtocol === protocol.name
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {protocol.icon} {protocol.name}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Details */}
      {selectedProtocol === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protocolData.map((protocol) => (
            <div key={protocol.name} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{protocol.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">{protocol.name}</h3>
                    <p className="text-sm text-gray-400">
                      Last active: {formatTimeAgo(protocol.lastActivity)}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(protocol.riskLevel)}`}>
                  {protocol.riskLevel} risk
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Score</div>
                  <div className="text-2xl font-bold text-white">{protocol.score}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Activity</div>
                  <div className={`text-2xl font-bold ${getActivityColor(protocol.activity)}`}>
                    {protocol.activity}%
                  </div>
                </div>
              </div>

              {protocol.volume > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-400">Volume</div>
                  <div className="text-lg font-semibold text-green-400">
                    ${protocol.volume.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-white">Top Strengths</div>
                {protocol.strengths.slice(0, 2).map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          {(() => {
            const protocol = protocolData.find(p => p.name === selectedProtocol);
            if (!protocol) return null;

            return (
              <div className="space-y-6">
                {/* Protocol Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{protocol.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{protocol.name}</h3>
                      <p className="text-gray-400">
                        Last activity: {formatTimeAgo(protocol.lastActivity)}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${getRiskLevelColor(protocol.riskLevel)}`}>
                    {protocol.riskLevel.charAt(0).toUpperCase() + protocol.riskLevel.slice(1)} Risk
                  </div>
                </div>

                {/* Protocol Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Protocol Score</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{protocol.score}</div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Activity Level</span>
                    </div>
                    <div className={`text-3xl font-bold ${getActivityColor(protocol.activity)}`}>
                      {protocol.activity}%
                    </div>
                  </div>

                  {protocol.volume > 0 && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Volume</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        ${protocol.volume.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Strengths</h4>
                  <div className="space-y-2">
                    {protocol.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Areas for Improvement</h4>
                  <div className="space-y-2">
                    {protocol.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">AI Recommendations</h4>
                  <div className="space-y-2">
                    {protocol.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
