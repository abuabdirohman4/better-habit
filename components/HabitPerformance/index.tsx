"use client";

import { Habit } from "@/lib/types";
import { getHabitIcon, getHabitCardColor, getHabitTextColor } from "@/utils/habit-icons";

interface HabitPerformanceProps {
    habits: Habit[];
    className?: string;
}

interface HabitStats {
    id: number;
    name: string;
    icon: string;
    streak: number;
    successRate: number;
    totalDays: number;
    completedDays: number;
}

export default function HabitPerformance({
    habits,
    className = "",
}: HabitPerformanceProps) {
    // Generate habit stats with real data (currently showing zeros)
    const generateHabitStats = (): HabitStats[] => {
        return habits.map((habit) => ({
            id: habit.id,
            name: habit.displayName,
            icon: habit.iconName,
            streak: 0, // Will be calculated from real data
            successRate: 0, // Will be calculated from real data
            totalDays: 0, // Will be calculated from real data
            completedDays: 0, // Will be calculated from real data
        }));
    };

    const habitStats = generateHabitStats();

    return (
        <div className={`w-full ${className}`}>
            {habitStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No habits to display</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {habitStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
                        >
                            {/* Left side - Icon and Name */}
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getHabitCardColor(
                                        stat.icon
                                    )}`}
                                >
                                    <span className="text-xl">
                                        {getHabitIcon(stat.icon)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {stat.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {stat.completedDays} of {stat.totalDays}{" "}
                                        days
                                    </p>
                                </div>
                            </div>

                            {/* Right side - Stats */}
                            <div className="text-right">
                                <div className="flex items-center space-x-4">
                                    {/* Streak */}
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-habit-blue">
                                            {stat.streak}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Streak
                                        </p>
                                    </div>

                                    {/* Success Rate */}
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-habit-green">
                                            {stat.successRate}%
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Success
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
