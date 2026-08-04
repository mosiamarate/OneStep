import type { ReactNode } from "react";
import { Link } from "@react-email/components";

interface EmailButtonProps {
  children: ReactNode;
  href: string;
}

export default function EmailButton({ children, href }: EmailButtonProps) {
  return (
    <Link href={href} style={button}>
      {children}
    </Link>
  );
}

const button = {
  display: "inline-block",
  marginTop: "20px",
  borderRadius: "10px",
  backgroundColor: "#3B82F6",
  color: "#FFFFFF",
  fontSize: "15px",
  fontWeight: "600",
  lineHeight: "20px",
  padding: "12px 18px",
  textDecoration: "none",
};
