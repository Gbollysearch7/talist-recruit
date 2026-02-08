"use client";

import { useState } from "react";
import { Box, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "System", href: "#features" },
    { label: "Process", href: "#how-it-works" },
    { label: "Output", href: "#metrics" },
    { label: "Access", href: "#pricing" },
  ];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit">
      {/* Desktop pill nav */}
      <nav className="pill-nav hidden md:flex items-center gap-8 shadow-2xl">
        <a className="flex items-center gap-2" href="/">
          <Box size={18} className="text-white" strokeWidth={2} />
          <span className="font-bold tracking-tight text-sm uppercase">
            Talist.ai
          </span>
        </a>

        <div className="flex items-center gap-6 border-l border-white/20 pl-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium text-white/60 hover:text-white uppercase tracking-[0.15em] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="border-l border-white/20 pl-6">
          <a
            href="/signup"
            className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide"
          >
            Join
          </a>
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="md:hidden pill-nav flex items-center justify-between gap-6 shadow-2xl mx-4">
        <a className="flex items-center gap-2" href="/">
          <Box size={16} className="text-white" strokeWidth={2} />
          <span className="font-bold tracking-tight text-xs uppercase">
            Talist.ai
          </span>
        </a>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 bg-[#121212]/95 backdrop-blur-xl border border-[#333] rounded-2xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xs font-medium text-white/60 hover:text-white uppercase tracking-[0.15em] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2">
              <a
                href="/signup"
                className="block text-center bg-white text-black px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide"
              >
                Join
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
