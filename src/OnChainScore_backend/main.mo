import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor OnChainScore {
  // Score factor data structure
  public type ScoreFactor = {
    name: Text;
    score: Nat;
    weight: Float;
    summary: Text;
  };

  // Score data structure
  public type ScoreData = {
    totalScore: Nat;
    loanEligibility: Nat;
    factors: [ScoreFactor];
    lastUpdated: Int;
  };

  // Transaction data structure
  public type TransactionData = {
    id: Text;
    transactionType: Text;
    amount: Nat;
    token: Text;
    timestamp: Int;
    scoreImpact: Int;
    description: Text;
  };

  // Get user score (mock implementation)
  public query func getUserScore(_principal: Principal) : async ScoreData {
    let baseScore = 750; // Fixed score for now
    
    {
      totalScore = baseScore;
      loanEligibility = 600;
      factors = [
        {
          name = "Transaction Consistency";
          score = 187;
          weight = 0.3;
          summary = "Regular transaction patterns detected";
        },
        {
          name = "DeFi Footprint";
          score = 225;
          weight = 0.25;
          summary = "Active in multiple DeFi protocols";
        },
        {
          name = "Asset Diversity";
          score = 187;
          weight = 0.25;
          summary = "Diversified token holdings";
        },
        {
          name = "Governance Activity";
          score = 150;
          weight = 0.2;
          summary = "Participates in governance decisions";
        }
      ];
      lastUpdated = Time.now();
    }
  };

  // Get transaction history (mock implementation)
  public query func getTransactionHistory(_principal: Principal) : async [TransactionData] {
    let baseTime = Time.now();
    
    [
      {
        id = "tx_001";
        transactionType = "swap";
        amount = 1000;
        token = "ICP";
        timestamp = baseTime - 86400000000000;
        scoreImpact = 5;
        description = "Swapped ICP for ckBTC";
      },
      {
        id = "tx_002";
        transactionType = "stake";
        amount = 500;
        token = "ICP";
        timestamp = baseTime - 172800000000000;
        scoreImpact = 10;
        description = "Staked ICP in governance";
      }
    ]
  };

  // Update score (mock implementation)
  public func updateScore(_principal: Principal) : async { success: Bool } {
    { success = true }
  };

  // Legacy greet function for compatibility
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}
