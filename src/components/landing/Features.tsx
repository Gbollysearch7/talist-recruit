import {
  Brain,
  LayoutGrid,
  Radar,
  Workflow,
} from "lucide-react";

const modules = [
  {
    number: "001",
    icon: Brain,
    title: ["Search", "Core"],
    description: "Natural language queries.\nAI-verified profiles.",
  },
  {
    number: "002",
    icon: LayoutGrid,
    title: ["Pipeline", "Engine"],
    description: "Kanban architecture.\nDrag-drop precision.",
  },
  {
    number: "003",
    icon: Radar,
    title: ["Qualify", "Matrix"],
    description: "Autonomous screening.\nMatch-score optimization.",
  },
  {
    number: "004",
    icon: Workflow,
    title: ["Export", "Protocol"],
    description: "Bulk operations.\nCSV, API, ATS integration.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-20 border-b border-white/10 pb-12">
          <span className="font-mono text-xs text-white/40">
            01 — CAPABILITIES
          </span>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white uppercase">
            System<br />Modules
          </h2>
        </div>

        {/* Brutalist cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10">
          {modules.map((mod) => (
            <div
              key={mod.number}
              className="brutalist-card p-10 flex flex-col justify-between aspect-auto md:aspect-[3/4] group border-r border-b border-t-0 border-l-0 border-white/10 hover:border-white z-10 relative"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-white/30">
                  {mod.number}
                </span>
                <mod.icon
                  size={36}
                  strokeWidth={1}
                  className="text-white group-hover:rotate-90 transition-transform duration-500"
                />
              </div>
              <div className="mt-8 md:mt-0">
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">
                  {mod.title[0]}
                  <br />
                  {mod.title[1]}
                </h3>
                <p className="text-white/50 text-sm font-mono leading-relaxed border-l border-white/20 pl-3 whitespace-pre-line">
                  {mod.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
