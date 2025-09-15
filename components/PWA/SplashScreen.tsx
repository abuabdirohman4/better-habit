"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
    isLoading?: boolean;
    minDisplayTime?: number; // Minimum display time in milliseconds
}

export default function SplashScreen({ 
    isLoading = false, 
    minDisplayTime = 1500 
}: SplashScreenProps) {
    const [showSplash, setShowSplash] = useState(true);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        // Ensure splash screen shows for minimum time
        const minTimer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, minDisplayTime);

        return () => clearTimeout(minTimer);
    }, [minDisplayTime]);

    useEffect(() => {
        // Hide splash screen when both conditions are met:
        // 1. Minimum display time has elapsed
        // 2. Data loading is complete
        if (minTimeElapsed && !isLoading) {
            setShowSplash(false);
        }
    }, [minTimeElapsed, isLoading]);

    if (!showSplash) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-r from-habit-blue to-habit-purple flex items-center justify-center z-50">
            <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Image 
                        src="/img/logo.svg" 
                        alt="Better Habit Logo" 
                        width={60} 
                        height={60}
                        className="text-white"
                    />
                </div>
                <h1 className="text-2xl font-bold mb-2">Better Habit</h1>
                <p className="text-white/80 text-sm">Building better habits, one day at a time</p>
                
                {/* Loading animation */}
                <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
            </div>
        </div>
    );
}
