import { createContext, useContext } from "react";

export type MobileLayoutPref = "portrait" | "landscape" | "desktop";

export const STORAGE_KEY = "sde-mobile-layout";

export type MobileLayoutContextValue = {
  /** Stored choice; null until user picks on a mobile-capable device */
  pref: MobileLayoutPref | null;
  /** Whether the mobile UI shell (compact chrome + touch tools) is active */
  isMobileShell: boolean;
  /** Whether to show the portrait/landscape chooser */
  showGate: boolean;
  /** Force reopening the gate (toolbar “Layout”) */
  reopenGate: boolean;
  setPref: (pref: MobileLayoutPref) => void;
  openGate: () => void;
  closeGateWithoutChoice: () => void;
};

export const MobileLayoutContext = createContext<MobileLayoutContextValue | null>(
  null
);

/** True when this browser is a good candidate for the mobile shell (Android phone/tablet). */
export function detectMobileCapable(): boolean {
  if (typeof window === "undefined") return false;
  if (window.electronAPI?.isDesktop) return false;
  try {
    return window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  } catch {
    return false;
  }
}

export function readStoredPref(): MobileLayoutPref | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "portrait" || v === "landscape" || v === "desktop") return v;
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function writeStoredPref(pref: MobileLayoutPref | null) {
  try {
    if (pref == null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // ignore
  }
}

export function useMobileLayout(): MobileLayoutContextValue {
  const ctx = useContext(MobileLayoutContext);
  if (!ctx) {
    throw new Error("useMobileLayout must be used within MobileLayoutProvider");
  }
  return ctx;
}
