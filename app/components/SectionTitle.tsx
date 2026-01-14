type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-white serif-font mb-3">{title}</h2>
      {subtitle && <p className="text-gray-400 font-light">{subtitle}</p>}
    </div>
  );
}
