import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-xl text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">OnChainScore</h1>
            <p className="text-xl text-gray-300 mb-8">Initializing AI-Powered Scoring System...</p>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">OnChainScore</h1>
            <p className="text-xl text-gray-300 mb-8">AI-Powered On-Chain Reputation System</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">Score Analysis</h3>
                <p className="text-gray-300">Real-time on-chain behavior analysis</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
                <p className="text-gray-300">Personalized improvement suggestions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">Portfolio Analytics</h3>
                <p className="text-gray-300">Comprehensive portfolio insights</p>
              </div>
            </div>
            
            <div className="mt-12">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
