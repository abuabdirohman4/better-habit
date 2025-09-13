export interface Habit {
    id: number;
    displayName: string;
    iconName: string;
    category: "Spiritual" | "Health" | "Mind" | "To Dont List";
    timeOfDay: "Morning" | "Afternoon" | "Evening" | "All Day";
    frequencyType: "daily" | "weekly" | "custom";
    frequencyDays?: string; // e.g., "1,2,3,4,5" for weekdays
    reminderTime?: string; // e.g., "07:00"
    isReminderOn: boolean;
    goalValue: number;
    goalUnit: string; // e.g., "minutes", "km", "pages"
    isActive: boolean;
    createdAt: string;
}

export interface HabitLog {
    id: number;
    habitId: number;
    date: string; // YYYY-MM-DD format
    completedValue?: number; // Optional achievement value
    completedAt: string; // Timestamp when completed
}

export interface GoogleSheetsResponse {
    data: any[];
    error?: string;
}

// Helper types for form data
export interface CreateHabitData {
    displayName: string;
    iconName: string;
    category: "Spiritual" | "Health" | "Mind" | "To Dont List";
    timeOfDay: "Morning" | "Afternoon" | "Evening" | "All Day";
    frequencyType: "daily" | "weekly" | "custom";
    frequencyDays?: string;
    reminderTime?: string;
    isReminderOn: boolean;
    goalValue: number;
    goalUnit: string;
}

export interface CreateHabitLogData {
    habitId: number;
    date: string;
    completedValue?: number;
}
