import { Text } from "@react-email/components";

import EmailLayout from "./components/EmailLayout";
import EmailButton from "./components/EmailButton";

interface WelcomeEmailProps {
  name: string;
  appUrl?: string;
}

export default function WelcomeEmail({
  name,
  appUrl = "https://onestepapp.co.za",
}: WelcomeEmailProps) {
  return (
    <EmailLayout
      preview="Welcome to calm productivity with OneStep."
      title="Welcome to OneStep"
    >
      <Text style={text}>Hello {name},</Text>
      <Text style={text}>
        OneStep is a calm productivity space for choosing one meaningful task
        and giving it your attention without pressure.
      </Text>
      <Text style={text}>Start with a simple rhythm:</Text>
      <Text style={listItem}>1. Check your mood.</Text>
      <Text style={listItem}>2. Choose one task.</Text>
      <Text style={listItem}>3. Start a focus session.</Text>
      <EmailButton href={appUrl}>Open OneStep</EmailButton>
    </EmailLayout>
  );
}

const text = {
  margin: "0 0 16px",
  color: "#CBD5E1",
  fontSize: "15px",
  lineHeight: "24px",
};

const listItem = {
  margin: "0 0 8px",
  color: "#FFFFFF",
  fontSize: "15px",
  lineHeight: "22px",
};
