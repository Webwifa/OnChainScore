import React, { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { Activity, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { onChainAnalyzer, EnhancedScoreData } from '../services/enhancedScoring';

interface RealTimeScoreMonitorProps {
  principal: Principal;
  onScoreUpdate: (scoreData: EnhancedScoreData) => void;
  isActive: boolean;
}

export default function RealTimeScoreMonitor({ 
  principal, 
  onScoreUpdate, 
  isActive 
}: RealTimeScoreMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateInterval, setUpdateInterval] = useState(30000); // 30 seconds default
  const [scoreHistory, setScoreHistory] = useState<Array<{ score: number; timestamp: Date }>>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const updateScore = useCallback(async () => {
    if (!isActive || isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log('Updating score for principal:', principal.toText());
      const enhancedData = await onChainAnalyzer.analyzeComprehensiveScore(principal);
      
      setScoreHistory(prev => [
        ...prev.slice(-19), // Keep last 20 entries
        { score: enhancedData.totalScore, timestamp: new Date() }
      ]);
      
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      onScoreUpdate(enhancedData);
    } catch (error) {
      console.error('Failed to update score:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [principal, isActive, isUpdating, onScoreUpdate]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isMonitoring && isActive) {
      // Initial update
      updateScore();
      
      // Set up interval
      intervalId = setInterval(updateScore, updateInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, isActive, updateInterval, updateScore]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const handleManualUpdate = () => {
    if (!isUpdating) {
      updateScore();
    }
  };

  const calculateScoreChange = () => {
    if (scoreHistory.length < 2) return 0;
    const current = scoreHistory[scoreHistory.length - 1].score;
    const previous = scoreHistory[scoreHistory.length - 2].score;
    return current - previous;
  };

  const getScoreChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isMonitoring ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
            <Activity className={`w-5 h-5 ${isMonitoring ? 'text-green-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Real-time Score Monitor</h3>
            <p className="text-sm text-gray-400">
              {isMonitoring ? 'Monitoring active' : 'Monitoring paused'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualUpdate}
            disabled={isUpdating}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={toggleMonitoring}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Monitoring Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Status</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {isMonitoring ? 'Active' : 'Paused'}
          </div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Updates</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {updateCount}
          </div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <RefreshCw className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Interval</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {updateInterval / 1000}s
          </div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Last Update</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {lastUpdate ? formatTimeAgo(lastUpdate) : 'Never'}
          </div>
        </div>
      </div>

      {/* Score History Chart */}
      {scoreHistory.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Score History</h4>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-end space-x-2 h-32">
              {scoreHistory.map((entry, index) => {
                const maxScore = Math.max(...scoreHistory.map(e => e.score));
                const minScore = Math.min(...scoreHistory.map(e => e.score));
                const range = maxScore - minScore || 1;
                const height = ((entry.score - minScore) / range) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-400 rounded-t transition-all duration-300"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {entry.score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Score Change Indicator */}
      {scoreHistory.length > 1 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Recent Change</h4>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Last Score Change</div>
                <div className={`text-2xl font-bold ${getScoreChangeColor(calculateScoreChange())}`}>
                  {calculateScoreChange() > 0 ? '+' : ''}{calculateScoreChange()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Current Score</div>
                <div className="text-2xl font-bold text-white">
                  {scoreHistory[scoreHistory.length - 1].score}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Update Interval
          </label>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
            disabled={isMonitoring}
          >
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
            <option value={900000}>15 minutes</option>
          </select>
        </div>

        {isMonitoring && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Live Monitoring Active</span>
            </div>
            <p className="text-sm text-gray-400">
              Score updates every {updateInterval / 1000} seconds. This provides real-time insights
              into your on-chain activity and its impact on your score.
            </p>
          </div>
        )}

        {!isActive && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Monitoring Unavailable</span>
            </div>
            <p className="text-sm text-gray-400">
              Please connect your wallet to enable real-time score monitoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
