"use client";
import Image from 'next/image';
import Link from 'next/link';
import Section from '../components/Section';
import FeatureCard from '../components/FeatureCard';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
/**
 * The homepage is intentionally minimal.  It shows a passkey
 * entry form until the user enters the correct key via the
 * `/api/unlock` endpoint.  Once unlocked, a simple welcome
 * message is displayed.  The unlocked state is persisted in
 * `localStorage` so visitors aren’t prompted again on future
 * visits.  This logic keeps the password protection aspect of
 * the original project while stripping away the heavy marketing
 * sections, videos and modals that were previously present.
 */
export default function HomePage() {
  const [enteredKey, setEnteredKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(false);


  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // ---- Safe storage helpers ----
  function loadMeta(): any {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveMeta(meta: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  }
  // helpers
  const STORAGE_KEY = 'swarm_role_modal_meta';
  const SNOOZE_DAYS = 14;                      // "Not now" snoozes for 14 days
  const MAX_SHOWS = 3;                         // show CTA at most 3 times total per browser

  // ---- Local state to control CTA visibility ----
  const [canShowCta, setCanShowCta] = useState(false);
  // Initialize CTA visibility from persisted meta
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const meta = loadMeta() || {};
      const totalShows = meta.totalShows || 0;
      const lastDismiss = meta.lastDismissTs ? new Date(meta.lastDismissTs).getTime() : 0;
      const now = Date.now();
      const snoozeMs = SNOOZE_DAYS * 24 * 60 * 60 * 1000;
      const canShow = totalShows < MAX_SHOWS && (lastDismiss === 0 || now - lastDismiss > snoozeMs);
      setCanShowCta(canShow);
    } catch (e) {
      setCanShowCta(false);
    }
  }, []);
  const onClose = () => {
    setShowModal(false);
    const meta = loadMeta();
    saveMeta({ ...meta, lastDismissTs: Date.now() }); // start snooze
    setCanShowCta(false); // hide CTA immediately
  };
  // ---- Open/Close handlers (CTA + modal overlay/close button) ----
  const openFromCta = () => {
    setShowModal(true);
    const meta = loadMeta();
    saveMeta({ ...meta, totalShows: (meta.totalShows || 0) + 1, lastShowTs: Date.now() });
  };
  // Bootstrapping: check session via API and fetch content if authenticated
  useEffect(() => {
    let mounted = true;
    // If localStorage already marks the homepage unlocked, set state synchronously
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('swarm_home_unlocked') === '1') {
        setUnlocked(true);
        // no need to call server-side checks in tests/local dev when already unlocked
        return () => { mounted = false };
      }
    } catch (_) {
      // ignore localStorage errors
    }

    // During tests we avoid making network calls that cause async state updates
    if (process.env.NODE_ENV === 'test') {
      return () => { mounted = false };
    }

    async function bootstrap() {
      // In production, we could check session status here
      // For now, rely on localStorage and middleware cookie checks
      if (mounted) {
        setUnlocked(false);
      }
    }
    bootstrap();
    return () => { mounted = false };
  }, []);

  async function handleUnlock() {
    setUnlockError(null);
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: enteredKey.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (j && j.success) {
        try { localStorage.setItem('swarm_home_unlocked', '1'); } catch (_) {}
        // In test environment avoid calling navigation.reload (jsdom doesn't implement it)
        if (process.env.NODE_ENV !== 'test') {
          try { window.location.reload(); } catch (_) {}
        }
        return;
      }
      // if not success, show error
      setUnlockError(j?.error || 'Unlock failed');
    } catch (e) {
      setUnlockError('Network error — try again');
    }
  }

  // Render the lock screen until the correct key is entered.
  if (!unlocked) {
    return (
      <div className="py-0 relative overflow-hidden flex items-center justify-center bg-background">

        {/* Modal (only if user clicks CTA) */}
              {showModal && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                  <div className="relative bg-white dark:bg-card text-textPrimary rounded-lg max-w-lg w-full p-6 shadow-lg z-10">
                    <h3 className="text-lg font-semibold mb-2">Quick question</h3>
                    <p className="text-sm text-textSecondary mb-4">
                      Are you an investor, project partner, or a potential customer? Optionally subscribe to product updates (GDPR-compliant).
                    </p>

                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setRole('investor')}
                        className={`px-3 py-1 rounded ${
                          role === 'investor'
                            ? 'bg-accent1 text-white'
                            : 'bg-[#0f1724] text-textSecondary'
                        }`}
                      >
                        Investor
                      </button>
                      <button
                        onClick={() => setRole('partner')}
                        className={`px-3 py-1 rounded ${
                          role === 'partner'
                            ? 'bg-accent1 text-white'
                            : 'bg-[#0f1724] text-textSecondary'
                        }`}
                      >
                        Project partner
                      </button>
                      <button
                        onClick={() => setRole('customer')}
                        className={`px-3 py-1 rounded ${
                          role === 'customer'
                            ? 'bg-accent1 text-white'
                            : 'bg-[#0f1724] text-textSecondary'
                        }`}
                      >
                        Customer
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (email && !simpleEmail.test(email)) {
                          alert('Please enter a valid email or leave blank to skip.');
                          return;
                        }
                        if (email && !consent) {
                          alert('Please consent to receive updates via email.');
                          return;
                        }
                        try {
                          const res = await fetch('/api/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ role, email: email || null, consent }),
                          });
                          const payload = await res.json();
                          if (!res.ok) throw new Error(payload?.error || 'failed');
                          setSubscribed(true);
                          setTimeout(() => setShowModal(false), 1000);
                        } catch (err) {
                          console.error(err);
                          alert('Subscription failed — try again later.');
                        }
                      }}
                      className="flex flex-col gap-3"
                    >
                      <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded px-3 py-2 bg-[#0b1220] text-textSecondary"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                        />{' '}
                        I agree to receive product updates (you can unsubscribe anytime)
                      </label>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-textSecondary">
                          {subscribed ? 'Thanks — you will be updated.' : 'We’ll only email product updates.'}
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={onClose} className="text-sm text-textSecondary hover:underline">
                            Close
                          </button>
                          <button type="submit" className="px-3 py-1 rounded bg-accent1 text-white text-sm">
                            {subscribed ? 'Done' : 'Subscribe'}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-textSecondary mt-2">
                        Privacy: we store only role, email (if provided), consent and a consent timestamp.
                        See our <a href="/privacy" className="text-accent1 underline">privacy policy</a>.
                      </p>
                    </form>
                  </div>
                </div>
              )}

              {/* Floating CTA */}
                {!showModal && canShowCta && (
                  <div className="fixed bottom-4 right-4 z-40 rounded-lg shadow-lg bg-[#0f1724] text-textSecondary px-4 py-3 flex items-center gap-3">
                    <span className="text-sm">Get product updates?</span>
                    <button
                      className="px-3 py-1 rounded bg-accent1 text-white text-sm"
                      onClick={openFromCta}
                    >
                      Yes, notify me
                    </button>
                    <button className="text-xs opacity-70 hover:opacity-100" onClick={onClose}>
                      Not now
                    </button>
                  </div>
                )}


        <section className="py-0 relative overflow-hidden flex items-center justify-center">


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

          <div className="grid md:grid-cols-1 gap-8 items-center">
            <div className="space-y-6">
              
              {/* Intro statements */}
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                SWARM.AI<br /> Perception Systems for European Defence<span className="text-accent1">_</span>
              </h1>
              <p className="text-lg md:text-xl text-textSecondary">
                AI backbone for drone detection, tracking and defence.
              </p>
              

            </div>
            <div className="hidden md:block">
              {/* Placeholder for hero visual; can be replaced with 3D/sensor animation */}
            </div>
          </div>
        </div>
      </section>

        <div className="bg-card rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Protected Homepage</h2>
          <p className="mb-6 text-textSecondary">Enter passkey to access the site.</p>
          <input
            type="password"
            placeholder="Passkey"
            className="w-full px-4 py-2 rounded-md bg-background border border-card/50 mb-4 focus:border-accent1 focus:ring-accent1 outline-none"
            value={enteredKey}
            onChange={e => setEnteredKey(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUnlock();
              }
            }}
          />
          {unlockError && <p className="text-red-500 text-sm mb-2">{unlockError}</p>}
          <button
            onClick={handleUnlock}
            className="w-full py-2 px-4 rounded-md bg-accent1 text-background hover:bg-accent1/80 transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // Once unlocked, show a simple welcome message.  Additional
  // content can be added here or on dedicated subpages via the
  // navigation bar.
  return (
    <>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="space-y-24 pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute top-0 left-0 w-full h-full object-cover object-[center_90%] transition-opacity duration-2000 ${
              fade ? "opacity-0" : "opacity-20"
            }`}
          >
            <source src="/videos/source-3.mov" type="video/mp4" />
          </video>
        </div>
        <div className="py-0 relative overflow-hidden flex flex-col items-center justify-center text-center px-4 relative z-10">
          <h1 className="text-6xl font-bold mb-4">Perception Systems for <span className="text-accent1 font-semibold">European Defence</span></h1>
          <p className="text-xl md:text-2xl text-textSecondary mb-6 max-w-2xl">
            Swarm.ai provides <span className="text-accent1 font-semibold">AI perception</span> and multi‑target tracking solutions for modern civil and defence anti-drone operations. 
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent1 text-white rounded-lg hover:bg-accent1/80 transition-colors font-semibold"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={async () => {
                try {
                  await fetch('/api/lock', { method: 'POST' });
                } catch (_) {}
                try { localStorage.removeItem('swarm_home_unlocked'); } catch (_) {}
                try { location.reload(); } catch (_) { /* ignore */ }
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-textSecondary bg-card"
            >
              Dev: Lock
            </button>
          )}
        </div>
      </section>
      <section className="py-0 relative overflow-hidden flex items-center justify-center">


      </section>
      <section>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/product" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-center text-4xl font-bold mb-4">1 </h3>
            <p className="text-textSecondary"><span className="text-accent1 font-semibold">See. Real-Time Perception at the Edge</span><br />
              We provide cost-effective detection technologies from sensor to chip on the edge. Our perception models are the result of state-of-the-art research. Up to 5 km radius per sensor device.<br />
              <span className="text-sm">All Sensors · All Platforms · On the Edge</span></p>
              <video
                  src="/videos/Drone_Animation_From_Thermal_Image.mp4"
                  className="w-full h-[50%] object-cover rounded-2xl autoplay loop"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                </video>
          </Link>
          <Link href="/product" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-center text-4xl font-bold mb-4">2</h3>
            <p className="text-textSecondary"><span className="text-accent1 font-semibold">Understand. AI built for the physical world.</span><br />
            Swarm.ai applies all perception directly at the sensors on the edge. Our 3D perception system fuses vision, thermal, acoustic, and existing sensors into a single, continuously updated 3D airspace model. 
            <br />
            <span className="text-sm">Multi-Modal · Distributed · Research-Driven</span></p>
             <video
                  src="/videos/PoseEstimationAndTrackingSUV.mp4"
                  className="w-full h-[50%] object-cover rounded-2xl autoplay loop"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                </video>
          </Link>
          <Link href="/product" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-center  text-4xl font-bold mb-4">3</h3>
            <p className="text-textSecondary"><span className="text-accent1 font-semibold">React. Engineered for mission-critical reliability.</span><br />Built for Critical Environments. Designed from day one for regulated, safety-critical markets — from defence and aerospace to critical infrastructure and mobility.
            <br />
              <span className="text-sm">Defence · Aerospace · Critical Infrastructure</span></p>
              <p className='inline-flex items-center gap-2 px-6 py-3 bg-accent2 text-white rounded-lg hover:bg-accent1/80 transition-colors font-semibold"'>
                Learn How
                <ArrowRight className="w-5 h-5" /></p>
          </Link>
          
        </div>

      </section>  

      {/* 1. Product Overview */}
      <Section
        title="A decentralized perception platform for real-time airspace intelligence"
        subtitle="Swarm.ai is an AI-native perception system that detects, tracks, and understands aerial objects in real time using distributed edge intelligence. It fuses multi-modal sensor data across a resilient mesh — without relying on centralized infrastructure."
      >
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <FeatureCard icon={<>🧠</>} title="Real-time, on-edge" desc="Intelligence computed locally at the sensor." />
          <FeatureCard icon={<>🔎</>} title="Multi-modal fusion" desc="Vision, thermal, acoustic, RF-ready." />
          <FeatureCard icon={<>🧬</>} title="Decentralized & resilient" desc="Mesh-first, no single point of failure." />
          <FeatureCard icon={<>👩‍🔧</>} title="Built for safety" desc="Designed for regulated environments." />
        </div>
      </Section>

      {/* Footer */}
      
      <section className="w-full py-16 bg-background border-t border-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h2 className="text-xs tracking-widest uppercase text-textSecondary">Trusted by partners</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 opacity-80">
            {/* Partners / micro proof */}
            <a
              href="https://www.tum.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent1 font-medium"
            >
              TUM Venture Labs &amp; Photogrammetry & Remote Sensing
            </a>
            <a
              href="https://www.dide.com/defence/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent1 font-medium"
            >
              Industrial Defence and Incubation partner
            </a>
            <a
              href="https://www.rvconnex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent1 font-medium"
            >
              RV Connex Co., Ltd.
            </a>
            <a
              href="https://3dwe.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent1 font-medium"
            >
              3DWe
            </a>
            <a
              href="https://www.suvarnabhumiairport.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent1 font-medium"
            >
              Bangkok Airport (BKK)
            </a>
          </div>
        </div>
      </section>
      <section className="w-full py-8 bg-background border-t border-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-textSecondary">
            <div className="opacity-80">
              © {new Date().getFullYear()} Swarm.ai. All rights reserved.
            </div>
            <nav className="flex items-center gap-4" aria-label="Footer navigation">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/product" className="hover:underline">Product</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="text-accent1 hover:underline" aria-label="Get product updates">
                Get product updates →
              </Link>
              <nav className="flex items-center gap-3" aria-label="Social links">
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">X</a>
              </nav>
            </div>
            <div className="opacity-80">
              Built in Munich, EU
            </div>
          </div>
        </div>
      </section>
    </>
  );
}