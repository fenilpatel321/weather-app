import { Component } from 'react';
import PropTypes from 'prop-types';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container glass-panel" style={{ padding: '3rem', margin: '2rem', textAlign: 'center' }}>
          <FiAlertTriangle style={{ fontSize: '4rem', color: 'var(--error)', marginBottom: '1rem' }} />
          <h2>Oops! Something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred in this component.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '0.8rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
