import React from 'react';
import { HttpClient } from 'yoshi-serverless-client';
import { greet } from './api/greeting.api';

interface PropsType {
  httpClient: HttpClient;
}

export default class App extends React.Component<PropsType> {
  state = { text: '' };
  async componentDidMount() {
    const { httpClient } = this.props;
    const result = await httpClient.request(greet)('Yaniv');
    this.setState({ text: result.greeting });
  }

  render() {
    return (
      <div>
        <h2 id="my-text">{this.state.text}</h2>
      </div>
    );
  }
}
