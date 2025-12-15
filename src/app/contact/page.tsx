"use client";

import { useState } from 'react';

/**
 * Contact page.  This page provides a simple way for visitors to
 * reach out.  It contains a contact form that does not submit to
 * any API by default; instead it demonstrates how a future
 * integration could capture input and send it via email or an API.
 */
export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real application you would send the form data to a
    // backend or third‑party service here.  For now we just show
    // a thank you message.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Thank you!</h1>
        <p className="text-textSecondary">
          Your message has been received.  We will get back to you as
          soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-textSecondary mb-8 text-center">
        Have questions or want to learn more?  Send us a message
        using the form below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-2 rounded-md bg-background border border-card/50 focus:border-accent1 focus:ring-accent1 outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-md bg-background border border-card/50 focus:border-accent1 focus:ring-accent1 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            className="w-full px-4 py-2 rounded-md bg-background border border-card/50 focus:border-accent1 focus:ring-accent1 outline-none h-32"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-accent1 text-background hover:bg-accent1/80 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}