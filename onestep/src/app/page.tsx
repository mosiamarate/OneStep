import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Clock3, Leaf } from "lucide-react";

import Footer from "../components/layout/Footer";
import MoodIcon from "../components/ui/MoodIcon";
import "./page.css";

const steps = [
  {
    number: "01",
    title: "Check in",
    description:
      "Take a moment to notice how you feel. There’s no right answer and no pressure to change it.",
  },
  {
    number: "02",
    title: "Choose one thing",
    description:
      "Name the next task that feels manageable. Leave the rest of the list for later.",
  },
  {
    number: "03",
    title: "Find your focus",
    description:
      "Set a pace that works for you, settle in, and give this one thing your attention.",
  },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" href="/" aria-label="OneStep home">
          <Image
            src="/icons/icon-web.webp"
            alt=""
            width={40}
            height={40}
            priority
          />
          <span>OneStep</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <Link className="landing-nav-link" href="#how-it-works">
            How it works
          </Link>
          <Link className="landing-nav-link" href="/auth/login">
            Log in
          </Link>
          <Link className="landing-nav-cta" href="/auth/signup">
            Create an account <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <h1 id="landing-title">
            Slow down, relax, and focus on one task at a time.
          </h1>
          <p className="landing-intro">
            When everything feels like a lot, start smaller. Check in with
            yourself, choose one next step, and focus at your own pace.
          </p>

          <div className="landing-actions">
            <Link className="landing-primary-action" href="/auth/signup">
              Get Started <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="landing-secondary-action" href="/auth/login">
              I already have an account
            </Link>
          </div>

          <p className="landing-reassurance">
            A simple routine for making a little progress, without the pressure.
          </p>
        </div>

        <aside
          className="landing-preview"
          aria-label="Example of a OneStep focus session"
        >
          <div className="preview-window">
            <div className="preview-topbar">
              <span className="preview-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>YOUR NEXT STEP</span>
              <span className="preview-day">A sample session</span>
            </div>

            <div className="preview-content">
              <div className="preview-greeting">
                <div>
                  <p className="preview-kicker">A moment for yourself</p>
                  <h2>Start where you are.</h2>
                </div>
                <span className="preview-leaf">
                  <Leaf aria-hidden="true" size={19} />
                </span>
              </div>

              <div className="preview-checkin">
                <span className="preview-checkin-label">Today, I feel</span>
                <span className="preview-mood">
                  <MoodIcon mood="tired" size={15} className="text-blue-300" />
                  A little tired
                </span>
              </div>

              <div className="preview-task">
                <div className="preview-task-icon">
                  <Check aria-hidden="true" size={17} />
                </div>
                <div className="preview-task-copy">
                  <span className="preview-checkin-label">ONE THING TO FOCUS ON</span>
                  <p>Review my notes for 25 minutes</p>
                </div>
              </div>

              <div className="preview-timer">
                <div className="preview-timer-heading">
                  <span>
                    <Clock3 aria-hidden="true" size={15} /> Focus time
                  </span>
                  <span>Take it at your pace</span>
                </div>
                <div className="preview-timer-track" aria-hidden="true">
                  <span />
                </div>
                <div className="preview-timer-time">25:00</div>
                <p>One thing at a time.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <a className="landing-scroll-cue" href="#how-it-works">
        A gentler way to get started <ArrowDown aria-hidden="true" size={16} />
      </a>

      <section
        className="landing-how"
        id="how-it-works"
        aria-labelledby="how-title"
      >
        <div className="landing-section-heading">
          <p className="landing-eyebrow">Small steps count</p>
          <h2 id="how-title">A calmer way to get things done.</h2>
          <p>
            OneStep helps you move from feeling overwhelmed to finding a
            manageable place to begin.
          </p>
        </div>

        <ol className="landing-steps">
          {steps.map((step) => (
            <li className="landing-step" key={step.number}>
              <span className="landing-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-closing" aria-labelledby="closing-title">
        <div>
          <p className="landing-eyebrow">You can begin right here</p>
          <h2 id="closing-title">One small step is enough.</h2>
          <p>
            Make a little space for yourself and decide what comes next.
          </p>
        </div>
        <Link className="landing-primary-action" href="/auth/signup">
          Create your account <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}
