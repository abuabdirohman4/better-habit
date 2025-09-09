"use client";

import { Habit } from "@/lib/types";

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
    // Mock data for habit performance
    const generateHabitStats = (): HabitStats[] => {
        return habits.map((habit) => ({
            id: habit.id,
            name: habit.displayName,
            icon: habit.iconName,
            streak: Math.floor(Math.random() * 15) + 1, // Random streak 1-15
            successRate: Math.floor(Math.random() * 40) + 60, // Random success rate 60-100%
            totalDays: Math.floor(Math.random() * 30) + 10, // Random total days 10-40
            completedDays: Math.floor(Math.random() * 25) + 5, // Random completed days 5-30
        }));
    };

    const habitStats = generateHabitStats();

    // Get habit card color based on icon
    const getHabitCardColor = (icon: string) => {
        const colorMap: { [key: string]: string } = {
            run_icon: "bg-habit-green",
            meditation_icon: "bg-habit-purple",
            water_icon: "bg-habit-blue",
            book_icon: "bg-habit-yellow",
            sleep_icon: "bg-habit-indigo",
            exercise_icon: "bg-habit-red",
        };
        return colorMap[icon] || "bg-habit-blue";
    };

    // Get habit text color
    const getHabitTextColor = (icon: string) => {
        const colorMap: { [key: string]: string } = {
            run_icon: "text-habit-dark",
            meditation_icon: "text-white",
            water_icon: "text-white",
            book_icon: "text-habit-dark",
            sleep_icon: "text-white",
            exercise_icon: "text-white",
        };
        return colorMap[icon] || "text-white";
    };

    // Get icon emoji
    const getIconEmoji = (icon: string) => {
        const iconMap: { [key: string]: string } = {
            run_icon: "🏃‍♂️",
            meditation_icon: "🧘‍♀️",
            water_icon: "💧",
            book_icon: "📚",
            sleep_icon: "😴",
            exercise_icon: "💪",
        };
        return iconMap[icon] || "📝";
    };

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
                                        {getIconEmoji(stat.icon)}
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
