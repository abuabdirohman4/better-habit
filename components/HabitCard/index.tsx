"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/lib/types";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import {
    getHabitIcon,
    getHabitCardColor,
} from "@/utils/habit-icons";
import { DAYS_OF_WEEK } from "@/utils/constants";

interface HabitCardProps {
    habit: Habit;
    className?: string;
    targetDate?: string; // Optional date prop for viewing specific dates
}

const localDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    className = "",
    targetDate,
}) => {
    const router = useRouter();
    const { isCompletedOnDate, getCountForDate, toggleCompletion } =
        useHabitLogs(habit.id, habit.daily_target);

    const dateToCheck = targetDate || localDateString(new Date());
    const isCompleted = isCompletedOnDate(dateToCheck);
    const countForDate = getCountForDate(dateToCheck);

    // Weekly progress (Monday-based week around target date)
    const weeklyProgress = useMemo(() => {
        const referenceDate = targetDate
            ? new Date(targetDate + "T00:00:00")
            : new Date();
        const currentDay = referenceDate.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
        const monday = new Date(referenceDate);
        monday.setDate(referenceDate.getDate() - daysSinceMonday);

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateString = localDateString(date);
            weekDays.push({
                date: dateString,
                completed: isCompletedOnDate(dateString),
                dayName: DAYS_OF_WEEK[i],
                isTargetDate: dateString === dateToCheck,
            });
        }
        return weekDays;
    }, [isCompletedOnDate, targetDate, dateToCheck]);

    const handleToggleCompletion = async () => {
        try {
            await toggleCompletion(dateToCheck);
        } catch (error) {
            console.error("Error toggling habit completion:", error);
        }
    };

    const handleCardClick = () => {
        router.push(`/habits/${habit.id}`);
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-5 border border-gray-100 ${className}`}
        >
            <div className="flex items-center space-x-4">
                <div
                    className="flex items-center space-x-4 flex-1 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
                    onClick={handleCardClick}
                >
                    {/* Icon */}
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getHabitCardColor(habit.category)} transition-all duration-300 hover:scale-110`}
                    >
                        <div className="text-2xl text-white drop-shadow-sm">
                            {getHabitIcon(habit.category)}
                        </div>
                    </div>

                    {/* Habit Details */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                            {habit.name}
                        </h3>
                        <div className="text-sm text-gray-600 mb-3">
                            {habit.description}
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
                                        } ${
                                            day.isTargetDate
                                                ? "ring-2 ring-habit-blue ring-offset-1"
                                                : ""
                                        }`}
                                        title={`${day.dayName} - ${day.date} ${day.completed ? "(Completed)" : "(Not completed)"}`}
                                    />
                                ))}
                            </div>
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
                    ) : habit.daily_target > 1 ? (
                        <span className="text-sm font-bold">
                            {countForDate}/{habit.daily_target}
                        </span>
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
