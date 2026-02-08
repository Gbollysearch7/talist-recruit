import { Box } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-[#121212]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-white" strokeWidth={2} />
          <span className="text-sm font-bold tracking-widest uppercase">
            Talist.ai
          </span>
        </div>

        <div className="flex gap-8 font-mono text-xs uppercase text-white/40">
          <a className="hover:text-white transition-colors" href="/about">
            About
          </a>
          <a className="hover:text-white transition-colors" href="/privacy">
            Privacy
          </a>
          <a className="hover:text-white transition-colors" href="/terms">
            Terms
          </a>
          <a className="hover:text-white transition-colors" href="/contact">
            Contact
          </a>
        </div>

        <div className="text-xs font-mono text-white/20">
          &copy; {new Date().getFullYear()} TALIST.AI
        </div>
      </div>
    </footer>
  );
}
