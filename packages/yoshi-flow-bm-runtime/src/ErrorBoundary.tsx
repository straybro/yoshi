import { Component } from 'react';
import withSentry, { InjectedSentryProps } from './hooks/withSentry';

class ErrorBoundary extends Component<InjectedSentryProps> {
  componentDidCatch(error: Error) {
    this.props.sentryClient.captureException(error);
  }

  render() {
    return this.props.children;
  }
}

export default withSentry(ErrorBoundary);
