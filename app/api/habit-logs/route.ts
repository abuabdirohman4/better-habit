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
