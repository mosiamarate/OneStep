import { Section, Text } from "@react-email/components";

import EmailLayout from "./components/EmailLayout";
import EmailFooter from "./components/EmailFooter";

interface PasswordResetProps {
  name: string;
  otp: string;
}

export default function PasswordReset({ name, otp }: PasswordResetProps) {
  return (
    <EmailLayout
      preview="Use your OneStep password reset code."
      title="Reset your OneStep password"
    >
      
      <Text style={text}>Hello {name},</Text>
      <Text style={text}>
        We received a request to reset your password. Use this code:
      </Text>

      <Section style={codeCard}>
        <Text style={code}>{otp}</Text>
      </Section>

      <Text style={text}>This code expires in 10 minutes.</Text>
      <Text style={muted}>
        If you did not request this, your account is safe.
      </Text>
      <EmailFooter />
    </EmailLayout>
  );
}

const text = {
  margin: "0 0 16px",
  color: "#CBD5E1",
  fontSize: "15px",
  lineHeight: "24px",
};

const muted = {
  ...text,
  color: "#94A3B8",
  fontSize: "14px",
};

const codeCard = {
  margin: "24px 0",
  borderRadius: "14px",
  backgroundColor: "#0F172A",
  border: "1px solid #334155",
  padding: "22px",
  textAlign: "center" as const,
};

const code = {
  margin: "0",
  color: "#FFFFFF",
  fontSize: "34px",
  fontWeight: "700",
  letterSpacing: "6px",
};
