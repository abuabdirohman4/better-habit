"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import { CreateHabitData, CATEGORIES, FREQUENCIES } from "@/lib/types";
import Input from "@/components/Input";
import Toggle from "@/components/Toggle";

export default function AddHabitPage() {
    const router = useRouter();
    const { createHabit, isLoading } = useHabits();

    const [formData, setFormData] = useState<CreateHabitData>({
        name: "",
        description: "",
        category: "other",
        frequency: "daily",
        tracking_type: "positive",
        daily_target: 1,
        monthly_goal: 20,
        target_time: null,
    });

    const handleInputChange = (field: keyof CreateHabitData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter a habit name");
            return;
        }

        try {
            await createHabit(formData);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating habit:", error);
            alert("Failed to create habit. Please try again.");
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
                <Input
                    type="text"
                    label="Habit Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Morning Run"
                    required
                    className="text-lg"
                    inputClassName="rounded-2xl"
                />

                {/* Category */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) =>
                            handleInputChange("category", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent capitalize"
                    >
                        {CATEGORIES.map((category) => (
                            <option
                                key={category}
                                value={category}
                                className="capitalize"
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Habit Type */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Habit Type
                    </label>
                    <Toggle
                        checked={formData.tracking_type === "negative"}
                        onChange={(checked: boolean) =>
                            handleInputChange(
                                "tracking_type",
                                checked ? "negative" : "positive"
                            )
                        }
                        label={
                            formData.tracking_type === "negative"
                                ? "Quit / To Don't (avoid this)"
                                : "Build (do this)"
                        }
                        color="primary"
                    />
                </div>

                {/* Frequency */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Frequency
                    </label>
                    <div className="flex space-x-3">
                        {FREQUENCIES.map((frequency) => (
                            <button
                                key={frequency}
                                type="button"
                                onClick={() =>
                                    handleInputChange("frequency", frequency)
                                }
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 capitalize ${
                                    formData.frequency === frequency
                                        ? "bg-habit-blue text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {frequency}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Targets */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                            Daily Target
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={99}
                            value={formData.daily_target}
                            onChange={(e) =>
                                handleInputChange(
                                    "daily_target",
                                    Number(e.target.value)
                                )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                            Monthly Goal
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={31}
                            value={formData.monthly_goal}
                            onChange={(e) =>
                                handleInputChange(
                                    "monthly_goal",
                                    Number(e.target.value)
                                )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Target Time */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Target Time (optional)
                    </label>
                    <input
                        type="time"
                        value={formData.target_time || ""}
                        onChange={(e) =>
                            handleInputChange(
                                "target_time",
                                e.target.value || null
                            )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Description (optional)
                    </label>
                    <Input
                        type="text"
                        value={formData.description || ""}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        placeholder="e.g. 30 minutes workout, Read 20 pages, No smoking"
                        className="w-full"
                        inputClassName="rounded-2xl"
                    />
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
