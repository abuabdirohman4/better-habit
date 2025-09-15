"use client";

import { useState, useEffect, useMemo } from "react";
import { Habit } from "@/lib/types";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import { getHabitIcon, getHabitCardColor, getHabitTextColor } from "@/utils/habit-icons";
import { DAYS_OF_WEEK } from "@/utils/constants";

interface HabitCardProps {
    habit: Habit;
    className?: string;
    targetDate?: string; // Optional date prop for viewing specific dates
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, className = "", targetDate }) => {
    const { isCompletedOnDate, toggleCompletion, isLoading, logs } = useHabitLogs(
        habit.id
    );
    const [isCompleted, setIsCompleted] = useState(false);

    // Check if habit is completed on target date
    useEffect(() => {
        // Use target date if provided, otherwise use today
        let dateToCheck: string;
        
        if (targetDate) {
            dateToCheck = targetDate;
        } else {
            // Use local date instead of UTC to match database
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            dateToCheck = `${year}-${month}-${day}`;
        }

        const completed = isCompletedOnDate(dateToCheck);
        setIsCompleted(completed);
    }, [isCompletedOnDate, habit.id, targetDate]);

    // Calculate weekly progress (7 days around target date)
    const weeklyProgress = useMemo(() => {
        const weekDays = [];
        
        // Use target date if provided, otherwise use today
        let referenceDate: Date;
        if (targetDate) {
            referenceDate = new Date(targetDate + 'T00:00:00');
        } else {
            referenceDate = new Date();
        }
        
        // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const currentDay = referenceDate.getDay();
        
        // Calculate days since Monday (if current day is Sunday, go back 6 days to get Monday)
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
        
        // Get Monday of the week containing the reference date
        const monday = new Date(referenceDate);
        monday.setDate(referenceDate.getDate() - daysSinceMonday);
        
        // Get 7 days starting from Monday
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateString = `${year}-${month}-${day}`;
            
            weekDays.push({
                date: dateString,
                completed: isCompletedOnDate(dateString),
                dayName: DAYS_OF_WEEK[i],
                isTargetDate: targetDate ? dateString === targetDate : dateString === new Date().toISOString().split('T')[0]
            });
        }
        
        return weekDays;
    }, [isCompletedOnDate, targetDate]);
    const completedCount = weeklyProgress.filter(day => day.completed).length;

    const handleToggleCompletion = async () => {
        try {
            // Use target date if provided, otherwise use today
            let dateToToggle: string;
            
            if (targetDate) {
                dateToToggle = targetDate;
            } else {
                // Use local date instead of UTC to match database
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day = String(today.getDate()).padStart(2, "0");
                dateToToggle = `${year}-${month}-${day}`;
            }

            const result = await toggleCompletion(dateToToggle);

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

    const formatReminderTime = (time?: string) => {
        if (!time) return "";
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-5 border border-gray-100 ${className}`}>
            {/* Main Content */}
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getHabitCardColor(habit.iconName)} transition-all duration-300 hover:scale-110`}>
                    <div className="text-2xl text-white drop-shadow-sm">
                        {getHabitIcon(habit.iconName)}
                    </div>
                </div>

                {/* Habit Details */}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {habit.displayName}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                        {habit.description}
                        {habit.reminderTime && habit.isReminderOn && (
                            <span>
                                {" "}
                                • {formatReminderTime(habit.reminderTime)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="flex space-x-2">
                            {weeklyProgress.map((day, index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 rounded-full transition-all duration-200 relative ${
                                        day.completed 
                                            ? "bg-habit-green" 
                                            : "bg-gray-200"
                                    }`}
                                    title={`${day.dayName} - ${day.date} ${day.completed ? '(Completed)' : '(Not completed)'} ${day.isTargetDate ? '(Selected date)' : ''}`}
                                />
                            ))}
                        </div>
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
