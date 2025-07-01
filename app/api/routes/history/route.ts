import { NextResponse } from "next/server";
import HistoryService from "../../services/historyService";
import consoleManager from "../../utils/consoleManager";
import { v4 as uuidv4 } from 'uuid';

// Get all histories (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        let histories;
        if (userId) {
            // Fetch histories for a specific user
            histories = await HistoryService.getHistoriesByUserId(userId);
            consoleManager.log("Fetched histories for user:", userId, histories.length);
        } else {
            // Fetch all histories
            histories = await HistoryService.getAllHistories();
            consoleManager.log("Fetched all histories:", histories.length);
        }

        return NextResponse.json({
            statusCode: 200,
            message: "Histories fetched successfully",
            data: histories,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/histories:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new history (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { userId, package_ref, tlcId } = formData;
        const uid = uuidv4();

        if (!userId || !package_ref) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "All fields are required",
            }, { status: 400 });
        }

        // Save history data in Firestore
        const newHistory = await HistoryService.addHistory({
            uid,
            userId,
            tlcId,
            package_ref,
            status: "active",
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        });

        consoleManager.log("✅ History created successfully:", newHistory);

        return NextResponse.json({
            statusCode: 201,
            message: "History added successfully",
            data: newHistory,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/histories:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
