import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "accent";
}

export function SectionCard({
  title,
  description,
  children,
  tone = "default",
}: SectionCardProps) {
  const toneClass =
    tone === "accent"
      ? "border-accent/30 bg-accentSoft/40 shadow-glow"
      : "border-line bg-white/[0.04] shadow-panel";

  return (
    <section className={`panel p-5 sm:p-7 ${toneClass}`}>
      <div className="mb-5 space-y-1">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
        {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
