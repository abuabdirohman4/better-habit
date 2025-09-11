"use client";

import { useHabits } from "@/hooks/useHabits";
import Calendar from "@/components/Calendar";
import HabitPerformance from "@/components/HabitPerformance";
import Spinner from "@/components/Spinner";

export default function StatisticsPage() {
    const { habits, isLoading, error } = useHabits();

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner />
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Error loading statistics
                    </p>
                    <p className="text-gray-500">{error}</p>
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
                        <h1 className="text-3xl font-bold mb-1">Statistics</h1>
                        <p className="text-white/90">
                            Track your habit progress
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Day Streak Card */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Day Streak</p>
                            <p className="text-2xl font-bold">7</p>
                        </div>
                        <div className="w-10 h-10 bg-habit-yellow rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-habit-dark"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Rate Card */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">
                                Success Rate
                            </p>
                            <p className="text-2xl font-bold">85%</p>
                        </div>
                        <div className="w-10 h-10 bg-habit-green rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* This Month Section */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            This Month
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
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
                            <span className="text-lg font-semibold text-gray-800">
                                December 2024
                            </span>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
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

                    {/* Calendar Component */}
                    <Calendar />
                </div>

                {/* Habit Performance Section */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Habit Performance
                    </h2>
                    <HabitPerformance habits={habits} />
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
