import React from 'react';
import ReactDOM from 'react-dom';
import Component from './component';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Component />, div);

  const firstChild = div.firstChild as HTMLDivElement;
  expect(firstChild.className).toBe('root alignCenter');
});
