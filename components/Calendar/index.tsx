"use client";

import { useState } from "react";

interface CalendarProps {
    className?: string;
}

interface DayData {
    date: number;
    status: "completed" | "missed" | "today" | "future" | "empty";
}

export default function Calendar({ className = "" }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Day names
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

    // Generate calendar data
    const generateCalendarData = (): DayData[] => {
        const calendarData: DayData[] = [];
        const today = new Date();

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayWeekday; i++) {
            calendarData.push({ date: 0, status: "empty" });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(currentYear, currentMonth, day);
            const isToday =
                dayDate.getDate() === today.getDate() &&
                dayDate.getMonth() === today.getMonth() &&
                dayDate.getFullYear() === today.getFullYear();

            let status: DayData["status"] = "future";

            if (isToday) {
                status = "today";
            } else if (dayDate < today) {
                // No data available - mark as missed
                status = "missed";
            }

            calendarData.push({ date: day, status });
        }

        return calendarData;
    };

    const calendarData = generateCalendarData();

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Get status color
    const getStatusColor = (status: DayData["status"]) => {
        switch (status) {
            case "completed":
                return "bg-habit-green";
            case "missed":
                return "bg-habit-red";
            case "today":
                return "bg-habit-blue";
            case "future":
                return "bg-gray-200";
            case "empty":
                return "bg-transparent";
            default:
                return "bg-gray-200";
        }
    };

    // Get text color
    const getTextColor = (status: DayData["status"]) => {
        switch (status) {
            case "completed":
            case "missed":
            case "today":
                return "text-white";
            case "future":
                return "text-gray-600";
            case "empty":
                return "text-transparent";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {dayNames.map((day, index) => (
                    <div
                        key={index}
                        className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
                    >
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {calendarData.map((day, index) => (
                    <div
                        key={index}
                        className={`h-8 w-8 mx-auto mb-3 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                            day.status === "empty"
                                ? ""
                                : "hover:scale-110 cursor-pointer"
                        } ${getStatusColor(day.status)} ${getTextColor(day.status)}`}
                    >
                        {day.date > 0 && day.date}
                    </div>
                ))}
            </div>

            {/* Calendar Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-habit-green"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-habit-red"></div>
                    <span className="text-sm text-gray-600">Missed</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-habit-blue"></div>
                    <span className="text-sm text-gray-600">Today</span>
                </div>
            </div>
        </div>
    );
}
