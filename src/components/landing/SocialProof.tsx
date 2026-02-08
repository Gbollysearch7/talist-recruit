export default function SocialProof() {
  return (
    <section className="py-20 px-6 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest shrink-0 w-32">
            Trusted By
          </p>
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-5 gap-12 items-center justify-items-center">
            {[
              "ACME Corp",
              "TechFlow",
              "NexGen",
              "Vertex AI",
              "Stratify",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-bold tracking-widest uppercase text-white/20 hover:text-white/40 transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
