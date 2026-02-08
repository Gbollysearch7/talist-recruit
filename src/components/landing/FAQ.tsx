"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does Talist discover candidates?",
    answer:
      "Talist uses AI-powered web search to scan publicly available profiles — LinkedIn, GitHub, portfolios, company pages. We parse your natural language query, find matching profiles, then enrich each result with verified contact data and qualifications.",
  },
  {
    question: "Is the data GDPR compliant?",
    answer:
      "Talist only accesses publicly available information. We don't scrape private data or bypass access controls. All candidate data is stored securely in your account and can be deleted at any time.",
  },
  {
    question: "How accurate is the AI search?",
    answer:
      "Accuracy depends on query specificity. More detail (title, location, skills, experience) means better results. Users report 85-95% relevance for well-specified queries. Each result includes a match score.",
  },
  {
    question: "Can I integrate with my existing ATS?",
    answer:
      "Currently you can export as CSV for import into any ATS. Direct integrations with Greenhouse, Lever, and Ashby are on our roadmap.",
  },
  {
    question: "What's the difference between search and saved candidates?",
    answer:
      "A search is a one-time query returning web results. Saved candidates are profiles you keep — with notes, pipeline stages, lists, and interaction tracking.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from account settings. Access continues until the end of your billing period. Your data is never deleted — it stays available if you return.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16 border-b border-white/10 pb-12">
          <span className="font-mono text-xs text-white/40">
            04 — PROTOCOL
          </span>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white uppercase">
            FAQ
          </h2>
        </div>

        {/* Questions */}
        <div className="flex flex-col">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-white/10 transition-colors ${
                  isOpen ? "bg-white/[0.02]" : ""
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-6 px-4 text-left group"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-white/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-semibold uppercase tracking-tight group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <Minus size={16} className="shrink-0 text-white/40" />
                  ) : (
                    <Plus size={16} className="shrink-0 text-white/40" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-6 pl-14">
                    <p className="text-sm font-mono text-white/50 leading-relaxed border-l border-white/20 pl-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
