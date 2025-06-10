import { NextResponse } from "next/server";
import JoinService from "../../services/joinServices";
import consoleManager from "../../utils/consoleManager";
import { v4 as uuidv4 } from 'uuid';

// Get all joins (GET)
export async function GET() {
    try {
        const joins = await JoinService.getAllJoins();
        consoleManager.log("Fetched all joins:", joins.length);
        return NextResponse.json({
            statusCode: 200,
            message: "Joins fetched successfully",
            data: joins,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/joins:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new join (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const uid = uuidv4();
        const newJoin = await JoinService.addJoin({ ...body, uid });
        consoleManager.log("Join created successfully:", newJoin);
        return NextResponse.json({
            statusCode: 201,
            message: "Join added successfully",
            data: newJoin,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });
    } catch (error: any) {
        consoleManager.error("Error in POST /api/joins:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
