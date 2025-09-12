"use client";

import { useState, useEffect } from "react";
import { useHabits } from "@/hooks/useHabits";
import Spinner from "@/components/Spinner";
import WeeklyProgress from "@/components/WeeklyProgress";
import HabitCard from "@/components/HabitCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { habits, isLoading, error } = useHabits();
    const router = useRouter();
    
    // Initialize state from localStorage or default values
    const getInitialCollapseState = (): Record<string, boolean> => {
        if (typeof window === 'undefined') {
            // Server-side rendering fallback
            return {
                Morning: false,
                Afternoon: false,
                Evening: false,
                "All Day": false,
            };
        }

        try {
            const savedState = localStorage.getItem('dashboard-collapse-state');
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error('Error loading collapse state from localStorage:', error);
        }

        // Default state if no saved state
        return {
            Morning: false,
            Afternoon: false,
            Evening: false,
            "All Day": false,
        };
    };

    // State for collapsed sections
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(getInitialCollapseState);

    // Save collapse state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const saveCollapseState = () => {
            try {
                localStorage.setItem('dashboard-collapse-state', JSON.stringify(collapsedSections));
            } catch (error) {
                console.error('Error saving collapse state to localStorage:', error);
            }
        };

        saveCollapseState();
    }, [collapsedSections]);

    const toggleSection = (timeOfDay: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [timeOfDay]: !prev[timeOfDay]
        }));
    };

    // Show loading while fetching habits
    if (isLoading) {
        return (
            <main className="bg-white pt-56">
                <div className="flex justify-center items-center min-h-64">
                    <Spinner className="h-28 w-28" />
                </div>
            </main>
        );
    }

    // Show error state
    if (error) {
        return (
            <main className="bg-white pt-24 px-7">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold">Error Loading Habits</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-habit-blue to-habit-purple px-7 py-8 text-white rounded-b-3xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">
                            Good Morning!
                        </h1>
                        <p className="text-white/90">
                            Let&apos;s build great habits today
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Today's Progress Section */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-lg">Today&apos;s Progress</p>
                        <p className="text-sm font-bold">
                            {habits.filter((h: any) => h.isActive).length > 0
                                ? `${Math.floor(Math.random() * habits.length) + 1} of ${habits.length} completed`
                                : "No habits today"}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-habit-yellow rounded-full flex items-center justify-center">
                        <p className="text-base font-bold text-white">
                            {habits.length > 0 ? "33%" : "0"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* Today's Habits Section */}
                <div className="mt-10 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Today&apos;s Habits
                        </h2>
                        <div className="flex gap-2">
                        <button
                                onClick={() => router.push("/manage-habits")}
                                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                        >
                            <svg
                                    className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                                Manage
                        </button>
                        </div>
                    </div>

                    {habits.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                No Habits Yet
                            </h3>
                            <p className="text-gray-500">
                                Start building better habits by adding your
                                first one
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Group habits by time of day */}
                            {["Morning", "Afternoon", "Evening", "All Day"].map((timeOfDay) => {
                                const timeHabits = habits.filter((habit: any) => habit.timeOfDay === timeOfDay);
                                
                                if (timeHabits.length === 0) return null;

                                return (
                                    <div key={timeOfDay} className="bg-white rounded-2xl p-4 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group border border-transparent hover:border-blue-200">
                                        <div 
                                            className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -m-2 transition-colors"
                                            onClick={() => toggleSection(timeOfDay)}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                timeOfDay === "Morning" ? "bg-orange-100" :
                                                timeOfDay === "Afternoon" ? "bg-yellow-100" :
                                                timeOfDay === "Evening" ? "bg-indigo-100" :
                                                "bg-gray-100"
                                            }`}>
                                                <span className={`text-lg ${
                                                    timeOfDay === "Morning" ? "text-orange-600" :
                                                    timeOfDay === "Afternoon" ? "text-yellow-600" :
                                                    timeOfDay === "Evening" ? "text-indigo-600" :
                                                    "text-gray-600"
                                                }`}>
                                                    {timeOfDay === "Morning" ? "🌅" :
                                                     timeOfDay === "Afternoon" ? "☀️" :
                                                     timeOfDay === "Evening" ? "🌙" :
                                                     "⏰"}
                                                </span>
                                            </div>
                                            <h3 className={`text-lg font-semibold ${
                                                timeOfDay === "Morning" ? "text-orange-600" :
                                                timeOfDay === "Afternoon" ? "text-yellow-600" :
                                                timeOfDay === "Evening" ? "text-indigo-600" :
                                                "text-gray-600"
                                            }`}>
                                                {timeOfDay}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                ({timeHabits.length} habit{timeHabits.length !== 1 ? 's' : ''})
                                            </span>
                                            <div className="ml-auto">
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-200 ${
                                                        collapsedSections[timeOfDay] ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        {!collapsedSections[timeOfDay] && (
                                            <div className="space-y-3 mt-4">
                                                {timeHabits.map((habit: any) => (
                                <HabitCard key={habit.id} habit={habit} />
                            ))}
                        </div>
                    )}
                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
