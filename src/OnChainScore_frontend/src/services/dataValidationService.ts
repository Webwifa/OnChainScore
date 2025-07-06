import { Principal } from '@dfinity/principal';
import { TypeGuards, ValidationError } from './dataSynchronization';
import { scoreService } from './scoreService';
import type { ScoreData, AIRecommendation } from './scoreService';
import type { EnhancedScoreData } from './enhancedScoring';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface SyncValidationResult {
  isSync: boolean;
  frontendData: any;
  backendData: any;
  discrepancies: string[];
  recommendations: string[];
}

export class DataValidationService {
  // Validate score data consistency
  static validateScoreData(scoreData: ScoreData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validate total score
    if (!TypeGuards.isValidScore(scoreData.totalScore)) {
      errors.push(new ValidationError(
        'Total score must be between 0 and 1000',
        'totalScore',
        scoreData.totalScore,
        'number (0-1000)'
      ));
    }

    // Validate loan eligibility
    if (!Number.isFinite(scoreData.loanEligibility) || scoreData.loanEligibility < 0) {
      errors.push(new ValidationError(
        'Loan eligibility must be a non-negative number',
        'loanEligibility',
        scoreData.loanEligibility,
        'number (>= 0)'
      ));
    }

    // Validate factors
    if (!Array.isArray(scoreData.factors)) {
      errors.push(new ValidationError(
        'Factors must be an array',
        'factors',
        scoreData.factors,
        'array'
      ));
    } else {
      scoreData.factors.forEach((factor, index) => {
        if (!TypeGuards.isValidScore(factor.score)) {
          errors.push(new ValidationError(
            `Factor ${index} score must be between 0 and 1000`,
            `factors[${index}].score`,
            factor.score,
            'number (0-1000)'
          ));
        }

        if (!TypeGuards.isValidWeight(factor.weight)) {
          errors.push(new ValidationError(
            `Factor ${index} weight must be between 0 and 1`,
            `factors[${index}].weight`,
            factor.weight,
            'number (0-1)'
          ));
        }

        if (factor.trend && !TypeGuards.isValidTrend(factor.trend)) {
          errors.push(new ValidationError(
            `Factor ${index} trend must be 'increasing', 'decreasing', or 'stable'`,
            `factors[${index}].trend`,
            factor.trend,
            'increasing | decreasing | stable'
          ));
        }

        if (factor.confidence && !TypeGuards.isValidConfidence(factor.confidence)) {
          errors.push(new ValidationError(
            `Factor ${index} confidence must be between 0 and 100`,
            `factors[${index}].confidence`,
            factor.confidence,
            'number (0-100)'
          ));
        }
      });
    }

    // Validate confidence level
    if (scoreData.confidenceLevel && !TypeGuards.isValidConfidence(scoreData.confidenceLevel)) {
      errors.push(new ValidationError(
        'Confidence level must be between 0 and 100',
        'confidenceLevel',
        scoreData.confidenceLevel,
        'number (0-100)'
      ));
    }

    // Validate risk level
    if (scoreData.riskLevel && !TypeGuards.isValidRiskLevel(scoreData.riskLevel)) {
      errors.push(new ValidationError(
        'Risk level must be low, medium, or high',
        'riskLevel',
        scoreData.riskLevel,
        'low | medium | high'
      ));
    }

    // Validate dates
    if (!(scoreData.lastUpdated instanceof Date) || isNaN(scoreData.lastUpdated.getTime())) {
      errors.push(new ValidationError(
        'Last updated must be a valid Date',
        'lastUpdated',
        scoreData.lastUpdated,
        'Date'
      ));
    }

    // Add warnings for missing optional fields
    if (!scoreData.riskLevel) {
      warnings.push('Risk level is not specified');
    }
    if (!scoreData.confidenceLevel) {
      warnings.push('Confidence level is not specified');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate AI recommendations
  static validateAIRecommendations(recommendations: AIRecommendation[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(recommendations)) {
      errors.push(new ValidationError(
        'Recommendations must be an array',
        'recommendations',
        recommendations,
        'array'
      ));
      return { isValid: false, errors, warnings };
    }

    recommendations.forEach((rec, index) => {
      if (!rec.id || typeof rec.id !== 'string') {
        errors.push(new ValidationError(
          `Recommendation ${index} must have a valid ID`,
          `recommendations[${index}].id`,
          rec.id,
          'string'
        ));
      }

      if (!TypeGuards.isValidCategory(rec.category)) {
        errors.push(new ValidationError(
          `Recommendation ${index} category must be immediate, short_term, or long_term`,
          `recommendations[${index}].category`,
          rec.category,
          'immediate | short_term | long_term'
        ));
      }

      if (!TypeGuards.isValidImpact(rec.expectedImpact)) {
        errors.push(new ValidationError(
          `Recommendation ${index} expected impact must be between -100 and 100`,
          `recommendations[${index}].expectedImpact`,
          rec.expectedImpact,
          'number (-100 to 100)'
        ));
      }

      if (!TypeGuards.isValidDifficulty(rec.difficulty)) {
        errors.push(new ValidationError(
          `Recommendation ${index} difficulty must be easy, medium, or hard`,
          `recommendations[${index}].difficulty`,
          rec.difficulty,
          'easy | medium | hard'
        ));
      }

      if (!TypeGuards.isValidPriority(rec.priority)) {
        errors.push(new ValidationError(
          `Recommendation ${index} priority must be between 1 and 5`,
          `recommendations[${index}].priority`,
          rec.priority,
          'number (1-5)'
        ));
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate enhanced score data
  static validateEnhancedScoreData(enhancedData: EnhancedScoreData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validate total score
    if (!TypeGuards.isValidScore(enhancedData.totalScore)) {
      errors.push(new ValidationError(
        'Enhanced total score must be between 0 and 1000',
        'enhancedData.totalScore',
        enhancedData.totalScore,
        'number (0-1000)'
      ));
    }

    // Validate confidence level
    if (!TypeGuards.isValidConfidence(enhancedData.confidenceLevel)) {
      errors.push(new ValidationError(
        'Enhanced confidence level must be between 0 and 100',
        'enhancedData.confidenceLevel',
        enhancedData.confidenceLevel,
        'number (0-100)'
      ));
    }

    // Validate risk profile
    if (!TypeGuards.isValidRiskLevel(enhancedData.riskProfile.riskLevel)) {
      errors.push(new ValidationError(
        'Enhanced risk level must be low, medium, or high',
        'enhancedData.riskProfile.riskLevel',
        enhancedData.riskProfile.riskLevel,
        'low | medium | high'
      ));
    }

    // Validate factors
    if (!Array.isArray(enhancedData.factors)) {
      errors.push(new ValidationError(
        'Enhanced factors must be an array',
        'enhancedData.factors',
        enhancedData.factors,
        'array'
      ));
    } else {
      enhancedData.factors.forEach((factor, index) => {
        if (!TypeGuards.isValidScore(factor.score)) {
          errors.push(new ValidationError(
            `Enhanced factor ${index} score must be between 0 and 1000`,
            `enhancedData.factors[${index}].score`,
            factor.score,
            'number (0-1000)'
          ));
        }

        if (!TypeGuards.isValidWeight(factor.weight)) {
          errors.push(new ValidationError(
            `Enhanced factor ${index} weight must be between 0 and 1`,
            `enhancedData.factors[${index}].weight`,
            factor.weight,
            'number (0-1)'
          ));
        }

        if (!TypeGuards.isValidTrend(factor.trend)) {
          errors.push(new ValidationError(
            `Enhanced factor ${index} trend must be increasing, decreasing, or stable`,
            `enhancedData.factors[${index}].trend`,
            factor.trend,
            'increasing | decreasing | stable'
          ));
        }
      });
    }

    // Validate recommendations
    if (!Array.isArray(enhancedData.recommendations)) {
      errors.push(new ValidationError(
        'Enhanced recommendations must be an array',
        'enhancedData.recommendations',
        enhancedData.recommendations,
        'array'
      ));
    } else {
      // Convert enhanced recommendations to frontend format for validation
      const convertedRecommendations: AIRecommendation[] = enhancedData.recommendations.map((rec, index) => ({
        id: `enhanced_${index}`,
        category: rec.category,
        action: rec.action,
        expectedImpact: rec.expectedImpact,
        difficulty: rec.difficulty,
        timeframe: rec.timeframe,
        priority: 3 // Default priority for enhanced recommendations
      }));
      
      const recValidation = this.validateAIRecommendations(convertedRecommendations);
      errors.push(...recValidation.errors);
      warnings.push(...recValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Compare frontend and backend data for synchronization
  static async validateDataSynchronization(principal: Principal): Promise<SyncValidationResult> {
    try {
      const frontendData = await scoreService.getUserScore(principal);
      const backendRecommendations = await scoreService.getAIRecommendations(principal);

      const discrepancies: string[] = [];
      const recommendations: string[] = [];

      // Compare scores
      if (frontendData.enhancedData) {
        const scoreDiff = Math.abs(frontendData.totalScore - frontendData.enhancedData.totalScore);
        if (scoreDiff > 10) {
          discrepancies.push(`Score discrepancy: Frontend=${frontendData.totalScore}, Enhanced=${frontendData.enhancedData.totalScore}`);
          recommendations.push('Consider recalibrating the enhanced scoring algorithm');
        }
      }

      // Compare confidence levels
      if (frontendData.confidenceLevel && frontendData.enhancedData) {
        const confidenceDiff = Math.abs(frontendData.confidenceLevel - frontendData.enhancedData.confidenceLevel);
        if (confidenceDiff > 15) {
          discrepancies.push(`Confidence discrepancy: Frontend=${frontendData.confidenceLevel}, Enhanced=${frontendData.enhancedData.confidenceLevel}`);
          recommendations.push('Review confidence calculation methods');
        }
      }

      // Validate factor count consistency
      if (frontendData.factors.length !== 4) {
        discrepancies.push(`Expected 4 factors, got ${frontendData.factors.length}`);
        recommendations.push('Ensure all required factors are present');
      }

      // Validate recommendations count
      if (backendRecommendations.length === 0) {
        discrepancies.push('No AI recommendations available');
        recommendations.push('Check AI recommendation generation logic');
      }

      return {
        isSync: discrepancies.length === 0,
        frontendData,
        backendData: {
          recommendations: backendRecommendations
        },
        discrepancies,
        recommendations
      };
    } catch (error) {
      return {
        isSync: false,
        frontendData: null,
        backendData: null,
        discrepancies: [`Sync validation failed: ${error}`],
        recommendations: ['Check network connectivity and backend availability']
      };
    }
  }

  // Generate a comprehensive data health report
  static async generateDataHealthReport(principal: Principal): Promise<{
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    validationResults: ValidationResult[];
    syncResult: SyncValidationResult;
    recommendations: string[];
  }> {
    const validationResults: ValidationResult[] = [];
    
    try {
      // Get data
      const scoreData = await scoreService.getUserScore(principal);
      const aiRecommendations = await scoreService.getAIRecommendations(principal);
      const syncResult = await this.validateDataSynchronization(principal);

      // Validate each data type
      validationResults.push(this.validateScoreData(scoreData));
      validationResults.push(this.validateAIRecommendations(aiRecommendations));
      
      if (scoreData.enhancedData) {
        validationResults.push(this.validateEnhancedScoreData(scoreData.enhancedData));
      }

      // Calculate overall health
      const totalErrors = validationResults.reduce((sum, result) => sum + result.errors.length, 0);
      const totalWarnings = validationResults.reduce((sum, result) => sum + result.warnings.length, 0);
      const hasSyncIssues = !syncResult.isSync;

      let overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
      if (totalErrors === 0 && totalWarnings === 0 && !hasSyncIssues) {
        overallHealth = 'excellent';
      } else if (totalErrors === 0 && totalWarnings <= 2 && !hasSyncIssues) {
        overallHealth = 'good';
      } else if (totalErrors <= 2 && totalWarnings <= 5) {
        overallHealth = 'fair';
      } else {
        overallHealth = 'poor';
      }

      // Generate recommendations
      const recommendations = [
        ...validationResults.flatMap(result => result.warnings),
        ...syncResult.recommendations
      ];

      return {
        overallHealth,
        validationResults,
        syncResult,
        recommendations
      };
    } catch (error) {
      return {
        overallHealth: 'poor',
        validationResults,
        syncResult: {
          isSync: false,
          frontendData: null,
          backendData: null,
          discrepancies: [`Health report generation failed: ${error}`],
          recommendations: ['Check system connectivity and try again']
        },
        recommendations: ['System health check failed - contact support']
      };
    }
  }
}

// Export singleton instance
export const dataValidationService = new DataValidationService();
