"use client";

import { useState, useEffect, useMemo } from "react";
import { useHabits } from "@/hooks/useHabits";
import { useAllHabitLogs } from "@/hooks/useHabitLogs";
import { useSetGlobalLoading } from "@/hooks/useGlobalLoading";
import Spinner from "@/components/Spinner";
import HabitCard from "@/components/HabitCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { habits, isLoading, error } = useHabits();
    const { logs, isLoading: logsLoading } = useAllHabitLogs();
    const setGlobalLoading = useSetGlobalLoading();
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
    
    // State for selected date navigation
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    });

    // Update global loading state
    useEffect(() => {
        setGlobalLoading(isLoading || logsLoading);
    }, [isLoading, logsLoading, setGlobalLoading]);

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

    // Get active habits for filtering
    const activeHabits = habits.filter((habit: any) => habit.isActive);
    
    // Helper functions for date navigation
    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayString = today.toISOString().split('T')[0];
        const yesterdayString = yesterday.toISOString().split('T')[0];
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        if (dateString === todayString) return "Today";
        if (dateString === yesterdayString) return "Yesterday";
        if (dateString === tomorrowString) return "Tomorrow";
        
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const currentDate = new Date(selectedDate + 'T00:00:00');
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const day = String(newDate.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);
    };

    // Calculate selected date's progress
    const selectedDateProgress = useMemo(() => {
        const selectedDateLogs = logs.filter((log: any) => log.date === selectedDate);
        const completedHabitIds = selectedDateLogs.map((log: any) => log.habitId);
        const completedCount = activeHabits.filter((habit: any) => 
            completedHabitIds.includes(habit.id)
        ).length;
        
        const totalHabits = activeHabits.length;
        const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
        
        return {
            totalHabits,
            completedCount,
            percentage
        };
    }, [logs, activeHabits, selectedDate]);

    // Loading is now handled by splash screen

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
                            Let&apos;s build great habits today!
                        </p>
                    </div>
                </div>

                {/* Selected Date Progress Section */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-lg">{formatDisplayDate(selectedDate)}&apos;s Progress</p>
                        <p className="text-sm font-bold">
                            {selectedDateProgress.totalHabits > 0
                                ? `${selectedDateProgress.completedCount} of ${selectedDateProgress.totalHabits} completed`
                                : "No habits for this date"}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-habit-yellow rounded-full flex items-center justify-center">
                        <p className="text-base font-bold text-white">
                            {selectedDateProgress.totalHabits > 0 ? `${selectedDateProgress.percentage}%` : "0%"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* Habits Section with Date Navigation */}
                <div className="mt-10 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {formatDisplayDate(selectedDate)}
                        </h2>
                        <div className="flex items-center gap-2">
                            {/* Date Navigation */}
                            <button
                                onClick={() => navigateDate('prev')}
                                className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                                title="Previous Day"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            
                            <button
                                onClick={() => navigateDate('next')}
                                className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                                title="Next Day"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {activeHabits.length === 0 ? (
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
                                const timeActiveHabits = habits.filter((habit: any) => habit.timeOfDay === timeOfDay && habit.isActive);
                                
                                if (timeActiveHabits.length === 0) return null;

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
                                                ({timeActiveHabits.length} habit{timeActiveHabits.length !== 1 ? 's' : ''})
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
                                                {timeActiveHabits.map((habit: any) => (
                                                    <HabitCard 
                                                        key={habit.id} 
                                                        habit={habit} 
                                                        targetDate={selectedDate}
                                                    />
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
