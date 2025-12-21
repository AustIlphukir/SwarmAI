"use client";
import Link from 'next/link'
import Section from '../../components/Section';
import FeatureCard from '../../components/FeatureCard';

/**
 * About page.  Share a short history or mission statement of the
 * organisation.  The content here can introduce the team or
 * highlight partnerships and achievements.  This skeleton sets
 * the stage for a more detailed company profile.
 */
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <Section title="About Us" subtitle="Founded in 2025 as a spin-off from the Technical University of Munich (TUM), Swarm.ai is driven by a mission to revolutionize aerial threat detection and defense. Our team combines deep expertise in computer vision, robotics, and aerospace engineering to deliver cutting-edge solutions that address the evolving challenges of modern defense. With a strong foundation in research and a commitment to innovation, we are dedicated to providing reliable, efficient, and scalable technologies that enhance situational awareness and operational effectiveness for our clients worldwide.">
      </Section>
      <Section title="Team" subtitle="">
      <div className="grid md:grid-cols-5 gap-4">
                <FeatureCard icon={<>👨‍💼</>} title="Dr. Lukas Karge" desc="CEO" image="/images/team/lukas-karge.png" />
                <FeatureCard icon={<>👨‍💻</>} title="Prof. Benjamin Busam" desc="CTO" image="/images/team/benjamin-busam.png" />
                <FeatureCard icon={<>🔬</>} title="Michael Greza" desc="AI researcher" image="/images/team/michael-greza.png" />
                <FeatureCard icon={<>🏗️</>} title="Mert Kiray" desc="AI Architect" image="/images/team/mert-kiray.png" />
                <FeatureCard icon={<>🔬</>} title="Dr. Florian Eberhardt" desc="AI researcher" image="/images/team/florian-eberhardt.png" />
        </div>

        <div className="mt-6 text-center">
          <Link href="#consortium" className="text-accent1 hover:underline">Meet the extended network &rarr;</Link>
        </div>
        
    </Section>
    </div>
  );
}