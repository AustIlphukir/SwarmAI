"use client";
import Link from 'next/link';
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

export default function PitchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Section title="Swarm.AI — Investor Pitch" subtitle="Transforming aerial situational awareness with edge-native 3D perception and real-time decision support.">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-card rounded-lg p-4 flex items-center justify-center">
            <Link href="https://1drv.ms/p/c/35d45b41fda176ae/EaAkYbaUKidEpz63DGkaRf8BxjM4H54rbwmnoSaVlpSQLw?e=HvLYz8" className="text-accent1 hover:underline">Pitch</Link>
          </div> <br />
          <div>
            <h3 className="text-2xl font-semibold">Problem</h3>
            <p className="text-textSecondary mt-2">Small unmanned aerial systems (sUAS) are fast and complex; existing solutions struggle with occlusion, scale and real-time constraints.</p>
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center justify-center">
            <svg width="100%" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#0f1724" />
              <text x="50%" y="50%" fill="#94a3b8" fontSize="16" fontFamily="Inter, sans-serif" textAnchor="middle">Problem visual (placeholder)</text>
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-2xl font-semibold">Solution</h3>
            <p className="text-textSecondary mt-2">Fused sensor streams into a real-time 3D digital twin and per-object 6D pose — actionable tracking, threat scoring and simulated engagement.</p>
            <ul className="list-disc ml-6 mt-4 text-textSecondary">
              <li>3D Digital Twin — simulation-ready outputs</li>
              <li>6D Pose Estimation — occlusion-robust tracking</li>
              <li>Edge-first deployment — low-latency & export-aware</li>
            </ul>
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center justify-center">
            <svg width="100%" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#0f1724" />
              <text x="50%" y="50%" fill="#94a3b8" fontSize="16" fontFamily="Inter, sans-serif" textAnchor="middle">Solution visual (placeholder)</text>
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={<>📈</>} title="Market" desc="Defense, perimeter security, emergency response" />
          <FeatureCard icon={<>🚀</>} title="Traction" desc="Academic partners, prototype flights" />
          <FeatureCard icon={<>💼</>} title="Business Model" desc="SaaS + per-unit edge licensing" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold">Team</h3>
            <p className="text-textSecondary mt-2">Experienced AI & systems engineers with ties to TUM and industry partners.</p>
          </div>
          <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold">Ask</h3>
            <p className="text-textSecondary mt-2">Seeking seed funding for field validation and inference optimizations. Target round: €1–2M.</p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Contact & Next Steps</h3>
          <p className="text-textSecondary mt-2">Request a demo, NDA or investor deck via the homepage contact form.</p>
          <div className="mt-4">
            <Link href="/" className="text-accent1 hover:underline">Back to home</Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
