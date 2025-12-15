"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // Define the top‑level navigation links for the site.  Each entry
  // corresponds to a dedicated page under `src/app`.  We intentionally
  // avoid fragment anchors (#foo) here because the site no longer
  // contains long, single‑page sections.  Instead, visitors can
  // navigate between simple pages like Product and About.  The logo
  // itself links back to the home page, so we omit an explicit
  // "Home" entry.
  const links = [
    { href: '/product', label: 'Product' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' }
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-card/50 bg-card/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* group logo + title so they stay together on the left */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/Logo3.png"
              className="h-10 md:h-12 w-auto object-contain rounded-2xl flex-shrink-0"
              alt="SWARM.AI logo"
            />
            <div className="text-xl font-bold tracking-wide">
              <Link href="/">SWARM.AI<span className="text-accent1">_</span></Link>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="text-textSecondary hover:text-accent1 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-textSecondary focus:outline-none">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-card border-t border-card/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-textSecondary hover:text-accent1">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}