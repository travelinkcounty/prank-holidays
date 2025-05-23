import { NextResponse } from "next/server";
import LeadService from "../../services/leadServices";
import consoleManager from "../../utils/consoleManager";

// Get all leads (GET)
export async function GET() {
    try {
        const leads = await LeadService.getAllLeads();
        consoleManager.log("Fetched all leads:", leads.length);
        return NextResponse.json({
            statusCode: 200,
            message: "Leads fetched successfully",
            data: leads,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/leads:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new lead (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newLead = await LeadService.addLead(body);
        consoleManager.log("Lead created successfully:", newLead);
        return NextResponse.json({
            statusCode: 201,
            message: "Lead added successfully",
            data: newLead,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });
    } catch (error: any) {
        consoleManager.error("Error in POST /api/leads:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
