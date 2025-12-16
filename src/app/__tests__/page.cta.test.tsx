import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import HomePage from '../page';

describe('CTA and modal flows', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  test('CTA shows based on meta and openFromCta increments totalShows', async () => {
    // seed meta with zero shows
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    render(<HomePage />);
    // CTA should be visible
    await waitFor(() => expect(screen.queryByText(/Get product updates\?/i)).toBeInTheDocument());
    // open CTA
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    // modal should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // check totalShows incremented in storage
    const meta = JSON.parse(localStorage.getItem('swarm_role_modal_meta') || '{}');
    expect(meta.totalShows).toBeGreaterThanOrEqual(1);
  });

  test('onClose sets lastDismissTs and hides CTA', async () => {
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    render(<HomePage />);
    // CTA should be visible
    await waitFor(() => expect(screen.queryByText(/Get product updates\?/i)).toBeInTheDocument());
    // click Not now
    fireEvent.click(screen.getByText(/Not now/i));
    const meta = JSON.parse(localStorage.getItem('swarm_role_modal_meta') || '{}');
    expect(meta.lastDismissTs).toBeDefined();
    // CTA hidden
    expect(screen.queryByText(/Get product updates\?/i)).not.toBeInTheDocument();
  });

  test('modal validation: invalid email prevents submit (no fetch)', async () => {
    // seed meta to show CTA
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    render(<HomePage />);
    // mock fetch to detect submit
    const fetchMock = jest.fn();
    global.fetch = fetchMock as any;
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    // role select within dialog (select the button by role)
    fireEvent.click(within(dialog).getByRole('button', { name: /Investor/i }));
    const emailInput = within(dialog).getByPlaceholderText(/Email \(optional\)/i);
    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    // submit via button role — invalid email should block submission
    fireEvent.click(within(dialog).getByRole('button', { name: /Subscribe/i }));
    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
  });

  test('successful subscribe closes modal and shows subscribed text', async () => {
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    // mock fetch for subscribe
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) })) as any;
    render(<HomePage />);
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /Investor/i }));
    const subscribeBtn = within(dialog).getByRole('button', { name: /Subscribe/i });
    fireEvent.click(subscribeBtn);
    await waitFor(() => expect(within(dialog).getByText(/Thanks — you will be updated\./i)).toBeInTheDocument());
  });

  test('overlay click closes modal', async () => {
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    render(<HomePage />);
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    // overlay is the first child div inside the dialog
    const overlay = dialog.querySelector('div');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay!);
    // modal should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const meta = JSON.parse(localStorage.getItem('swarm_role_modal_meta') || '{}');
    expect(meta.lastDismissTs).toBeDefined();
  });

  test('role button gains active class when selected', async () => {
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    render(<HomePage />);
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    const investorBtn = within(dialog).getByRole('button', { name: /Investor/i });
    // initial should not have active class
    expect(investorBtn.className).not.toMatch(/bg-accent1/);
    fireEvent.click(investorBtn);
    expect(investorBtn.className).toMatch(/bg-accent1/);
  });

  test('subscribe failure shows alert', async () => {
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // mock fetch to return ok: false
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'db' }) })) as any;
    render(<HomePage />);
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /Investor/i }));
    fireEvent.click(within(dialog).getByRole('button', { name: /Subscribe/i }));
    await waitFor(() => expect(alertMock).toHaveBeenCalled());
    alertMock.mockRestore();
  });

  test('successful subscribe closes modal after timeout', async () => {
    jest.useFakeTimers();
    localStorage.setItem('swarm_role_modal_meta', JSON.stringify({ totalShows: 0 }));
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) })) as any;
    render(<HomePage />);
    fireEvent.click(screen.getByText(/Yes, notify me/i));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /Investor/i }));
    fireEvent.click(within(dialog).getByRole('button', { name: /Subscribe/i }));
    // wait for subscribed text to appear (state update from resolved fetch)
    await waitFor(() => expect(within(dialog).getByText(/Thanks — you will be updated\./i)).toBeInTheDocument());
    // advance timers inside act so React processes the timeout callback
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    jest.useRealTimers();
  });
});
