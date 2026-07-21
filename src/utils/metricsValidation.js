/**
 * Content validation functions for meaningful metrics section
 * Handles missing data, invalid configurations, and fallback values
 */

import { Shield, Eye, Network, Globe } from 'lucide-react';

/**
 * Default fallback metric configuration
 */
const DEFAULT_METRIC = {
  icon: Shield,
  label: 'Platform Benefit',
  value: 'Verified Feature'
};

/**
 * Available fallback icons for different metric types
 */
const FALLBACK_ICONS = {
  transparency: Eye,
  security: Shield,
  decentralization: Network,
  accessibility: Globe,
  default: Shield
};

/**
 * Validates a single metric object and applies fallbacks for missing or invalid data
 * 
 * @param {Object} metric - The metric object to validate
 * @param {React.Component} metric.icon - Lucide React icon component
 * @param {string} metric.label - Metric description/category
 * @param {string} metric.value - Metric value/benefit statement
 * @param {string} [metricType] - Optional metric type for better icon fallback selection
 * @returns {Object} Validated metric with fallbacks applied
 */
export const validateMetric = (metric, metricType = 'default') => {
  // Handle null or undefined metric
  if (!metric || typeof metric !== 'object') {
    console.warn('Invalid metric object provided, using default fallback');
    return { ...DEFAULT_METRIC };
  }

  const validatedMetric = {};

  // Validate and set icon with fallback
  if (metric.icon && (typeof metric.icon === 'function' || (typeof metric.icon === 'object' && metric.icon.$$typeof))) {
    validatedMetric.icon = metric.icon;
  } else {
    console.warn(`Invalid or missing icon for metric "${metric.label || 'unknown'}", using fallback`);
    validatedMetric.icon = FALLBACK_ICONS[metricType] || FALLBACK_ICONS.default;
  }

  // Validate and set label with fallback
  if (typeof metric.label === 'string' && metric.label.trim().length > 0) {
    validatedMetric.label = metric.label.trim();
  } else {
    console.warn(`Invalid or missing label for metric, using fallback`);
    validatedMetric.label = DEFAULT_METRIC.label;
  }

  // Validate and set value with fallback
  if (typeof metric.value === 'string' && metric.value.trim().length > 0) {
    validatedMetric.value = metric.value.trim();
  } else {
    console.warn(`Invalid or missing value for metric "${validatedMetric.label}", using fallback`);
    validatedMetric.value = DEFAULT_METRIC.value;
  }

  return validatedMetric;
};

/**
 * Validates an array of metrics and ensures exactly 4 valid metrics are returned
 * 
 * @param {Array} metrics - Array of metric objects to validate
 * @param {Array} [metricTypes] - Optional array of metric types for better fallback selection
 * @returns {Array} Array of exactly 4 validated metrics
 */
export const validateMetricsArray = (metrics, metricTypes = []) => {
  if (!Array.isArray(metrics)) {
    console.error('Invalid metrics array provided, using default metrics');
    return getDefaultMetrics();
  }

  const validatedMetrics = [];
  const maxMetrics = 4;

  // Validate provided metrics
  for (let i = 0; i < Math.min(metrics.length, maxMetrics); i++) {
    const metricType = metricTypes[i] || 'default';
    const validated = validateMetric(metrics[i], metricType);
    validatedMetrics.push(validated);
  }

  // Fill remaining slots with default metrics if needed
  while (validatedMetrics.length < maxMetrics) {
    const defaultMetric = getDefaultMetricByIndex(validatedMetrics.length);
    validatedMetrics.push(defaultMetric);
    console.warn(`Missing metric at index ${validatedMetrics.length - 1}, added default metric`);
  }

  return validatedMetrics;
};

/**
 * Validates metric configuration object structure
 * 
 * @param {Object} config - Metric configuration object
 * @returns {boolean} True if configuration is valid
 */
