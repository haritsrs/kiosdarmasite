type LandingSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  eyebrow?: string;
  accent?: "purple" | "indigo" | "lavender" | "slate";
};

const accentConfig: Record<
  NonNullable<LandingSectionProps["accent"]>,
  { container: string; eyebrow: string; title: string }
> = {
  purple: {
    container: "border-t-4 border-t-purple-600 bg-white",
    eyebrow: "text-purple-600",
    title: "text-slate-900",
  },
  indigo: {
    container: "border-t-4 border-t-indigo-500 bg-white",
    eyebrow: "text-indigo-600",
    title: "text-slate-900",
  },
  lavender: {
    container: "border-t-4 border-t-violet-400 bg-white",
    eyebrow: "text-violet-500",
    title: "text-slate-900",
  },
  slate: {
    container: "border-t-4 border-t-slate-800 bg-slate-900 text-white",
    eyebrow: "text-purple-200",
    title: "text-white",
  },
};

export function LandingSection({
  id,
  title,
  description,
  children,
  cta,
  eyebrow,
  accent = "indigo",
}: LandingSectionProps) {
  const { container, eyebrow: eyebrowClass, title: titleClass } = accentConfig[accent] ?? accentConfig.indigo;
  const isDark = accent === "slate";

  return (
    <section id={id} className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className={`rounded-md border border-slate-200 shadow-sm ${container}`}>
          <div className="flex flex-col gap-5 px-6 py-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              {eyebrow ? (
                <span className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${eyebrowClass}`}>
                  {eyebrow}
                </span>
              ) : null}
              <h2 className={`text-[26px] font-semibold leading-snug md:text-[28px] ${titleClass}`}>{title}</h2>
              {description ? (
                <p className={`max-w-3xl text-sm leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {description}
                </p>
              ) : null}
            </div>
            {cta ? <div className="shrink-0 pt-1">{cta}</div> : null}
          </div>
          <div className={`border-t text-sm ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <div className="px-6 py-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

