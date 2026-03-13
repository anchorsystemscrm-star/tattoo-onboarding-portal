interface StepTrackerProps {
  currentStep: number;
  steps: readonly string[];
}

export function StepTracker({ currentStep, steps }: StepTrackerProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-white/10 bg-ink/90 px-4 pb-4 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Onboarding Progress</p>
          <h2 className="mt-1 text-base font-semibold text-white sm:text-lg">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </h2>
        </div>
        <div className="rounded-full border border-accent/20 bg-accentSoft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {Math.round(progress)}%
        </div>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-[#f0d9a6] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === currentStep;
          const complete = stepNumber < currentStep;

          return (
            <div key={step} className="space-y-2">
              <div
                className={`h-2 rounded-full transition ${
                  active || complete ? "bg-accent" : "bg-white/10"
                }`}
              />
              <p
                className={`hidden text-[11px] leading-4 sm:block ${
                  active ? "text-white" : complete ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
