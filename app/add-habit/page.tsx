"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import { CreateHabitData } from "@/lib/types";

export default function AddHabitPage() {
    const router = useRouter();
    const { createHabit, isLoading } = useHabits();

    // Form state
    const [formData, setFormData] = useState<CreateHabitData>({
        displayName: "",
        iconName: "run_icon",
        type: "do",
        frequencyType: "daily",
        frequencyDays: "",
        reminderTime: "07:00",
        isReminderOn: false,
        goalValue: 0,
        goalUnit: "minutes",
    });

    // UI state
    const [selectedIcon, setSelectedIcon] = useState("run_icon");
    const [selectedFrequency, setSelectedFrequency] = useState("daily");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);

    // Available icons
    const availableIcons = [
        { id: "run_icon", emoji: "🏃‍♂️", name: "Run" },
        { id: "meditation_icon", emoji: "🧘‍♀️", name: "Meditation" },
        { id: "water_icon", emoji: "💧", name: "Water" },
        { id: "book_icon", emoji: "📚", name: "Read" },
        { id: "sleep_icon", emoji: "😴", name: "Sleep" },
        { id: "exercise_icon", emoji: "💪", name: "Exercise" },
    ];

    // Days of week
    const daysOfWeek = [
        { id: "1", name: "M", fullName: "Monday" },
        { id: "2", name: "T", fullName: "Tuesday" },
        { id: "3", name: "W", fullName: "Wednesday" },
        { id: "4", name: "T", fullName: "Thursday" },
        { id: "5", name: "F", fullName: "Friday" },
        { id: "6", name: "S", fullName: "Saturday" },
        { id: "7", name: "S", fullName: "Sunday" },
    ];

    // Time options
    const timeOptions = [
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
    ];

    // Unit options
    const unitOptions = [
        { value: "minutes", label: "minutes" },
        { value: "hours", label: "hours" },
        { value: "km", label: "km" },
        { value: "pages", label: "pages" },
        { value: "glasses", label: "glasses" },
        { value: "times", label: "times" },
    ];

    // Handle form changes
    const handleInputChange = (field: keyof CreateHabitData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Handle icon selection
    const handleIconSelect = (iconId: string) => {
        setSelectedIcon(iconId);
        handleInputChange("iconName", iconId);
    };

    // Handle frequency selection
    const handleFrequencySelect = (frequency: string) => {
        setSelectedFrequency(frequency);
        handleInputChange("frequencyType", frequency);

        // Reset selected days when changing frequency
        if (frequency === "daily") {
            setSelectedDays([]);
            handleInputChange("frequencyDays", "");
        }
    };

    // Handle day selection
    const handleDayToggle = (dayId: string) => {
        if (selectedFrequency === "daily") return;

        const newSelectedDays = selectedDays.includes(dayId)
            ? selectedDays.filter((d) => d !== dayId)
            : [...selectedDays, dayId];

        setSelectedDays(newSelectedDays);
        handleInputChange("frequencyDays", newSelectedDays.join(","));
    };

    // Handle reminder toggle
    const handleReminderToggle = (enabled: boolean) => {
        setIsReminderEnabled(enabled);
        handleInputChange("isReminderOn", enabled);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createHabit(formData);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating habit:", error);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-7 pt-16 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
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
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add New Habit
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-8">
                {/* Habit Name Section */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Habit Name
                    </label>
                    <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                            handleInputChange("displayName", e.target.value)
                        }
                        placeholder="e.g. Morning Run"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                        required
                    />
                </div>

                {/* Icon Selection Section */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Choose Icon
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {availableIcons.map((icon) => (
                            <button
                                key={icon.id}
                                type="button"
                                onClick={() => handleIconSelect(icon.id)}
                                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                                    selectedIcon === icon.id
                                        ? "border-habit-blue bg-habit-blue/10"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-3xl mb-2">
                                        {icon.emoji}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700">
                                        {icon.name}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frequency Selection Section */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Frequency
                    </label>
                    <div className="flex space-x-3">
                        {["daily", "weekly", "custom"].map((frequency) => (
                            <button
                                key={frequency}
                                type="button"
                                onClick={() => handleFrequencySelect(frequency)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                    selectedFrequency === frequency
                                        ? "bg-habit-blue text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {frequency.charAt(0).toUpperCase() +
                                    frequency.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Days of Week Selection (only for weekly/custom) */}
                {selectedFrequency !== "daily" && (
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                            Days of Week
                        </label>
                        <div className="flex space-x-3">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => handleDayToggle(day.id)}
                                    className={`w-12 h-12 rounded-full font-medium transition-all duration-200 ${
                                        selectedDays.includes(day.id)
                                            ? "bg-habit-blue text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {day.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reminder Settings Section */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Reminder
                    </label>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">
                                Enable reminder
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    handleReminderToggle(!isReminderEnabled)
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isReminderEnabled
                                        ? "bg-habit-blue"
                                        : "bg-gray-200"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isReminderEnabled
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {isReminderEnabled && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time
                                </label>
                                <select
                                    value={formData.reminderTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "reminderTime",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                                >
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Goal Settings Section */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Goal (optional)
                    </label>
                    <div className="flex space-x-3">
                        <input
                            type="number"
                            value={formData.goalValue}
                            onChange={(e) =>
                                handleInputChange(
                                    "goalValue",
                                    parseInt(e.target.value) || 0
                                )
                            }
                            placeholder="e.g. 5"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                            min="0"
                        />
                        <select
                            value={formData.goalUnit}
                            onChange={(e) =>
                                handleInputChange("goalUnit", e.target.value)
                            }
                            className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                        >
                            {unitOptions.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-habit-blue text-white py-4 rounded-2xl font-semibold text-lg hover:bg-habit-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Saving..." : "Save Habit"}
                    </button>
                </div>
            </form>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </main>
    );
}
