import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import Button from './index.js';




it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Button />, div);
});
/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/
