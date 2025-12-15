"use client";
import Link from 'next/link';
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Section
        title="Services"
        subtitle="Wir sind Experten für 3D‑Perception, 3D‑Zwillinge, 3D‑Rekonstruktion und Edge‑Intelligence. Wir unterstützen von der Machbarkeitsstudie bis zum produktiven Rollout – schnell, messbar, einsatznah."
      >
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FeatureCard
            icon={<>👀</>}
            title="3D‑Perception"
            desc="Echtzeit‑Erkennung, Verfolgung und Klassifikation; Multi‑Sensor‑Fusion (EO/IR, akustisch, RF‑ready)."
          />
          <FeatureCard
            icon={<>🏗️</>}
            title="3D‑Zwillinge"
            desc="Digitale Zwillinge für Tests, Simulation und Training; Szenarien aus Real‑Daten ableitbar."
          />
          <FeatureCard
            icon={<>🗺️</>}
            title="3D‑Rekonstruktion"
            desc="EO/IR‑ und Multi‑View‑Rekonstruktion, metrische Qualität, große Areale und schwierige Bedingungen."
          />
          <FeatureCard
            icon={<>🧠</>}
            title="Edge‑AI"
            desc="On‑Device/On‑Edge‑Inference; niedrige Latenz und Bandbreite; verteilte, resiliente Knoten."
          />
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Link href="/contact" className="text-accent1 hover:underline font-medium">
            Projekt anfragen – sprechen wir über Ihr Vorhaben →
          </Link>
        </div>
      </Section>
    </div>
  );
}