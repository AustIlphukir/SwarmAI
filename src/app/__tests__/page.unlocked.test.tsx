import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage unlocked view', () => {
  beforeEach(() => {
    localStorage.setItem('swarm_home_unlocked', '1');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders hero text and contact link', () => {
    render(<HomePage />);
    expect(screen.getByText(/Perception Systems for/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact Us/i })).toBeInTheDocument();
  });

  test('renders product cards and videos', () => {
    render(<HomePage />);
    // Check for product cards with links to /product
    const productLinks = screen.getAllByRole('link', { name: /See\. Real-Time Perception/i });
    expect(productLinks.length).toBeGreaterThan(0);
    // video element should be present in the DOM
    expect(document.querySelector('video')).toBeTruthy();
  });
});
