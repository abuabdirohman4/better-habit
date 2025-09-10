import { NextRequest, NextResponse } from "next/server";
import { CreateHabitData, Habit } from "@/lib/types";
import { googleSheets } from "@/lib/google-sheets";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const HABITS_SHEET = "Habits";

export async function GET() {
    try {
        if (!SPREADSHEET_ID) {
            console.log(
                "Google Spreadsheet ID not configured, using mock data"
            );
            // Return mock data for development
            const mockHabits: Habit[] = [
                {
                    id: 1,
                    displayName: "Morning Run",
                    iconName: "run_icon",
                    type: "do",
                    frequencyType: "daily",
                    frequencyDays: "",
                    reminderTime: "07:00",
                    isReminderOn: true,
                    goalValue: 5,
                    goalUnit: "km",
                    isActive: true,
                    createdAt: "2024-01-01T00:00:00Z",
                },
                {
                    id: 2,
                    displayName: "Meditation",
                    iconName: "meditation_icon",
                    type: "do",
                    frequencyType: "daily",
                    frequencyDays: "",
                    reminderTime: "08:00",
                    isReminderOn: true,
                    goalValue: 10,
                    goalUnit: "minutes",
                    isActive: true,
                    createdAt: "2024-01-01T00:00:00Z",
                },
            ];
            return NextResponse.json({ data: mockHabits });
        }

        // Get habits from Google Sheets
        const habitsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            `${HABITS_SHEET}!A:K`
        );

        // Transform CSV data to Habit objects
        const habits: Habit[] = habitsData.map((row: any, index: number) => ({
            id: parseInt(row.id) || index + 1,
            displayName: row.displayName || "",
            iconName: row.iconName || "",
            type: (row.type as "do" | "dont") || "do",
            frequencyType:
                (row.frequencyType as "daily" | "weekly" | "custom") || "daily",
            frequencyDays: row.frequencyDays || "",
            reminderTime: row.reminderTime || "07:00",
            isReminderOn:
                row.isReminderOn === "true" || row.isReminderOn === true,
            goalValue: parseInt(row.goalValue) || 0,
            goalUnit: row.goalUnit || "minutes",
            isActive: row.isActive === "true" || row.isActive === true,
            createdAt: row.createdAt || new Date().toISOString(),
        }));

        return NextResponse.json({ data: habits });
    } catch (error) {
        console.error("Error fetching habits:", error);
        // Return mock data as fallback
        const mockHabits: Habit[] = [
            {
                id: 1,
                displayName: "Morning Run",
                iconName: "run_icon",
                type: "do",
                frequencyType: "daily",
                frequencyDays: "",
                reminderTime: "07:00",
                isReminderOn: true,
                goalValue: 5,
                goalUnit: "km",
                isActive: true,
                createdAt: "2024-01-01T00:00:00Z",
            },
        ];
        return NextResponse.json({ data: mockHabits });
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!SPREADSHEET_ID) {
            console.log(
                "Google Spreadsheet ID not configured, using mock response"
            );
            const habitData: CreateHabitData = await request.json();

            // Validate required fields
            if (!habitData.displayName || !habitData.iconName) {
                return NextResponse.json(
                    { error: "Missing required fields" },
                    { status: 400 }
                );
            }

            // Create mock response
            const newHabit: Habit = {
                id: Date.now(),
                displayName: habitData.displayName,
                iconName: habitData.iconName,
                type: habitData.type,
                frequencyType: habitData.frequencyType,
                frequencyDays: habitData.frequencyDays || "",
                reminderTime: habitData.reminderTime || "07:00",
                isReminderOn: habitData.isReminderOn,
                goalValue: habitData.goalValue || 0,
                goalUnit: habitData.goalUnit || "minutes",
                isActive: true,
                createdAt: new Date().toISOString(),
            };

            return NextResponse.json({ data: newHabit }, { status: 201 });
        }

        const habitData: CreateHabitData = await request.json();

        // Validate required fields
        if (!habitData.displayName || !habitData.iconName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate new ID (in real app, you might want to get the next ID from the sheet)
        const newId = Date.now(); // Simple ID generation

        // Prepare data for Google Sheets
        const newHabitRow = [
            newId.toString(),
            habitData.displayName,
            habitData.iconName,
            habitData.type,
            habitData.frequencyType,
            habitData.frequencyDays || "",
            habitData.reminderTime || "07:00",
            habitData.isReminderOn.toString(),
            habitData.goalValue?.toString() || "0",
            habitData.goalUnit || "minutes",
            "true", // isActive
            new Date().toISOString(), // createdAt
        ];

        // Append to Google Sheets
        await googleSheets.appendValues(SPREADSHEET_ID, `${HABITS_SHEET}!A:L`, [
            newHabitRow,
        ]);

        // Create response object
        const newHabit: Habit = {
            id: newId,
            displayName: habitData.displayName,
            iconName: habitData.iconName,
            type: habitData.type,
            frequencyType: habitData.frequencyType,
            frequencyDays: habitData.frequencyDays || "",
            reminderTime: habitData.reminderTime || "07:00",
            isReminderOn: habitData.isReminderOn,
            goalValue: habitData.goalValue || 0,
            goalUnit: habitData.goalUnit || "minutes",
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ data: newHabit }, { status: 201 });
    } catch (error) {
        console.error("Error creating habit:", error);
        return NextResponse.json(
            { error: "Failed to create habit" },
            { status: 500 }
        );
    }
}
