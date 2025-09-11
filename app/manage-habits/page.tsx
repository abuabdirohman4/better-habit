"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faArchive,
    faTrash,
    faEye,
    faEyeSlash,
    faPlus,
    faSearch,
    faFilter,
    faSort,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ManageHabitsPage() {
    const { habits, isLoading, error, updateHabit, deleteHabit } = useHabits();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "active" | "archived">("all");
    const [filterCategory, setFilterCategory] = useState<"all" | "Health" | "Spiritual" | "Development Self" | "To Dont List">("all");
    const [filterTimeOfDay, setFilterTimeOfDay] = useState<"all" | "Morning" | "Afternoon" | "Evening" | "All Day">("all");
    const [sortBy, setSortBy] = useState<"name" | "created" | "category" | "timeOfDay">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedHabits, setSelectedHabits] = useState<number[]>([]);

    // Filter and sort habits
    const filteredHabits = habits
        ?.filter((habit: Habit) => {
            const matchesSearch = habit.displayName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterType === "all" ||
                (filterType === "active" && habit.isActive) ||
                (filterType === "archived" && !habit.isActive);
            const matchesCategory = 
                filterCategory === "all" || habit.category === filterCategory;
            const matchesTimeOfDay = 
                filterTimeOfDay === "all" || habit.timeOfDay === filterTimeOfDay;
            return matchesSearch && matchesFilter && matchesCategory && matchesTimeOfDay;
        })
        .sort((a: Habit, b: Habit) => {
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.displayName.localeCompare(b.displayName);
                    break;
                case "created":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
                case "timeOfDay":
                    comparison = a.timeOfDay.localeCompare(b.timeOfDay);
                    break;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        }) || [];

    const handleToggleSelection = (habitId: number) => {
        setSelectedHabits((prev) =>
            prev.includes(habitId)
                ? prev.filter((id) => id !== habitId)
                : [...prev, habitId]
        );
    };

    const handleSelectAll = () => {
        if (selectedHabits.length === filteredHabits.length) {
            setSelectedHabits([]);
        } else {
            setSelectedHabits(filteredHabits.map((habit: Habit) => habit.id));
        }
    };

    const handleArchiveHabit = async (habitId: number) => {
        try {
            await updateHabit(habitId, { isActive: false });
        } catch (error) {
            console.error("Failed to archive habit:", error);
        }
    };

    const handleRestoreHabit = async (habitId: number) => {
        try {
            await updateHabit(habitId, { isActive: true });
        } catch (error) {
            console.error("Failed to restore habit:", error);
        }
    };

    const handleDeleteHabit = async (habitId: number) => {
        if (confirm("Are you sure you want to permanently delete this habit?")) {
            try {
                await deleteHabit(habitId);
            } catch (error) {
                console.error("Failed to delete habit:", error);
            }
        }
    };

    const handleBulkArchive = async () => {
        if (confirm(`Archive ${selectedHabits.length} selected habits?`)) {
            try {
                await Promise.all(
                    selectedHabits.map((habitId) =>
                        updateHabit(habitId, { isActive: false })
                    )
                );
                setSelectedHabits([]);
            } catch (error) {
                console.error("Failed to archive habits:", error);
            }
        }
    };

    const handleBulkRestore = async () => {
        if (confirm(`Restore ${selectedHabits.length} selected habits?`)) {
            try {
                await Promise.all(
                    selectedHabits.map((habitId) =>
                        updateHabit(habitId, { isActive: true })
                    )
                );
                setSelectedHabits([]);
            } catch (error) {
                console.error("Failed to restore habits:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (confirm(`Permanently delete ${selectedHabits.length} selected habits?`)) {
            try {
                await Promise.all(
                    selectedHabits.map((habitId) => deleteHabit(habitId))
                );
                setSelectedHabits([]);
            } catch (error) {
                console.error("Failed to delete habits:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-600">Loading habits...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Error Loading Habits
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Manage Habits
                            </h1>
                            <p className="mt-1 text-gray-600">
                                View, edit, and organize your habits
                            </p>
                        </div>
                        <Link
                            href="/add-habit"
                            className="btn btn-primary gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search habits..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faFilter}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <select
                                value={filterType}
                                onChange={(e) =>
                                    setFilterType(e.target.value as "all" | "active" | "archived")
                                }
                                className="select select-bordered w-full pl-10"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value as "all" | "Health" | "Spiritual" | "Development Self" | "To Dont List")
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="all">All Categories</option>
                                <option value="Health">Health</option>
                                <option value="Spiritual">Spiritual</option>
                                <option value="Development Self">Development Self</option>
                                <option value="To Dont List">To Dont List</option>
                            </select>
                        </div>

                        {/* Time of Day Filter */}
                        <div className="relative">
                            <select
                                value={filterTimeOfDay}
                                onChange={(e) =>
                                    setFilterTimeOfDay(e.target.value as "all" | "Morning" | "Afternoon" | "Evening" | "All Day")
                                }
                                className="select select-bordered w-full"
                            >
                                <option value="all">All Times</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                                <option value="All Day">All Day</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faSort}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as "name" | "created" | "category" | "timeOfDay")
                                }
                                className="select select-bordered w-full pl-10"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="created">Sort by Created</option>
                                <option value="category">Sort by Category</option>
                                <option value="timeOfDay">Sort by Time</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <button
                            onClick={() =>
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                            className="btn btn-outline gap-2"
                        >
                            <FontAwesomeIcon icon={faSort} />
                            {sortOrder === "asc" ? "A-Z" : "Z-A"}
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedHabits.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-blue-800 font-medium">
                                {selectedHabits.length} habit(s) selected
                            </span>
                            <div className="flex gap-2">
                                {filterType === "active" && (
                                    <button
                                        onClick={handleBulkArchive}
                                        className="btn btn-warning btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faArchive} />
                                        Archive
                                    </button>
                                )}
                                {filterType === "archived" && (
                                    <button
                                        onClick={handleBulkRestore}
                                        className="btn btn-success btn-sm gap-2"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                        Restore
                                    </button>
                                )}
                                <button
                                    onClick={handleBulkDelete}
                                    className="btn btn-error btn-sm gap-2"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Habits List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredHabits.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                No habits found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || filterType !== "all"
                                    ? "Try adjusting your search or filter"
                                    : "Create your first habit to get started"}
                            </p>
                            <Link
                                href="/add-habit"
                                className="btn btn-primary"
                            >
                                Add
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedHabits.length ===
                                                    filteredHabits.length &&
                                                    filteredHabits.length > 0
                                                }
                                                onChange={handleSelectAll}
                                                className="checkbox"
                                            />
                                        </th>
                                        <th>Habit</th>
                                        <th>Category</th>
                                        <th>Time</th>
                                        <th>Frequency</th>
                                        <th>Goal</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHabits.map((habit: Habit) => (
                                        <HabitRow
                                            key={habit.id}
                                            habit={habit}
                                            isSelected={selectedHabits.includes(
                                                habit.id
                                            )}
                                            onToggleSelection={() =>
                                                handleToggleSelection(habit.id)
                                            }
                                            onArchive={() =>
                                                handleArchiveHabit(habit.id)
                                            }
                                            onRestore={() =>
                                                handleRestoreHabit(habit.id)
                                            }
                                            onDelete={() =>
                                                handleDeleteHabit(habit.id)
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-center font-medium text-gray-600 mb-4">
                            Active
                        </div>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-blue-600 text-xl"
                                />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {habits?.filter((h: Habit) => h.isActive).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-sm text-center font-medium text-gray-600 mb-4">
                            Archived
                        </p>
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faArchive}
                                    className="text-gray-600 text-xl"
                                />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {habits?.filter((h: Habit) => !h.isActive).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-center font-medium text-gray-600 mb-4">
                            Total
                        </div>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-green-600 text-xl"
                                />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {habits?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface HabitRowProps {
    habit: Habit;
    isSelected: boolean;
    onToggleSelection: () => void;
    onArchive: () => void;
    onRestore: () => void;
    onDelete: () => void;
}

function HabitRow({
    habit,
    isSelected,
    onToggleSelection,
    onArchive,
    onRestore,
    onDelete,
}: HabitRowProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Health":
                return "badge-success";
            case "Spiritual":
                return "badge-primary";
            case "Development Self":
                return "badge-info";
            case "To Dont List":
                return "badge-error";
            default:
                return "badge-neutral";
        }
    };

    const getTimeOfDayColor = (timeOfDay: string) => {
        switch (timeOfDay) {
            case "Morning":
                return "badge-warning";
            case "Afternoon":
                return "badge-secondary";
            case "Evening":
                return "badge-accent";
            case "All Day":
                return "badge-neutral";
            default:
                return "badge-neutral";
        }
    };

    const getFrequencyText = (habit: Habit) => {
        if (habit.frequencyType === "daily") return "Daily";
        if (habit.frequencyType === "weekly") {
            const days = habit.frequencyDays?.split(",").length || 0;
            return `${days} days/week`;
        }
        if (habit.frequencyType === "custom") {
            const days = habit.frequencyDays?.split(",").length || 0;
            return `${days} days`;
        }
        return "Custom";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <tr className={isSelected ? "bg-blue-50" : ""}>
            <td>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelection}
                    className="checkbox"
                />
            </td>
            <td>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🏃</span>
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {habit.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {habit.iconName}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <span className={`text-white font-bold badge ${getCategoryColor(habit.category)}`}>
                    {habit.category}
                </span>
            </td>
            <td>
                <span className={`text-white font-bold badge ${getTimeOfDayColor(habit.timeOfDay)}`}>
                    {habit.timeOfDay}
                </span>
            </td>
            <td>
                <span className="text-sm text-gray-600">
                    {getFrequencyText(habit)}
                </span>
            </td>
            <td>
                <span className="text-sm text-gray-600">
                    {habit.goalValue} {habit.goalUnit}
                </span>
            </td>
            <td>
                <span
                    className={`text-white font-bold badge ${
                        habit.isActive ? "badge-success" : "badge-warning"
                    }`}
                >
                    {habit.isActive ? "Active" : "Archived"}
                </span>
            </td>
            <td>
                <span className="text-sm text-gray-600">
                    {formatDate(habit.createdAt)}
                </span>
            </td>
            <td>
                <div className="flex gap-1">
                    <Link
                        href={`/edit-habit/${habit.id}`}
                        className="btn btn-ghost btn-sm"
                        title="Edit"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    {habit.isActive ? (
                        <button
                            onClick={onArchive}
                            className="btn btn-ghost btn-sm text-warning"
                            title="Archive"
                        >
                            <FontAwesomeIcon icon={faArchive} />
                        </button>
                    ) : (
                        <button
                            onClick={onRestore}
                            className="btn btn-ghost btn-sm text-success"
                            title="Restore"
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="btn btn-ghost btn-sm text-error"
                        title="Delete"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
