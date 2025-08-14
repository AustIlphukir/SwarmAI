"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#technology', label: 'Technology' },
    { href: '#product', label: 'Product' },
    { href: '#consortium', label: 'Consortium' },
    { href: '#research', label: 'Research' },
    { href: '#team', label: 'Team' },
    { href: '#contact', label: 'Contact' }
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-card/50 bg-card/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-xl font-bold tracking-wide">
            <Link href="/">SWARM.AI<span className="text-accent1">_</span></Link>
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