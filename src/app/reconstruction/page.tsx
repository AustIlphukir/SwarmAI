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
            <img
                  src="/images/SCR-20250911-tpju.jpeg"
                  className="w-full h-[50%] object-cover rounded-2xl"
                  alt="Reconstruction of 3D Digital Twin"
              />
            <Link href="https://d1rmg6jcg0tsw.cloudfront.net/viewer/3060a252-e667-48f3-ad33-d4d3fb06ce1a" target="_blank" className="block">
              View 3D Model indoor
            </Link>
          </div>
          <div className="bg-black rounded-lg overflow-hidden">
           <img
                  src="/images/image3.gif"
                  className="w-full h-[50%] object-cover rounded-2xl"
                  alt="Reconstruction of 3D Digital Twin"
              /> 
          <Link href="https://3dtwin.3dwe.org/burda_senatorre.html" target="_blank" className="block">
            View 3D Model outdoor
          </Link>
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
