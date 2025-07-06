import { Principal } from '@dfinity/principal';
import { scoreService } from './scoreService';
import { DataValidationService } from './dataValidationService';
import { onChainAnalyzer } from './enhancedScoring';
import { DataSynchronizer } from './dataSynchronization';

export class SynchronizationTestSuite {
  private static testPrincipal = Principal.fromText('umunu-kh777-77774-qaaca-cai');

  static async runFullSynchronizationTest(): Promise<{
    success: boolean;
    results: Array<{
      testName: string;
      passed: boolean;
      details: string;
      duration: number;
    }>;
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      overallDuration: number;
    };
  }> {
    const startTime = Date.now();
    const results = [];

    console.log('🔄 Starting Frontend-Backend Synchronization Test Suite...');

    // Test 1: Score Data Synchronization
    const scoreTest = await this.testScoreDataSync();
    results.push(scoreTest);

    // Test 2: AI Recommendations Synchronization
    const aiTest = await this.testAIRecommendationsSync();
    results.push(aiTest);

    // Test 3: Data Validation
    const validationTest = await this.testDataValidation();
    results.push(validationTest);

    // Test 4: Enhanced Score Integration
    const enhancedTest = await this.testEnhancedScoreIntegration();
    results.push(enhancedTest);

    // Test 5: Data Conversion Accuracy
    const conversionTest = await this.testDataConversionAccuracy();
    results.push(conversionTest);

    // Test 6: Error Handling
    const errorTest = await this.testErrorHandling();
    results.push(errorTest);

    const endTime = Date.now();
    const overallDuration = endTime - startTime;

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const success = failed === 0;

    console.log(`📊 Test Summary: ${passed}/${results.length} tests passed`);
    console.log(`⏱️  Total duration: ${overallDuration}ms`);

    return {
      success,
      results,
      summary: {
        totalTests: results.length,
        passed,
        failed,
        overallDuration
      }
    };
  }

  private static async testScoreDataSync(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'Score Data Synchronization';
    
    try {
      console.log('🧪 Testing score data synchronization...');
      
      const scoreData = await scoreService.getUserScore(this.testPrincipal);
      
      // Verify structure
      const hasRequiredFields = [
        'totalScore',
        'loanEligibility',
        'factors',
        'lastUpdated'
      ].every(field => field in scoreData);

      if (!hasRequiredFields) {
        return {
          testName,
          passed: false,
          details: 'Missing required fields in score data',
          duration: Date.now() - startTime
        };
      }

      // Verify data types
      const typesCorrect = 
        typeof scoreData.totalScore === 'number' &&
        typeof scoreData.loanEligibility === 'number' &&
        Array.isArray(scoreData.factors) &&
        scoreData.lastUpdated instanceof Date;

      if (!typesCorrect) {
        return {
          testName,
          passed: false,
          details: 'Incorrect data types in score data',
          duration: Date.now() - startTime
        };
      }

      // Verify factor structure
      const factorStructureCorrect = scoreData.factors.every(factor => 
        typeof factor.name === 'string' &&
        typeof factor.score === 'number' &&
        typeof factor.weight === 'number' &&
        typeof factor.summary === 'string'
      );

      if (!factorStructureCorrect) {
        return {
          testName,
          passed: false,
          details: 'Incorrect factor structure in score data',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: `Score data synchronized correctly. Score: ${scoreData.totalScore}, Factors: ${scoreData.factors.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Score data sync failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private static async testAIRecommendationsSync(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'AI Recommendations Synchronization';
    
    try {
      console.log('🤖 Testing AI recommendations synchronization...');
      
      const recommendations = await scoreService.getAIRecommendations(this.testPrincipal);
      
      // Verify structure
      if (!Array.isArray(recommendations)) {
        return {
          testName,
          passed: false,
          details: 'Recommendations is not an array',
          duration: Date.now() - startTime
        };
      }

      // Verify each recommendation structure
      const recommendationStructureCorrect = recommendations.every(rec => 
        typeof rec.id === 'string' &&
        typeof rec.category === 'string' &&
        typeof rec.action === 'string' &&
        typeof rec.expectedImpact === 'number' &&
        typeof rec.difficulty === 'string' &&
        typeof rec.timeframe === 'string' &&
        typeof rec.priority === 'number'
      );

      if (!recommendationStructureCorrect) {
        return {
          testName,
          passed: false,
          details: 'Incorrect recommendation structure',
          duration: Date.now() - startTime
        };
      }

      // Verify value ranges
      const valuesValid = recommendations.every(rec => 
        rec.expectedImpact >= -100 && rec.expectedImpact <= 100 &&
        rec.priority >= 1 && rec.priority <= 5 &&
        ['immediate', 'short_term', 'long_term'].includes(rec.category) &&
        ['easy', 'medium', 'hard'].includes(rec.difficulty)
      );

      if (!valuesValid) {
        return {
          testName,
          passed: false,
          details: 'Invalid recommendation values',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: `AI recommendations synchronized correctly. Count: ${recommendations.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `AI recommendations sync failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private static async testDataValidation(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'Data Validation';
    
    try {
      console.log('✅ Testing data validation...');
      
      const healthReport = await DataValidationService.generateDataHealthReport(this.testPrincipal);
      
      if (!healthReport) {
        return {
          testName,
          passed: false,
          details: 'Health report generation failed',
          duration: Date.now() - startTime
        };
      }

      const hasValidationResults = Array.isArray(healthReport.validationResults) &&
                                 healthReport.validationResults.length > 0;

      if (!hasValidationResults) {
        return {
          testName,
          passed: false,
          details: 'No validation results generated',
          duration: Date.now() - startTime
        };
      }

      const healthLevels = ['excellent', 'good', 'fair', 'poor'];
      const validHealth = healthLevels.includes(healthReport.overallHealth);

      if (!validHealth) {
        return {
          testName,
          passed: false,
          details: 'Invalid health level',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: `Data validation working. Health: ${healthReport.overallHealth}, Validations: ${healthReport.validationResults.length}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Data validation failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private static async testEnhancedScoreIntegration(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'Enhanced Score Integration';
    
    try {
      console.log('🚀 Testing enhanced score integration...');
      
      const enhancedData = await onChainAnalyzer.analyzeComprehensiveScore(this.testPrincipal);
      
      if (!enhancedData) {
        return {
          testName,
          passed: false,
          details: 'Enhanced score analysis failed',
          duration: Date.now() - startTime
        };
      }

      // Verify required fields
      const requiredFields = [
        'totalScore',
        'confidenceLevel',
        'factors',
        'riskProfile',
        'recommendations',
        'predictions',
        'lastUpdated'
      ];

      const hasRequiredFields = requiredFields.every(field => field in enhancedData);

      if (!hasRequiredFields) {
        return {
          testName,
          passed: false,
          details: 'Missing required fields in enhanced data',
          duration: Date.now() - startTime
        };
      }

      // Verify data quality
      const dataQuality = 
        enhancedData.totalScore >= 0 && enhancedData.totalScore <= 1000 &&
        enhancedData.confidenceLevel >= 0 && enhancedData.confidenceLevel <= 100 &&
        Array.isArray(enhancedData.factors) &&
        Array.isArray(enhancedData.recommendations) &&
        Array.isArray(enhancedData.predictions);

      if (!dataQuality) {
        return {
          testName,
          passed: false,
          details: 'Invalid enhanced data quality',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: `Enhanced score integration working. Score: ${enhancedData.totalScore}, Confidence: ${enhancedData.confidenceLevel}%`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Enhanced score integration failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private static async testDataConversionAccuracy(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'Data Conversion Accuracy';
    
    try {
      console.log('🔄 Testing data conversion accuracy...');
      
      // Test timestamp conversion
      const testDate = new Date();
      const backendTimestamp = DataSynchronizer.convertToBackendTimestamp(testDate);
      const frontendDate = DataSynchronizer.convertTimestamp(backendTimestamp);
      
      const timestampAccuracy = Math.abs(testDate.getTime() - frontendDate.getTime()) < 1000; // Within 1 second

      if (!timestampAccuracy) {
        return {
          testName,
          passed: false,
          details: 'Timestamp conversion inaccurate',
          duration: Date.now() - startTime
        };
      }

      // Test normalization functions
      const testScore = DataSynchronizer.normalizeScore(1500); // Should be capped at 1000
      const testConfidence = DataSynchronizer.normalizeConfidence(150); // Should be capped at 100
      const testWeight = DataSynchronizer.normalizeWeight(1.5); // Should be capped at 1

      if (testScore !== 1000 || testConfidence !== 100 || testWeight !== 1) {
        return {
          testName,
          passed: false,
          details: 'Normalization functions not working correctly',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: 'Data conversion accuracy verified',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Data conversion test failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private static async testErrorHandling(): Promise<{
    testName: string;
    passed: boolean;
    details: string;
    duration: number;
  }> {
    const startTime = Date.now();
    const testName = 'Error Handling';
    
    try {
      console.log('⚠️  Testing error handling...');
      
      // Test with invalid principal
      const invalidPrincipal = Principal.fromText('aaaaa-aa');
      
      // This should not throw but return fallback data
      const fallbackData = await scoreService.getUserScore(invalidPrincipal);
      
      if (!fallbackData) {
        return {
          testName,
          passed: false,
          details: 'Fallback data not provided for invalid principal',
          duration: Date.now() - startTime
        };
      }

      // Verify fallback data structure
      const fallbackStructureValid = 
        typeof fallbackData.totalScore === 'number' &&
        typeof fallbackData.loanEligibility === 'number' &&
        Array.isArray(fallbackData.factors) &&
        fallbackData.lastUpdated instanceof Date;

      if (!fallbackStructureValid) {
        return {
          testName,
          passed: false,
          details: 'Fallback data structure invalid',
          duration: Date.now() - startTime
        };
      }

      return {
        testName,
        passed: true,
        details: 'Error handling working correctly with fallback data',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        details: `Error handling test failed: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  // Run a specific test
  static async runSingleTest(testName: string): Promise<any> {
    switch (testName) {
      case 'score':
        return await this.testScoreDataSync();
      case 'ai':
        return await this.testAIRecommendationsSync();
      case 'validation':
        return await this.testDataValidation();
      case 'enhanced':
        return await this.testEnhancedScoreIntegration();
      case 'conversion':
        return await this.testDataConversionAccuracy();
      case 'error':
        return await this.testErrorHandling();
      default:
        throw new Error(`Unknown test: ${testName}`);
    }
  }

  // Quick health check
  static async quickHealthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
  }> {
    const issues = [];
    
    try {
      // Quick score test
      const scoreData = await scoreService.getUserScore(this.testPrincipal);
      if (!scoreData || typeof scoreData.totalScore !== 'number') {
        issues.push('Score data issue');
      }

      // Quick AI test
      const aiRecs = await scoreService.getAIRecommendations(this.testPrincipal);
      if (!Array.isArray(aiRecs)) {
        issues.push('AI recommendations issue');
      }

      // Quick enhanced test
      const enhancedData = await onChainAnalyzer.analyzeComprehensiveScore(this.testPrincipal);
      if (!enhancedData || typeof enhancedData.totalScore !== 'number') {
        issues.push('Enhanced score issue');
      }

    } catch (error) {
      issues.push(`Health check error: ${error}`);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  }
}

// Export for use in development/testing
export const syncTestSuite = SynchronizationTestSuite;
