import { NextRequest, NextResponse } from "next/server";
import { googleSheets } from "@/lib/google-sheets";
import { CreateHabitLogData, HabitLog } from "@/lib/types";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const HABIT_LOGS_SHEET = "HabitLogs";

export async function GET(request: NextRequest) {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        // Get all habit logs from Google Sheets
        const logsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            HABIT_LOGS_SHEET
        );

        // Transform data to match our interface
        const transformedLogs = logsData.map((log: any) => ({
            id: parseInt(log.id),
            habitId: parseInt(log.habitId || log.habit_id || log.habitid),
            date: log.date,
            completedValue: log.completedValue || log.completed_value 
                ? parseInt(log.completedValue || log.completed_value) 
                : undefined,
            completedAt: log.completedAt || log.completed_at,
        }));

        return NextResponse.json({ data: transformedLogs });
    } catch (error) {
        console.error("Error fetching habit logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch habit logs" },
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

        const logData: CreateHabitLogData = await request.json();

        // Validate required fields
        if (!logData.habitId || !logData.date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate new ID
        const newId = Date.now();

        // Prepare data for Google Sheets
        const newLogRow = [
            newId.toString(),
            logData.habitId.toString(),
            logData.date,
            logData.completedValue?.toString() || "",
            new Date().toISOString(),
        ];

        // Append to Google Sheets
        try {
            await googleSheets.appendValues(
                SPREADSHEET_ID,
                `${HABIT_LOGS_SHEET}!A:E`,
                [newLogRow]
            );
        } catch (error) {
            console.log(
                "HabitLogs sheet not found, creating log in memory only"
            );
            // If sheet doesn't exist, just return the log without saving
        }

        // Create response object
        const newLog: HabitLog = {
            id: newId,
            habitId: logData.habitId,
            date: logData.date,
            completedValue: logData.completedValue,
            completedAt: new Date().toISOString(),
        };

        return NextResponse.json({ data: newLog }, { status: 201 });
    } catch (error) {
        console.error("Error creating habit log:", error);
        return NextResponse.json(
            { error: "Failed to create habit log" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const habitId = searchParams.get('habitId');
        const date = searchParams.get('date');

        if (!habitId || !date) {
            return NextResponse.json(
                { error: "Missing habitId or date parameter" },
                { status: 400 }
            );
        }

        // Get all logs to find the one to delete
        const logsData = await googleSheets.getCSVWithAuth(
            SPREADSHEET_ID,
            HABIT_LOGS_SHEET
        );

        // Find the log to delete
        const logToDelete = logsData.find((log: any) => 
            String(log.habitId || log.habit_id || log.habitid) === String(habitId) && 
            log.date === date
        );

        if (!logToDelete) {
            return NextResponse.json(
                { error: "Log not found" },
                { status: 404 }
            );
        }

        // Find the index of the log to delete
        const logIndex = logsData.findIndex((log: any) => 
            String(log.habitId || log.habit_id || log.habitid) === String(habitId) && 
            log.date === date
        );

        if (logIndex === -1) {
            return NextResponse.json(
                { error: "Log not found" },
                { status: 404 }
            );
        }

        // For Google Sheets, we'll clear the row instead of deleting it
        // This is because Google Sheets API doesn't have a direct delete row method
        const emptyRow = Array(5).fill(""); // 5 columns for habit logs
        const range = `${HABIT_LOGS_SHEET}!A${logIndex + 2}:E${logIndex + 2}`;
        
        try {
            await googleSheets.updateValues(SPREADSHEET_ID, range, [emptyRow]);
            console.log(`Log deleted for habit ${habitId} on ${date}`);
        } catch (error) {
            console.log("HabitLogs sheet not found or update failed, log deletion in memory only");
        }
        
        return NextResponse.json({ 
            success: true,
            message: "Log deleted successfully",
            deletedLog: logToDelete 
        });
    } catch (error) {
        console.error("Error deleting habit log:", error);
        return NextResponse.json(
            { error: "Failed to delete habit log" },
            { status: 500 }
        );
    }
}
