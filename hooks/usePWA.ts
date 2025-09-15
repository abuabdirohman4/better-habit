"use client";

import { useState, useEffect } from "react";

export const usePWA = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if app is already installed
        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
        };

        // Handle online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Handle install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // Check installation status
        checkInstalled();

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const installApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
        }
    };

    const canInstall = !isInstalled && deferredPrompt;

    return {
        isOnline,
        isInstalled,
        canInstall,
        installApp,
    };
};


// Hook for offline habit storage
export const useOfflineHabits = () => {
    const storeHabitCompletion = (habitId: number, date: string, completed: boolean) => {
        const offlineQueue = JSON.parse(localStorage.getItem('habitQueue') || '[]');
        const item = {
            id: Date.now(),
            action: 'toggle_completion',
            habitId,
            date,
            completed,
            timestamp: new Date().toISOString()
        };
        
        offlineQueue.push(item);
        localStorage.setItem('habitQueue', JSON.stringify(offlineQueue));
        
        // Note: Background sync can be implemented later if needed
    };

    const getOfflineQueue = () => {
        return JSON.parse(localStorage.getItem('habitQueue') || '[]');
    };

    const clearOfflineQueue = () => {
        localStorage.removeItem('habitQueue');
    };

    return {
        storeHabitCompletion,
        getOfflineQueue,
        clearOfflineQueue,
    };
};
