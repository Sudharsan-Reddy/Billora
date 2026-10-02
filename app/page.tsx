"use client";

import React, { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  IconInvoice,
  IconArrowRight,
  IconCheck,
  IconTrendingUp,
  IconShield,
} from "@/components/Icons";

export default function Home() {
  const { isAuthenticated, isLoading, demoLogin } = useAuth();
  const router = useRouter();

  // If user is already authenticated, take them directly to the dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Billora Finance Suite 2.0
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto leading-[1.15]">
            Smarter invoicing. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Faster cash flow for teams.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Billora simplifies billing workflows, automates overdue client follow-ups, and gives you instant visibility into revenue and accounts receivable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <NextLink
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started / Sign In</span>
              <IconArrowRight className="w-4 h-4" />
            </NextLink>

            <button
              type="button"
              onClick={() => demoLogin("admin")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant 1-Click Demo</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-emerald-500" />
              Automated Reminders
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-emerald-500" />
              Multi-Currency (USD, EUR, GBP)
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-emerald-500" />
              SOC-2 & Encryption Compliant
            </span>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <IconInvoice className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Instant Invoicing
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Generate PDF invoices in seconds with custom tax rates, due dates, discounts, and payment terms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <IconTrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Cashflow Analytics
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Track collected revenue, outstanding dues, and overdue accounts in real time with interactive charts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <IconShield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Profile & Team Controls
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Customize company details, tax registration IDs, currency preferences, and notification channels.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <p>© 2024 Billora Billing Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
