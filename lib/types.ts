export type HabitCategory =
    | "spiritual"
    | "kesehatan"
    | "karir"
    | "keuangan"
    | "relasi"
    | "petualangan"
    | "kontribusi"
    | "other";

export type HabitFrequency = "daily" | "weekly" | "flexible";

export type HabitTrackingType = "positive" | "negative";

export interface Habit {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    category: HabitCategory;
    frequency: HabitFrequency;
    monthly_goal: number;
    tracking_type: HabitTrackingType;
    target_time: string | null;
    is_archived: boolean;
    sort_order: number;
    daily_target: number;
    created_at: string;
    updated_at: string;
}

export interface HabitCompletion {
    id: string;
    habit_id: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    note: string | null;
    created_at: string;
}

export type CreateHabitData = Pick<
    Habit,
    | "name"
    | "description"
    | "category"
    | "frequency"
    | "tracking_type"
    | "daily_target"
    | "monthly_goal"
    | "target_time"
>;

export const CATEGORIES: HabitCategory[] = [
    "spiritual",
    "kesehatan",
    "karir",
    "keuangan",
    "relasi",
    "petualangan",
    "kontribusi",
    "other",
];

export const FREQUENCIES: HabitFrequency[] = ["daily", "weekly", "flexible"];
