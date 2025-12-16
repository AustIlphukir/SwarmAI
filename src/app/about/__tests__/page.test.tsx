import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

describe('About page', () => {
  it('renders about sections', () => {
    render(<AboutPage />);
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
  });
});
