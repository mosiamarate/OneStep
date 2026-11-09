import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <Image
        src="/icons/icon-web.webp"
        alt=""
        width={52}
        height={52}
        className="mx-auto mb-4 rounded-xl"
      />

      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>

      <p className="mx-auto max-w-sm text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}