export const isValidMetricConfig = (config) => {
  if (!config || typeof config !== 'object') return false;
  
  // Check required properties
  const hasValidIcon = config.icon && (typeof config.icon === 'function' || (typeof config.icon === 'object' && config.icon.$$typeof));
  const hasValidLabel = typeof config.label === 'string' && config.label.trim().length > 0;
  const hasValidValue = typeof config.value === 'string' && config.value.trim().length > 0;
  
  return hasValidIcon && hasValidLabel && hasValidValue;
};

/**
 * Creates a safe metrics object with validation and error handling
 * 
 * @param {Array} rawMetrics - Raw metrics data
 * @param {Object} options - Validation options
 * @param {boolean} options.strict - If true, throws errors instead of using fallbacks
 * @param {Array} options.metricTypes - Array of metric types for fallback selection
 * @returns {Array} Safe metrics array
 */
export const createSafeMetrics = (rawMetrics, options = {}) => {
  const { strict = false, metricTypes = [] } = options;
  
  try {
    if (strict && !Array.isArray(rawMetrics)) {
      throw new Error('Invalid metrics array provided');
    }
    
    if (strict && rawMetrics.length !== 4) {
      throw new Error(`Expected exactly 4 metrics, received ${rawMetrics.length}`);
    }
    
    if (strict) {
      // In strict mode, validate all metrics without fallbacks
      rawMetrics.forEach((metric, index) => {
        if (!isValidMetricConfig(metric)) {
          throw new Error(`Invalid metric configuration at index ${index}`);
        }
      });
      return rawMetrics;
    }
    
    // Non-strict mode: use validation with fallbacks
    return validateMetricsArray(rawMetrics, metricTypes);
    
  } catch (error) {
    console.error('Error creating safe metrics:', error.message);
    
    if (strict) {
      throw error;
    }
    
    // Return default metrics as ultimate fallback
    console.warn('Using default metrics due to validation errors');
    return getDefaultMetrics();
  }
};

/**
 * Returns default metrics configuration
 * 
 * @returns {Array} Array of 4 default metrics
 */
export const getDefaultMetrics = () => [
  {
    icon: Eye,
    label: 'Full Transparency',
    value: '100% On-Chain Verification'
  },
  {
    icon: Shield,
    label: 'Smart Contract Security',
    value: 'MetaMask Protected'
  },
  {
    icon: Network,
    label: 'Decentralized Resilience',
    value: 'No Platform Risk'
  },
  {
    icon: Globe,
    label: 'Global Accessibility',
    value: 'ETH + UPI Integration'
  }
];

/**
 * Returns a default metric by index for consistent fallback behavior
 * 
 * @param {number} index - Index of the metric (0-3)
 * @returns {Object} Default metric for the given index
 */
export const getDefaultMetricByIndex = (index) => {
  const defaults = getDefaultMetrics();
  return defaults[index] || defaults[0];
};

/**
 * Validates icon component and provides fallback
 * 
 * @param {React.Component} IconComponent - Icon component to validate
 * @param {string} fallbackType - Type of fallback icon to use
 * @returns {React.Component} Valid icon component
 */
export const validateIconComponent = (IconComponent, fallbackType = 'default') => {
  if (IconComponent && (typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent.$$typeof))) {
    return IconComponent;
  }
  
  console.warn(`Invalid icon component provided, using ${fallbackType} fallback`);
  return FALLBACK_ICONS[fallbackType] || FALLBACK_ICONS.default;
};

/**
 * Sanitizes and validates metric text content
 * 
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fallback - Fallback text if validation fails
 * @returns {string} Validated text
 */
export const validateMetricText = (text, maxLength = 100, fallback = 'Platform Benefit') => {
  if (typeof text !== 'string') {
    console.warn('Non-string value provided for metric text, using fallback');
    return fallback;
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    console.warn('Empty text provided for metric, using fallback');
    return fallback;
  }
  
  if (trimmed.length > maxLength) {
    console.warn(`Text length exceeds ${maxLength} characters, truncating`);
    return trimmed.substring(0, maxLength - 3) + '...';
  }
  
  return trimmed;
};