interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
        🌿
      </p>

      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}