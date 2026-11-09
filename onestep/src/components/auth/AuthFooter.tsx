import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-slate-400 text-sm">
        {text}{" "}
        <Link
          href={href}
          className="
            inline-flex
            min-h-11
            items-center
            text-blue-400
            hover:text-blue-300
            transition-colors
            font-medium
          "
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}