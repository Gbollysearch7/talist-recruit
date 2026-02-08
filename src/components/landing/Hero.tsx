"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

const TYPED_QUERIES = [
  "5 senior React engineers in San Francisco",
  "product designers with fintech experience",
  "ML engineers who worked at FAANG companies",
  "marketing leads in New York, 8+ years exp",
];

export default function Hero() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentQuery = TYPED_QUERIES[queryIndex];
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      const typeChar = () => {
        if (charIndex <= currentQuery.length) {
          setDisplayText(currentQuery.slice(0, charIndex));
          charIndex++;
          timeout = setTimeout(typeChar, 40 + Math.random() * 30);
        } else {
          timeout = setTimeout(() => setIsTyping(false), 2400);
        }
      };
      typeChar();
    } else {
      timeout = setTimeout(() => {
        setDisplayText("");
        setQueryIndex((prev) => (prev + 1) % TYPED_QUERIES.length);
        setIsTyping(true);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [queryIndex, isTyping]);

  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 relative pt-32 pb-20">
      {/* Wireframe spinning icon */}
      <div className="mb-12 opacity-80">
        <Cpu size={96} strokeWidth={0.8} className="wireframe-spin text-white" />
      </div>

      <div className="max-w-5xl w-full text-center flex flex-col items-center space-y-8 z-10">
        {/* Version badge */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full">
            Engine v.1.0
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] text-white">
          TALIST<br />
          <span className="text-white/30">.AI</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed font-mono mt-8">
          Raw candidate discovery. Architectural precision.{" "}
          <br className="hidden md:block" />
          We engineer hiring through brutal efficiency.
        </p>

        {/* Animated search bar */}
        <div className="w-full max-w-2xl mt-10 border-2 border-[#333] bg-[#121212] p-1">
          <div className="flex items-center bg-[#1a1a1a] border border-white/5">
            <div className="flex-1 px-5 py-4 font-mono text-sm md:text-base">
              <span className="text-white/30 mr-1">&gt;</span>
              <span className="text-white">{displayText}</span>
              <span
                className="ml-0.5 inline-block h-5 w-[2px] bg-white align-middle"
                style={{ animation: "typing-cursor 1s step-end infinite" }}
              />
            </div>
            <button className="shrink-0 bg-white text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 pt-6 w-full max-w-md">
          <a
            href="/signup"
            className="w-full sm:w-1/2 px-8 py-4 bg-white hover:bg-gray-200 text-black font-bold text-sm uppercase tracking-widest transition-all border border-white text-center"
          >
            Start Engine
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-1/2 px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold text-sm uppercase tracking-widest transition-all border border-white border-t-0 sm:border-t sm:border-l-0 text-center"
          >
            Protocol
          </a>
        </div>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-px bg-gradient-to-t from-white/20 to-transparent" />
    </section>
  );
}
