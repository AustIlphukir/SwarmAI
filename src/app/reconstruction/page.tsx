"use client";
import Link from 'next/link';
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

export default function ReconstructionPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Section title="Reconstruction of 3D Digital Twin" subtitle="Highly accurate 3D geometry and photorealistic digitization for simulation and AR/VR.">
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard icon={<>🛰️</>} title="Accurate Geometry" desc="High-fidelity meshes" />
          <FeatureCard icon={<>🗺️</>} title="Semantic Maps" desc="Layered annotations" />
          <FeatureCard icon={<>⚙️</>} title="Simulation Ready" desc="Export to simulators" />
        </div>

        <div className="mt-4 p-4 bg-card rounded-lg text-textSecondary">
          <p>Platform capability: operators can register target signatures (CAD or reference imagery). The pipeline runs on our drone edge platform and integrates with partner ground systems.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-black rounded-lg overflow-hidden">
            <video src="/videos/source-2.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
          </div>
          <div className="bg-card rounded-lg p-4 flex items-center justify-center">
            <svg width="100%" height="220" viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" className="text-textSecondary">
              <rect width="100%" height="100%" fill="#0f1724" />
              <g fill="#94a3b8">
                <rect x="60" y="40" width="140" height="140" rx="8" />
                <rect x="260" y="30" width="260" height="160" rx="8" />
              </g>
              <text x="50%" y="92%" fill="#64748b" fontSize="13" fontFamily="Inter, ui-sans-serif, system-ui" textAnchor="middle">Preview: photogrammetry / LiDAR capture</text>
            </svg>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Link href="/" className="text-accent1 hover:underline">Back to home</Link>
          <Link href="/pose" className="text-accent1 hover:underline">See 6D Pose Estimation &rarr;</Link>
        </div>
      </Section>
    </div>
  );
}
