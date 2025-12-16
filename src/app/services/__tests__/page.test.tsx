import { render, screen } from '@testing-library/react';
import ServicesPage from '../page';

describe('Services page', () => {
  it('renders services section and link to contact', () => {
    render(<ServicesPage />);
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Projekt anfragen/i)).toBeInTheDocument();
  });
});
