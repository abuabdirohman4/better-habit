import { useCallback } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { HabitCompletion } from "@/lib/types";

const supabase = createClient();

// Semua completion milik user (RLS membatasi ke user login)
export const useAllHabitLogs = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "habit_completions",
        async (): Promise<HabitCompletion[]> => {
            const { data, error } = await supabase
                .from("habit_completions")
                .select("*")
                .order("date");
            if (error) throw error;
            return data;
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
        }
    );

    return {
        logs: data || [],
        isLoading,
        error: error?.message,
        mutate,
    };
};

// Completion untuk satu habit
export const useHabitLogs = (habitId: string, dailyTarget: number = 1) => {
    const { logs, isLoading, mutate } = useAllHabitLogs();

    const habitLogs = logs.filter(
        (log: HabitCompletion) => log.habit_id === habitId
    );

    const getCountForDate = useCallback(
        (date: string): number =>
            habitLogs.filter((log: HabitCompletion) => log.date === date)
                .length,
        [habitLogs]
    );

    const isCompletedOnDate = useCallback(
        (date: string): boolean => getCountForDate(date) >= dailyTarget,
        [getCountForDate, dailyTarget]
    );

    const toggleCompletion = async (date: string) => {
        const count = getCountForDate(date);

        if (count >= dailyTarget) {
            // Sudah penuh → reset: hapus semua completion habit+tanggal ini
            const { error } = await supabase
                .from("habit_completions")
                .delete()
                .eq("habit_id", habitId)
                .eq("date", date);
            if (error) throw error;

            mutate(
                (current) =>
                    (current || []).filter(
                        (log) => !(log.habit_id === habitId && log.date === date)
                    ),
                false
            );
            return false;
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not signed in");

        const { data: newLog, error } = await supabase
            .from("habit_completions")
            .insert({ habit_id: habitId, user_id: user.id, date })
            .select()
            .single();
        if (error) throw error;

        mutate(
            (current) => [...(current || []), newLog as HabitCompletion],
            false
        );
        return count + 1 >= dailyTarget;
    };

    const getCompletionRate = (): number => {
        if (habitLogs.length === 0) return 0;

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentDays = new Set(
            habitLogs
                .filter((log) => {
                    const logDate = new Date(log.date);
                    return logDate >= sevenDaysAgo && logDate <= today;
                })
                .map((log) => log.date)
        );

        return Math.round((recentDays.size / 7) * 100);
    };

    return {
        logs: habitLogs,
        isLoading,
        error: null,
        getCountForDate,
        isCompletedOnDate,
        toggleCompletion,
        getCompletionRate,
        mutate,
    };
};
