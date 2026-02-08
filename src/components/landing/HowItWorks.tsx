export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Neural Precision",
      description:
        "Describe your ideal candidate in plain language. Our AI parses intent, searches the entire web, and identifies signals in the noise.",
    },
    {
      number: "02",
      title: "Velocity",
      description:
        "Results in minutes, not weeks. Automated pipelines handling discovery, verification, and enrichment — all in parallel.",
    },
    {
      number: "03",
      title: "Alignment",
      description:
        "Review verified profiles, manage through your pipeline, export when ready. We only succeed when you hire.",
    },
    {
      number: "04",
      title: "Architecture",
      description:
        "Custom pipeline stages, saved lists, team collaboration. Infrastructure that scales with your hiring velocity.",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column */}
          <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 pb-12 lg:pb-0 lg:pr-12">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest uppercase mb-4 block">
                02 — The Protocol
              </span>
              <h2 className="text-6xl font-medium tracking-tighter leading-[0.9] mt-6">
                HOW<br />IT<br />WORKS
              </h2>
            </div>
            <div className="mt-12">
              <p className="text-black/60 font-mono text-sm leading-relaxed max-w-xs">
                We don&apos;t just search profiles. We build the infrastructure
                for the next generation of talent acquisition.
              </p>
              <div className="mt-8 flex items-center gap-2">
                <div className="h-px w-12 bg-black" />
                <span className="text-xs font-bold uppercase">
                  Logic Defined
                </span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {steps.map((step) => (
              <div key={step.number} className="group cursor-default">
                <div className="flex items-baseline justify-between border-b border-black/10 pb-4 mb-4 group-hover:border-black transition-colors">
                  <h4 className="text-xl font-bold uppercase">
                    {step.title}
                  </h4>
                  <span className="font-mono text-xs">{step.number}</span>
                </div>
                <p className="text-black/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
