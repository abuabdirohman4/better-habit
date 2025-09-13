import { useCallback } from "react";
import useSWR from "swr";
import { HabitLog, CreateHabitLogData } from "@/lib/types";

// Hook untuk mengambil semua habit logs
export const useAllHabitLogs = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/habit-logs",
        async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch habit logs");
            }
            return response.json();
        },
        {
            revalidateOnFocus: false, // Prevent revalidation on focus
            revalidateOnReconnect: false, // Prevent revalidation on reconnect
            dedupingInterval: 60000, // Cache for 1 minute
        }
    );

    return {
        logs: data?.data || [],
        isLoading,
        error: error?.message,
        mutate,
    };
};

// Hook untuk mengambil habit logs untuk habit tertentu
export const useHabitLogs = (habitId: number) => {
    const { logs, isLoading, mutate } = useAllHabitLogs();
    
    // Filter logs for this specific habit
    const habitLogs = logs.filter((log: any) => log.habitId === habitId);

    const addLog = async (logData: CreateHabitLogData) => {
        try {
            const response = await fetch('/api/habit-logs', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error("Failed to create habit log");
            }

            const { data: newLog } = await response.json();

            // Optimistic update
            mutate((currentData: any) => {
                if (!currentData) return { data: [newLog] };
                return {
                    ...currentData,
                    data: [...currentData.data, newLog],
                };
            }, false);

            return newLog;
        } catch (err) {
            throw err;
        }
    };

    const toggleCompletion = async (date: string, completedValue?: number) => {
        try {
            // Check if log already exists for this date
            const existingLog = habitLogs.find(
                (log: HabitLog) => log.date === date
            );

            if (existingLog) {
                // If log exists, remove it (toggle off)
                try {
                    const response = await fetch(`/api/habit-logs?habitId=${habitId}&date=${date}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to delete habit log");
                    }

                    // Update cache optimistically
                    mutate((currentData: any) => {
                        if (!currentData) return currentData;
                        return {
                            ...currentData,
                            data: currentData.data.filter(
                                (log: HabitLog) => !(log.habitId === habitId && log.date === date)
                            ),
                        };
                    }, false); // false = don't revalidate from server
                    
                    console.log("Log deleted from database and cache");
                    return false; // Return false to indicate habit is now not completed
                } catch (error) {
                    console.error("Error deleting log:", error);
                    // Fallback to cache-only delete
                    mutate((currentData: any) => {
                        if (!currentData) return currentData;
                        return {
                            ...currentData,
                            data: currentData.data.filter(
                                (log: HabitLog) => !(log.habitId === habitId && log.date === date)
                            ),
                        };
                    }, false);
                    return false;
                }
            } else {
                // Create new log
                const logData: CreateHabitLogData = {
                    habitId,
                    date,
                    completedValue,
                };
                await addLog(logData);
                return true; // Return true to indicate habit is now completed
            }
        } catch (err) {
            throw err;
        }
    };

    const getLogForDate = useCallback((date: string): HabitLog | undefined => {
        const log = habitLogs.find((log: HabitLog) => log.date === date);
        return log;
    }, [habitLogs]);

    const isCompletedOnDate = useCallback((date: string): boolean => {
        const completed = !!getLogForDate(date);
        return completed;
    }, [getLogForDate]);

    const getCompletionRate = (): number => {
        if (!habitLogs || habitLogs.length === 0) return 0;

        // Calculate completion rate for the last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentLogs = habitLogs.filter((log: HabitLog) => {
            const logDate = new Date(log.date);
            return logDate >= sevenDaysAgo && logDate <= today;
        });

        return Math.round((recentLogs.length / 7) * 100);
    };

    return {
        logs: habitLogs,
        isLoading,
        error: null,
        addLog,
        toggleCompletion,
        getLogForDate,
        isCompletedOnDate,
        getCompletionRate,
        mutate,
    };
};
