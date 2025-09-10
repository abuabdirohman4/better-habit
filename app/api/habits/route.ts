import { NextRequest, NextResponse } from "next/server";
import { CreateHabitData, Habit } from "@/lib/types";
import { googleSheets } from "@/lib/google-sheets";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const HABITS_SHEET = "Habits";

export async function GET() {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        // Get habits from Google Sheets
        const habitsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            HABITS_SHEET
        );

        // Transform CSV data to Habit objects
        const habits: Habit[] = habitsData.map((row: any, index: number) => {
            return {
                id: parseInt(row.id) || index + 1,
                displayName: row.displayName || row.displayname || "",
                iconName: row.iconName || row.iconname || "",
                type: (row.type as "do" | "dont") || "do",
                frequencyType:
                    row.frequencyType ||
                    (row.frequencytype as "daily" | "weekly" | "custom") ||
                    "daily",
                frequencyDays: row.frequencyDays || row.frequencydays || "",
                reminderTime: row.reminderTime || row.remindertime || "07:00",
                isReminderOn:
                    row.isReminderOn === "true" ||
                    row.isreminderon === "true" ||
                    row.isReminderOn === true,
                goalValue: parseInt(row.goalValue || row.goalvalue) || 0,
                goalUnit: row.goalUnit || row.goalunit || "minutes",
                isActive:
                    row.isActive === "true" ||
                    row.isactive === "true" ||
                    row.isActive === true,
                createdAt:
                    row.createdAt || row.createdat || new Date().toISOString(),
            };
        });

        return NextResponse.json({ data: habits });
    } catch (error) {
        console.error("Error fetching habits:", error);
        return NextResponse.json(
            { error: "Failed to fetch habits" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
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
