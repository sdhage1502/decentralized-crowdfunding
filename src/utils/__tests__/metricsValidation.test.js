/**
 * Unit tests for metrics validation functions
 * Tests content validation, fallback behavior, and error handling
 */

import { expect } from 'chai';
import { 
  validateMetric, 
  validateMetricsArray, 
  isValidMetricConfig,
  createSafeMetrics,
  getDefaultMetrics,
  validateIconComponent,
  validateMetricText
} from '../metricsValidation.js';
import { Shield, Eye, Network, Globe } from 'lucide-react';

describe('Metrics Validation Functions', () => {
  
  describe('validateMetric', () => {
    it('should return valid metric unchanged', () => {
      const validMetric = {
        icon: Shield,
        label: 'Security',
        value: 'MetaMask Protected'
      };
      
      const result = validateMetric(validMetric);
      expect(result).to.deep.equal(validMetric);
    });

    it('should apply fallback for missing icon', () => {
      const metricWithoutIcon = {
        label: 'Security',
        value: 'MetaMask Protected'
      };
      
      const result = validateMetric(metricWithoutIcon, 'security');
      expect(result.icon).to.equal(Shield);
      expect(result.label).to.equal('Security');
      expect(result.value).to.equal('MetaMask Protected');
    });

    it('should apply fallback for missing label', () => {
      const metricWithoutLabel = {
        icon: Shield,
        value: 'MetaMask Protected'
      };
      
      const result = validateMetric(metricWithoutLabel);
      expect(result.icon).to.equal(Shield);
      expect(result.label).to.equal('Platform Benefit');
      expect(result.value).to.equal('MetaMask Protected');
    });

    it('should apply fallback for missing value', () => {
      const metricWithoutValue = {
        icon: Shield,
        label: 'Security'
      };
      
      const result = validateMetric(metricWithoutValue);
      expect(result.icon).to.equal(Shield);
      expect(result.label).to.equal('Security');
      expect(result.value).to.equal('Verified Feature');
    });

    it('should handle null metric with complete fallback', () => {
      const result = validateMetric(null);
      expect(result.icon).to.equal(Shield);
      expect(result.label).to.equal('Platform Benefit');
      expect(result.value).to.equal('Verified Feature');
    });

    it('should handle undefined metric with complete fallback', () => {
      const result = validateMetric(undefined);
      expect(result.icon).to.equal(Shield);
      expect(result.label).to.equal('Platform Benefit');
      expect(result.value).to.equal('Verified Feature');
    });

    it('should trim whitespace from label and value', () => {
      const metricWithWhitespace = {
        icon: Shield,
        label: '  Security  ',
        value: '  MetaMask Protected  '
      };
      
      const result = validateMetric(metricWithWhitespace);
      expect(result.label).to.equal('Security');
      expect(result.value).to.equal('MetaMask Protected');
    });

    it('should use correct fallback icon based on metric type', () => {
      const metricWithoutIcon = { label: 'Test', value: 'Test' };
      
      expect(validateMetric(metricWithoutIcon, 'transparency').icon).to.equal(Eye);
      expect(validateMetric(metricWithoutIcon, 'security').icon).to.equal(Shield);
      expect(validateMetric(metricWithoutIcon, 'decentralization').icon).to.equal(Network);
      expect(validateMetric(metricWithoutIcon, 'accessibility').icon).to.equal(Globe);
      expect(validateMetric(metricWithoutIcon, 'unknown').icon).to.equal(Shield);
    });
  });

  describe('validateMetricsArray', () => {
    it('should validate array of valid metrics', () => {
      const validMetrics = [
        { icon: Eye, label: 'Transparency', value: '100% On-Chain' },
        { icon: Shield, label: 'Security', value: 'MetaMask Protected' },
        { icon: Network, label: 'Decentralization', value: 'No Platform Risk' },
        { icon: Globe, label: 'Accessibility', value: 'ETH + UPI' }
      ];
      
      const result = validateMetricsArray(validMetrics);
      expect(result).to.have.length(4);
      expect(result[0].icon).to.equal(Eye);
      expect(result[1].icon).to.equal(Shield);
      expect(result[2].icon).to.equal(Network);
      expect(result[3].icon).to.equal(Globe);
    });

    it('should fill missing metrics with defaults', () => {
      const partialMetrics = [
        { icon: Eye, label: 'Transparency', value: '100% On-Chain' },
        { icon: Shield, label: 'Security', value: 'MetaMask Protected' }
      ];
      
      const result = validateMetricsArray(partialMetrics);
      expect(result).to.have.length(4);
      expect(result[0].icon).to.equal(Eye);
      expect(result[1].icon).to.equal(Shield);
      // Remaining should be filled with defaults
      expect(result[2]).to.exist;
      expect(result[3]).to.exist;
    });

    it('should handle empty array with default metrics', () => {
      const result = validateMetricsArray([]);
      expect(result).to.have.length(4);
      expect(result[0].icon).to.equal(Eye);
      expect(result[0].label).to.equal('Full Transparency');
    });

    it('should handle null array with default metrics', () => {
      const result = validateMetricsArray(null);
      expect(result).to.have.length(4);
      expect(result[0].icon).to.equal(Eye);
    });

    it('should truncate array if more than 4 metrics provided', () => {
      const tooManyMetrics = Array(6).fill({
        icon: Shield, 
        label: 'Test', 
        value: 'Test Value'
      });
      
      const result = validateMetricsArray(tooManyMetrics);
      expect(result).to.have.length(4);
    });
  });

  describe('isValidMetricConfig', () => {
    it('should return true for valid configuration', () => {
      const validConfig = {
        icon: Shield,
        label: 'Security',
        value: 'MetaMask Protected'
      };
      
      expect(isValidMetricConfig(validConfig)).to.be.true;
    });

    it('should return false for missing icon', () => {
      const invalidConfig = {
        label: 'Security',
        value: 'MetaMask Protected'
      };
      
      expect(isValidMetricConfig(invalidConfig)).to.be.false;
    });

    it('should return false for missing label', () => {
      const invalidConfig = {
        icon: Shield,
        value: 'MetaMask Protected'
      };
      
      expect(isValidMetricConfig(invalidConfig)).to.be.false;
    });

    it('should return false for missing value', () => {
      const invalidConfig = {
        icon: Shield,
        label: 'Security'
      };
      
      expect(isValidMetricConfig(invalidConfig)).to.be.false;
    });

    it('should return false for empty strings', () => {
      const invalidConfig = {
        icon: Shield,
        label: '',
        value: '   '
      };
      
      expect(isValidMetricConfig(invalidConfig)).to.be.false;
    });

    it('should return false for null/undefined', () => {
      expect(isValidMetricConfig(null)).to.be.false;
      expect(isValidMetricConfig(undefined)).to.be.false;
    });
  });

  describe('createSafeMetrics', () => {
    it('should return validated metrics in non-strict mode', () => {
      const rawMetrics = [
        { icon: Eye, label: 'Transparency', value: '100% On-Chain' },
        { label: 'Security', value: 'MetaMask Protected' }, // Missing icon
        { icon: Network, label: 'Decentralization', value: 'No Platform Risk' },
        { icon: Globe, label: 'Accessibility', value: 'ETH + UPI' }
      ];
      
      const result = createSafeMetrics(rawMetrics);
      expect(result).to.have.length(4);
      expect(result[1].icon).to.equal(Shield); // Default fallback icon
    });

    it('should throw error in strict mode for invalid metrics', () => {
      const invalidMetrics = [
        { icon: Eye, label: 'Transparency', value: '100% On-Chain' },
        { label: 'Security', value: 'MetaMask Protected' }, // Missing icon
      ];
      
      expect(() => createSafeMetrics(invalidMetrics, { strict: true }))
        .to.throw('Invalid metric configuration at index 1');
    });

    it('should return default metrics as ultimate fallback', () => {
      const result = createSafeMetrics('invalid input');
      expect(result).to.have.length(4);
      expect(result[0].label).to.equal('Full Transparency');
    });
  });

  describe('getDefaultMetrics', () => {
    it('should return 4 default metrics', () => {
      const defaults = getDefaultMetrics();
      expect(defaults).to.have.length(4);
      
      expect(defaults[0].icon).to.equal(Eye);
      expect(defaults[0].label).to.equal('Full Transparency');
      expect(defaults[0].value).to.equal('100% On-Chain Verification');
      
      expect(defaults[1].icon).to.equal(Shield);
      expect(defaults[1].label).to.equal('Smart Contract Security');
      expect(defaults[1].value).to.equal('MetaMask Protected');
      
      expect(defaults[2].icon).to.equal(Network);
      expect(defaults[2].label).to.equal('Decentralized Resilience');
      expect(defaults[2].value).to.equal('No Platform Risk');
      
      expect(defaults[3].icon).to.equal(Globe);
      expect(defaults[3].label).to.equal('Global Accessibility');
      expect(defaults[3].value).to.equal('ETH + UPI Integration');
    });
  });

  describe('validateIconComponent', () => {
    it('should return valid icon component unchanged', () => {
      const result = validateIconComponent(Shield);
      expect(result).to.equal(Shield);
    });

    it('should return fallback for invalid icon', () => {
      const result = validateIconComponent('invalid', 'security');
      expect(result).to.equal(Shield);
    });

    it('should return default fallback for unknown type', () => {
      const result = validateIconComponent(null, 'unknown');
      expect(result).to.equal(Shield);
    });
  });

  describe('validateMetricText', () => {
    it('should return valid text unchanged', () => {
      const text = 'Valid metric text';
      const result = validateMetricText(text);
      expect(result).to.equal(text);
    });

    it('should trim whitespace', () => {
      const result = validateMetricText('  Valid text  ');
      expect(result).to.equal('Valid text');
    });

    it('should return fallback for empty string', () => {
      const result = validateMetricText('   ');
      expect(result).to.equal('Platform Benefit');
    });

    it('should return fallback for non-string input', () => {
      const result = validateMetricText(123);
      expect(result).to.equal('Platform Benefit');
    });

    it('should truncate text that exceeds max length', () => {
      const longText = 'This is a very long text that exceeds the maximum allowed length for metric text content and should be truncated';
      const result = validateMetricText(longText, 50);
      expect(result).to.have.length(50);
      expect(result).to.include('...');
    });

    it('should use custom fallback text', () => {
      const result = validateMetricText('', 100, 'Custom Fallback');
      expect(result).to.equal('Custom Fallback');
    });
  });
});