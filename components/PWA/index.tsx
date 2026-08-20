"use client";

import { useState, useEffect } from "react";
import {
    setDeferredPrompt,
    setIsInstalled,
    isStandalone,
    type BeforeInstallPromptEvent,
} from "@/lib/pwa-install";

export default function PWAComponents() {
    const [isOnline, setIsOnline] = useState(true);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

    useEffect(() => {
        setIsInstalled(isStandalone());

        // Simpan event-nya saja; tombol install ada di halaman Settings.
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        // Offline/Online handlers
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Service worker update handler
        const handleServiceWorkerUpdate = () => {
            setShowUpdatePrompt(true);
        };

        // Event listeners
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener(
                "controllerchange",
                handleServiceWorkerUpdate
            );
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.removeEventListener(
                    "controllerchange",
                    handleServiceWorkerUpdate
                );
            }
        };
    }, []);

    const handleUpdateClick = () => {
        window.location.reload();
    };

    return (
        <>
            {/* Offline Indicator */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
                    You are currently offline
                </div>
            )}

            {/* Update Available */}
            {showUpdatePrompt && (
                <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 px-4 z-50">
                    <div className="flex items-center justify-center gap-4">
                        <span>New version available</span>
                        <button 
                            onClick={handleUpdateClick}
                            className="bg-white text-blue-500 px-3 py-1 rounded font-medium hover:bg-gray-100 transition-colors"
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}
