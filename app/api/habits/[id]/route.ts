import { NextRequest, NextResponse } from "next/server";
import { Habit } from "@/lib/types";
import { googleSheets } from "@/lib/google-sheets";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const HABITS_SHEET = "Habits";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        const updates: Partial<Habit> = await request.json();
        const habitId = parseInt(params.id);

        // Get current habits to find the one to update
        const habitsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            HABITS_SHEET
        );

        const habitIndex = habitsData.findIndex(
            (row: any) => parseInt(row.id) === habitId
        );

        if (habitIndex === -1) {
            return NextResponse.json(
                { error: "Habit not found" },
                { status: 404 }
            );
        }

        // Update the habit data
        const updatedHabit = {
            ...habitsData[habitIndex],
            ...updates,
        };

        // Convert to Google Sheets format
        const updatedRow = [
            updatedHabit.id.toString(),
            updatedHabit.displayName || updatedHabit.displayname || "",
            updatedHabit.description || "",
            updatedHabit.iconName || updatedHabit.iconname || "",
            updatedHabit.category || "Health",
            updatedHabit.timeOfDay || updatedHabit.timeofday || "All Day",
            updatedHabit.frequencyType || updatedHabit.frequencytype || "daily",
            updatedHabit.frequencyDays || updatedHabit.frequencydays || "",
            updatedHabit.reminderTime || updatedHabit.remindertime || "07:00",
            updatedHabit.isReminderOn ? "1" : "0",
            updatedHabit.isActive ? "1" : "0",
            updatedHabit.createdAt || updatedHabit.createdat || new Date().toISOString(),
        ];

        // Update the specific row in Google Sheets
        const range = `${HABITS_SHEET}!A${habitIndex + 2}:M${habitIndex + 2}`;
        await googleSheets.updateValues(SPREADSHEET_ID, range, [updatedRow]);

        // Create response object
        const responseHabit: Habit = {
            id: updatedHabit.id,
            displayName: updatedHabit.displayName || updatedHabit.displayname || "",
            description: updatedHabit.description || "",
            iconName: updatedHabit.iconName || updatedHabit.iconname || "",
            category: (updatedHabit.category as "Spiritual" | "Health" | "Mind" | "To Dont List") || "Health",
            timeOfDay: (updatedHabit.timeOfDay || updatedHabit.timeofday as "Morning" | "Afternoon" | "Evening" | "All Day") || "All Day",
            frequencyType: (updatedHabit.frequencyType as "daily" | "weekly" | "custom") || "daily",
            frequencyDays: updatedHabit.frequencyDays || updatedHabit.frequencydays || "",
            reminderTime: updatedHabit.reminderTime || updatedHabit.remindertime || "07:00",
            isReminderOn: updatedHabit.isReminderOn || false,
            isActive: updatedHabit.isActive || false,
            createdAt: updatedHabit.createdAt || updatedHabit.createdat || new Date().toISOString(),
        };

        return NextResponse.json({ data: responseHabit });
    } catch (error) {
        console.error("Error updating habit:", error);
        return NextResponse.json(
            { error: "Failed to update habit" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        const habitId = parseInt(params.id);

        // Get current habits to find the one to delete
        const habitsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            HABITS_SHEET
        );

        const habitIndex = habitsData.findIndex(
            (row: any) => parseInt(row.id) === habitId
        );

        if (habitIndex === -1) {
            return NextResponse.json(
                { error: "Habit not found" },
                { status: 404 }
            );
        }

        // For Google Sheets, we'll clear the row instead of deleting it
        // This is because Google Sheets API doesn't have a direct delete row method
        const emptyRow = Array(13).fill(""); // 13 columns for habits
        const range = `${HABITS_SHEET}!A${habitIndex + 2}:M${habitIndex + 2}`;
        await googleSheets.updateValues(SPREADSHEET_ID, range, [emptyRow]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting habit:", error);
        return NextResponse.json(
            { error: "Failed to delete habit" },
            { status: 500 }
        );
    }
}
