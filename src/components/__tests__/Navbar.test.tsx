import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock the Next.js Link component.  The real Link component adds
// client-side routing behaviour which is unnecessary for testing
// static rendering of the navbar.  This mock renders a simple
// anchor tag preserving the href prop.
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('Navbar component', () => {
  it('renders all navigation links with correct labels and hrefs', () => {
    render(<Navbar />);
    // Check each navigation link individually.  The Navbar defines
    // links to /product, /services, /about and /contact.  We use
    // getByRole to find the link by its accessible name and then
    // assert that the href matches the expected path.
    const productLink = screen.getByRole('link', { name: 'Product' });
    expect(productLink).toHaveAttribute('href', '/product');
    const servicesLink = screen.getByRole('link', { name: 'Services' });
    expect(servicesLink).toHaveAttribute('href', '/services');
    const aboutLink = screen.getByRole('link', { name: 'About Us' });
    expect(aboutLink).toHaveAttribute('href', '/about');
    const contactLink = screen.getByRole('link', { name: 'Contact' });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});