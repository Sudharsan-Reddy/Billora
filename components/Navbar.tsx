"use client";

import React, { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  IconDashboard,
  IconUser,
  IconBell,
  IconLogOut,
} from "./Icons";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated && pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <NextLink href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                  Billora
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1">
                  Billing Suite
                </span>
              </div>
            </NextLink>

            {/* Navigation Links for Authenticated Users */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1.5 ml-4">
                <NextLink
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === "/dashboard"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <IconDashboard className="w-4 h-4" />
                  Dashboard
                </NextLink>

                <NextLink
                  href="/profile"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === "/profile"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <IconUser className="w-4 h-4" />
                  Profile & Settings
                </NextLink>
              </nav>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    type="button"
                    aria-label="Notifications"
                    className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors relative"
                  >
                    <IconBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notifications</span>
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">2 new</span>
                      </div>
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs mt-1">
                        <div className="py-2.5">
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">Invoice #INV-2024-001 Paid</p>
                          <p className="text-zinc-500 mt-0.5">$3,400.00 credited via Stripe</p>
                          <span className="text-[10px] text-zinc-400">10m ago</span>
                        </div>
                        <div className="py-2.5">
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">Invoice #INV-2024-003 Due in 2 days</p>
                          <p className="text-zinc-500 mt-0.5">Acme Cloud Systems ($1,850.00)</p>
                          <span className="text-[10px] text-zinc-400">2h ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    type="button"
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                      {user.avatarInitials || "AM"}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                        {user.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          {user.plan}
                        </span>
                      </div>

                      <NextLink
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <IconDashboard className="w-4 h-4 text-zinc-500" />
                        Dashboard
                      </NextLink>

                      <NextLink
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <IconUser className="w-4 h-4 text-zinc-500" />
                        Profile Details & Actions
                      </NextLink>

                      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        type="button"
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <IconLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NextLink
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all hover:shadow"
                >
                  Sign In
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
