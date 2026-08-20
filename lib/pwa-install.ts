"use client";

import { useSyncExternalStore } from "react";

export interface BeforeInstallPromptEvent extends Event {
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    prompt(): Promise<void>;
}

// Store modul-level, bukan zustand — cuma dua nilai dan dipakai dua komponen.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
const listeners = new Set<() => void>();

interface PWASnapshot {
    deferredPrompt: BeforeInstallPromptEvent | null;
    isInstalled: boolean;
}

// Snapshot harus stabil identitasnya, kalau tidak useSyncExternalStore loop tanpa henti.
let snapshot: PWASnapshot = { deferredPrompt, isInstalled };

const emit = () => {
    snapshot = { deferredPrompt, isInstalled };
    listeners.forEach((l) => l());
};

export const setDeferredPrompt = (e: BeforeInstallPromptEvent | null) => {
    deferredPrompt = e;
    emit();
};

export const setIsInstalled = (v: boolean) => {
    isInstalled = v;
    emit();
};

export const isStandalone = (): boolean => {
    if (typeof window === "undefined") return false;
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true
    );
};

export const isIOS = (): boolean =>
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
};

const SERVER_SNAPSHOT: PWASnapshot = {
    deferredPrompt: null,
    isInstalled: false,
};

export const usePWAInstall = () =>
    useSyncExternalStore(
        subscribe,
        () => snapshot,
        () => SERVER_SNAPSHOT
    );
