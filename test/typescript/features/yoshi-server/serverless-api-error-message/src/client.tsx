import React from 'react';
import ReactDOM from 'react-dom';
import HttpClient from 'yoshi-serverless-client';
import Component from './component';

const client = new HttpClient();

ReactDOM.render(
  <Component httpClient={client} />,
  document.getElementById('root'),
);
