"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import {
    CreateHabitData,
    Habit,
    CATEGORIES,
    FREQUENCIES,
} from "@/lib/types";
import Input from "@/components/Input";
import Toggle from "@/components/Toggle";

export default function EditHabitPage() {
    const router = useRouter();
    const params = useParams();
    const { habits, updateHabit, isLoading } = useHabits();

    const habitId = params.id as string;
    const currentHabit = habits.find((h: Habit) => h.id === habitId);

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentHabit) {
            setFormData({
                name: currentHabit.name,
                description: currentHabit.description,
                category: currentHabit.category,
                frequency: currentHabit.frequency,
                tracking_type: currentHabit.tracking_type,
                daily_target: currentHabit.daily_target,
                monthly_goal: currentHabit.monthly_goal,
                target_time: currentHabit.target_time,
            });
        }
    }, [currentHabit]);

    const handleInputChange = (field: keyof CreateHabitData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter a habit name");
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
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter habit name"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Category
                        </h2>
                        <select
                            value={formData.category}
                            onChange={(e) =>
                                handleInputChange("category", e.target.value)
                            }
                            className="select select-bordered w-full capitalize"
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
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Habit Type
                        </h2>
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
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Frequency
                        </h2>
                        <div className="flex gap-4">
                            {FREQUENCIES.map((frequency) => (
                                <label
                                    key={frequency}
                                    className="flex items-center capitalize"
                                >
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={frequency}
                                        checked={
                                            formData.frequency === frequency
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "frequency",
                                                e.target.value
                                            )
                                        }
                                        className="radio radio-primary mr-2"
                                    />
                                    <span>{frequency}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Targets */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Targets
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    Daily target
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
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    Monthly goal
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
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Target Time */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Target Time (optional)
                        </h2>
                        <input
                            type="time"
                            value={formData.target_time || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "target_time",
                                    e.target.value || null
                                )
                            }
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Description
                        </h2>
                        <Input
                            type="text"
                            value={formData.description || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="e.g. 30 minutes workout, Read 20 pages, No smoking"
                            className="w-full"
                        />
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
