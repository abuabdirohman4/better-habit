"use client";

import { useState } from "react";
import { Habit } from "@/lib/types";

interface HabitCardProps {
    habit: Habit;
    className?: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, className = "" }) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleToggleCompletion = () => {
        setIsCompleted(!isCompleted);
        // TODO: Implement actual toggle functionality with useHabitLogs
    };

    const getHabitIcon = (iconName: string) => {
        // Map icon names to actual icons based on mockup
        const iconMap: { [key: string]: string } = {
            exercise_icon: "⚡",
            book_icon: "📖",
            no_smoking_icon: "🚭",
            water_icon: "💧",
            meditation_icon: "💡",
            sleep_icon: "😴",
            run_icon: "⚡",
            read_icon: "📖",
            default: "✅",
        };
        return iconMap[iconName] || iconMap.default;
    };

    const getHabitCardColor = (iconName: string) => {
        // Map icon names to card colors based on mockup
        const colorMap: { [key: string]: string } = {
            exercise_icon: "bg-card-green",
            book_icon: "bg-card-blue",
            no_smoking_icon: "bg-card-red",
            water_icon: "bg-card-blue",
            meditation_icon: "bg-card-purple",
            sleep_icon: "bg-card-yellow",
            run_icon: "bg-card-green",
            read_icon: "bg-card-blue",
            default: "bg-card-green",
        };
        return colorMap[iconName] || colorMap.default;
    };

    const getHabitTextColor = (iconName: string) => {
        // Map icon names to text colors based on mockup
        const colorMap: { [key: string]: string } = {
            exercise_icon: "text-habit-green",
            book_icon: "text-habit-blue",
            no_smoking_icon: "text-habit-red",
            water_icon: "text-habit-blue",
            meditation_icon: "text-habit-purple",
            sleep_icon: "text-habit-yellow",
            run_icon: "text-habit-green",
            read_icon: "text-habit-blue",
            default: "text-habit-green",
        };
        return colorMap[iconName] || colorMap.default;
    };

    const getHabitTypeColor = (type: "do" | "dont") => {
        return type === "do" ? "text-success" : "text-error";
    };

    const getHabitTypeBg = (type: "do" | "dont") => {
        return type === "do" ? "bg-success/10" : "bg-error/10";
    };

    const formatReminderTime = (time?: string) => {
        if (!time) return "";
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatFrequencyDays = (
        frequencyType: string,
        frequencyDays?: string
    ) => {
        if (frequencyType === "daily") return "Daily";
        if (frequencyType === "weekly" && frequencyDays) {
            const days = frequencyDays.split(",").map(Number);
            const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            return days.map((day) => dayNames[day - 1]).join(", ");
        }
        return frequencyType.charAt(0).toUpperCase() + frequencyType.slice(1);
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 ${className}`}
        >
            {/* Main Content */}
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getHabitCardColor(habit.iconName)}`}
                >
                    <div className="text-2xl text-white">
                        {getHabitIcon(habit.iconName)}
                    </div>
                </div>

                {/* Habit Details */}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {habit.displayName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {habit.goalValue} {habit.goalUnit}
                        {habit.reminderTime && habit.isReminderOn && (
                            <span>
                                {" "}
                                • {formatReminderTime(habit.reminderTime)}
                            </span>
                        )}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getHabitCardColor(habit.iconName)} ${getHabitTextColor(habit.iconName)}`}
                        >
                            {Math.floor(Math.random() * 7) + 1} day streak
                        </span>
                    </div>
                </div>

                {/* Completion Button */}
                <button
                    onClick={handleToggleCompletion}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                            ? "bg-habit-green text-white"
                            : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                    }`}
                >
                    {isCompleted ? (
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
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
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
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HabitCard;
