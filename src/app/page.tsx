import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 radar-bg opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {/* Intro statements */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Swarm.AI –<br /> AI reconnaissance backbone for modern defense &amp; emergency operations<span className="text-accent1">_</span>
              </h1>
              <p className="text-lg md:text-xl text-textSecondary">
                Fast. Accurate. Modular. From sensor to system.
              </p>
              <p className="text-base md:text-lg text-textSecondary">
                Delivering cutting‑edge computer vision research to affordable platforms for defence. Built to operate within Europe’s AI governance and MLOps constraints.
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
              <div className="flex items-center space-x-6 mt-8 opacity-70">
                {/* Micro proof: add logos later */}
                <span>TUM</span>
                <span>Diehl</span>
                <span>RV Connex</span>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for hero visual; can be replaced with 3D/sensor animation */}
              <div className="w-full aspect-square bg-card rounded-2xl flex items-center justify-center text-textSecondary relative overflow-hidden">
                {/* Visual Placeholder */}
                <video
                  src="/videos/source.mp4"
                  className="w-full h-full object-cover rounded-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
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
                We bring the latest scientific progress in computer vision and tracking to the defense industry.<span className="text-accent1">_</span>
              </p>
          </div>
          <div className="space-y-4">
            {/* Data cards placeholder */}
            <div className="bg-card rounded-xl p-6 shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Speed Bands</h3>
              <p className="text-textSecondary">Placeholder data for speed ranges and agility.</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md flex flex-col justify-between">
              <h3 className="text-xl font-semibold mb-2">Range & Convergence</h3>
              <p className="text-textSecondary">Placeholder for multi-object convergence example.</p>
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
          <div className="bg-card rounded-xl p-6 shadow-md space-y-2">
            <h3 className="text-xl font-semibold">6D Detection & Tracking</h3>
            <p className="text-textSecondary">Multi-target trajectories, confidence and cohesion scoring, robust to clutter.</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md space-y-2">
            <h3 className="text-xl font-semibold">Real-time 3D Reconstruction</h3>
            <p className="text-textSecondary">Landscape and structure understanding for path planning & effects.</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md space-y-2">
            <h3 className="text-xl font-semibold">Sensor Fusion on the Edge</h3>
            <p className="text-textSecondary">RGB, Thermal & LiDAR fused for reliable perception.</p>
          </div>
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

      {/* Consortium Section */}
      <section id="consortium" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Consortium & Partners<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Swarm.AI</h3>
            <p className="text-textSecondary">AI detection, multi-target tracking, C2 platform, digital twin</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">RV Connex</h3>
            <p className="text-textSecondary">Hardware platform, flight control, system integration</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">Diehl</h3>
            <p className="text-textSecondary">Weaponry & market access, hardening</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">TUM</h3>
            <p className="text-textSecondary">Research advisory & talent</p>
          </div>
        </div>
        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">Explore partnership models &rarr;</Link>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Research Pedigree<span className="text-accent1">_</span></h2>
        <div className="space-y-4 text-textSecondary">
          <p>Decades of 3D vision and computer vision experience inform our algorithms.</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Rotation-invariant descriptors (CVPR 2021)</li>
            <li>Point cloud registration (ECCV 2018)</li>
            <li>Object pose & multi-object tracking (ICCV 2019)</li>
            <li>Cross-modal matching (NeurIPS 2020)</li>
          </ul>
        </div>
        <div className="mt-6">
          <Link href="#contact" className="text-accent1 hover:underline">See all publications &rarr;</Link>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Team<span className="text-accent1">_</span></h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Dr. Lukas Karge</h3>
            <p className="text-textSecondary">Head of Mercedes-Benz AI Platform; distributed systems & cloud.</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Prof. Benjamin Busam</h3>
            <p className="text-textSecondary">Founder 3Dwe; TUM; computer vision scientist.</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">AI & 3D Vision Experts</h3>
            <p className="text-textSecondary">Solutions architect, 3D vision engineer & remote sensing specialist.</p>
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