interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

import Image from "next/image";
import icon from "@/public/icons/icon-2000x2000.png"

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mb-4">
        <Image
            src={icon}
            alt="OneStep logo"
            width={70}
            height={70}
            className="mx-auto rounded-lg"
          />
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