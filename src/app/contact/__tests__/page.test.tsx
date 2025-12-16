import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '../page';

describe('Contact page', () => {
  it('renders the contact form and submits', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /Contact Us/i })).toBeInTheDocument();
    // Fill and submit
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Max' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'max@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(screen.getByText(/Thank you!/i)).toBeInTheDocument();
  });
});
