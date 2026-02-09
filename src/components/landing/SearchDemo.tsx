"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const DEMO_RESULTS = [
  {
    name: "Sarah Chen",
    initials: "SC",
    role: "Senior Backend Engineer",
    company: "Stripe",
    location: "San Francisco",
    match: 96,
  },
  {
    name: "Marcus Johnson",
    initials: "MJ",
    role: "Go Developer, 7yr exp",
    company: "Datadog",
    location: "Austin, TX",
    match: 93,
  },
  {
    name: "Priya Patel",
    initials: "PP",
    role: "Staff Engineer",
    company: "Figma",
    location: "Remote",
    match: 91,
  },
  {
    name: "Alex Rivera",
    initials: "AR",
    role: "Platform Engineer",
    company: "Vercel",
    location: "New York",
    match: 89,
  },
  {
    name: "Jordan Kim",
    initials: "JK",
    role: "Backend Lead",
    company: "Linear",
    location: "San Francisco",
    match: 87,
  },
];

export default function SearchDemo() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-6">
          <h2
            id="metrics"
            className="text-4xl md:text-5xl font-medium tracking-tighter uppercase"
          >
            Output<br />Metrics
          </h2>
          <p className="hidden md:block text-right font-mono text-xs text-white/40">
            LIVE DATA FEED{" "}
            <span
              className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
          </p>
        </div>

        {/* Big stats */}
        <div className="flex flex-col">
          {[
            { label: "Candidates Found", value: "50K", suffix: "+" },
            { label: "Avg Search Time", value: "2.4", suffix: "min" },
            { label: "Active Recruiters", value: "2,400", suffix: "+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col md:flex-row md:items-baseline justify-between py-12 border-b border-white/10 hover:bg-white/5 transition-colors px-4"
            >
              <span className="font-mono text-sm text-white/40 mb-2 md:mb-0 w-48 uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="flex-1 md:text-right">
                <span className="text-6xl md:text-9xl font-medium tracking-tighter block group-hover:translate-x-4 transition-transform duration-300">
                  {stat.value}
                  <span className="text-white/30">{stat.suffix}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Results preview table */}
        <div className="mt-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-0">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
              Sample Output — &quot;Senior Backend Engineers in Austin&quot;
            </span>
            <span className="font-mono text-xs text-green-500">
              5 results
            </span>
          </div>

          <div className="border-l border-r border-white/10">
            {DEMO_RESULTS.map((r, i) => (
              <div
                key={r.name}
                className={`flex items-center justify-between py-5 px-6 border-b border-white/10 transition-colors cursor-pointer ${
                  hoveredRow === i ? "bg-white/5" : ""
                }`}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-white/20 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center border border-white/20 text-xs font-bold tracking-tight">
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-tight">
                      {r.name}
                    </div>
                    <div className="text-xs font-mono text-white/40">
                      {r.role} — {r.company}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                  <span className="font-mono text-xs text-white/30">
                    {r.location}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {r.match}%
                  </span>
                  <ArrowUpRight
                    size={14}
                    className={`transition-opacity ${
                      hoveredRow === i ? "opacity-100" : "opacity-0"
                    } text-white/60`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-emerald-500 text-black font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-full group"
          >
            Initialise Search
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
