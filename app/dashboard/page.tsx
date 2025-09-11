"use client";

import { useHabits } from "@/hooks/useHabits";
import Spinner from "@/components/Spinner";
import WeeklyProgress from "@/components/WeeklyProgress";
import HabitCard from "@/components/HabitCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { habits, isLoading, error } = useHabits();
    const router = useRouter();
    console.log("habits", habits);

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

                {/* Current Streak Card */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm">Current Streak</p>
                        <p className="text-2xl font-bold">7 Days</p>
                    </div>
                    <div className="w-12 h-12 bg-habit-yellow rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-habit-dark"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* Weekly Progress Section */}
                {/* <div className="mb-6">
                    <WeeklyProgress />
                </div> */}

                {/* Today's Habits Section */}
                <div className="mt-10 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Today&apos;s Habits
                        </h2>
                        <button
                            onClick={() => router.push("/add-habit")}
                            className="w-8 h-8 bg-habit-blue rounded-full flex items-center justify-center hover:bg-habit-blue/90 transition-colors"
                        >
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
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
                        <div className="space-y-3">
                            {habits.map((habit: any) => (
                                <HabitCard key={habit.id} habit={habit} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Today's Progress Section */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Today&apos;s Progress
                            </h3>
                            <p className="text-sm text-gray-600">
                                {habits.filter((h: any) => h.isActive).length >
                                0
                                    ? `${Math.floor(Math.random() * habits.length) + 1} of ${habits.length} completed`
                                    : "No habits today"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-habit-blue">
                                {habits.length > 0 ? "33%" : "0%"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
