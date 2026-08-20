"use client";

import { useState, useEffect, useMemo } from "react";
import { useHabits } from "@/hooks/useHabits";
import { useAllHabitLogs } from "@/hooks/useHabitLogs";
import { useSetGlobalLoading } from "@/hooks/useGlobalLoading";
import HabitCard from "@/components/HabitCard";
import StaleHabitsBanner from "@/components/StaleHabitsBanner";
import { Habit, HabitCompletion } from "@/lib/types";
import {
    toDateString,
    todayWIB,
    isDueOn,
    findStaleHabits,
} from "@/utils/habit-stats";

const localDateString = toDateString;

export default function DashboardPage() {
    const { habits, isLoading, error, updateHabit } = useHabits();
    const { logs, isLoading: logsLoading } = useAllHabitLogs();
    const setGlobalLoading = useSetGlobalLoading();

    const [selectedDate, setSelectedDate] = useState<string>(() => todayWIB());

    useEffect(() => {
        setGlobalLoading(isLoading || logsLoading);
    }, [isLoading, logsLoading, setGlobalLoading]);

    const activeHabits = habits.filter((habit: Habit) => !habit.is_archived);

    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString + "T00:00:00");
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (dateString === todayWIB()) return "Today";
        if (dateString === localDateString(yesterday)) return "Yesterday";
        if (dateString === localDateString(tomorrow)) return "Tomorrow";

        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });
    };

    const navigateDate = (direction: "prev" | "next") => {
        const currentDate = new Date(selectedDate + "T00:00:00");
        currentDate.setDate(
            currentDate.getDate() + (direction === "next" ? 1 : -1)
        );
        setSelectedDate(localDateString(currentDate));
    };

    // Habit yang jatuh tempo pada tanggal terpilih (daily tiap hari, weekly tiap Senin).
    // Flexible tidak pernah wajib harian — dinilai lewat monthly_goal, bukan di sini.
    const dueHabits = useMemo(
        () => activeHabits.filter((habit: Habit) => isDueOn(habit, selectedDate)),
        [activeHabits, selectedDate]
    );

    // Progress: penyebut = habit yang jatuh tempo, bukan semua habit aktif.
    const selectedDateProgress = useMemo(() => {
        const countByHabit: Record<string, number> = {};
        logs.forEach((log: HabitCompletion) => {
            if (log.date === selectedDate) {
                countByHabit[log.habit_id] =
                    (countByHabit[log.habit_id] || 0) + 1;
            }
        });

        const completedCount = dueHabits.filter(
            (habit: Habit) =>
                (countByHabit[habit.id] || 0) >= habit.daily_target
        ).length;

        // Habit flexible yang dicentang tetap dihitung sebagai bonus.
        const bonusCount = activeHabits.filter(
            (habit: Habit) =>
                !isDueOn(habit, selectedDate) &&
                (countByHabit[habit.id] || 0) >= habit.daily_target
        ).length;

        const totalHabits = dueHabits.length;
        const percentage =
            totalHabits > 0
                ? Math.round((completedCount / totalHabits) * 100)
                : 0;

        return { totalHabits, completedCount, bonusCount, percentage };
    }, [logs, dueHabits, activeHabits, selectedDate]);

    // Habit lama tak tersentuh — kandidat arsip (hanya tampil saat melihat hari ini).
    const staleHabits = useMemo(
        () => findStaleHabits(habits, logs, todayWIB()),
        [habits, logs]
    );

    const handleArchiveStale = async (habitIds: string[]) => {
        await Promise.all(
            habitIds.map((id) => updateHabit(id, { is_archived: true }))
        );
    };

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
                        <p className="text-white/80 text-lg">
                            {formatDisplayDate(selectedDate)}&apos;s Progress
                        </p>
                        <p className="text-sm font-bold">
                            {selectedDateProgress.totalHabits > 0
                                ? `${selectedDateProgress.completedCount} of ${selectedDateProgress.totalHabits} completed`
                                : "No habits due for this date"}
                            {selectedDateProgress.bonusCount > 0
                                ? ` · +${selectedDateProgress.bonusCount} bonus`
                                : ""}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-habit-yellow rounded-full flex items-center justify-center">
                        <p className="text-base font-bold text-white">
                            {selectedDateProgress.totalHabits > 0
                                ? `${selectedDateProgress.percentage}%`
                                : "0%"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                <div className="mt-10">
                    <StaleHabitsBanner
                        stale={staleHabits}
                        onArchive={handleArchiveStale}
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {formatDisplayDate(selectedDate)}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigateDate("prev")}
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
                                onClick={() => navigateDate("next")}
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
                        <div className="space-y-3">
                            {activeHabits.map((habit: Habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    targetDate={selectedDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
