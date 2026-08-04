import type { ReactNode } from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailLayoutProps {
  children: ReactNode;
  preview: string;
  title: string;
}

export default function EmailLayout({
  children,
  preview,
  title,
}: EmailLayoutProps) {
  const appUrl = getAppUrl();

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={brandSection}>
            <Row style={brandRow}>
              <Column style={brandIconColumn}>
                <Img
                  src={`${appUrl}/icons/icon-192x192.png`}
                  width="32"
                  height="32"
                  alt="OneStep"
                  style={brandIcon}
                />
              </Column>
              <Column>
                <Text style={logoMark}>OneStep</Text>
              </Column>
            </Row>
          </Section>

          <Section style={card}>
            <Heading style={heading}>{title}</Heading>
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function getAppUrl() {
  return process.env.APP_URL || "https://onestepapp.co.za";
}

const body = {
  margin: "0",
  backgroundColor: "#0F172A",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const container = {
  width: "100%",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 20px",
};

const brandSection = {
  marginBottom: "20px",
};

const brandRow = {
  width: "auto",
  margin: "0 auto",
};

const brandIconColumn = {
  width: "40px",
  paddingRight: "8px",
};

const brandIcon = {
  display: "block",
  borderRadius: "8px",
};

const logoMark = {
  margin: "0",
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "0",
};

const card = {
  backgroundColor: "#1E293B",
  border: "1px solid #334155",
  borderRadius: "16px",
  padding: "32px",
};

const heading = {
  margin: "0 0 20px",
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "1.3",
};