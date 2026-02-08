import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-4 py-12">
      {/* Branding */}
      <Link href="/" className="mb-10 block">
        <h1
          className="text-center font-mono text-2xl font-bold tracking-[0.3em] text-white"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          TALIST.AI
        </h1>
        <div className="mt-1.5 h-[2px] w-full bg-white" />
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md border-2 border-[#333333] bg-[#121212] p-8">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} TALIST.AI &mdash; All rights reserved.
      </p>
    </div>
  );
}
