"use client";

import { useState, useEffect } from "react";

interface WeeklyProgressProps {
    className?: string;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ className = "" }) => {
    const [currentWeek, setCurrentWeek] = useState<number[]>([]);

    // Generate mock data for current week
    useEffect(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

        const weekData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            // Mock data: random completion percentage (0-100)
            const completion = Math.floor(Math.random() * 101);
            weekData.push(completion);
        }
        setCurrentWeek(weekData);
    }, []);

    const getDayName = (index: number) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[index];
    };

    const getBarColor = (percentage: number) => {
        if (percentage >= 80) return "bg-success";
        if (percentage >= 60) return "bg-warning";
        return "bg-error";
    };

    const getTextColor = (percentage: number) => {
        if (percentage >= 80) return "text-success";
        if (percentage >= 60) return "text-warning";
        return "text-error";
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Weekly Progress
                </h2>
                <div className="text-sm text-gray-500">
                    {Math.round(
                        currentWeek.reduce((sum, val) => sum + val, 0) /
                            currentWeek.length
                    )}
                    %
                </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between space-x-2 mb-4">
                {currentWeek.map((percentage, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-2"
                    >
                        <div className="w-8 h-20 bg-gray-200 rounded-full relative overflow-hidden">
                            <div
                                className={`absolute bottom-0 w-full rounded-full transition-all duration-300 ${
                                    percentage >= 80
                                        ? "bg-gradient-to-t from-primary to-primary/80"
                                        : percentage >= 60
                                          ? "bg-gradient-to-t from-warning to-warning/80"
                                          : "bg-gradient-to-t from-error to-error/80"
                                }`}
                                style={{ height: `${percentage}%` }}
                            ></div>
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                            {getDayName(index)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyProgress;
