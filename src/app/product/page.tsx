"use client";
import Link from 'next/link'
import Image from 'next/image'
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

/**
 * Product page.  This page provides a brief overview of the
 * Swarm.AI product.  Feel free to flesh out the content to
 * describe features, benefits or deployment scenarios.  The
 * styling stays consistent with the rest of the site.
 */
export default function ProductPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="sr-only">A decentralized perception platform for real-time airspace intelligence</h1>

      {/* 3. How Swarm.ai Works */}
      <Section title="The Three Layers of Swarm.ai" subtitle="Conceptual overview of sensing, edge perception, and distributed intelligence.">
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-5 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Mantyx sensor· Optical Front-End</h3>
            <p className="text-textSecondary mb-3">High-performance EO/IR sensing for detection, identification, and tracking of small aerial objects under real-world conditions.</p>
            <div className="mb-3 flex justify-center">
              <Image src="/images/Mantyx.png" alt="Mantyx optical front-end" width={240} height={360} className="rounded-md object-cover" />
            </div>
            <ul className="space-y-2 text-textSecondary">
              <li>Day / night / adverse weather</li>
              <li>Long-range, passive detection</li>
              <li>Designed for scalable deployment</li>
            </ul>
          </div>

          <div className="p-5 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Myrix Node · Edge Perception</h3>
            <p className="text-textSecondary mb-3">On-device AI that processes sensor data locally and shares intelligence across the grid.</p>
            <div className="mb-3 flex justify-center">
              <Image src="/images/Myrix.png" alt="Myrix AI" width={240} height={360} className="rounded-md object-cover" />
            </div>
            <ul className="space-y-2 text-textSecondary">
              <li>Real-time multi-sensor fusion</li>
              <li>6D tracking & trajectory estimation</li>
              <li>Low latency, low bandwidth, GPS-optional</li>
            </ul>
          </div>

          <div className="p-5 bg-card rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Nexus · Command & Intelligence</h3>
            <p className="text-textSecondary mb-3">Distributed intelligence layer that aggregates insights and enables coordinated response.</p>
            <div className="my-12 flex justify-center">
              <Image src="/images/mesh.png" alt="Nexus distributed intelligence" width={240} height={360} className="rounded-md object-cover" />
            </div>
            <ul className="space-y-2 text-textSecondary">
              <li>Local fusion & global consistency</li>
              <li>AI model updates from field data</li>
              <li>Interfaces to existing C2 / safety systems</li>
            </ul>
          </div>
        </div>

        {/* Simple diagram (conceptual) */}
        <div className="mt-8 p-6 bg-black rounded-lg text-center text-textSecondary">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="p-4 rounded-lg bg-card">Mantyx Sensors 🔬 🌙 🔥</div>
            <div className="p-4 rounded-lg bg-card">Myrix Edge Nodes 🧩 📰 📡</div>
            <div className="p-4 rounded-lg bg-card">Nexus Intelligence 🧠 🛠️ 🧩</div>
          </div>
          <p className="mt-3 text-xs opacity-70">Conceptual flow: sensors → edge nodes → distributed intelligence. No screenshots; high-level diagram only.</p>
        </div>
      </Section>

      {/* 2. The Problem We Solve */}
      <Section title="Why classical systems fail in low-altitude airspace" subtitle="Defending airspace today is a data and perception problem — not a weapons problem.">
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <FeatureCard icon={<>🛩️</>} title="Below radar" desc="Small autonomous drones operate under traditional thresholds." />
          <FeatureCard icon={<>🛡️</>} title="Centralized fragility" desc="Slow, expensive, brittle architectures can't keep up." />
          <FeatureCard icon={<>🎬</>} title="Adaptive threats" desc="Static detectors lose against fast-evolving tactics." />
          <FeatureCard icon={<>👀</>} title="Perception bottleneck" desc="Seeing, understanding, and tracking is the constraint." />
        </div>
      </Section>
      
      


      

      {/* 4. Differentiation */}
      <Section title="What makes Swarm.ai fundamentally different" subtitle="Designed around decentralization, edge perception, and continuous learning.">
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <FeatureCard icon={<>🧬</>} title="Decentralized by design" desc="No single point of failure — intelligence lives at the edge." />
          <FeatureCard icon={<>🛠️</>} title="AI-native, not AI-added" desc="Built around perception and learning, not retrofitted onto legacy hardware." />
          <FeatureCard icon={<>💰</>} title="Cost-efficient at scale" desc="Dense grids of affordable sensors outperform sparse, expensive systems." />
          <FeatureCard icon={<>✨</>} title="Continuously improving" desc="Models learn from real deployments and update across the fleet." />
        </div>
      </Section>

      {/* 5. Applications */}
      <Section title="Designed for critical and regulated environments" subtitle="Where Swarm.ai delivers value today.">
        <div className="grid md:grid-cols-4 gap-4 text-left">
          <FeatureCard icon={<>🏗️</>} title="Critical infrastructure" desc="Perimeter and asset monitoring with resilient edge perception." />
          <FeatureCard icon={<>🛫</>} title="Airports & airspace" desc="Low-altitude awareness beyond classical radar coverage." />
          <FeatureCard icon={<>🛡️</>} title="Defence & installations" desc="Distributed sensing for contested environments." />
          <FeatureCard icon={<>🏭</>} title="Industrial & testing" desc="Autonomous systems trials with measurable safety data." />
        </div>
      </Section>

      {/* 6. Trust & Readiness */}
      <Section title="Built for real-world deployment" subtitle="Maturity signals without overclaiming.">
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <FeatureCard icon={<>🏛️</>} title="Research partners" desc="Developed with top-tier European research partners." />
          <FeatureCard icon={<>🧷</>} title="Regulated markets" desc="Designed for safety-critical and regulated environments." />
          <FeatureCard icon={<>💽</>} title="Edge-first architecture" desc="Data-sovereign by design; local processing prioritized." />
          <FeatureCard icon={<>🧬</>} title="Infrastructure-ready" desc="Compatible with existing systems and integrations." />
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-card rounded-lg">
            <p>🎯 Currently deployed in pilot environments</p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <p>🧠 Available for controlled evaluations</p>
          </div>
        </div>
      </Section>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mt-8">
        <Link href="/" className="text-accent1 hover:underline">Zurück zur Startseite</Link>
        <Link href="/pose" className="text-accent1 hover:underline">6D Pose Estimation ansehen →</Link>
      </div>
    </div>
  
  );
}