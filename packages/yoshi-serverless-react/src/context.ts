import React from 'react';
import { HttpClient } from 'yoshi-serverless-client';

export const HttpContext: React.Context<{
  client?: HttpClient;
}> = React.createContext({});
