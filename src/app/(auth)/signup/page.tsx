"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  // Success state — show verification message
  if (success) {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-white bg-white text-black">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h2 className="mb-2 font-mono text-lg font-bold uppercase tracking-wider text-white">
          Check Your Email
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-white/50">
          We sent a verification link to{" "}
          <span className="font-mono font-bold text-white">{email}</span>.
          Click the link to activate your account and start recruiting.
        </p>

        <div className="border-t border-[#333333] pt-6">
          <p className="text-sm text-white/40">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="font-mono font-bold uppercase tracking-wider text-white underline underline-offset-4 transition-colors hover:text-white/80"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page heading */}
      <h2 className="mb-1 font-mono text-lg font-bold uppercase tracking-wider text-white">
        Create Account
      </h2>
      <p className="mb-8 text-sm text-white/50">
        Start building your recruitment pipeline.
      </p>

      {/* Error display */}
      {error && (
        <div className="mb-6 border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Sign-up form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/60"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className="w-full border-2 border-[#333333] bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/60"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full border-2 border-[#333333] bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/60"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className="w-full border-2 border-[#333333] bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/60"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className="w-full border-2 border-[#333333] bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-white bg-white px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-[#333333]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
          or
        </span>
        <div className="h-[1px] flex-1 bg-[#333333]" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="flex w-full items-center justify-center gap-3 border-2 border-[#333333] bg-[#121212] px-4 py-3 font-mono text-sm uppercase tracking-wider text-white transition-colors hover:border-white"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {/* Login link */}
      <p className="mt-8 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-mono font-bold uppercase tracking-wider text-white underline underline-offset-4 transition-colors hover:text-white/80"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
