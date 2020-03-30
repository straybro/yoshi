import React from 'react';
import { greet } from './api/greeting.api';

export default class App extends React.Component {
  state = { text: '' };
  async componentDidMount() {
    const { httpClient } = this.props;
    const result = await httpClient.request({ method: greet, args: ['Yaniv'] });
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
