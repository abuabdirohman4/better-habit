import { useState, useEffect } from "react";
import { useHabits } from "./useHabits";
import { useHabitLogs } from "./useHabitLogs";

export const useWeeklyProgress = () => {
    const [currentWeek, setCurrentWeek] = useState<number[]>([]);
    const { habits } = useHabits();

    useEffect(() => {
        if (!habits || habits.length === 0) {
            setCurrentWeek([]);
            return;
        }

        const calculateWeekProgress = async () => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

            const weekData = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dateString = date.toISOString().split("T")[0];

                let completedHabits = 0;
                let totalHabits = 0;

                for (const habit of habits) {
                    if (habit.isActive) {
                        totalHabits++;

                        try {
                            // Check if habit was completed on this date
                            const response = await fetch(
                                `/api/habits/${habit.id}/logs`
                            );
                            if (response.ok) {
                                const { data: logs } = await response.json();
                                const logForDate = logs.find(
                                    (log: any) => log.date === dateString
                                );
                                if (logForDate) {
                                    completedHabits++;
                                }
                            }
                        } catch (error) {
                            // If API fails, skip this habit
                            console.error(
                                `Error fetching logs for habit ${habit.id}:`,
                                error
                            );
                        }
                    }
                }

                const completion =
                    totalHabits > 0
                        ? Math.round((completedHabits / totalHabits) * 100)
                        : 0;
                weekData.push(completion);
            }
            setCurrentWeek(weekData);
        };

        calculateWeekProgress();
    }, [habits]);

    const averageProgress = Math.round(
        currentWeek.reduce((sum, val) => sum + val, 0) / currentWeek.length
    );

    return {
        currentWeek,
        averageProgress,
        isLoading: currentWeek.length === 0,
    };
};
