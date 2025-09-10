import useSWR from "swr";
import { HabitLog, CreateHabitLogData } from "@/lib/types";

export const useHabitLogs = (habitId: number) => {
    // Use real API call
    const { data, error, isLoading, mutate } = useSWR(
        habitId ? `/api/habits/${habitId}/logs` : null,
        async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch habit logs");
            }
            return response.json();
        }
    );

    const addLog = async (logData: CreateHabitLogData) => {
        try {
            const response = await fetch(`/api/habits/${habitId}/logs`, {
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
            const existingLog = data?.data?.find(
                (log: HabitLog) => log.date === date
            );

            if (existingLog) {
                // If log exists, remove it (toggle off)
                mutate((currentData: any) => {
                    if (!currentData) return currentData;
                    return {
                        ...currentData,
                        data: currentData.data.filter(
                            (log: HabitLog) => log.date !== date
                        ),
                    };
                }, false);
                return null;
            } else {
                // Create new log
                const logData: CreateHabitLogData = {
                    habitId,
                    date,
                    completedValue,
                };
                return await addLog(logData);
            }
        } catch (err) {
            throw err;
        }
    };

    const getLogForDate = (date: string): HabitLog | undefined => {
        return data?.data?.find((log: HabitLog) => log.date === date);
    };

    const isCompletedOnDate = (date: string): boolean => {
        return !!getLogForDate(date);
    };

    const getCompletionRate = (): number => {
        if (!data?.data || data.data.length === 0) return 0;

        // Calculate completion rate for the last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentLogs = data.data.filter((log: HabitLog) => {
            const logDate = new Date(log.date);
            return logDate >= sevenDaysAgo && logDate <= today;
        });

        return Math.round((recentLogs.length / 7) * 100);
    };

    return {
        logs: data?.data || [],
        isLoading,
        error: error?.message,
        addLog,
        toggleCompletion,
        getLogForDate,
        isCompletedOnDate,
        getCompletionRate,
        mutate,
    };
};
