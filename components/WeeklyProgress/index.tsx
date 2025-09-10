"use client";

import { useState, useEffect } from "react";
import { useHabits } from "@/hooks/useHabits";
import { useHabitLogs } from "@/hooks/useHabitLogs";

interface WeeklyProgressProps {
    className?: string;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ className = "" }) => {
    const [currentWeek, setCurrentWeek] = useState<number[]>([]);
    const { habits } = useHabits();

    // Calculate real progress data for current week
    useEffect(() => {
        if (!habits || habits.length === 0) return;

        const calculateWeekProgress = async () => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

            const weekData = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dateString = date.toISOString().split("T")[0];

                // Calculate completion percentage for this day
                let completedHabits = 0;
                let totalHabits = 0;

                for (const habit of habits) {
                    if (habit.isActive) {
                        totalHabits++;

                        try {
                            // Check if habit was completed on this date
                            const response = await fetch(
                                `/api/habits/${habit.id}/logs`
                            );
                            if (response.ok) {
                                const { data: logs } = await response.json();
                                const logForDate = logs.find(
                                    (log: any) => log.date === dateString
                                );
                                if (logForDate) {
                                    completedHabits++;
                                }
                            }
                        } catch (error) {
                            // If API fails, skip this habit
                            console.error(
                                `Error fetching logs for habit ${habit.id}:`,
                                error
                            );
                        }
                    }
                }

                const completion =
                    totalHabits > 0
                        ? Math.round((completedHabits / totalHabits) * 100)
                        : 0;
                weekData.push(completion);
            }
            setCurrentWeek(weekData);
        };

        calculateWeekProgress();
    }, [habits]);

    const getDayName = (index: number) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[index];
    };

    const getBarColor = (percentage: number) => {
        if (percentage >= 90) return "from-habit-green to-habit-blue";
        if (percentage >= 80) return "from-habit-blue to-habit-purple";
        if (percentage >= 60) return "from-habit-yellow to-habit-orange";
        if (percentage >= 40) return "from-habit-orange to-habit-red";
        return "from-habit-red to-habit-pink";
    };

    const getBarShadow = (percentage: number) => {
        if (percentage >= 90) return "shadow-habit-green/30";
        if (percentage >= 80) return "shadow-habit-blue/30";
        if (percentage >= 60) return "shadow-habit-yellow/30";
        if (percentage >= 40) return "shadow-habit-orange/30";
        return "shadow-habit-red/30";
    };

    const getTextColor = (percentage: number) => {
        if (percentage >= 90) return "text-habit-green";
        if (percentage >= 80) return "text-habit-blue";
        if (percentage >= 60) return "text-habit-yellow";
        if (percentage >= 40) return "text-habit-orange";
        return "text-habit-red";
    };

    const averageProgress = Math.round(
        currentWeek.reduce((sum, val) => sum + val, 0) / currentWeek.length
    );

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${className}`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Weekly Progress
                </h2>
                <div
                    className={`text-3xl font-bold transition-colors duration-300 ${getTextColor(averageProgress)}`}
                >
                    {averageProgress}%
                </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between space-x-3 mb-4">
                {currentWeek.map((percentage, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-3 group"
                    >
                        <div className="relative">
                            <div className="w-10 h-24 bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner">
                                <div
                                    className={`absolute bottom-0 w-full rounded-2xl transition-all duration-700 ease-out hover:scale-105 bg-gradient-to-t ${getBarColor(percentage)} shadow-lg ${getBarShadow(percentage)}`}
                                    style={{
                                        height: `${percentage}%`,
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                ></div>
                            </div>
                            {/* Percentage Label */}
                            <div
                                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold ${getTextColor(percentage)} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                            >
                                {percentage}%
                            </div>
                        </div>
                        <div className="text-xs font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                            {getDayName(index)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyProgress;
