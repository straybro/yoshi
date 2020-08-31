import React from 'react';
import { useRequestWithOptions } from 'yoshi-serverless-react';
import { greet } from './api/greeting.api';

const Component = () => {
  const req = useRequestWithOptions(
    greet,
    { headers: { foo: 'bar' } },
    'Yaniv',
  );

  if (req.loading) {
    return <p data-testid="loading">Loading...</p>;
  }

  if (req.error) {
    return <p data-testid="error">Error :(</p>;
  }

  return (
    <div>
      <h2>{req.data.greeting}</h2>
    </div>
  );
};

export default Component;
