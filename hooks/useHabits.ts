import useSWR from "swr";
import { Habit, CreateHabitData } from "@/lib/types";
import { mockHabits } from "@/lib/mock-data";

export const useHabits = () => {
    // Use real API call
    const { data, error, isLoading, mutate } = useSWR(
        "/api/habits",
        async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch habits");
            }
            return response.json();
        },
        {
            fallbackData: { data: mockHabits },
        }
    );

    const createHabit = async (habitData: CreateHabitData) => {
        try {
            const response = await fetch("/api/habits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(habitData),
            });

            if (!response.ok) {
                throw new Error("Failed to create habit");
            }

            const { data: newHabit } = await response.json();

            // Optimistic update
            mutate((currentData: any) => {
                if (!currentData) return { data: [newHabit] };
                return {
                    ...currentData,
                    data: [...currentData.data, newHabit],
                };
            }, false);

            return newHabit;
        } catch (err) {
            throw err;
        }
    };

    const updateHabit = async (id: number, updates: Partial<Habit>) => {
        try {
            const response = await fetch(`/api/habits/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error("Failed to update habit");
            }

            const { data: updatedHabit } = await response.json();

            // Optimistic update
            mutate((currentData: any) => {
                if (!currentData) return { data: [] };
                return {
                    ...currentData,
                    data: currentData.data.map((habit: Habit) =>
                        habit.id === id ? updatedHabit : habit
                    ),
                };
            }, false);

            return updatedHabit;
        } catch (err) {
            throw err;
        }
    };

    const deleteHabit = async (id: number) => {
        try {
            const response = await fetch(`/api/habits/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete habit");
            }

            // Optimistic update
            mutate((currentData: any) => {
                if (!currentData) return { data: [] };
                return {
                    ...currentData,
                    data: currentData.data.filter(
                        (habit: Habit) => habit.id !== id
                    ),
                };
            }, false);
        } catch (err) {
            throw err;
        }
    };

    return {
        habits: data?.data || [],
        isLoading,
        error: error?.message,
        createHabit,
        updateHabit,
        deleteHabit,
        mutate,
    };
};
