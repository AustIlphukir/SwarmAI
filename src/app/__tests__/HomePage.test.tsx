import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';

// Mock fetch for the unlock API.  In these tests we are not
// exercising the network call so we provide a dummy implementation
// that resolves with an error.  This prevents React from logging
// warnings about unhandled promise rejections when the unlock
// button is clicked.
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ success: false, error: 'incorrect passkey' }) })
) as jest.Mock;

describe('HomePage component', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean
    // environment.  jsdom provides a working implementation of
    // localStorage which can be manipulated like in the browser.
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('shows the passkey form when not unlocked', async () => {
    render(<HomePage />);
    // The protected homepage heading should be present
    expect(screen.getByText(/Protected Homepage/i)).toBeInTheDocument();
    // The passkey input should be rendered
    expect(screen.getByPlaceholderText('Passkey')).toBeInTheDocument();
  });

  it('shows the welcome message when unlocked flag is set', async () => {
    // Persist the unlocked flag ahead of rendering
    localStorage.setItem('swarm_home_unlocked', '1');
    render(<HomePage />);
    // Wait for the effect to set the state and rerender
    await waitFor(() => {
      // The unlocked UI uses the hero heading — assert a visible phrase
      expect(screen.getByText(/Perception Systems for/i)).toBeInTheDocument();
    });
  });
});