import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Services
import { authService } from './services/auth';
import { scoreService, ScoreData, TransactionData } from './services/scoreService';
import { icpWalletService, WalletConnection } from './services/icpWallet';

// Components
import DataNebula from './components/DataNebula';
import RealIdentityView from './components/RealIdentityView';
import ReputationOrb from './components/ReputationOrb';
import ScoreFactorSatellite from './components/ScoreFactorSatellite';
import ScoreFactorDetail from './components/ScoreFactorDetail';
import ActionHub from './components/ActionHub';
import AIModal from './components/AIModal';
import SimulatorControl from './components/SimulatorControl';
import ReputationTimeline from './components/ReputationTimeline';
import SoulboundMinter from './components/SoulboundMinter';
import OpportunityEngine from './components/OpportunityEngine';
import Navigation from './components/Navigation';
import RealWalletConnection from './components/RealWalletConnection';
import UserProfile from './components/UserProfile';
import TransactionHistory from './components/TransactionHistory';
import NotificationCenter from './components/NotificationCenter';

// --- Data Interfaces ---
interface ScoreFactor {
  name: 'Transaction Consistency' | 'DeFi Footprint' | 'Asset Diversity' | 'Governance Activity';
  score: number; // Score for this specific factor (0-100)
  weight: number; // How much it contributes to the total score (0-1)
  summary: string; // A brief summary of this factor
}

interface Opportunity {
  dapp: string;
  action: string;
  impact: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
  description: string;
}

interface Notification {
  id: string;
  type: 'score_update' | 'achievement' | 'opportunity' | 'system' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  scoreChange?: number;
}

// Mock historical data for timeline (this would come from your canister)
const mockHistoricalData: ScoreData[] = [
  {
    totalScore: 650,
    loanEligibility: 25000,
    factors: [
      { name: 'Transaction Consistency', score: 75, weight: 0.3, summary: '' },
      { name: 'DeFi Footprint', score: 60, weight: 0.25, summary: '' },
      { name: 'Asset Diversity', score: 55, weight: 0.25, summary: '' },
      { name: 'Governance Activity', score: 45, weight: 0.2, summary: '' }
    ],
    lastUpdated: new Date('2024-01-01')
  },
  {
    totalScore: 680,
    loanEligibility: 30000,
    factors: [
      { name: 'Transaction Consistency', score: 80, weight: 0.3, summary: '' },
      { name: 'DeFi Footprint', score: 65, weight: 0.25, summary: '' },
      { name: 'Asset Diversity', score: 58, weight: 0.25, summary: '' },
      { name: 'Governance Activity', score: 50, weight: 0.2, summary: '' }
    ],
    lastUpdated: new Date('2024-02-01')
  }
];

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'score_update',
    title: 'Score Increased!',
    message: 'Your OnChainScore increased by 15 points due to recent DeFi activity.',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    scoreChange: 15
  },
  {
    id: '2',
    type: 'achievement',
    title: 'New Achievement Unlocked',
    message: 'Congratulations! You\'ve earned the "DeFi Explorer" achievement.',
    timestamp: '2024-01-14T15:45:00Z',
    isRead: false
  }
];

