import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { syncTestSuite } from '../services/synchronizationTestSuite';
import { scoreService } from '../services/scoreService';
import { onChainAnalyzer } from '../services/enhancedScoring';
import { DataValidationService } from '../services/dataValidationService';

interface SyncStatus {
  frontend: {
    score: number;
    confidence: number;
    factors: number;
    lastUpdated: Date;
  };
  backend: {
    score: number;
    confidence: number;
    factors: number;
    lastUpdated: Date;
  };
  enhanced: {
    score: number;
    confidence: number;
    factors: number;
    lastUpdated: Date;
  };
  sync: {
    isHealthy: boolean;
    issues: string[];
  };
}

export const SynchronizationDemo: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [principal, setPrincipal] = useState('rdmx6-jaaaa-aaaah-qcaiq-cai');

  const checkSynchronization = async () => {
    setLoading(true);
    try {
      const testPrincipal = Principal.fromText(principal);
      
      // Get data from all sources
      const frontendData = await scoreService.getUserScore(testPrincipal);
      const enhancedData = await onChainAnalyzer.analyzeComprehensiveScore(testPrincipal);
      const healthCheck = await syncTestSuite.quickHealthCheck();
      
      // Extract backend data from frontend response
      const backendData = {
        score: frontendData.totalScore,
        confidence: frontendData.confidenceLevel || 0,
        factors: frontendData.factors.length,
        lastUpdated: frontendData.lastUpdated
      };

      const status: SyncStatus = {
        frontend: {
          score: frontendData.totalScore,
          confidence: frontendData.confidenceLevel || 0,
          factors: frontendData.factors.length,
          lastUpdated: frontendData.lastUpdated
        },
        backend: backendData,
        enhanced: {
          score: enhancedData.totalScore,
          confidence: enhancedData.confidenceLevel,
          factors: enhancedData.factors.length,
          lastUpdated: enhancedData.lastUpdated
        },
        sync: {
          isHealthy: healthCheck.healthy,
          issues: healthCheck.issues
        }
      };

      setSyncStatus(status);
    } catch (error) {
      console.error('Synchronization check failed:', error);
      setSyncStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const runFullTests = async () => {
    setLoading(true);
    try {
      const results = await syncTestSuite.runFullSynchronizationTest();
      setTestResults(results);
    } catch (error) {
      console.error('Full test failed:', error);
      setTestResults({ success: false, error: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  const generateHealthReport = async () => {
    setLoading(true);
    try {
      const testPrincipal = Principal.fromText(principal);
      const healthReport = await DataValidationService.generateDataHealthReport(testPrincipal);
      setTestResults(healthReport);
    } catch (error) {
      console.error('Health report generation failed:', error);
      setTestResults({ success: false, error: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (isHealthy: boolean) => {
    return isHealthy ? 'text-green-600' : 'text-red-600';
  };

  const getSyncStatusColor = (frontendValue: number, enhancedValue: number) => {
    const diff = Math.abs(frontendValue - enhancedValue);
    const percentDiff = (diff / Math.max(frontendValue, enhancedValue)) * 100;
    
    if (percentDiff < 5) return 'text-green-600';
    if (percentDiff < 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Frontend-Backend Synchronization Demo
        </h2>
        <p className="text-gray-600 mb-4">
          This demo shows the synchronization between frontend, backend, and enhanced scoring systems.
        </p>
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Principal ID"
          />
          <button
            onClick={checkSynchronization}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Sync'}
          </button>
          <button
            onClick={runFullTests}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
          <button
            onClick={generateHealthReport}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Health Report'}
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Synchronization Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend Data */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Frontend Data</h4>
              <div className="space-y-2 text-sm">
                <div>Score: <span className="font-mono">{syncStatus.frontend.score}</span></div>
                <div>Confidence: <span className="font-mono">{syncStatus.frontend.confidence}%</span></div>
                <div>Factors: <span className="font-mono">{syncStatus.frontend.factors}</span></div>
                <div>Updated: <span className="font-mono">{syncStatus.frontend.lastUpdated.toLocaleTimeString()}</span></div>
              </div>
            </div>

            {/* Backend Data */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Backend Data</h4>
              <div className="space-y-2 text-sm">
                <div>Score: <span className="font-mono">{syncStatus.backend.score}</span></div>
                <div>Confidence: <span className="font-mono">{syncStatus.backend.confidence}%</span></div>
                <div>Factors: <span className="font-mono">{syncStatus.backend.factors}</span></div>
                <div>Updated: <span className="font-mono">{syncStatus.backend.lastUpdated.toLocaleTimeString()}</span></div>
              </div>
            </div>

            {/* Enhanced Data */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Enhanced Data</h4>
              <div className="space-y-2 text-sm">
                <div>Score: <span className="font-mono">{syncStatus.enhanced.score}</span></div>
                <div>Confidence: <span className="font-mono">{syncStatus.enhanced.confidence}%</span></div>
                <div>Factors: <span className="font-mono">{syncStatus.enhanced.factors}</span></div>
                <div>Updated: <span className="font-mono">{syncStatus.enhanced.lastUpdated.toLocaleTimeString()}</span></div>
              </div>
            </div>
          </div>

          {/* Sync Analysis */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Synchronization Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Score Sync: </span>
                <span className={getSyncStatusColor(syncStatus.frontend.score, syncStatus.enhanced.score)}>
                  {Math.abs(syncStatus.frontend.score - syncStatus.enhanced.score) < 10 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <div>
                <span className="font-medium">Confidence Sync: </span>
                <span className={getSyncStatusColor(syncStatus.frontend.confidence, syncStatus.enhanced.confidence)}>
                  {Math.abs(syncStatus.frontend.confidence - syncStatus.enhanced.confidence) < 15 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <div>
                <span className="font-medium">Overall Health: </span>
                <span className={getHealthColor(syncStatus.sync.isHealthy)}>
                  {syncStatus.sync.isHealthy ? 'Healthy' : 'Issues Found'}
                </span>
              </div>
              <div>
                <span className="font-medium">Issues: </span>
                <span className="text-gray-600">{syncStatus.sync.issues.length}</span>
              </div>
            </div>
            {syncStatus.sync.issues.length > 0 && (
              <div className="mt-2">
                <h5 className="font-medium text-red-700 mb-1">Issues:</h5>
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {syncStatus.sync.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {testResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Test Results
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SynchronizationDemo;
