"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function PWAComponents() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

    useEffect(() => {
        // Install prompt handler
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show install prompt after user engagement
            setTimeout(() => {
                setShowInstallPrompt(false);
            }, 3000); // Show after 3 seconds
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

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    const handleInstallDismiss = () => {
        setShowInstallPrompt(false);
    };

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

            {/* Install Prompt */}
            {showInstallPrompt && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center">
                            <Image src="/img/logo.svg" alt="App Icon" width={45} height={45} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Install Better Habit</h3>
                            <p className="text-xs text-gray-500">Add to home screen for quick access</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={handleInstallClick} 
                            className="flex-1 bg-habit-blue text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-habit-blue/90 transition-colors"
                        >
                            Install
                        </button>
                        <button 
                            onClick={handleInstallDismiss} 
                            className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
