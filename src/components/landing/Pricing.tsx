import { ArrowUpRight } from "lucide-react";

const plans = [
  {
    name: "Base",
    price: "Free",
    period: "",
    description: "Individual recruiters. Getting started with AI-powered search.",
    features: [
      "10 searches / month",
      "50 candidates saved",
      "5-stage pipeline",
      "CSV export",
      "Email support",
    ],
    cta: "Deploy Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "Teams that need unlimited access and full system capabilities.",
    features: [
      "Unlimited searches",
      "Unlimited candidates",
      "Custom pipeline stages",
      "Advanced enrichment",
      "Team collaboration",
      "Bulk operations",
      "Priority support",
      "API access",
    ],
    cta: "Start Trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-20 border-b border-white/10 pb-12">
          <span className="font-mono text-xs text-white/40">
            03 — ACCESS
          </span>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white uppercase">
            System<br />Access
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-10 md:p-12 flex flex-col justify-between relative ${
                plan.highlighted
                  ? "bg-white text-black border-l border-white/10"
                  : "bg-[#121212] text-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-6 right-6">
                  <span className="bg-black text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
                    Recommended
                  </span>
                </div>
              )}

              <div>
                <span
                  className={`font-mono text-xs uppercase tracking-widest ${
                    plan.highlighted ? "text-black/40" : "text-white/40"
                  }`}
                >
                  {plan.name}
                </span>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-6xl md:text-7xl font-medium tracking-tighter">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`font-mono text-sm ${
                        plan.highlighted ? "text-black/40" : "text-white/40"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-4 text-sm font-mono leading-relaxed max-w-xs ${
                    plan.highlighted ? "text-black/60" : "text-white/50"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-10 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 text-sm ${
                        plan.highlighted ? "text-black/70" : "text-white/60"
                      }`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full shrink-0 ${
                          plan.highlighted ? "bg-black" : "bg-white/40"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plan.href}
                className={`mt-12 inline-flex items-center justify-center gap-3 w-full py-4 text-sm font-bold uppercase tracking-widest transition-all group ${
                  plan.highlighted
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {plan.cta}
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
