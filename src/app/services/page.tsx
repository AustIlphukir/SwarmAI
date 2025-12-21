"use client";
import Link from 'next/link';
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Section
        title="Services"
        subtitle="Concise, practical services: Edge AI, 3D perception, and consulting for real‑world deployments."
      >
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FeatureCard
            image="/images/services/airport-optics.svg"
            title="Optical Airport Defense"
            desc="EO/IR optics, edge AI, and C2 integration to detect and identify drones (UAS). We support airports and vendors integrating into airport systems."
          />
          <FeatureCard
            image="/images/services/edge-3d-perception.svg"
            title="Edge 3D Perception"
            desc="Real‑time 3D perception on the edge: multi‑sensor fusion and robust general‑purpose models that handle unknown situations."
          />
          <FeatureCard
            image="/images/services/low-bandwidth-edge.svg"
            title="Low‑Bandwidth Edge Vision"
            desc="Process video on the edge to minimize data transfer—send results, not raw streams. From compact outputs we reconstruct photorealistic 3D scenes."
          />
          <FeatureCard
            image="/images/services/3d-vision-consulting.svg"
            title="3D Vision Consulting"
            desc="Hands‑on consulting for advanced 3D computer vision: backbone design, LoRA training, tracking, and state‑of‑the‑art research—from prototype to production."
          />
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Link href="/contact" className="text-accent1 hover:underline font-medium">
            Request a project — let’s discuss your use case →
          </Link>
        </div>
      </Section>
    </div>
  );
}