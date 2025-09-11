"use client";
import Link from 'next/link';
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

export default function PosePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Section title="6D Object Pose Estimation" subtitle="Compact, high-speed per-object 6DOF pose estimates for edge deployment.">
        <div className="grid sm:grid-cols-3 gap-4">
          <FeatureCard icon={<>📍</>} title="Position" desc="2D & 3D localization" />
          <FeatureCard icon={<>🧭</>} title="Orientation" desc="Full 6DOF" />
          <FeatureCard icon={<>⚡</>} title="Speed" desc="Real-time & predictive" />
        </div>

        <div className="mt-4 p-4 bg-card rounded-lg">
          <p className="text-textSecondary">Operators can register target signatures (CAD or reference images). Runs on-board Swarm.AI for low-latency detection; integrates with partner ground systems.</p>
          <p className="text-textSecondary text-sm mt-2">Used by: Diehl (user). Partners/supporters: 3dWe, TUM Venture Labs, NVIDIA Inception.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-black rounded-lg overflow-hidden">
            <video src="/videos/Pose.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
          </div>
          <div className="bg-card rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-textPrimary">Demo preview</h3>
            <p className="text-textSecondary mb-4">Short clip illustrating multi-target pose tracking and occlusion handling.</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0f1724] rounded p-2 text-center text-textSecondary">Photogrammetry</div>
              <div className="bg-[#0f1724] rounded p-2 text-center text-textSecondary">Pose Fit</div>
              <div className="bg-[#0f1724] rounded p-2 text-center text-textSecondary">Tracking</div>
              <div className="bg-[#0f1724] rounded p-2 text-center text-textSecondary">Prediction</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Link href="/" className="text-accent1 hover:underline">Back to home</Link>
          <Link href="/reconstruction" className="text-accent1 hover:underline">See Reconstruction &rarr;</Link>
        </div>
      </Section>
    </div>
  );
}
