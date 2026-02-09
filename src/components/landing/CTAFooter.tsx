import { ArrowUpRight, Box } from "lucide-react";

export default function CTAFooter() {
  return (
    <section className="py-40 px-6 relative">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Icon */}
        <Box
          size={48}
          strokeWidth={0.8}
          className="mb-8 text-white/20"
        />

        <h2 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9] uppercase">
          Stop<br />
          <span className="text-white/30">Searching</span><br />
          Manually
        </h2>

        <p className="mt-10 max-w-md font-mono text-sm text-white/50 leading-relaxed">
          Join thousands of recruiters who replaced weeks of sourcing with
          minutes of intelligent, AI-powered candidate discovery.
        </p>

        <div className="mt-12">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-emerald-500 text-black font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-full group"
          >
            Initialise Engine
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>

        <p className="mt-6 font-mono text-xs text-white/30">
          No credit card required. Free plan includes 10 searches/month.
        </p>
      </div>
    </section>
  );
}
