import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Char "mo:base/Char";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";

actor OnChainScore {
  // Enhanced score factor data structure with trend analysis
  public type ScoreFactor = {
    name: Text;
    score: Nat;
    weight: Float;
    summary: Text;
    trend: Text; // "increasing", "decreasing", "stable"
    confidence: Nat; // 0-100 confidence level
    lastUpdate: Int;
  };

  // Enhanced score data structure with predictions
  public type ScoreData = {
    totalScore: Nat;
    loanEligibility: Nat;
    factors: [ScoreFactor];
    lastUpdated: Int;
    riskLevel: Text; // "low", "medium", "high"
    confidence: Nat; // Overall confidence in the score
    nextUpdate: Int; // When the score will be updated next
    improvementPotential: Nat; // How much the score could improve
  };

  // Enhanced transaction data structure
  public type TransactionData = {
    id: Text;
    transactionType: Text;
    amount: Nat;
    token: Text;
    timestamp: Int;
    scoreImpact: Int;
    description: Text;
    protocol: Text; // Which protocol/dapp was used
    riskLevel: Text; // Risk level of this transaction
  };

  // AI-powered recommendation structure
  public type AIRecommendation = {
    id: Text;
    category: Text; // "immediate", "short_term", "long_term"
    action: Text;
    expectedImpact: Int;
    difficulty: Text; // "easy", "medium", "hard"
    timeframe: Text;
    priority: Nat; // 1-5 priority level
  };

  // Get enhanced user score with AI insights
  public query func getUserScore(_principal: Principal) : async ScoreData {
    let principalText = Principal.toText(_principal);
    let baseScore = calculateDynamicScore(principalText);
    
    {
      totalScore = baseScore;
      loanEligibility = calculateLoanEligibility(baseScore);
      factors = generateEnhancedFactors(principalText);
      lastUpdated = Time.now();
      riskLevel = calculateRiskLevel(baseScore);
      confidence = calculateConfidence(principalText);
      nextUpdate = Time.now() + 3600_000_000_000; // 1 hour
      improvementPotential = calculateImprovementPotential(baseScore);
    }
  };

  // Get AI-powered recommendations
  public query func getAIRecommendations(_principal: Principal) : async [AIRecommendation] {
    let principalText = Principal.toText(_principal);
    [
      {
        id = "rec_001";
        category = "immediate";
        action = "Participate in NNS governance to boost your Governance Activity score";
        expectedImpact = 25;
        difficulty = "easy";
        timeframe = "1-3 days";
        priority = 5;
      },
      {
        id = "rec_002";
        category = "short_term";
        action = "Provide liquidity on Sonic DEX to improve your DeFi Footprint";
        expectedImpact = 40;
        difficulty = "medium";
        timeframe = "1-2 weeks";
        priority = 4;
      },
      {
        id = "rec_003";
        category = "long_term";
        action = "Diversify your token holdings across 5+ different assets";
        expectedImpact = 60;
        difficulty = "medium";
        timeframe = "1-3 months";
        priority = 3;
      }
    ]
  };

  // Enhanced transaction history with protocol analysis
  public query func getTransactionHistory(_principal: Principal) : async [TransactionData] {
    let baseTime = Time.now();
    let principalText = Principal.toText(_principal);
    
    [
      {
        id = "tx_001";
        transactionType = "swap";
        amount = 1000;
        token = "ICP";
        timestamp = baseTime - 86400000000000;
        scoreImpact = 8;
        description = "Swapped ICP for ckBTC on Sonic DEX";
        protocol = "Sonic";
        riskLevel = "low";
      },
      {
        id = "tx_002";
        transactionType = "governance";
        amount = 500;
        token = "ICP";
        timestamp = baseTime - 172800000000000;
        scoreImpact = 15;
        description = "Voted on NNS proposal #12345";
        protocol = "NNS";
        riskLevel = "low";
      },
      {
        id = "tx_003";
        transactionType = "liquidity";
        amount = 2000;
        token = "ICP";
        timestamp = baseTime - 259200000000000;
        scoreImpact = 20;
        description = "Added liquidity to ICP/ckBTC pool";
        protocol = "ICPSwap";
        riskLevel = "medium";
      },
      {
        id = "tx_004";
        transactionType = "nft";
        amount = 100;
        token = "ICP";
        timestamp = baseTime - 345600000000000;
        scoreImpact = 5;
        description = "Purchased NFT from IC Punks collection";
        protocol = "Entrepot";
        riskLevel = "high";
      }
    ]
  };

  // Calculate dynamic score based on principal hash
  private func calculateDynamicScore(principalText: Text) : Nat {
    let hash = textToHash(principalText);
    let baseScore = 650;
    let variation = hash % 200;
    baseScore + variation
  };

  // Calculate loan eligibility based on score
  private func calculateLoanEligibility(score: Nat) : Nat {
    if (score >= 800) { 100000 }
    else if (score >= 700) { 50000 }
    else if (score >= 600) { 25000 }
    else { 10000 }
  };

  // Generate enhanced factors with trends and confidence
  private func generateEnhancedFactors(principalText: Text) : [ScoreFactor] {
    let hash = textToHash(principalText);
    let baseTime = Time.now();
    
    [
      {
        name = "Transaction Consistency";
        score = 180 + (hash % 20);
        weight = 0.30;
        summary = "Regular and predictable transaction patterns indicate financial stability";
        trend = if (hash % 3 == 0) "increasing" else if (hash % 3 == 1) "stable" else "decreasing";
        confidence = 85 + (hash % 15);
        lastUpdate = baseTime - 3600000000000;
      },
      {
        name = "DeFi Footprint";
        score = 160 + (hash % 30);
        weight = 0.25;
        summary = "Active participation across multiple DeFi protocols shows sophistication";
        trend = if (hash % 4 == 0) "increasing" else "stable";
        confidence = 78 + (hash % 20);
        lastUpdate = baseTime - 7200000000000;
      },
      {
        name = "Asset Diversity";
        score = 150 + (hash % 40);
        weight = 0.25;
        summary = "Diversified portfolio reduces risk and shows financial maturity";
        trend = if (hash % 5 == 0) "increasing" else if (hash % 5 == 1) "decreasing" else "stable";
        confidence = 82 + (hash % 18);
        lastUpdate = baseTime - 10800000000000;
      },
      {
        name = "Governance Activity";
        score = 140 + (hash % 50);
        weight = 0.20;
        summary = "Participation in governance shows long-term commitment to ecosystem";
        trend = if (hash % 6 == 0) "increasing" else "stable";
        confidence = 75 + (hash % 25);
        lastUpdate = baseTime - 14400000000000;
      }
    ]
  };

  // Calculate risk level based on score
  private func calculateRiskLevel(score: Nat) : Text {
    if (score >= 750) { "low" }
    else if (score >= 600) { "medium" }
    else { "high" }
  };

  // Calculate confidence in the score
  private func calculateConfidence(principalText: Text) : Nat {
    let hash = textToHash(principalText);
    75 + (hash % 25) // 75-100% confidence
  };

  // Calculate improvement potential
  private func calculateImprovementPotential(currentScore: Nat) : Nat {
    if (currentScore >= 850) { 50 }  // Already very high
    else if (currentScore >= 700) { 100 }
    else if (currentScore >= 600) { 150 }
    else { 200 } // Lower scores have more room for improvement
  };

  // Simple hash function for deterministic randomness
  private func textToHash(text: Text) : Nat {
    var hash : Nat = 0;
    for (char in text.chars()) {
      let charNat = Nat32.toNat(Char.toNat32(char));
      hash := (hash * 31 + charNat) % 1000000;
    };
    hash
  };

  // Update score with enhanced analytics
  public func updateScore(_principal: Principal) : async { success: Bool; newScore: Nat; improvement: Int } {
    let oldScore = calculateDynamicScore(Principal.toText(_principal));
    // Simulate score improvement after update
    let newScore = oldScore + 5;
    { 
      success = true; 
      newScore = newScore;
      improvement = 5;
    }
  };

  // Simulate score impact of potential actions
  public query func simulateScoreImpact(_principal: Principal, action: Text) : async { estimatedImpact: Int; confidence: Nat; timeframe: Text } {
    switch (action) {
      case ("add_liquidity") { { estimatedImpact = 15; confidence = 85; timeframe = "1-3 days" } };
      case ("governance_vote") { { estimatedImpact = 10; confidence = 90; timeframe = "immediate" } };
      case ("diversify_portfolio") { { estimatedImpact = 25; confidence = 80; timeframe = "1-2 weeks" } };
      case ("regular_transactions") { { estimatedImpact = 8; confidence = 95; timeframe = "ongoing" } };
      case (_) { { estimatedImpact = 0; confidence = 0; timeframe = "unknown" } };
    }
  };

  // Legacy greet function for compatibility

  // Legacy greet function for compatibility
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}
