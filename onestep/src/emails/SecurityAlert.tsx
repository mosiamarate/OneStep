import { Section, Text, Row, Column, Img } from "@react-email/components";

import EmailLayout from "./components/EmailLayout";
import EmailFooter from "./components/EmailFooter";

const appUrl = process.env.APP_URL ?? "";

interface SecurityAlertProps {
  browser: string;
  device: string;
  location: string;
  time: string;
}

export default function SecurityAlert({
  browser,
  device,
  location,
  time,
}: SecurityAlertProps) {
  return (
    <EmailLayout
      preview="A new login was detected on your OneStep account."
      title="New login detected"
    >
      <Section style={brandSection}>
        <Row style={brandRow}>
          <Column style={brandIconColumn}>
            <Img
              src={`${appUrl}/icons/icon-2000x2000.png`}
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

      <Text style={text}>
        We noticed a new login to your OneStep account. If this was you, no
        action is needed.
      </Text>
      <Text style={detail}>Device: {device}</Text>
      <Text style={detail}>Browser: {browser}</Text>
      <Text style={detail}>Location: {location}</Text>
      <Text style={detail}>Time: {time}</Text>
      <Text style={muted}>
        If this was not you, reset your password and review your account.
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

const detail = {
  margin: "0 0 10px",
  color: "#FFFFFF",
  fontSize: "15px",
  lineHeight: "22px",
};

const muted = {
  ...text,
  color: "#94A3B8",
  fontSize: "14px",
};

const brandSection = {
  padding: "20px 0 16px",
  borderBottom: "1px solid #334155",
};

const brandRow = {
  alignItems: "center",
  gap: "12px",
  margin: "0 0 20px",
};

const brandIconColumn = {
  width: "32px",
};

const brandIcon = {
  display: "block",
  borderRadius: "8px",
};

const logoMark = {
  margin: "0",
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: "bold",
};
