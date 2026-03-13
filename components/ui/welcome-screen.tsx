"use client";

import { useState } from "react";
import { ANCHOR_LOGO_URL } from "@/lib/constants";

interface WelcomeScreenProps {
  onBegin: () => void;
}

export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <section className="panel relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,180,106,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(69,107,169,0.16),transparent_24%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          {!logoMissing ? (
            <img
              src={ANCHOR_LOGO_URL}
              alt="Anchor Systems"
              className="h-16 w-auto object-contain sm:h-20"
              onError={() => setLogoMissing(true)}
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/30 bg-accentSoft font-display text-3xl font-semibold text-accent shadow-glow">
              AS
            </div>
          )}
        </div>
        <span className="inline-flex rounded-full border border-accent/20 bg-accentSoft px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Private Onboarding
        </span>
        <h1 className="mt-6 font-display text-4xl leading-tight text-white sm:text-6xl">
          Welcome to Your Personal Onboarding
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          Thank you for choosing Anchor Systems. This onboarding form will help us gather
          everything we need to build your tattoo shop system, artist routing, calendars,
          and phone setup.
        </p>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
          This should only take about 8 to 10 minutes.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onBegin}
            className="rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink"
          >
            Begin
          </button>
          <p className="text-sm text-slate-400">
            Your information goes directly to the Anchor Systems onboarding team.
          </p>
        </div>
      </div>
    </section>
  );
}
