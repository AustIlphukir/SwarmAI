import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage unlock flow', () => {
  beforeEach(() => {
    // clear localStorage and reset mocks
    localStorage.clear();
    jest.resetAllMocks();
  });

  test('shows error when unlock fails', async () => {
    // mock failed fetch
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ success: false, error: 'incorrect passkey' }) })) as any;

    render(<HomePage />);

    const input = screen.getByPlaceholderText('Passkey');
    const button = screen.getByRole('button', { name: /unlock/i });

    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/incorrect passkey/i)).toBeInTheDocument());
  });

  test('on success sets localStorage and reloads', async () => {
    const jsonResponse = { success: true };
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(jsonResponse) })) as any;

    render(<HomePage />);

    const input = screen.getByPlaceholderText('Passkey');
    const button = screen.getByRole('button', { name: /unlock/i });

    fireEvent.change(input, { target: { value: 'good' } });
    fireEvent.click(button);

    await waitFor(() => expect(localStorage.getItem('swarm_home_unlocked')).toBe('1'));
  });
});
