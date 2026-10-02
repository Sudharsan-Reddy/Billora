"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  IconCheck,
  IconTrendingUp,
  IconArrowRight,
} from "@/components/Icons";

export default function LoginPage() {
  const { login, register, demoLogin, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [email, setEmail] = useState("alex.morgan@billora.io");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        if (!email.trim() || !password.trim()) {
          setErrorMessage("Please enter both email and password.");
          setSubmitting(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setErrorMessage("Please complete all required fields.");
          setSubmitting(false);
          return;
        }
        await register(name, email, password, company);
      }
    } catch {
      setErrorMessage("Authentication failed. Please check your credentials.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Visual Preview (hidden on small devices) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-950 text-white overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-indigo-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Billora v2.5 Live
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Smarter billing. Faster payouts.
            </h2>
            <p className="mt-3 text-sm text-indigo-200/80 leading-relaxed">
              Create professional invoices in seconds, automate payment reminders, and monitor cashflow in real time.
            </p>
          </div>

          {/* Floating Metric Card Preview */}
          <div className="relative z-10 my-8 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-200">Monthly Invoiced</span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <IconTrendingUp className="w-3.5 h-3.5" /> +24.8%
              </span>
            </div>
            <div className="text-2xl font-black tracking-tight text-white">$48,250.00</div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400 w-3/4 rounded-full" />
            </div>
            <p className="text-[11px] text-indigo-200/70">92% invoices settled within 7 days</p>
          </div>

          {/* Feature List */}
          <div className="relative z-10 space-y-2.5 text-xs text-indigo-100/90">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-emerald-300">
                <IconCheck className="w-3.5 h-3.5" />
              </div>
              <span>Custom PDF branding & localized currencies</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-emerald-300">
                <IconCheck className="w-3.5 h-3.5" />
              </div>
              <span>Automated client reminders & status webhooks</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-emerald-300">
                <IconCheck className="w-3.5 h-3.5" />
              </div>
              <span>Bank-grade 256-bit encryption & compliance</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create your Billora account"}
                </h1>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {mode === "login"
                  ? "Enter your credentials or use 1-click demo access below"
                  : "Start invoicing clients in minutes with zero setup fees"}
              </p>
            </div>

            {/* Quick Demo Sign In Bar */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  ⚡ 1-Click Instant Demo Login
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">No typing required</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => demoLogin("admin")}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-500 hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Alex (Finance Lead)
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("freelancer")}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-500 hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Samantha (Agency)
                </button>
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Design Studio"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Password *
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => alert("For this demo, any password or the demo buttons work!")}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
              </div>

              {mode === "login" && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-zinc-300 dark:border-zinc-700 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    Remember this device for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In to Dashboard" : "Create Billora Account"}</span>
                    <IconArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-500">
              By proceeding, you agree to Billora’s Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
