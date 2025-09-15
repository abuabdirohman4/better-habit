"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Hide splash screen after 2 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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
