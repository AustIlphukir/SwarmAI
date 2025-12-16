import { render, screen } from '@testing-library/react';
import ProductPage from '../page';

describe('Product page', () => {
  it('renders the product overview', () => {
    render(<ProductPage />);
    expect(screen.getByText(/A decentralized perception platform/i)).toBeInTheDocument();
  });
});
