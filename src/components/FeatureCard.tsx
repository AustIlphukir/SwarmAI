export default function FeatureCard({
  icon,
  image,
  title,
  desc,
}: {
  icon?: React.ReactNode;
  image?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="bg-card rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">
        {image ? (
          <img src={image} alt={title} className="w-12 h-12 mx-auto object-cover" />
        ) : (
          icon
        )}
      </div>
      <div className="font-semibold">{title}</div>
      {desc && <div className="text-sm mt-1 text-textSecondary">{desc}</div>}
    </div>
  );
}