import '../app/globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Swarm.AI — AI Reconnaissance & Counter‑UAS Platform',
  description: 'Edge‑AI perception and multi‑target tracking for modern defense & emergency operations.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-textPrimary font-sans">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}