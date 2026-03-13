import { MAIN_WEBSITE_URL } from "@/lib/constants";

interface SuccessScreenProps {
  referenceNumber: string;
  countdown: number;
}

export function SuccessScreen({ referenceNumber, countdown }: SuccessScreenProps) {
  return (
    <section className="panel relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,180,106,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(69,107,169,0.14),transparent_26%)]" />
      <div className="relative mx-auto max-w-3xl">
        <span className="inline-flex rounded-full border border-accent/20 bg-accentSoft px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Submission Complete
        </span>
        <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-5xl">
          Thank You. Your Onboarding Has Been Submitted
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
          Anchor Systems has received your onboarding details and our team can now begin
          preparing your tattoo shop setup, routing, calendars, and AI phone configuration.
        </p>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-accent/30 bg-white/[0.04] p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Reference Number</p>
          <p className="mt-4 text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl">
            {referenceNumber}
          </p>
          <p className="mt-4 text-sm text-slate-300">
            Save this reference number for any future communication with Anchor Systems.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
            You&apos;ll be redirected to our main website in {countdown} second
            {countdown === 1 ? "" : "s"}.
          </p>
          <a
            href={MAIN_WEBSITE_URL}
            className="inline-flex rounded-full border border-accent/30 bg-accentSoft px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-accent hover:bg-accent/20"
          >
            Go to Anchor Systems Now
          </a>
        </div>
      </div>
    </section>
  );
}
