import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar links', () => {
  test('renders main navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Product/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Contact/i).length).toBeGreaterThanOrEqual(1);
  });
});
