import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Import only the components that are known to work
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import SynchronizationDemo from './components/SynchronizationDemo';

// Add other components gradually
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize GSAP animations
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // Add smooth transitions between views
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-xl text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Reload Application
          </button>
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">OnChainScore Dashboard</h1>
            <p className="text-xl text-gray-300 mb-8">AI-Powered On-Chain Reputation System</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Score Analysis</h3>
                <p className="text-gray-300">Real-time on-chain behavior analysis</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-green-400">750</div>
                  <div className="text-sm text-gray-400">Current Score</div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
                <p className="text-gray-300">Personalized improvement suggestions</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-blue-400">3</div>
                  <div className="text-sm text-gray-400">Active Recommendations</div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Portfolio Analytics</h3>
                <p className="text-gray-300">Comprehensive portfolio insights</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-purple-400">12</div>
                  <div className="text-sm text-gray-400">Active Protocols</div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <button 
                onClick={() => setIsAuthenticated(!isAuthenticated)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                {isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        );
      
      case 'sync-demo':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Synchronization Demo</h1>
              <p className="text-xl text-gray-300">Backend-Frontend Sync Status</p>
            </div>
            <SynchronizationDemo />
          </div>
        );
      
      case 'ai-analytics':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">AI Analytics</h1>
            <p className="text-xl text-gray-300 mb-8">Advanced AI-Powered Analytics Dashboard</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-blue-400 text-xl font-semibold">🧠 AI Analytics Engine</div>
              <div className="text-gray-300 mt-2">Advanced machine learning models analyzing your on-chain behavior</div>
            </div>
          </div>
        );
      
      case 'portfolio':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Portfolio Analysis</h1>
            <p className="text-xl text-gray-300 mb-8">Comprehensive Portfolio Insights</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-purple-400 text-xl font-semibold">📊 Portfolio Analytics</div>
              <div className="text-gray-300 mt-2">Real-time portfolio performance and risk analysis</div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">OnChainScore</h1>
            <p className="text-xl text-gray-300">View: {currentView}</p>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Navigation 
          currentView={currentView} 
          onViewChange={handleViewChange} 
          notifications={0}
          isAuthenticated={isAuthenticated}
        />
        <div ref={containerRef} className="container mx-auto px-4 py-8">
          {renderCurrentView()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
