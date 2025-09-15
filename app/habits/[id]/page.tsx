"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import Calendar from "@/components/Calendar";
import HabitPerformance from "@/components/HabitPerformance";
import Spinner from "@/components/Spinner";

export default function HabitStatisticsPage() {
    const params = useParams();
    const router = useRouter();
    const habitId = parseInt(params.id as string);
    
    const { habits, isLoading: habitsLoading, error: habitsError } = useHabits();
    const { logs, isLoading: logsLoading, error: logsError } = useHabitLogs(habitId);
    
    // Current month state
    const [currentDate, setCurrentDate] = useState(() => new Date());
    
    // Find the specific habit
    const habit = useMemo(() => {
        return habits.find(h => h.id === habitId);
    }, [habits, habitId]);
    
    // Calculate habit statistics for current month
    const habitStats = useMemo(() => {
        if (!habit || !logs) return null;
        
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Filter logs for current month
        const monthLogs = logs.filter(log => {
            const logDate = new Date(log.date);
            return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });
        
        // Calculate streak (consecutive days)
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);
        
        while (true) {
            const dateString = checkDate.toISOString().split('T')[0];
            const hasLog = logs.some(log => log.date === dateString);
            
            if (hasLog) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        // Calculate success rate for current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const successRate = monthLogs.length > 0 ? Math.round((monthLogs.length / daysInMonth) * 100) : 0;
        
        return {
            streak,
            successRate,
            completedDays: monthLogs.length,
            totalDaysInMonth: daysInMonth
        };
    }, [habit, logs, currentDate]);
    
    // Navigate month
    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };
    
    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (habitsLoading || logsLoading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner />
            </main>
        );
    }

    if (habitsError || logsError) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Error loading habit statistics
                    </p>
                    <p className="text-gray-500">{habitsError || logsError}</p>
                </div>
            </main>
        );
    }
    
    if (!habit) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Habit not found</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-habit-blue text-white px-4 py-2 rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-habit-blue to-habit-purple px-7 py-8 text-white rounded-b-3xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                        >
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{habit.displayName}</h1>
                            <p className="text-white/90">{habit.description}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Day Streak Card */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Day Streak</p>
                            <p className="text-2xl font-bold">{habitStats?.streak || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-habit-yellow rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-habit-dark"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Rate Card */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Success Rate</p>
                            <p className="text-2xl font-bold">{habitStats?.successRate || 0}%</p>
                        </div>
                        <div className="w-10 h-10 bg-habit-green rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* Monthly Calendar Section */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Monthly Progress
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-gray-100 rounded-full"
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
                            <span className="text-lg font-semibold text-gray-800">
                                {formatMonthYear(currentDate)}
                            </span>
                            <button 
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-gray-100 rounded-full"
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

                    {/* Calendar Component */}
                    <Calendar 
                        currentDate={currentDate}
                        habitLogs={logs}
                        habitId={habitId}
                    />
                </div>

                {/* Monthly Summary */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        This Month Summary
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-habit-blue">
                                {habitStats?.completedDays || 0}
                            </p>
                            <p className="text-sm text-gray-600">Days Completed</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-gray-600">
                                {habitStats?.totalDaysInMonth || 0}
                            </p>
                            <p className="text-sm text-gray-600">Total Days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
