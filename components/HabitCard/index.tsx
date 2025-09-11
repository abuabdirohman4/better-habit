"use client";

import { useState, useEffect } from "react";
import { Habit } from "@/lib/types";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import { getHabitIcon, getHabitCardColor, getHabitTextColor } from "@/utils/habit-icons";

interface HabitCardProps {
    habit: Habit;
    className?: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, className = "" }) => {
    const { isCompletedOnDate, toggleCompletion, isLoading } = useHabitLogs(
        habit.id
    );
    const [isCompleted, setIsCompleted] = useState(false);

    // Check if habit is completed today
    useEffect(() => {
        // Use local date instead of UTC to match database
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayString = `${year}-${month}-${day}`;

        const completed = isCompletedOnDate(todayString);
        setIsCompleted(completed);
    }, [isCompletedOnDate, habit.id]);

    const handleToggleCompletion = async () => {
        try {
            // Use local date instead of UTC to match database
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const todayString = `${year}-${month}-${day}`;

            const result = await toggleCompletion(todayString, habit.goalValue);

            // Update state based on the result
            if (result) {
                // Log was created, so habit is now completed
                setIsCompleted(true);
            } else {
                // Log was removed, so habit is now not completed
                setIsCompleted(false);
            }
        } catch (error) {
            console.error("Error toggling habit completion:", error);
        }
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
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-5 border border-gray-100 ${className}`}
        >
            {/* Main Content */}
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getHabitCardColor(habit.iconName)} transition-all duration-300 hover:scale-110`}
                >
                    <div className="text-2xl text-white drop-shadow-sm">
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
                            0 day streak
                        </span>
                    </div>
                </div>

                {/* Completion Button */}
                <button
                    onClick={handleToggleCompletion}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        isCompleted
                            ? "bg-gradient-to-r from-habit-green to-habit-blue text-white shadow-lg shadow-habit-green/30"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 border-2 border-gray-200 hover:border-gray-300"
                    }`}
                >
                    {isCompleted ? (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HabitCard;
