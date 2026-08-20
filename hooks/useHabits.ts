import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { Habit, CreateHabitData } from "@/lib/types";

const supabase = createClient();

export const useHabits = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "habits",
        async (): Promise<Habit[]> => {
            const { data, error } = await supabase
                .from("habits")
                .select("*")
                .order("sort_order");
            if (error) throw error;
            return data;
        }
    );

    const createHabit = async (habitData: CreateHabitData) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not signed in");

        const { data: newHabit, error } = await supabase
            .from("habits")
            .insert({ ...habitData, user_id: user.id })
            .select()
            .single();
        if (error) throw error;

        mutate((current) => [...(current || []), newHabit as Habit], false);
        return newHabit as Habit;
    };

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
        const { data: updatedHabit, error } = await supabase
            .from("habits")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;

        mutate(
            (current) =>
                (current || []).map((habit) =>
                    habit.id === id ? (updatedHabit as Habit) : habit
                ),
            false
        );
        return updatedHabit as Habit;
    };

    const deleteHabit = async (id: string) => {
        // Completions first — FK on habit_completions.habit_id has no cascade.
        const { error: completionsError } = await supabase
            .from("habit_completions")
            .delete()
            .eq("habit_id", id);
        if (completionsError) throw completionsError;

        const { error } = await supabase.from("habits").delete().eq("id", id);
        if (error) throw error;

        mutate(
            (current) => (current || []).filter((habit) => habit.id !== id),
            false
        );
    };

    return {
        habits: data || [],
        isLoading,
        error: error?.message,
        createHabit,
        updateHabit,
        deleteHabit,
        mutate,
    };
};
