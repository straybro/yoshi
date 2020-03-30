import React from 'react';
import ReactDOM from 'react-dom';
import HttpClient from 'yoshi-server-client';
import Component from './component';

const client = new HttpClient({ baseUrl: 'http://localhost:3000' });

ReactDOM.render(
  <Component httpClient={client} />,
  document.getElementById('root'),
);
