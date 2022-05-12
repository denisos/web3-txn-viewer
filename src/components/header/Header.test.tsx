import { render, screen } from '@testing-library/react';
import Header from './Header';

test('should render header text', () => {
  render(<Header>Welcome</Header>);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});