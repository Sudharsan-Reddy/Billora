"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  IconInvoice,
  IconPlus,
  IconSearch,
  IconCheck,
  IconClock,
  IconDownload,
  IconTrendingUp,
  IconShield,
  IconX,
  IconUser,
} from "@/components/Icons";

interface InvoiceItem {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  description: string;
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "INV-2024-001",
    clientName: "Acme Cloud Technologies",
    clientEmail: "billing@acmecloud.io",
    amount: 8500,
    currency: "USD",
    date: "2024-03-15",
    dueDate: "2024-04-14",
    status: "paid",
    description: "Enterprise Cloud Architecture Consulting - Q1",
  },
  {
    id: "INV-2024-002",
    clientName: "Starlight Digital Media",
    clientEmail: "accounts@starlightmedia.com",
    amount: 4200,
    currency: "USD",
    date: "2024-03-20",
    dueDate: "2024-04-19",
    status: "pending",
    description: "Full-stack UI/UX redesign & design system",
  },
  {
    id: "INV-2024-003",
    clientName: "FinEdge Capital Partners",
    clientEmail: "invoices@finedge.co",
    amount: 12450,
    currency: "USD",
    date: "2024-02-28",
    dueDate: "2024-03-29",
    status: "overdue",
    description: "API Security Audit & SOC2 Preparation",
  },
  {
    id: "INV-2024-004",
    clientName: "Apex Retail Solutions",
    clientEmail: "finance@apexretail.org",
    amount: 3600,
    currency: "USD",
    date: "2024-03-25",
    dueDate: "2024-04-24",
    status: "paid",
    description: "Point-of-Sale Integration & payment gateway setup",
  },
  {
    id: "INV-2024-005",
    clientName: "Nova Interactive Labs",
    clientEmail: "ops@novalabs.ai",
    amount: 7800,
    currency: "USD",
    date: "2024-03-28",
    dueDate: "2024-04-27",
    status: "pending",
    description: "Machine Learning model optimization & deployment",
  },
  {
    id: "INV-2024-006",
    clientName: "Pulse BioHealth Systems",
    clientEmail: "pay@pulsebio.health",
    amount: 5100,
    currency: "USD",
    date: "2024-03-01",
    dueDate: "2024-03-31",
    status: "paid",
    description: "HIPAA-compliant client dashboard portal",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Invoice Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("2024-04-30");
  const [newDesc, setNewDesc] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Status toggle action
  const handleMarkAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
    showToast(`Invoice #${id} has been marked as PAID.`);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newAmount.trim()) return;

    const newId = `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`;
    const newInv: InvoiceItem = {
      id: newId,
      clientName: newClient,
      clientEmail: newEmail || `${newClient.toLowerCase().replace(/\s+/g, "")}@example.com`,
      amount: parseFloat(newAmount) || 1000,
      currency: "USD",
      date: new Date().toISOString().split("T")[0],
      dueDate: newDueDate,
      status: "pending",
      description: newDesc || "General professional services & deliverables",
    };

    setInvoices([newInv, ...invoices]);
    setIsModalOpen(false);
    setNewClient("");
    setNewEmail("");
    setNewAmount("");
    setNewDesc("");
    showToast(`New Invoice #${newId} created successfully!`);
  };

  // Calculations
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = invoices
    .filter((i) => i.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === "overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter((item) => {
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {toastMessage}
          </div>
        )}

        {/* Welcome Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {user?.company || "Billora Studio"}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Here is your financial and billing health summary for this cycle.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast("Exported 6 invoices as CSV successfully.")}
              type="button"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <IconDownload className="w-4 h-4 text-zinc-500" />
              Export Report
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Billed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-indigo-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Invoiced</span>
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <IconInvoice className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <IconTrendingUp className="w-3.5 h-3.5" />
                <span>+14.5% vs last month</span>
              </div>
            </div>
          </div>

          {/* Paid / Collected */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Paid & Collected</span>
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <IconCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                ${paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {Math.round((paidAmount / (totalBilled || 1)) * 100)}% collection rate
              </div>
            </div>
          </div>

          {/* Pending Collection */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pending Collection</span>
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <IconClock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                ${pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {invoices.filter((i) => i.status === "pending").length} awaiting payment
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-rose-400/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Overdue</span>
              <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <IconShield className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                ${overdueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {invoices.filter((i) => i.status === "overdue").length} requires follow-up
              </div>
            </div>
          </div>
        </div>

        {/* Quick Profile Summary Banner & Short Action */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-md">
              {user?.avatarInitials || "AM"}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Active Organization: {user?.company}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Default Currency: <strong className="text-zinc-800 dark:text-zinc-200">{user?.currency}</strong> • Tax Rate:{" "}
                <strong className="text-zinc-800 dark:text-zinc-200">{user?.taxRate}%</strong> • Payment Terms:{" "}
                <strong className="text-zinc-800 dark:text-zinc-200">{user?.paymentTerms}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NextLink
              href="/profile"
              className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <IconUser className="w-3.5 h-3.5" />
              Manage Profile & Billing Actions
            </NextLink>
          </div>
        </div>

        {/* Invoices List / Operations Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Controls Bar: Search & Status Filters */}
          <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <IconSearch className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full sm:w-auto overflow-x-auto">
              {(["all", "paid", "pending", "overdue"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterStatus === status
                      ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] uppercase font-semibold text-zinc-400 tracking-wider bg-zinc-50/50 dark:bg-zinc-800/30">
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-6">Client</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {inv.id}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {inv.clientName}
                        </div>
                        <div className="text-[11px] text-zinc-400">{inv.description}</div>
                      </td>
                      <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">
                        {inv.dueDate}
                      </td>
                      <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                        ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === "paid"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                              : inv.status === "pending"
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inv.status === "paid"
                                ? "bg-emerald-500"
                                : inv.status === "pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status !== "paid" && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsPaid(inv.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => showToast(`Downloaded PDF for ${inv.id}`)}
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <IconDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Invoice */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <IconX className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  New Invoice
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Generate a new invoice for your client with custom line items.
                </p>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Client or Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Labs Corp"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Client Email
                    </label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Invoice Amount (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Service Description & Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Monthly maintenance & cloud infrastructure audit"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    Save & Issue Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
