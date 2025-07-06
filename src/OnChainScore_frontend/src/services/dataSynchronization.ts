// Synchronization interface between frontend and backend data models
// This ensures consistent data structures across the application

export interface SyncedScoreData {
  totalScore: number;
  loanEligibility: number;
  factors: SyncedScoreFactor[];
  lastUpdated: Date;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  improvementPotential: number;
  nextUpdate: Date;
}

export interface SyncedScoreFactor {
  name: string;
  score: number;
  weight: number;
  summary: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  lastUpdate: Date;
}

export interface SyncedTransactionData {
  id: string;
  transactionType: string;
  amount: number;
  token: string;
  timestamp: Date;
  scoreImpact: number;
  description: string;
  protocol: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SyncedAIRecommendation {
  id: string;
  category: 'immediate' | 'short_term' | 'long_term';
  action: string;
  expectedImpact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  priority: number;
}

export interface SyncedScoreImpactSimulation {
  estimatedImpact: number;
  confidence: number;
  timeframe: string;
}

export interface SyncedScoreUpdate {
  success: boolean;
  newScore: number;
  improvement: number;
}

// Conversion utilities to ensure data consistency
export class DataSynchronizer {
  // Convert backend bigint timestamps to frontend Date objects
  static convertTimestamp(timestamp: bigint): Date {
    return new Date(Number(timestamp) / 1000000);
  }

  // Convert frontend Date objects to backend bigint timestamps
  static convertToBackendTimestamp(date: Date): bigint {
    return BigInt(date.getTime() * 1000000);
  }

  // Convert backend numeric values to frontend numbers
  static convertBigIntToNumber(value: bigint): number {
    return Number(value);
  }

  // Ensure consistent risk level strings
  static normalizeRiskLevel(riskLevel: string): 'low' | 'medium' | 'high' {
    const normalized = riskLevel.toLowerCase();
    if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
      return normalized as 'low' | 'medium' | 'high';
    }
    return 'medium'; // Default fallback
  }

  // Ensure consistent trend strings
  static normalizeTrend(trend: string): 'increasing' | 'decreasing' | 'stable' {
    const normalized = trend.toLowerCase();
    if (normalized === 'increasing' || normalized === 'decreasing' || normalized === 'stable') {
      return normalized as 'increasing' | 'decreasing' | 'stable';
    }
    return 'stable'; // Default fallback
  }

  // Ensure consistent category strings
  static normalizeCategory(category: string): 'immediate' | 'short_term' | 'long_term' {
    const normalized = category.toLowerCase();
    if (normalized === 'immediate' || normalized === 'short_term' || normalized === 'long_term') {
      return normalized as 'immediate' | 'short_term' | 'long_term';
    }
    return 'short_term'; // Default fallback
  }

  // Ensure consistent difficulty strings
  static normalizeDifficulty(difficulty: string): 'easy' | 'medium' | 'hard' {
    const normalized = difficulty.toLowerCase();
    if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
      return normalized as 'easy' | 'medium' | 'hard';
    }
    return 'medium'; // Default fallback
  }

  // Validate and normalize score values
  static normalizeScore(score: number): number {
    return Math.max(0, Math.min(1000, Math.round(score)));
  }

  // Validate and normalize confidence values
  static normalizeConfidence(confidence: number): number {
    return Math.max(0, Math.min(100, Math.round(confidence)));
  }

  // Validate and normalize weight values
  static normalizeWeight(weight: number): number {
    return Math.max(0, Math.min(1, weight));
  }

  // Validate and normalize impact values
  static normalizeImpact(impact: number): number {
    return Math.max(-100, Math.min(100, Math.round(impact)));
  }

  // Validate and normalize priority values
  static normalizePriority(priority: number): number {
    return Math.max(1, Math.min(5, Math.round(priority)));
  }
}

// Type guards for runtime validation
export class TypeGuards {
  static isValidRiskLevel(value: string): value is 'low' | 'medium' | 'high' {
    return ['low', 'medium', 'high'].includes(value);
  }

  static isValidTrend(value: string): value is 'increasing' | 'decreasing' | 'stable' {
    return ['increasing', 'decreasing', 'stable'].includes(value);
  }

  static isValidCategory(value: string): value is 'immediate' | 'short_term' | 'long_term' {
    return ['immediate', 'short_term', 'long_term'].includes(value);
  }

  static isValidDifficulty(value: string): value is 'easy' | 'medium' | 'hard' {
    return ['easy', 'medium', 'hard'].includes(value);
  }

  static isValidScore(value: number): boolean {
    return Number.isFinite(value) && value >= 0 && value <= 1000;
  }

  static isValidConfidence(value: number): boolean {
    return Number.isFinite(value) && value >= 0 && value <= 100;
  }

  static isValidWeight(value: number): boolean {
    return Number.isFinite(value) && value >= 0 && value <= 1;
  }

  static isValidImpact(value: number): boolean {
    return Number.isFinite(value) && value >= -100 && value <= 100;
  }

  static isValidPriority(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }
}

// Error classes for data synchronization issues
export class DataSyncError extends Error {
  constructor(message: string, public readonly field: string, public readonly value: any) {
    super(`Data synchronization error in field '${field}': ${message}`);
    this.name = 'DataSyncError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly field: string, public readonly value: any, public readonly expectedType: string) {
    super(`Validation error in field '${field}': ${message}. Expected ${expectedType}, got ${typeof value}`);
    this.name = 'ValidationError';
  }
}
