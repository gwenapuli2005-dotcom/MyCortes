import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-gray-900">
          <div className="max-w-xl w-full rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-sm text-red-600 mb-4">
              The app encountered an error while rendering. Please check the browser console for details.
            </p>
            <details className="whitespace-pre-wrap text-xs text-red-700 bg-white/70 p-3 rounded-md">
              <summary className="cursor-pointer font-medium">Error details</summary>
              {this.state.error?.message}
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-xs">{this.state.errorInfo.componentStack}</pre>
              )}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
