"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  IconUser,
  IconMail,
  IconMapPin,
  IconCheck,
  IconShield,
  IconDollar,
  IconSettings,
  IconLogOut,
} from "@/components/Icons";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "notifications" | "security">("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable Profile fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [company, setCompany] = useState(user?.company || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");

  // Invoicing preferences
  const [currency, setCurrency] = useState(user?.currency || "USD ($)");
  const [taxRate, setTaxRate] = useState(user?.taxRate || 10);
  const [paymentTerms, setPaymentTerms] = useState(user?.paymentTerms || "Net 30");
  const [taxId, setTaxId] = useState(user?.taxId || "US-EIN-98421045");

  // Notifications
  const [notifs, setNotifs] = useState({
    invoicePaid: user?.notifications?.invoicePaid ?? true,
    overdueAlert: user?.notifications?.overdueAlert ?? true,
    weeklySummary: user?.notifications?.weeklySummary ?? true,
    clientViewed: user?.notifications?.clientViewed ?? false,
  });

  // Password state for security tab
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      company,
      location,
      bio,
    });
    showToast("Profile details updated successfully!");
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      currency,
      taxRate: Number(taxRate),
      paymentTerms,
      taxId,
    });
    showToast("Invoicing & billing preferences updated!");
  };

  const handleToggleNotif = (key: keyof typeof notifs) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    updateProfile({
      notifications: updated,
    });
    showToast("Notification preferences updated.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      showToast("Passwords do not match!");
      return;
    }
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    showToast("Password changed successfully.");
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {toastMessage}
          </div>
        )}

        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-zinc-950 text-white border border-indigo-900/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl border-2 border-white/20">
                {user?.avatarInitials || "AM"}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {user?.plan}
                  </span>
                </div>
                <p className="text-sm text-indigo-200 mt-1">
                  {user?.role} at <strong className="text-white">{user?.company}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-indigo-300/80">
                  <span className="flex items-center gap-1.5">
                    <IconMail className="w-3.5 h-3.5" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconMapPin className="w-3.5 h-3.5" />
                    {user?.location}
                  </span>
                  <span>Joined {user?.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2">
              <button
                type="button"
                onClick={() => showToast("Account data archive sent to " + user?.email)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-semibold transition-all text-center"
              >
                Export Account Data
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <IconLogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Profile Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <IconUser className="w-4 h-4" />
            General Profile
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "billing"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <IconDollar className="w-4 h-4" />
            Billing Defaults
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "notifications"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <IconSettings className="w-4 h-4" />
            Notifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <IconShield className="w-4 h-4" />
            Security & Actions
          </button>
        </div>

        {/* Tab 1: General Profile Details */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Personal & Business Details
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Update your identity and business information visible on outgoing client invoices.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Business Address / Office Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Professional Bio / Invoice Footer Note
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <IconCheck className="w-4 h-4" />
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Billing & Invoicing Defaults */}
        {activeTab === "billing" && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Invoicing & Financial Settings
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Set default tax rates, currency, and standard payment schedules for new invoices.
              </p>
            </div>

            <form onSubmit={handleSaveBilling} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                    <option value="AUD ($)">AUD ($) - Australian Dollar</option>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Standard Tax / VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Default Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="Due on Receipt">Due on Receipt (Immediate)</option>
                    <option value="Net 15">Net 15 (Within 15 days)</option>
                    <option value="Net 30">Net 30 (Standard 30 days)</option>
                    <option value="Net 60">Net 60 (60 days terms)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tax ID / VAT Registration
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <IconCheck className="w-4 h-4" />
                  Save Billing Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Notification Toggles */}
        {activeTab === "notifications" && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Email & System Notifications
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Choose when and how Billora sends you billing alerts and summaries.
              </p>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-4">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Payment Received Confirmation
                  </p>
                  <p className="text-xs text-zinc-500">
                    Receive an immediate email confirmation whenever a client settles an invoice.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotif("invoicePaid")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifs.invoicePaid ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifs.invoicePaid ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Overdue Account Reminders
                  </p>
                  <p className="text-xs text-zinc-500">
                    Get alerted 3 days before an invoice becomes overdue and on the due date.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotif("overdueAlert")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifs.overdueAlert ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifs.overdueAlert ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Weekly Financial Digest
                  </p>
                  <p className="text-xs text-zinc-500">
                    Receive an executive weekly breakdown of incoming cash flow, pending invoices, and totals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotif("weeklySummary")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifs.weeklySummary ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifs.weeklySummary ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Client Read Receipts
                  </p>
                  <p className="text-xs text-zinc-500">
                    Get notified when a client opens and views your invoice link for the first time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotif("clientViewed")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifs.clientViewed ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifs.clientViewed ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Actions */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Update Account Password
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Ensure your account uses a strong, random password.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Danger Zone / Session Actions */}
            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8">
              <h2 className="text-base font-bold text-rose-700 dark:text-rose-400">
                Danger Zone & Sessions
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Log out of all other devices or reset local demo data.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("billora_auth_user");
                    window.location.reload();
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  Reset Demo Data
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
                >
                  Log Out Everywhere
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
