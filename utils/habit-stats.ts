import { Habit, HabitCompletion } from "@/lib/types";

// Tanggal "hari ini" versi WIB — samakan dengan better-planner (dua app baca DB yang sama).
export const todayWIB = (): string =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export const toDateString = (date: Date): string =>
    date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

// Tanggal yang completion-nya sudah mencapai daily_target.
export const buildCompletedDates = (
    completions: HabitCompletion[],
    dailyTarget: number
): Set<string> => {
    const counts = new Map<string, number>();
    for (const c of completions) {
        counts.set(c.date, (counts.get(c.date) ?? 0) + 1);
    }
    const dates = new Set<string>();
    counts.forEach((n, date) => {
        if (n >= Math.max(1, dailyTarget)) dates.add(date);
    });
    return dates;
};

// Apakah habit jatuh tempo pada tanggal ini?
// daily = tiap hari; weekly = sekali per minggu (dianggap due Senin);
// flexible = tidak pernah wajib harian, dinilai lewat monthly_goal.
export const isDueOn = (habit: Habit, date: string): boolean => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "weekly") {
        return new Date(date + "T00:00:00").getDay() === 1; // Monday
    }
    return false;
};

const DAY_MS = 86400000;

// Hari sejak completion terakhir. null = belum pernah sama sekali.
export const daysSinceLastCompletion = (
    completions: HabitCompletion[],
    today: string
): number | null => {
    if (completions.length === 0) return null;
    let last = completions[0].date;
    for (const c of completions) if (c.date > last) last = c.date;
    return Math.round(
        (new Date(today + "T00:00:00").getTime() -
            new Date(last + "T00:00:00").getTime()) /
            DAY_MS
    );
};

export const STALE_DAYS = 30;

// Habit aktif yang lama tak tersentuh — kandidat arsip.
export const findStaleHabits = (
    habits: Habit[],
    completions: HabitCompletion[],
    today: string
): Array<{ habit: Habit; days: number | null }> => {
    const byHabit = new Map<string, HabitCompletion[]>();
    for (const c of completions) {
        if (!byHabit.has(c.habit_id)) byHabit.set(c.habit_id, []);
        byHabit.get(c.habit_id)!.push(c);
    }

    return habits
        .filter((h) => !h.is_archived)
        .map((habit) => ({
            habit,
            days: daysSinceLastCompletion(byHabit.get(habit.id) ?? [], today),
        }))
        .filter(({ days }) => days === null || days >= STALE_DAYS)
        .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));
};

// Progress bulan berjalan terhadap monthly_goal.
export const monthlyProgress = (
    habit: Habit,
    completions: HabitCompletion[],
    year: number,
    month: number // 1-based
): { completed: number; goal: number; percentage: number } => {
    const prefix = `${year}-${String(month).padStart(2, "0")}-`;
    const dates = buildCompletedDates(
        completions.filter((c) => c.date.startsWith(prefix)),
        habit.daily_target
    );
    const completed = dates.size;
    const goal = habit.monthly_goal;
    return {
        completed,
        goal,
        percentage: goal > 0 ? Math.round((completed / goal) * 100) : 0,
    };
};
