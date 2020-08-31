import React from 'react';
import ReactDOM from 'react-dom';
import HttpClient from 'yoshi-serverless-client';
import { HttpProvider } from 'yoshi-serverless-react';
import Component from './component';

const client = new HttpClient();

ReactDOM.render(
  <HttpProvider client={client}>
    <Component />
  </HttpProvider>,

  document.getElementById('root'),
);
