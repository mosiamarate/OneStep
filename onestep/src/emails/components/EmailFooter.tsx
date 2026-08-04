import { Link, Section, Text } from "@react-email/components";

import { supportEmail } from "../../lib/resend";

export default function EmailFooter() {
  return (
    <Section style={footer}>
      <Text style={footerText}>
        OneStep helps you slow down, choose one meaningful task, and move with
        calm focus.
      </Text>
      
      <Text style={footerText}>
        Need help? Contact{" "}
        <Link href={`mailto:${supportEmail}`} style={footerLink}>
          {supportEmail}
        </Link>
        .
      </Text>
      <Text style={footerMuted}>
        Copyright {new Date().getFullYear()} OneStep. All rights reserved.
      </Text>
    </Section>
  );
}

const footer = {
  borderTop: "1px solid #334155",
  margin: "28px 0 0",
  paddingTop: "20px",
  textAlign: "center" as const,
};

const footerText = {
  margin: "0 0 8px",
  color: "#94A3B8",
  fontSize: "13px",
  lineHeight: "20px",
};

const footerMuted = {
  ...footerText,
  margin: "12px 0 0",
  color: "#64748B",
};

const footerLink = {
  color: "#93C5FD",
  textDecoration: "underline",
};
