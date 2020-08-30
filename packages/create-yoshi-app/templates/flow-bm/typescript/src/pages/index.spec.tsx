import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { PageTestProvider } from 'yoshi-flow-bm-runtime/test';
import Index from './index';

describe('index', () => {
  it('renders a title correctly', async () => {
    const { getByTestId } = render(
      <PageTestProvider>
        <Index />
      </PageTestProvider>,
    );

    await waitForElement(() => getByTestId('app-title'));

    expect(getByTestId('app-title')).not.toBeNull();
  });
});
