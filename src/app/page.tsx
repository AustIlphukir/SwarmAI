"use client";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [enteredKey, setEnteredKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  
  // 👇 add these for video fade
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(false);

  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;          // ensure true on the DOM element
    video.playsInline = true;    // ensure true on the DOM element
    const tryPlay = () => video.play().catch(() => {});
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 2) {
        setFade(true); // fade out in last 2s
      } else {
        setFade(false); // fade back in otherwise
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Persist unlocked state across reloads (session-like)
  useEffect(() => {
    if (localStorage.getItem('swarm_home_unlocked') === '1') {
      setUnlocked(true);
    }
  }, []);

  // Persist unlocked state across reloads
  useEffect(() => {
    if (localStorage.getItem("swarm_home_unlocked") === "1") {
      setUnlocked(true);
    }
  }, []);

  function handleUnlock() {
    setUnlockError(null);
    // log for debugging; remove in production
    console.log('unlock attempt', { enteredKey });
    fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: enteredKey }),
    })
      .then(res => res.json())
      .then(payload => {
        if (!payload.success) {
          setUnlockError(payload?.error || 'Incorrect passkey');
          return;
        }
        setUnlocked(true);
        localStorage.setItem('swarm_home_unlocked', '1');
      })
      .catch(err => {
        console.error(err);
        setUnlockError('Network error — try again');
      });
  }

  useEffect(() => {
    // show after 12s if not seen this session
    if (localStorage.getItem('swarm_role_modal_seen')) return;
    const t = setTimeout(() => {
      setShowModal(true);
      localStorage.setItem('swarm_role_modal_seen', '1');
    }, 12000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showModal) emailRef.current?.focus();
  }, [showModal]);

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Protected Homepage</h2>
          <p className="mb-6 text-textSecondary">Enter passkey to access the homepage.</p>
          <input
            type="password"
            placeholder="Passkey"
            className="w-full px-4 py-2 rounded-md bg-background border border-card/50 mb-4 focus:border-accent1 focus:ring-accent1 outline-none"
            value={enteredKey}
            onChange={e => setEnteredKey(e.target.value)}
            onKeyDown={(e) => {
              // prevent accidental navigation if Enter is pressed
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUnlock();
              }
            }}
          />
          <button
            className="w-full px-4 py-2 bg-accent1 text-background font-semibold rounded-lg shadow hover:bg-accent1/80 transition-colors"
            onClick={handleUnlock}
          >
            Unlock
          </button>
          {unlockError && <div className="mt-3 text-sm text-red-500">{unlockError}</div>}
        </div>
      </div>
      
    );
    
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">


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
            <source src="/videos/source-3.mp4" type="video/mp4" />
          </video>
        <div className="absolute inset-0 radar-bg opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

          <div className="grid md:grid-cols-1 gap-8 items-center">
            <div className="space-y-6">
              {/* Intro statements */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Swarm.AI<br /> AI reconnaissance backbone for modern defense &amp; emergency operations<span className="text-accent1">_</span>
              </h1>
              <p className="text-lg md:text-xl text-textSecondary">
                Fast. Accurate. Modular. From sensor to system.
              </p>
              <p className="text-base md:text-lg text-textSecondary">
                Bringing 3D perception research to affordable, export‑aware edge platforms.
              </p>
              <div className="flex flex-wrap space-x-4 mt-6">
                {/* Prominent contact button */}
                <Link href="#contact" className="inline-flex items-center px-6 py-3 bg-accent2 text-background font-semibold rounded-lg shadow hover:bg-accent2/80 transition-colors">
                  Contact us
                </Link>
                <Link href="#contact" className="inline-flex items-center px-6 py-3 bg-accent1 text-background font-semibold rounded-lg shadow hover:bg-accent1/80 transition-colors">
                  Request a briefing
                </Link>
                <Link href="#technology" className="inline-flex items-center px-6 py-3 border border-accent1 text-accent1 font-semibold rounded-lg hover:bg-accent1 hover:text-background transition-colors">
                  Explore the tech <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              {/* Role & newsletter modal trigger (auto-opened) */}
              {showModal && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                  <div className="relative bg-white dark:bg-card text-textPrimary rounded-lg max-w-lg w-full p-6 shadow-lg z-10">
                    <h3 className="text-lg font-semibold mb-2">Quick question</h3>
                    <p className="text-sm text-textSecondary mb-4">Are you an investor, project partner, or a potential customer? Optionally subscribe to product updates (GDPR-compliant).</p>

                    <div className="flex gap-2 mb-4">
                      <button onClick={() => setRole('investor')} className={`px-3 py-1 rounded ${role==='investor' ? 'bg-accent1 text-white' : 'bg-[#0f1724] text-textSecondary'}`}>Investor</button>
                      <button onClick={() => setRole('partner')} className={`px-3 py-1 rounded ${role==='partner' ? 'bg-accent1 text-white' : 'bg-[#0f1724] text-textSecondary'}`}>Project partner</button>
                      <button onClick={() => setRole('customer')} className={`px-3 py-1 rounded ${role==='customer' ? 'bg-accent1 text-white' : 'bg-[#0f1724] text-textSecondary'}`}>Customer</button>
                    </div>

                    <form onSubmit={async (e) => {
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
                    }} className="flex flex-col gap-3">
                      <input ref={emailRef} type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-3 py-2 bg-[#0b1220] text-textSecondary" />
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> I agree to receive product updates (you can unsubscribe anytime)</label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-textSecondary">{subscribed ? 'Thanks — you will be updated.' : 'We’ll only email product updates.'}</div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setShowModal(false)} className="text-sm text-textSecondary hover:underline">Close</button>
                          <button type="submit" className="px-3 py-1 rounded bg-accent1 text-white text-sm">{subscribed ? 'Done' : 'Subscribe'}</button>
                        </div>
                      </div>
                      <p className="text-xs text-textSecondary mt-2">Privacy: we store only role, email (if provided), consent and a consent timestamp. See our <a href="/privacy" className="text-accent1 underline">privacy policy</a>.</p>
                    </form>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-6 mt-8 opacity-80">
                {/* Partners / micro proof */}
                <a
                  href="https://www.tum.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-accent1 font-medium"
                >
                  TUM Photogrammetry & Remote Sensing — TUM Aerospace
                </a>
                <a
                  href="https://www.diehl.com/defence/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-accent1 font-medium"
                >
                  Diehl — user / Incubation partner
                </a>
                <a
                  href="https://www.rvconnex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-accent1 font-medium"
                >
                  RV Connex
                </a>
                <a
                  href="https://3dwe.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-accent1 font-medium"
                >
                  3dWe
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for hero visual; can be replaced with 3D/sensor animation */}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">The aerial threat has changed<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-textSecondary">            
              <p className="text-xl md:text-2xl font-semibold text-textPrimary">
                We believe defense against small UAVs is the major technology challenge in the 2020s/30s<span className="text-accent1">_</span><br />
                <br />
                We bring the latest scientific progress in computer vision and tracking to the defense industry.<span className="text-accent1">_</span>
              </p>

          <div className="bg-card rounded-xl p-6 shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Pursuit</h3>
              <p className="text-textSecondary">Follow and Pursuit with up to 200 km/h</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Range & Convergence</h3>
              <p className="text-textSecondary">Up to 5 km detection range and 24 h air time.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Data cards placeholder */}

              <div className="w-full aspect-square bg-card rounded-2xl flex items-center justify-center text-textSecondary relative overflow-hidden opacity-30">
                {/* Visual Placeholder */}
                <video
                  src="/videos/source-2.mp4"
                  className="w-full h-full object-cover rounded-2xl autoplay loop"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            
          </div>
        </div>
        <div className="mt-6">
          <Link href="#scenario" className="text-accent1 hover:underline">See a swarm scenario &rarr;</Link>
        </div>
      </section>

      {/* Approach Section */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Precision at speed<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/pose" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">6D Object Pose Estimation</h3>
            <p className="text-textSecondary">Per-object 6DOF pose estimates (position + orientation), multi-object association and robust tracking in cluttered scenes.</p>
             <video
                  src="/videos/Pose.mp4"
                  className="w-full h-[50%] object-cover rounded-2xl autoplay loop"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                </video>
          </Link>
          <Link href="/registration" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">Multimodal sensor registration</h3>
            <p className="text-textSecondary">Real-time multimodal sensor registration for planning, geolocation and audit trails.</p>
              <img
                  src="/images/image4.gif"
                  className="w-full h-[50%] object-cover rounded-2xl"
                  alt="Reconstruction of 3D Digital Twin"
              />
          </Link>
          <Link href="/reconstruction" className="block bg-card rounded-xl p-6 shadow-md space-y-2 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">Reconstruction of 3D Digital Twin</h3>
            <p className="text-textSecondary">Real-time dense and sparse 3D reconstruction to build actionable digital twins for planning, geolocation and audit trails.</p>
              <img
                  src="/images/image3.gif"
                  className="w-full h-[50%] object-cover rounded-2xl"
                  alt="Reconstruction of 3D Digital Twin"
              />
          </Link>
          {/* <div className="bg-card rounded-xl p-6 shadow-md space-y-2">
            <h3 className="text-xl font-semibold">Sensor Fusion on the Edge</h3>
            <p className="text-textSecondary">RGB, Thermal & LiDAR fused for reliable perception.</p>
          </div> */}
        </div>
        <p className="mt-6 text-textSecondary">
          We pioneer novel 3D perception models that run efficiently on cost‑effective hardware, without sacrificing accuracy. Our MLOps pipeline is engineered to comply with European governance and export regulations.
        </p>
        <div className="mt-4">
          <Link href="#architecture" className="text-accent1 hover:underline">Dive into the architecture &rarr;</Link>
        </div>
      </section>

      {/* Scenario Section */}
      <section id="scenario" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Coordinated swarm approaching an urban perimeter<span className="text-accent1">_</span></h2>
        <ol className="space-y-6 list-decimal list-inside text-textSecondary">
          <li>
            <span className="font-semibold text-textPrimary">Early Warning –</span> Edge-AI patrol, 10–20 km radius, continuous IR + LiDAR.
          </li>
          <li>
            <span className="font-semibold text-textPrimary">Multi-Target Pose Detection –</span> Flight directions, speeds, headings; cohesion score; classification.
          </li>
          <li>
            <span className="font-semibold text-textPrimary">Tactical Decision –</span> Ground station alert; options: intercept or handover to ground-based defense.
          </li>
          <li>
            <span className="font-semibold text-textPrimary">Interceptor Action –</span> Pursuit mode, accurate pose-driven engagement.
          </li>
          <li>
            <span className="font-semibold text-textPrimary">Outcome –</span> Primary wave neutralized/disoriented; secondary wave handled; full audit trail.
          </li>
        </ol>
        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">Request a live demo &rarr;</Link>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">SwarmEye Edge‑AI Drone<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-textSecondary">
            <p>Edge compute for autonomous perception and decision making.</p>
            <p>Modular payload with thermal, LiDAR and polarization sensors.</p>
            <p>Designed for rugged environments and seamless C2 integration.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold">Payload</h3>
              <p className="text-textSecondary">7–15 kg (placeholder)</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold">Endurance</h3>
              <p className="text-textSecondary">Placeholder for speed bands / endurance</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold">Sensors</h3>
              <p className="text-textSecondary">FLIR thermal, Seyond Falcon K1 LiDAR, Lucid PolarSens RGB/Polarization</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">Get the datasheet &rarr;</Link>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Architecture Overview<span className="text-accent1">_</span></h2>
        <div className="bg-card rounded-xl p-6 shadow-md text-textSecondary">
          <p>Interactive diagram placeholder detailing Edge, Autonomy, C2 & Coordination modules and data link.</p>
        </div>
      </section>

      {/* Links to detailed demo pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/reconstruction" className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold">Reconstruction of 3D Digital Twin</h3>
            <p className="text-textSecondary mt-2">Highly accurate geometry, photorealistic digitization and efficient data representation.</p>
          </Link>
          <Link href="/pose" className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold">6D Object Pose Estimation</h3>
            <p className="text-textSecondary mt-2">High-speed, robust 6DOF pose detection suitable for edge deployment and tracking.</p>
          </Link>
          <Link href="/pitch" className="bg-accent1 text-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold">Investor Pitch</h3>
            <p className="mt-2">One-page overview: market, product, traction, and ask.</p>
          </Link>
        </div>
      </section>

  {/* Detailed capability pages moved to dedicated routes: /reconstruction and /pose */}

      {/* Consortium & Supporters */}
      <section id="consortium" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Consortium & Supporters<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Swarm.AI</h3>
            <p className="text-textSecondary">Core AI: 3D perception, tracking & C2</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">RV Connex</h3>
            <p className="text-textSecondary">Platform & integration</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Diehl</h3>
            <p className="text-textSecondary">User / industry partner</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">TUM Photogrammetry & Remote Sensing</h3>
            <p className="text-textSecondary">Research advisory — Faculty of Aerospace</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-4 text-textSecondary">
            <h4 className="font-semibold">Supporters</h4>
            <ul className="list-disc ml-6 mt-2 text-textSecondary text-sm">
              <li>NVIDIA Inception (3dWe) | NVidia inception program</li>
              <li>Gründerland Bayern</li>
              <li>TUM Venture Labs AI & TUM Venture Labs Aerospace</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl p-4 text-textSecondary">
            <h4 className="font-semibold">Incubation</h4>
            <p className="text-textSecondary text-sm">TUM Venture Labs / UnternehmerTUM network<br />Diehl Defence</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-textSecondary">
            <h4 className="font-semibold">Notes</h4>
            <p className="text-textSecondary text-sm">Some partners act as users, others as incubators; roles vary by project.</p>
          </div>
        </div>

        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">Explore partnership models &rarr;</Link>
        </div>
      </section>

      {/* Research (visual-first) */}
      <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Research Pedigree<span className="text-accent1">_</span></h2>
        <p className="text-textSecondary mb-6">Grounded in photogrammetry, point-cloud processing and multi-object tracking — shown visually below.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl overflow-hidden">
            <div className="w-full h-44 bg-[url('/videos/source-2.mp4')] bg-center bg-cover" />
            <div className="p-4 text-textSecondary">Photogrammetry capture</div>
          </div>
          <div className="bg-card rounded-xl overflow-hidden">
            <div className="w-full h-44 bg-[url('/videos/source.mp4')] bg-center bg-cover" />
            <div className="p-4 text-textSecondary">Pose estimation & tracking</div>
          </div>
          <div className="bg-card rounded-xl overflow-hidden">
            <div className="w-full h-44 bg-gradient-to-br from-[#0f1724] to-[#11151c] flex items-center justify-center text-textSecondary">Visualization</div>
            <div className="p-4 text-textSecondary">3D reconstruction & simulation</div>
          </div>
        </div>
        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">Get technical references &rarr;</Link>
        </div>
      </section>

      {/* Team (short) */}
      <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Team<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Dr. Lukas Karge</h3>
            <p className="text-textSecondary">Lead — distributed systems & AI deployment.</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Prof. Benjamin Busam</h3>
            <p className="text-textSecondary">Advisor — 3D vision & founder (3dWe).</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Core engineers</h3>
            <p className="text-textSecondary">AI, 3D perception and remote sensing experts.</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="#contact" className="text-accent1 hover:underline">Meet the extended network &rarr;</Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-card py-16" id="call-to-action">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let’s bring situational awareness into the next era<span className="text-accent1">_</span></h2>
          <p className="text-textSecondary mb-8">We’ll respond within two business days; export compliance applies.</p>
          <div className="flex justify-center space-x-4">
            <Link href="#contact" className="inline-flex items-center px-6 py-3 bg-accent1 text-background font-semibold rounded-lg shadow hover:bg-accent1/80 transition-colors">
              Request a briefing
            </Link>
            <Link href="#consortium" className="inline-flex items-center px-6 py-3 border border-accent1 text-accent1 font-semibold rounded-lg hover:bg-accent1 hover:text-background transition-colors">
              Join the consortium <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Contact<span className="text-accent1">_</span></h2>
        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" className="w-full px-4 py-2 rounded-md bg-card border border-card/50 placeholder-textSecondary focus:border-accent1 focus:ring-accent1 outline-none" />
            <input type="email" placeholder="Work Email" className="w-full px-4 py-2 rounded-md bg-card border border-card/50 placeholder-textSecondary focus:border-accent1 focus:ring-accent1 outline-none" />
          </div>
          {/* New question: business type */}
          <input type="text" placeholder="What business are you working in?" className="w-full px-4 py-2 rounded-md bg-card border border-card/50 placeholder-textSecondary focus:border-accent1 focus:ring-accent1 outline-none" />
          {/* New question: interest area */}
          <select className="w-full px-4 py-2 rounded-md bg-card border border-card/50 text-textSecondary focus:border-accent1 focus:ring-accent1 outline-none">
            <option value="" disabled selected hidden>Are you primarily interested in surveillance or counter measures?</option>
            <option value="surveillance">Surveillance</option>
            <option value="counter">Counter measures</option>
            <option value="both">Both</option>
          </select>
          {/* New question: specific capabilities or challenges */}
          <input type="text" placeholder="What specific capabilities or challenges are you most interested in?" className="w-full px-4 py-2 rounded-md bg-card border border-card/50 placeholder-textSecondary focus:border-accent1 focus:ring-accent1 outline-none" />
          <textarea placeholder="Additional details" rows={4} className="w-full px-4 py-2 rounded-md bg-card border border-card/50 placeholder-textSecondary focus:border-accent1 focus:ring-accent1 outline-none"></textarea>
          <div className="flex items-center">
            <input type="checkbox" id="consent" className="mr-2" />
            <label htmlFor="consent" className="text-sm text-textSecondary">I agree to the privacy & export compliance policy.</label>
          </div>
          <button type="submit" className="w-full inline-flex justify-center px-6 py-3 bg-accent1 text-background font-semibold rounded-lg shadow hover:bg-accent1/80 transition-colors">Submit</button>
        </form>
      </section>
    </div>
  );
}