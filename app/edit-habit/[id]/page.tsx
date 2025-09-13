"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import { CreateHabitData, Habit } from "@/lib/types";
import { AVAILABLE_ICONS } from "@/utils/habit-icons";
import Input from "@/components/Input";
import Toggle from "@/components/Toggle";

export default function EditHabitPage() {
    const router = useRouter();
    const params = useParams();
    const { habits, updateHabit, isLoading } = useHabits();
    
    const habitId = parseInt(params.id as string);
    const currentHabit = habits.find((h: Habit) => h.id === habitId);

    // Form state
    const [formData, setFormData] = useState<CreateHabitData>({
        displayName: "",
        iconName: "run_icon",
        category: "Health",
        timeOfDay: "Morning",
        frequencyType: "daily",
        frequencyDays: "",
        reminderTime: "07:00",
        isReminderOn: false,
        goalValue: 0,
        goalUnit: "minutes",
    });

    // UI state
    const [selectedIcon, setSelectedIcon] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("daily");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Available icons
    const availableIcons = AVAILABLE_ICONS;

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
    ];

    // Initialize form with current habit data
    useEffect(() => {
        if (currentHabit) {
            setFormData({
                displayName: currentHabit.displayName,
                iconName: currentHabit.iconName,
                category: currentHabit.category,
                timeOfDay: currentHabit.timeOfDay,
                frequencyType: currentHabit.frequencyType,
                frequencyDays: currentHabit.frequencyDays || "",
                reminderTime: currentHabit.reminderTime || "07:00",
                isReminderOn: currentHabit.isReminderOn,
                goalValue: currentHabit.goalValue,
                goalUnit: currentHabit.goalUnit,
            });

            setSelectedIcon(currentHabit.iconName);
            setSelectedFrequency(currentHabit.frequencyType);
            setIsReminderEnabled(currentHabit.isReminderOn);

            // Parse frequency days
            if (currentHabit.frequencyDays) {
                setSelectedDays(currentHabit.frequencyDays.split(","));
            } else {
                setSelectedDays([]);
            }
        }
    }, [currentHabit]);

    // Handle form input changes
    const handleInputChange = (field: keyof CreateHabitData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle icon selection
    const handleIconSelect = (iconName: string) => {
        setSelectedIcon(iconName);
        handleInputChange("iconName", iconName);
    };

    // Handle frequency type change
    const handleFrequencyChange = (frequency: string) => {
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
        
        if (!formData.displayName.trim()) {
            alert("Please enter a habit name");
            return;
        }

        if (formData.goalValue <= 0) {
            alert("Please enter a valid goal value");
            return;
        }

        if (selectedFrequency !== "daily" && selectedDays.length === 0) {
            alert("Please select at least one day for this frequency");
            return;
        }

        setIsSubmitting(true);

        try {
            await updateHabit(habitId, formData);
            router.push("/manage-habits");
        } catch (error) {
            console.error("Failed to update habit:", error);
            alert("Failed to update habit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading if habit not found yet
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-600">Loading habit...</p>
                </div>
            </div>
        );
    }

    // Show error if habit not found
    if (!currentHabit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Habit Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The habit you&apos;re trying to edit doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.push("/manage-habits")}
                        className="btn btn-primary"
                    >
                        Back to Manage Habits
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
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
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Habit
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Update your habit details
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Habit Name */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Input
                            type="text"
                            label="Habit Name"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            placeholder="Enter habit name"
                            required
                        />
                    </div>

                    {/* Icon Selection */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Choose Icon
                        </h2>
                        <div className="grid grid-cols-6 gap-3">
                            {availableIcons.map((icon) => (
                                <button
                                    key={icon.name}
                                    type="button"
                                    onClick={() => handleIconSelect(icon.name)}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        selectedIcon === icon.name
                                            ? "border-habit-blue bg-habit-blue/10"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <span className="text-2xl">{icon.emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Category
                        </h2>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="Health">Health</option>
                            <option value="Spiritual">Spiritual</option>
                            <option value="Development Self">Development Self</option>
                            <option value="To Dont List">To Dont List</option>
                        </select>
                    </div>

                    {/* Time of Day */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Time of Day
                        </h2>
                        <select
                            value={formData.timeOfDay}
                            onChange={(e) => handleInputChange("timeOfDay", e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                            <option value="All Day">All Day</option>
                        </select>
                    </div>

                    {/* Frequency */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Frequency
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value="daily"
                                        checked={selectedFrequency === "daily"}
                                        onChange={(e) => handleFrequencyChange(e.target.value)}
                                        className="radio radio-primary mr-2"
                                    />
                                    <span>Daily</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value="weekly"
                                        checked={selectedFrequency === "weekly"}
                                        onChange={(e) => handleFrequencyChange(e.target.value)}
                                        className="radio radio-primary mr-2"
                                    />
                                    <span>Weekly</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value="custom"
                                        checked={selectedFrequency === "custom"}
                                        onChange={(e) => handleFrequencyChange(e.target.value)}
                                        className="radio radio-primary mr-2"
                                    />
                                    <span>Custom</span>
                                </label>
                            </div>

                            {/* Day Selection */}
                            {(selectedFrequency === "weekly" || selectedFrequency === "custom") && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Select days:
                                    </p>
                                    <div className="flex gap-2">
                                        {daysOfWeek.map((day) => (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => handleDayToggle(day.id)}
                                                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                                    selectedDays.includes(day.id)
                                                        ? "border-habit-blue bg-habit-blue text-white"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                {day.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Goal
                        </h2>
                        <div className="flex gap-4">
                            <Input
                                type="number"
                                value={formData.goalValue}
                                onChange={(e) => handleInputChange("goalValue", parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className="flex-1"
                                min={1}
                                required
                            />
                            <select
                                value={formData.goalUnit}
                                onChange={(e) => handleInputChange("goalUnit", e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="times">Times</option>
                                <option value="pages">Pages</option>
                                <option value="glasses">Glasses</option>
                                <option value="km">Kilometers</option>
                                <option value="steps">Steps</option>
                                <option value="calories">Calories</option>
                            </select>
                        </div>
                    </div>

                    {/* Reminder */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Reminder
                        </h2>
                        <div className="space-y-4">
                            <Toggle
                                checked={isReminderEnabled}
                                onChange={handleReminderToggle}
                                label="Enable reminder"
                                color="primary"
                            />

                            {isReminderEnabled && (
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        Reminder time:
                                    </label>
                                    <select
                                        value={formData.reminderTime}
                                        onChange={(e) => handleInputChange("reminderTime", e.target.value)}
                                        className="select select-bordered w-full"
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

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-outline flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Updating...
                                </>
                            ) : (
                                "Update Habit"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>
        </div>
    );
}
