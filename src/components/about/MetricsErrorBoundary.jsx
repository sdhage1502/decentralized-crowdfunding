/**
 * Error boundary for metrics section to handle component failures gracefully
 * Provides fallback UI when metrics validation or rendering fails
 */

'use client';

import { Component } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

class MetricsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging purposes
    console.error('Metrics section error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI with basic metrics information
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" data-testid="metrics-error-fallback">
          <div className="bg-surface/70 backdrop-blur p-6 rounded-xl border border-border flex flex-col items-start">
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4">
              <Shield size={20} aria-label="Blockchain security metric" />
            </div>
            <div className="text-2xl font-extrabold text-text-strong tracking-tight">
              Blockchain Secured
            </div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">
              Smart Contract Protection
            </div>
          </div>
          
          <div className="bg-surface/70 backdrop-blur p-6 rounded-xl border border-border flex flex-col items-start">
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4">
              <AlertTriangle size={20} aria-label="Transparency metric" />
            </div>
            <div className="text-2xl font-extrabold text-text-strong tracking-tight">
              Fully Transparent
            </div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">
              On-Chain Verification
            </div>
          </div>
          
          <div className="bg-surface/70 backdrop-blur p-6 rounded-xl border border-border flex flex-col items-start">
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4">
              <Shield size={20} aria-label="Decentralization metric" />
            </div>
            <div className="text-2xl font-extrabold text-text-strong tracking-tight">
              Decentralized
            </div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">
              No Single Point of Failure
            </div>
          </div>
          
          <div className="bg-surface/70 backdrop-blur p-6 rounded-xl border border-border flex flex-col items-start">
            <div className="p-2.5 bg-surface-alt border border-border rounded-lg text-accent mb-4">
              <Shield size={20} aria-label="Global accessibility metric" />
            </div>
            <div className="text-2xl font-extrabold text-text-strong tracking-tight">
              Global Access
            </div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">
              Multiple Payment Options
            </div>
          </div>
        </div>
      );
    }

    // Normal render
    return this.props.children;
  }
}

export default MetricsErrorBoundary;