export default function Section({
  title,
  subtitle,
  id,
  children,
}: {
  title: string;
  subtitle?: string;
  id?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}<span className="text-accent1">_</span></h2>
      {subtitle && <p className="text-textSecondary mb-6">{subtitle}</p>}
      <div>{children}</div>
    </section>
  );
}
