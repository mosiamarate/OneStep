import type { Metadata } from "next";

import LegalPageShell from "../../components/legal/LegalPageShell";
import { LEGAL_DETAILS } from "../../constants/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms that apply when creating an account or using OneStep.",
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

export default function TermsPage() {
  const contactLink = `mailto:${LEGAL_DETAILS.contactEmail}`;

  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms govern your access to and use of OneStep."
      lastUpdated={LEGAL_DETAILS.lastUpdated}
    >
      <section>
        <SectionHeading>1. Acceptance of these terms</SectionHeading>

        <p className="mt-3">
          These Terms of Service form an agreement between you and{" "}
          {LEGAL_DETAILS.operatorName}, the operator of{" "}
          {LEGAL_DETAILS.appName}.
        </p>

        <p className="mt-3">
          By creating an account, accessing OneStep, or using its features, you
          agree to these terms and acknowledge the Privacy Policy.
        </p>

        <p className="mt-3">
          Do not use OneStep if you do not agree to these terms.
        </p>
      </section>

      <section>
        <SectionHeading>2. What OneStep provides</SectionHeading>

        <p className="mt-3">
          OneStep is a productivity and focus application designed to help
          users:
        </p>

        <BulletList>
          <li>Complete a short emotional check-in.</li>
          <li>Choose one task at a time.</li>
          <li>Run and manage a focus timer.</li>
          <li>Reflect after a focus session.</li>
          <li>Review focus sessions and progress.</li>
        </BulletList>

        <p className="mt-3">
          Features may be added, changed, suspended, or removed as OneStep
          develops.
        </p>
      </section>

      <section>
        <SectionHeading>3. OneStep is not a medical service</SectionHeading>

        <p className="mt-3">
          OneStep is provided for general productivity, organisation,
          reflection, and focus purposes.
        </p>

        <p className="mt-3">
          It does not provide medical advice, diagnosis, counselling,
          psychological treatment, emergency support, or professional
          healthcare services.
        </p>

        <p className="mt-3">
          Mood check-ins and reflections are personal productivity tools and
          should not be treated as professional assessments.
        </p>
      </section>

      <section>
        <SectionHeading>4. Eligibility and users under 18</SectionHeading>

        <p className="mt-3">
          You must be legally capable of agreeing to these terms.
        </p>

        <p className="mt-3">
          If you are under 18, you may use OneStep only with permission from a
          parent or legal guardian who accepts responsibility for your use of
          the service and can provide any consent required by law.
        </p>

        <p className="mt-3">
          We may restrict or close an account where the required permission has
          not been obtained.
        </p>
      </section>

      <section>
        <SectionHeading>5. Accounts and security</SectionHeading>

        <p className="mt-3">
          You may need to create an account using an email address and password
          or a supported sign-in provider such as Google.
        </p>

        <p className="mt-3">You agree to:</p>

        <BulletList>
          <li>Provide accurate account information.</li>
          <li>Keep your account details reasonably current.</li>
          <li>Protect your password and access to your email account.</li>
          <li>Not allow another person to misuse your account.</li>
          <li>Tell us if you become aware of unauthorised account access.</li>
        </BulletList>

        <p className="mt-3">
          You are responsible for activity performed through your account
          unless applicable law provides otherwise.
        </p>
      </section>

      <section>
        <SectionHeading>6. Acceptable use</SectionHeading>

        <p className="mt-3">You must not:</p>

        <BulletList>
          <li>Use OneStep for unlawful, fraudulent, or abusive purposes.</li>
          <li>Attempt to access another user’s account or information.</li>
          <li>
            Bypass, interfere with, probe, or weaken security controls.
          </li>
          <li>
            Upload malicious software, scripts, automated attacks, or harmful
            code.
          </li>
          <li>
            Overload, disrupt, scrape, reverse engineer, or misuse the service.
          </li>
          <li>
            Misrepresent your identity or impersonate another person.
          </li>
          <li>
            Use OneStep in a way that infringes another person’s legal rights.
          </li>
        </BulletList>
      </section>

      <section>
        <SectionHeading>7. Your content</SectionHeading>

        <p className="mt-3">
          You retain ownership of the task names, notes, reflections, and other
          content you add to OneStep.
        </p>

        <p className="mt-3">
          You give us a limited permission to host, store, process, display,
          and transmit that content only as reasonably necessary to provide,
          secure, maintain, and improve OneStep.
        </p>

        <p className="mt-3">
          You are responsible for the content you submit and should avoid
          adding content that is unlawful, harmful, or unnecessarily sensitive.
        </p>
      </section>

      <section>
        <SectionHeading>8. OneStep intellectual property</SectionHeading>

        <p className="mt-3">
          OneStep’s name, branding, interface, software, visual design, and
          original content are owned by or licensed to{" "}
          {LEGAL_DETAILS.operatorName}.
        </p>

        <p className="mt-3">
          These terms do not transfer ownership of OneStep or grant permission
          to copy, sell, redistribute, or commercially exploit the application
          except where expressly permitted in writing or allowed by law.
        </p>
      </section>

      <section>
        <SectionHeading>9. Third-party services</SectionHeading>

        <p className="mt-3">
          OneStep depends on third-party services, including Google Firebase,
          Google sign-in, and Vercel.
        </p>

        <p className="mt-3">
          Your use of certain features may also be subject to those providers’
          terms and privacy practices.
        </p>

        <p className="mt-3">
          We are not responsible for third-party services that are outside our
          reasonable control.
        </p>
      </section>

      <section>
        <SectionHeading>10. Updates and availability</SectionHeading>

        <p className="mt-3">
          We may release updates, fixes, security changes, or new features. You
          may be asked to refresh or update the application to continue using
          the latest version.
        </p>

        <p className="mt-3">
          We aim to keep OneStep available, but uninterrupted or error-free
          operation is not guaranteed. Access may occasionally be affected by
          maintenance, outages, provider failures, security incidents, or
          circumstances outside our control.
        </p>
      </section>

      <section>
        <SectionHeading>11. Account suspension and termination</SectionHeading>

        <p className="mt-3">
          You may stop using OneStep at any time and may request deletion of
          your account by contacting us.
        </p>

        <p className="mt-3">
          We may suspend, restrict, or terminate access where reasonably
          necessary to:
        </p>

        <BulletList>
          <li>Protect users or the security of OneStep.</li>
          <li>Investigate suspected abuse or unlawful activity.</li>
          <li>Enforce these terms.</li>
          <li>Comply with a legal obligation.</li>
          <li>Discontinue the service.</li>
        </BulletList>
      </section>

      <section>
        <SectionHeading>12. Disclaimer</SectionHeading>

        <p className="mt-3">
          OneStep is provided on an “as available” basis. To the extent
          permitted by law, we do not guarantee that the service will always be
          uninterrupted, error-free, secure, or suitable for every individual
          purpose.
        </p>

        <p className="mt-3">
          Results from using productivity tools differ between users. We do not
          guarantee improved productivity, academic performance, employment
          performance, health, or wellbeing.
        </p>
      </section>

      <section>
        <SectionHeading>13. Limitation of liability</SectionHeading>

        <p className="mt-3">
          To the extent permitted by applicable law,{" "}
          {LEGAL_DETAILS.operatorName} will not be liable for indirect,
          incidental, special, or consequential losses resulting from your use
          of or inability to use OneStep.
        </p>

        <p className="mt-3">
          Nothing in these terms excludes or limits liability or consumer
          rights that cannot lawfully be excluded or limited under South
          African law.
        </p>
      </section>

      <section>
        <SectionHeading>14. Privacy</SectionHeading>

        <p className="mt-3">
          Our collection and use of personal information is explained in the{" "}
          <a
            href="/privacy"
            className="font-medium text-blue-300 underline decoration-blue-500/40 underline-offset-4 hover:text-blue-200"
          >
            OneStep Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <SectionHeading>15. Changes to these terms</SectionHeading>

        <p className="mt-3">
          We may update these terms when OneStep’s features, business model,
          providers, or legal requirements change.
        </p>

        <p className="mt-3">
          Important changes may be communicated through an in-app notice,
          update prompt, email, or an updated date on this page.
        </p>

        <p className="mt-3">
          Continued use of OneStep after updated terms take effect means that
          you accept the revised terms, where permitted by law.
        </p>
      </section>

      <section>
        <SectionHeading>16. Governing law</SectionHeading>

        <p className="mt-3">
          These terms are governed by the laws of the Republic of South Africa.
        </p>

        <p className="mt-3">
          Any dispute will be handled by a court or authorised dispute
          resolution body with jurisdiction, subject to any rights you have
          under applicable consumer or privacy law.
        </p>
      </section>

      <section>
        <SectionHeading>17. Contact</SectionHeading>

        <p className="mt-3">
          Questions about these terms can be sent to:
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