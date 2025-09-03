export default function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <div className="bg-card rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold">{title}</div>
      {desc && <div className="text-sm mt-1 text-textSecondary">{desc}</div>}
    </div>
  );
}
