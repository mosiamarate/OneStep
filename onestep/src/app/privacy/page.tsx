import type { Metadata } from "next";

import LegalPageShell from "../../components/legal/LegalPageShell";
import { LEGAL_DETAILS } from "../../constants/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how OneStep collects, uses, stores, and protects personal information.",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
      {children}
    </h2>
  );
}

function BulletList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-300">
      {children}
    </ul>
  );
}

export default function PrivacyPage() {
  const contactLink = `mailto:${LEGAL_DETAILS.contactEmail}`;

  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains what information OneStep handles and how that information is used."
      lastUpdated={LEGAL_DETAILS.lastUpdated}
    >
      <section>
        <SectionHeading>1. Who we are</SectionHeading>

        <p className="mt-3">
          {LEGAL_DETAILS.appName} is a productivity and focus application
          operated by {LEGAL_DETAILS.operatorName} in{" "}
          {LEGAL_DETAILS.country}.
        </p>

        <p className="mt-3">
          OneStep helps users check in with their mood, choose one task, run a
          focus session, reflect afterwards, and review their focus history.
        </p>

        <p className="mt-3">
          For questions about this Privacy Policy or your personal information,
          contact us at{" "}
          <a
            href={contactLink}
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            {LEGAL_DETAILS.contactEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <SectionHeading>2. Information we collect</SectionHeading>

        <p className="mt-3">
          The information OneStep handles depends on the features you use.
        </p>

        <h3 className="mt-5 font-semibold text-white">
          Account information
        </h3>

        <BulletList>
          <li>Your name or display name.</li>
          <li>Your email address.</li>
          <li>Your Firebase user identifier.</li>
          <li>
            Your sign-in provider, such as email and password or Google
            sign-in.
          </li>
          <li>Your account creation and update dates.</li>
        </BulletList>

        <h3 className="mt-5 font-semibold text-white">
          Information you add to OneStep
        </h3>

        <BulletList>
          <li>Mood selections before and after focus sessions.</li>
          <li>Optional mood or reflection notes.</li>
          <li>Tasks you create.</li>
          <li>Selected focus-session durations.</li>
          <li>Completed, reset, or ended focus sessions.</li>
          <li>Focus-session history and progress information.</li>
          <li>Preferences and settings that may be added in the future.</li>
        </BulletList>

        <h3 className="mt-5 font-semibold text-white">
          Technical information
        </h3>

        <p className="mt-3">
          Our technology providers may automatically process information needed
          to operate and secure the service. This can include IP addresses,
          browser or device information, authentication logs, request logs,
          security events, and general usage information.
        </p>
      </section>

      <section>
        <SectionHeading>3. Mood information and sensitive content</SectionHeading>

        <p className="mt-3">
          Mood selections and optional notes may reveal personal or sensitive
          information about how you feel. Adding a mood note is optional.
        </p>

        <p className="mt-3">
          Please avoid entering medical diagnoses, emergency information, or
          other highly sensitive information that is not necessary for using
          OneStep.
        </p>

        <p className="mt-3">
          OneStep is a productivity tool. It is not a medical, counselling,
          psychological, or emergency service.
        </p>
      </section>

      <section>
        <SectionHeading>4. How we use information</SectionHeading>

        <p className="mt-3">We use information to:</p>

        <BulletList>
          <li>Create and manage your account.</li>
          <li>Authenticate you and keep your account signed in.</li>
          <li>Save your moods, tasks, sessions, and history.</li>
          <li>Display personal dashboard statistics and progress.</li>
          <li>Provide password reset and account-security features.</li>
          <li>Operate, maintain, troubleshoot, and secure OneStep.</li>
          <li>Respond to questions and support requests.</li>
          <li>Understand and improve how OneStep works.</li>
          <li>Comply with applicable legal obligations.</li>
        </BulletList>

        <p className="mt-3">
          We process personal information with your consent, to provide the
          service you request, for legitimate operational and security
          purposes, and where otherwise permitted or required by applicable
          law.
        </p>
      </section>

      <section>
        <SectionHeading>5. Service providers</SectionHeading>

        <p className="mt-3">
          OneStep uses third-party providers to operate the application.
        </p>

        <h3 className="mt-5 font-semibold text-white">
          Google Firebase
        </h3>

        <p className="mt-3">
          Firebase provides authentication, Google sign-in, password reset,
          database storage, and related security services. Information
          processed through Firebase may be processed outside South Africa,
          including in the United States.
        </p>

        <h3 className="mt-5 font-semibold text-white">
          Vercel
        </h3>

        <p className="mt-3">
          Vercel hosts and delivers the OneStep web application. Vercel may
          process technical information required to provide hosting, security,
          performance, and request-delivery services.
        </p>

        <p className="mt-3">
          These providers process information according to their own legal
          terms, privacy notices, and data-processing arrangements.
        </p>
      </section>

      <section>
        <SectionHeading>6. When information may be shared</SectionHeading>

        <p className="mt-3">
          We do not sell your personal information.
        </p>

        <p className="mt-3">
          Information may be shared only where reasonably necessary:
        </p>

        <BulletList>
          <li>With providers that operate OneStep on our behalf.</li>
          <li>To protect the security, rights, and integrity of OneStep.</li>
          <li>To investigate fraud, abuse, or unlawful activity.</li>
          <li>When required by law, regulation, or a lawful authority.</li>
          <li>
            As part of a lawful business transfer, restructuring, or change of
            ownership.
          </li>
        </BulletList>
      </section>

      <section>
        <SectionHeading>7. Browser storage and cookies</SectionHeading>

        <p className="mt-3">
          OneStep and its providers may use essential browser storage,
          authentication tokens, cookies, IndexedDB, local storage, cached
          files, or service-worker storage.
        </p>

        <p className="mt-3">
          These technologies may be used to keep you signed in, remember app
          state, support PWA installation, improve performance, detect updates,
          and protect the service.
        </p>

        <p className="mt-3">
          OneStep does not currently use personal information for third-party
          advertising.
        </p>
      </section>

      <section>
        <SectionHeading>8. Data storage and international processing</SectionHeading>

        <p className="mt-3">
          OneStep is operated from South Africa, but Firebase, Vercel, and their
          providers may store or process information in other countries.
        </p>

        <p className="mt-3">
          Where personal information is transferred internationally, we take
          reasonable steps to use providers and arrangements intended to
          protect that information in accordance with applicable law.
        </p>
      </section>

      <section>
        <SectionHeading>9. How long we keep information</SectionHeading>

        <p className="mt-3">
          We retain account information and user-created content while your
          account remains active or while it is reasonably needed to provide
          OneStep.
        </p>

        <p className="mt-3">
          Some information may be kept for longer where necessary for security,
          fraud prevention, legal compliance, dispute resolution, or backup
          recovery.
        </p>

        <p className="mt-3">
          You may request account and data deletion by contacting{" "}
          <a
            href={contactLink}
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            {LEGAL_DETAILS.contactEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <SectionHeading>10. Security</SectionHeading>

        <p className="mt-3">
          We use reasonable technical and organisational safeguards intended to
          protect personal information. These may include authentication,
          access-control rules, secure connections, and security features
          provided by Firebase and Vercel.
        </p>

        <p className="mt-3">
          No online system can guarantee complete security. You are responsible
          for keeping your password confidential and for protecting access to
          your email account and devices.
        </p>
      </section>

      <section>
        <SectionHeading>11. Your privacy rights</SectionHeading>

        <p className="mt-3">
          Subject to applicable law, you may have the right to:
        </p>

        <BulletList>
          <li>Ask whether we hold personal information about you.</li>
          <li>Request access to your personal information.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of information where legally permitted.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Withdraw consent where processing depends on consent.</li>
          <li>Submit a complaint to the Information Regulator.</li>
        </BulletList>

        <p className="mt-3">
          To submit a request, email{" "}
          <a
            href={contactLink}
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            {LEGAL_DETAILS.contactEmail}
          </a>
          . We may need to verify your identity before processing the request.
        </p>

        <p className="mt-3">
          You may also learn about privacy complaints through the South African{" "}
          <a
            href="https://inforegulator.org.za/complaints/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            Information Regulator
          </a>
          .
        </p>
      </section>

      <section>
        <SectionHeading>12. Users under 18</SectionHeading>

        <p className="mt-3">
          Users under 18 should use OneStep only with permission from a parent
          or legal guardian who is legally able to provide consent.
        </p>

        <p className="mt-3">
          If we learn that a child’s personal information was processed without
          the required permission or another lawful basis, we may restrict the
          account and delete the information where appropriate.
        </p>

        <p className="mt-3">
          A parent or guardian may contact us at{" "}
          <a
            href={contactLink}
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            {LEGAL_DETAILS.contactEmail}
          </a>{" "}
          with a privacy request.
        </p>
      </section>

      <section>
        <SectionHeading>13. Changes to this policy</SectionHeading>

        <p className="mt-3">
          We may update this Privacy Policy when OneStep’s features, providers,
          or legal obligations change.
        </p>

        <p className="mt-3">
          When changes are important, we may notify users through the
          application, an update notice, email, or an updated date on this page.
        </p>
      </section>

      <section>
        <SectionHeading>14. Contact</SectionHeading>

        <p className="mt-3">
          Privacy questions and requests can be sent to:
        </p>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="font-semibold text-white">
            {LEGAL_DETAILS.operatorName}
          </p>

          <p className="mt-1 text-slate-400">{LEGAL_DETAILS.country}</p>

          <a
            href={contactLink}
            className="mt-2 inline-block font-medium text-blue-300 hover:text-blue-200"
          >
            {LEGAL_DETAILS.contactEmail}
          </a>
        </div>
      </section>
    </LegalPageShell>
  );
}