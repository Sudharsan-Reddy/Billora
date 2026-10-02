"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  location: string;
  taxId: string;
  currency: string;
  taxRate: number;
  paymentTerms: string;
  avatarInitials: string;
  bio: string;
  joinedDate: string;
  plan: string;
  notifications: {
    invoicePaid: boolean;
    overdueAlert: boolean;
    weeklySummary: boolean;
    clientViewed: boolean;
  };
}

const DEFAULT_USER: UserProfile = {
  id: "usr_billora_001",
  name: "Alex Morgan",
  email: "alex.morgan@billora.io",
  role: "Finance Director",
  company: "Billora Global Solutions Inc.",
  phone: "+1 (555) 482-9012",
  location: "San Francisco, CA, USA",
  taxId: "US-EIN-98421045",
  currency: "USD ($)",
  taxRate: 10,
  paymentTerms: "Net 30",
  avatarInitials: "AM",
  bio: "Managing cross-border invoices, recurring SaaS billing, and enterprise accounts receivable.",
  joinedDate: "January 2024",
  plan: "Enterprise Pro",
  notifications: {
    invoicePaid: true,
    overdueAlert: true,
    weeklySummary: true,
    clientViewed: false,
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, company: string) => Promise<boolean>;
  demoLogin: (role?: "admin" | "freelancer") => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "billora_auth_user";
const AUTH_EVENT = "billora_auth_change";

function subscribeToAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

let cachedRawUser: string | null = null;
let cachedUser: UserProfile | null = null;

function getClientUserSnapshot(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRawUser) {
      return cachedUser;
    }
    cachedRawUser = raw;
    cachedUser = raw ? (JSON.parse(raw) as UserProfile) : null;
    return cachedUser;
  } catch {
    return null;
  }
}

function getServerUserSnapshot(): UserProfile | null {
  return null;
}

const emptySubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Sync with localStorage without triggering setState in useEffect
  const user = useSyncExternalStore(
    subscribeToAuth,
    getClientUserSnapshot,
    getServerUserSnapshot
  );

  // Safe SSR hydration status
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const router = useRouter();

  const isLoading = !isHydrated || isActionLoading;

  const saveUser = (userData: UserProfile | null) => {
    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new Event(AUTH_EVENT));
    }
  };

  const login = async (email: string, _pass: string): Promise<boolean> => {
    setIsActionLoading(true);
    // Simulate brief network delay
    await new Promise((res) => setTimeout(res, 400));

    // Check if we already have a customized profile in storage or use default
    const existing = localStorage.getItem(STORAGE_KEY);
    let currentUser = DEFAULT_USER;
    if (existing) {
      try {
        currentUser = { ...JSON.parse(existing), email };
      } catch {
        currentUser = { ...DEFAULT_USER, email };
      }
    } else {
      currentUser = { ...DEFAULT_USER, email };
    }

    saveUser(currentUser);
    setIsActionLoading(false);
    router.push("/dashboard");
    return true;
  };

  const register = async (name: string, email: string, _pass: string, company: string): Promise<boolean> => {
    setIsActionLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      name,
      email,
      company: company || "Independent Studio",
      avatarInitials: initials,
      joinedDate: "Today",
    };

    saveUser(newUser);
    setIsActionLoading(false);
    router.push("/dashboard");
    return true;
  };

  const demoLogin = (role: "admin" | "freelancer" = "admin") => {
    if (role === "admin") {
      saveUser(DEFAULT_USER);
    } else {
      saveUser({
        ...DEFAULT_USER,
        id: "usr_freelance_002",
        name: "Samantha Ray",
        email: "samantha@designstudio.co",
        role: "Creative Director",
        company: "Studio Ray Designs",
        currency: "USD ($)",
        taxRate: 8.5,
        avatarInitials: "SR",
        bio: "Brand strategist and UI/UX design consultant for tech startups.",
      });
    }
    router.push("/dashboard");
  };

  const logout = () => {
    saveUser(null);
    router.push("/login");
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updatedData,
      avatarInitials: updatedData.name
        ? updatedData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        : user.avatarInitials,
    };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
