interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mb-4">
        <span className="text-5xl">🌿</span>
      </div>

      <h1 className="text-4xl font-bold text-white mb-3">
        {title}
      </h1>

      <p className="text-slate-400 max-w-sm mx-auto">
        {subtitle}
      </p>
    </div>
  );
}