function App() {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentIdentity, setCurrentIdentity] = useState<Identity | null>(null);
  const [principalId, setPrincipalId] = useState<Principal | null>(null);
  
  // --- Score Data State ---
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState<boolean>(false);
  const [activeFactor, setActiveFactor] = useState<ScoreFactor['name'] | null>(null);
  
  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string }>({
    title: '',
    content: ''
  });
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  // --- Navigation and View State ---
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);

  // --- Wallet State ---
  const [connectedWallets, setConnectedWallets] = useState<WalletConnection[]>([]);

  // --- Transaction Data ---
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // --- Advanced Feature States ---
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simulatedFactors, setSimulatedFactors] = useState<ScoreFactor[]>([]);
  const [simulatedTotalScore, setSimulatedTotalScore] = useState<number>(0);
  const [analystNote, setAnalystNote] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState<number>(mockHistoricalData.length - 1);
  const [displayedData, setDisplayedData] = useState<ScoreData | null>(null);
  
  const [showSoulboundMinter, setShowSoulboundMinter] = useState<boolean>(false);
  
  const [showOpportunityEngine, setShowOpportunityEngine] = useState<boolean>(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState<boolean>(false);
  const [weakestArea, setWeakestArea] = useState<string>('');

  // --- User Data (this would come from your profile canister) ---
  const [userData, setUserData] = useState({
    principal: '',
    username: 'Anonymous User',
    avatar: '',
    joinDate: new Date().toISOString().split('T')[0],
    totalScore: 0,
    rank: 0,
    totalUsers: 50000,
    achievements: [],
    wallets: [],
    stats: {
      totalTransactions: 0,
      totalVolume: 0,
      daysActive: 0,
      protocolsUsed: 0
    }
  });

  // Refs for GSAP animations
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const simulationBannerRef = useRef<HTMLDivElement>(null);

  /**
   * REAL AUTHENTICATION: Handles Internet Identity connection
   * and initializes all real data fetching
   */
  const handleConnect = async (identity: Identity, principal: Principal) => {
    try {
      console.log('Handling authentication with principal:', principal.toText());
      
      setIsAuthenticated(true);
      setCurrentIdentity(identity);
      setPrincipalId(principal);
      setIsLoadingScore(true);

      // Update user data with real principal
      setUserData(prev => ({
        ...prev,
        principal: principal.toText(),
        username: `User ${principal.toText().slice(0, 8)}...`
      }));

      // Declare realScoreData in function scope
      let realScoreData;
      
      try {
        // Initialize score service with the authenticated identity
        await scoreService.initializeActor(identity);

        // Fetch real user score data
        realScoreData = await scoreService.getUserScore(principal);
        setScoreData(realScoreData);
        setDisplayedData(realScoreData);
        setSimulatedFactors([...realScoreData.factors]);
        setSimulatedTotalScore(realScoreData.totalScore);

        // Fetch transaction history
        const realTransactions = await scoreService.getTransactionHistory(principal);
        setTransactions(realTransactions);

        console.log('Score data loaded successfully:', realScoreData);
      } catch (scoreError) {
        console.error('Failed to load score data, using fallback:', scoreError);
        
        // Use fallback data if score service fails
        realScoreData = await scoreService.getFallbackScoreData(principal);
        setScoreData(realScoreData);
        setDisplayedData(realScoreData);
        setSimulatedFactors([...realScoreData.factors]);
        setSimulatedTotalScore(realScoreData.totalScore);
      }

      // Fetch transaction history
      const transactionHistory = await scoreService.getTransactionHistory(principal);
      setTransactions(transactionHistory);

      // Connect Internet Identity wallet automatically
      const iiWallet = await icpWalletService.connectInternetIdentity(identity);
      setConnectedWallets([iiWallet]);

      // Update user data
      setUserData(prev => ({
        ...prev,
        principal: principal.toString(),
        totalScore: realScoreData.totalScore,
        stats: {
          totalTransactions: transactionHistory.length,
          totalVolume: transactionHistory.reduce((sum, tx) => sum + tx.amount, 0),
          daysActive: Math.floor((Date.now() - new Date(realScoreData.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)),
          protocolsUsed: new Set(transactionHistory.map(tx => tx.protocol).filter(Boolean)).size
        }
      }));

      // GSAP Morphing Animation Timeline
      const morphTimeline = gsap.timeline();
      
      // Find the identity logo element
      const identityLogo = document.getElementById('identity-logo');
      
      if (identityLogo) {
        // Phase 1: Identity logo transforms and moves to center
        morphTimeline
          .to(identityLogo, {
            scale: 1.5,
            duration: 0.8,
            ease: "power2.out"
          })
          .to(identityLogo, {
            x: window.innerWidth / 2 - identityLogo.offsetLeft - identityLogo.offsetWidth / 2,
            y: window.innerHeight / 2 - identityLogo.offsetTop - identityLogo.offsetHeight / 2,
            duration: 1,
            ease: "power3.inOut"
          }, "-=0.4")
          // Phase 2: Logo morphs into orb (simulated with opacity transition)
          .to(identityLogo, {
            opacity: 0,
            scale: 2,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              // Phase 3: Main dashboard elements animate in
              if (orbContainerRef.current) {
                gsap.fromTo(orbContainerRef.current.children,
                  { scale: 0, opacity: 0 },
                  { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.2,
                    ease: "back.out(1.7)" 
                  }
                );
              }
            }
          });
      }

    } catch (error) {
      console.error('Failed to initialize user data:', error);
      // Handle error - maybe show a notification
    } finally {
      setIsLoadingScore(false);
    }
  };

  /**
   * Handles selecting a specific score factor, triggering the focus animation
   */
  const handleSelectFactor = (factorName: ScoreFactor['name']) => {
    if (isSimulationMode) return; // Disable factor selection in simulation mode
    
    setActiveFactor(factorName);
    
    // Focus Animation Timeline - satellite docking sequence
    const focusTimeline = gsap.timeline();
    
    // Find all satellites and identify the active one
    const satellites = document.querySelectorAll('[data-satellite]');
    const activeSatellite = document.querySelector(`[data-satellite="${factorName}"]`);
    
    if (activeSatellite && orbContainerRef.current) {
      // Dock the active satellite to top of screen
      focusTimeline
        .to(activeSatellite, {
          x: window.innerWidth / 2,
          y: 100,
          scale: 1.5,
          duration: 0.8,
          ease: "power3.out"
        })
        // Fade other satellites to background
        .to(satellites, {
          opacity: 0.3,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.5");
    }
  };

  /**
   * Closes the factor detail view and returns satellites to orbital positions
   */
  const handleCloseFactor = () => {
    setActiveFactor(null);
    
    // Return Animation Timeline - satellites back to orbit
    const returnTimeline = gsap.timeline();
    const satellites = document.querySelectorAll('[data-satellite]');
    
    returnTimeline
      .to(satellites, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      })
      // Reset positions (satellites will recalculate orbital positions)
      .call(() => {
        // Force re-render to recalculate positions
        setScoreData(prev => prev ? { ...prev } : null);
      });
  };

  /**
   * Toggles simulation mode with smooth UI transitions
   */
  const handleToggleSimulation = () => {
    const newMode = !isSimulationMode;
    setIsSimulationMode(newMode);
    
    if (newMode) {
      // Entering simulation mode
      if (simulationBannerRef.current) {
        gsap.fromTo(simulationBannerRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
      
      // Change UI glow to gold
      const panels = document.querySelectorAll('.neuro-glass');
      gsap.to(panels, {
        borderColor: 'rgba(251, 191, 36, 0.3)',
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      // Exiting simulation mode
      if (simulationBannerRef.current) {
        gsap.to(simulationBannerRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
      
      // Reset UI glow
      const panels = document.querySelectorAll('.neuro-glass');
      gsap.to(panels, {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Reset simulated data
      if (scoreData) {
        setSimulatedFactors([...scoreData.factors]);
        setSimulatedTotalScore(scoreData.totalScore);
      }
      setAnalystNote('');
    }
  };

  /**
   * Handles slider changes in simulation mode with real-time visual feedback
   */
  const handleSliderChange = (factorName: string, value: number) => {
    const updatedFactors = simulatedFactors.map(factor => {
      if (factor.name === factorName) {
        const newScore = Math.min(100, Math.max(0, (value / 1000) * 10));
        return { ...factor, score: newScore };
      }
      return factor;
    });
    
    setSimulatedFactors(updatedFactors);
    
    // Calculate new total score
    const newTotalScore = Math.round(
      updatedFactors.reduce((total, factor) => total + (factor.score * factor.weight), 0) * 10
    );
    setSimulatedTotalScore(newTotalScore);
    
    // Trigger real-time GSAP animations
    const mainOrb = document.querySelector('[data-main-orb]');
    if (mainOrb) {
      gsap.to(mainOrb, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    
    // Find and animate the corresponding satellite
    const satellite = document.querySelector(`[data-satellite="${factorName}"]`);
    if (satellite) {
      gsap.to(satellite, {
        scale: 1.3,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    
    // Trigger AI analysis after user stops adjusting (debounced)
    clearTimeout((window as any).sliderTimeout);
    (window as any).sliderTimeout = setTimeout(() => {
      handleAnalyzeSimulation(factorName, value);
    }, 2000);
  };

  /**
   * AI analysis for simulation changes
   */
  const handleAnalyzeSimulation = async (factor: string, value: number) => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const notes = [
        `Increasing your ${factor} activity is an excellent strategic move. This enhancement demonstrates stronger financial discipline and will significantly improve your creditworthiness across DeFi protocols.`,
        `Great choice! Boosting ${factor} shows sophisticated Web3 engagement. Lenders value this type of diversified activity as it indicates lower risk and higher financial literacy.`,
        `Smart optimization! Your ${factor} improvement will compound with your other strong metrics, potentially unlocking premium lending rates and exclusive DeFi opportunities.`,
        `Excellent direction! This ${factor} enhancement aligns perfectly with what top-tier protocols look for in borrowers. You're building institutional-level credibility.`
      ];
      
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      setAnalystNote(randomNote);
      setIsAnalyzing(false);
    }, 1500);
  };

  /**
   * Timeline scrubbing functionality
   */
  const handleTimelineChange = (index: number) => {
    setCurrentTimelineIndex(index);
    const historicalData = mockHistoricalData[index];
    setDisplayedData(historicalData);
    
    // Animate the main visualization to reflect historical data
    const mainOrb = document.querySelector('[data-main-orb]');
    if (mainOrb) {
      gsap.to(mainOrb, {
        scale: 0.8 + (historicalData.totalScore / 1000) * 0.4,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  /**
   * Soulbound token minting sequence
   */
  const handleMintSoulbound = () => {
    setShowSoulboundMinter(true);
  };

  const handleSoulboundMinted = () => {
    // Spectacular minting completion animation
    const mainOrb = document.querySelector('[data-main-orb]');
    if (mainOrb) {
      const mintingTimeline = gsap.timeline();
      
      mintingTimeline
        .to(mainOrb, {
          scale: 1.5,
          rotation: 360,
          duration: 1,
          ease: "power2.out"
        })
        .to(mainOrb, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
    }
  };

  /**
   * Advanced AI Opportunity Engine
   */
  const handleFindOpportunities = async () => {
    setShowOpportunityEngine(true);
    setIsLoadingOpportunities(true);
    
    // Find weakest area
    if (scoreData) {
      const weakest = scoreData.factors.reduce((min, factor) => 
        factor.score < min.score ? factor : min
      );
      setWeakestArea(weakest.name);
    }
    
    // Simulate advanced AI analysis
    setTimeout(() => {
      const mockOpportunities: Opportunity[] = [
        {
          dapp: 'ICPSwap',
          action: 'Provide Liquidity to ICP/USDC Pool',
          impact: '+12 points',
          category: 'DeFi',
          difficulty: 'Easy',
          timeframe: '1-2 weeks',
          description: 'Stake 1000 ICP in the main liquidity pool to demonstrate DeFi engagement and earn yield while improving your footprint score.'
        },
        {
          dapp: 'NNS Governance',
          action: 'Vote on 5 Governance Proposals',
          impact: '+8 points',
          category: 'Governance',
          difficulty: 'Easy',
          timeframe: '1 week',
          description: 'Participate in Internet Computer governance by voting on active proposals. This directly boosts your governance activity score.'
        }
      ];
      
      setOpportunities(mockOpportunities);
      setIsLoadingOpportunities(false);
    }, 3000);
  };

  /**
   * AI Integration: Explains the user's score in detail
   */
  const handleExplainScore = async () => {
    setModalContent({
      title: 'Your OnChainScore Explained',
      content: ''
    });
    setIsModalOpen(true);
    setIsAILoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      const currentScore = isSimulationMode ? simulatedTotalScore : (displayedData?.totalScore || scoreData?.totalScore || 0);
      const explanation = `Your OnChainScore of ${currentScore} places you in the **${currentScore >= 750 ? 'Excellent' : currentScore >= 600 ? 'Very Good' : 'Good'}** tier.

This score is calculated from your real on-chain activity on the Internet Computer, including:

**Transaction Patterns:** Your consistency and frequency of transactions
**DeFi Engagement:** Participation in decentralized finance protocols  
**Asset Management:** Diversification and portfolio management
**Governance Activity:** Participation in DAO and protocol governance

Your score is updated in real-time based on your actual blockchain activity.`;

      setModalContent(prev => ({ ...prev, content: explanation }));
      setIsAILoading(false);
    }, 2500);
  };

  /**
   * Handles disconnection and returns to identity view
   */
  const handleDisconnect = async () => {
    try {
      await authService.logout();
      
      // Disconnect all wallets
      for (const wallet of connectedWallets) {
        await icpWalletService.disconnectWallet(wallet.type);
      }
      
      // Reset all state
      setIsAuthenticated(false);
      setCurrentIdentity(null);
      setPrincipalId(null);
      setScoreData(null);
      setDisplayedData(null);
      setActiveFactor(null);
      setIsModalOpen(false);
      setIsSimulationMode(false);
      setShowTimeline(false);
      setShowSoulboundMinter(false);
      setShowOpportunityEngine(false);
      setConnectedWallets([]);
      setTransactions([]);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  /**
   * Handle wallet connection
   */
  const handleWalletConnect = (wallet: WalletConnection) => {
    setConnectedWallets(prev => [...prev, wallet]);
    setIsWalletModalOpen(false);
  };

  /**
   * Handle view changes from navigation
   */
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    
    // Open appropriate modals based on view
    switch (view) {
      case 'profile':
        setIsProfileModalOpen(true);
        break;
      case 'history':
        setIsHistoryModalOpen(true);
        break;
      case 'wallets':
        setIsWalletModalOpen(true);
        break;
      default:
        // Close all modals for dashboard view
        setIsProfileModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsWalletModalOpen(false);
        break;
    }
  };

  /**
   * Handle notification actions
   */
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  /**
   * Handle profile updates
   */
  const handleUpdateProfile = (data: any) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  // Get the active factor data for the detail panel
  const activeFactorData = activeFactor && (displayedData || scoreData)
    ? (displayedData || scoreData)!.factors.find(f => f.name === activeFactor) || null
    : null;

  // Determine which data to display (current, simulated, or historical)
  const currentDisplayData = isSimulationMode 
    ? { ...scoreData!, totalScore: simulatedTotalScore, factors: simulatedFactors }
    : (displayedData || scoreData);

  // Count unread notifications
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Data Nebula Background */}
      <DataNebula score={currentDisplayData?.totalScore || 500} />

      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        notifications={unreadNotifications}
        isAuthenticated={isAuthenticated}
      />

      {/* Simulation Mode Banner */}
      {isSimulationMode && (
        <div 
          ref={simulationBannerRef}
          className={`fixed ${isAuthenticated ? 'top-20' : 'top-0'} left-0 right-0 bg-gradient-to-r from-gold-500/20 to-yellow-500/20 border-b border-gold-400/30 backdrop-blur-lg p-3 z-30`}
        >
          <div className="text-center">
            <span className="text-gold-400 font-semibold">🧪 Simulation Mode Active</span>
            <span className="text-gray-300 ml-2">• Explore how actions impact your reputation</span>
          </div>
        </div>
      )}

      {/* Main Application Container */}
      <div ref={mainContainerRef} className="relative z-10">
        {!isAuthenticated ? (
          /* Real Identity Connection View */
          <RealIdentityView onConnect={handleConnect} />
        ) : (
          /* Main Score Dashboard */
          <div className={`min-h-screen flex items-center justify-center p-8 ${isAuthenticated ? 'pt-24' : ''}`}>
            {isLoadingScore ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Loading your OnChain reputation...</p>
              </div>
            ) : currentDisplayData ? (
              <>
                <div ref={orbContainerRef} className="relative w-full max-w-4xl h-96">
                  {/* Central Reputation Orb */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div data-main-orb>
                      <ReputationOrb 
                        score={currentDisplayData.totalScore} 
                        size={120} 
                        isMainOrb={true}
                      />
                    </div>
                  </div>

                  {/* Score Factor Satellites */}
                  {currentDisplayData.factors.map((factor, index) => {
                    const angle = (index * 2 * Math.PI) / currentDisplayData.factors.length;
                    return (
                      <ScoreFactorSatellite
                        key={factor.name}
                        factor={factor}
                        centerX={0}
                        centerY={0}
                        angle={angle}
                        isActive={activeFactor === factor.name}
                        onSelect={() => handleSelectFactor(factor.name)}
                      />
                    );
                  })}
                </div>

                {/* Score Display Header */}
                <div className={`absolute ${isSimulationMode ? (isAuthenticated ? 'top-32' : 'top-16') : (isAuthenticated ? 'top-24' : 'top-8')} left-1/2 transform -translate-x-1/2 text-center`}>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    OnChain<span className="text-blue-400">Score</span>
                  </h1>
                  <p className="text-gray-300">
                    Principal: <span className="font-mono text-sm">{principalId?.toString().slice(0, 12)}...</span>
                  </p>
                  <div className="mt-4 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl px-6 py-3 neuro-glass">
                    <div className="text-3xl font-bold text-white">
                      {currentDisplayData.totalScore}
                      {isSimulationMode && (
                        <span className="text-gold-400 text-lg ml-2">(Simulated)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">
                      Loan Eligibility: {currentDisplayData.loanEligibility.toLocaleString()} ICP
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Last Updated: {currentDisplayData.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Simulation Toggle */}
                  <div className="mt-4 flex items-center justify-center space-x-3">
                    <span className="text-gray-400 text-sm">Simulation Mode</span>
                    <button
                      onClick={handleToggleSimulation}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        isSimulationMode ? 'bg-gold-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        isSimulationMode ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                    
                    <button
                      onClick={() => setShowTimeline(!showTimeline)}
                      className="ml-4 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-400 text-sm hover:bg-blue-500/30 transition-all duration-200"
                    >
                      {showTimeline ? 'Hide' : 'Show'} Timeline
                    </button>
                  </div>
                </div>

                {/* Enhanced Action Hub */}
                <ActionHub
                  onGetLoanIdeas={handleFindOpportunities}
                  onExplainScore={handleExplainScore}
                  onDisconnect={handleDisconnect}
                  onMintSoulbound={handleMintSoulbound}
                  isSimulationMode={isSimulationMode}
                />
              </>
            ) : (
              <div className="text-center">
                <p className="text-white text-lg">Failed to load score data</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score Factor Detail Panel (only in normal mode) */}
      {!isSimulationMode && (
        <ScoreFactorDetail
          factor={activeFactorData}
          isVisible={!!activeFactor}
          onClose={handleCloseFactor}
        />
      )}

      {/* Simulator Control Panel */}
      <SimulatorControl
        simulatedFactors={simulatedFactors}
        isVisible={isSimulationMode}
        onClose={() => setIsSimulationMode(false)}
        onSliderChange={handleSliderChange}
        analystNote={analystNote}
        isAnalyzing={isAnalyzing}
      />

      {/* Reputation Timeline */}
      <ReputationTimeline
        historicalData={mockHistoricalData}
        isVisible={showTimeline}
        onTimelineChange={handleTimelineChange}
        currentIndex={currentTimelineIndex}
      />

      {/* Soulbound Token Minter */}
      {currentDisplayData && (
        <SoulboundMinter
          isOpen={showSoulboundMinter}
          onClose={() => setShowSoulboundMinter(false)}
          scoreData={currentDisplayData}
          onMint={handleSoulboundMinted}
        />
      )}

      {/* AI Opportunity Engine */}
      <OpportunityEngine
        isOpen={showOpportunityEngine}
        onClose={() => setShowOpportunityEngine(false)}
        opportunities={opportunities}
        isLoading={isLoadingOpportunities}
        weakestArea={weakestArea}
      />

      {/* Real Wallet Connection Modal */}
      <RealWalletConnection
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnect={handleWalletConnect}
        connectedWallets={connectedWallets}
        currentIdentity={currentIdentity}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Transaction History Modal */}
      <TransactionHistory
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        transactions={transactions}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* AI Modal */}
      <AIModal
        isOpen={isModalOpen}
        title={modalContent.title}
        content={modalContent.content}
        isLoading={isAILoading}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Custom CSS for animations and styling */}
      <style jsx>{`
        @keyframes dataFlow {
          0% { opacity: 0; transform: translateY(-20px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(20px); }
        }
        
        .neuro-glass {
          transition: border-color 0.5s ease;
        }
        
        /* Gold color utilities */
        .text-gold-400 { color: #fbbf24; }
        .bg-gold-500 { background-color: #f59e0b; }
        .border-gold-400 { border-color: #fbbf24; }
        .from-gold-500 { --tw-gradient-from: #f59e0b; }
        .to-yellow-500 { --tw-gradient-to: #eab308; }
      `}</style>
    </div>
  );
}

export default App;