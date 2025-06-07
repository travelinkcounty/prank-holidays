import { NextResponse } from "next/server";
import MembershipService from "../../services/membershipServices";
import consoleManager from "../../utils/consoleManager";

// Get all memberships (GET)
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        
        if (userId) {
            const memberships = await MembershipService.getMembershipByUserId(userId);
            consoleManager.log("Fetched memberships for user ID:", userId, memberships.length);
            return NextResponse.json({
                statusCode: 200,
                message: "Memberships fetched successfully",
                data: memberships,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });    
        }

        // Fetch memberships based on status filter
        const memberships = await MembershipService.getAllMemberships();
        consoleManager.log("Fetched all memberships:", memberships.length);

        return NextResponse.json({
            statusCode: 200,
            message: "Memberships fetched successfully",
            data: memberships,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/memberships:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new membership (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { userId, planId, usedDays, usedNights, totalDays, totalNights } = formData;
        
        if (!userId || !planId || !totalDays || !totalNights) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "All fields are required",
            }, { status: 400 });
        }

        // Save membership data in Firestore
        const newMembership = await MembershipService.addMembership({
            userId,
            planId,
            usedDays,
            usedNights,
            totalDays,
            totalNights,
            status: "active",
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        });

        consoleManager.log("✅ Membership created successfully:", newMembership);

        return NextResponse.json({
            statusCode: 201,
            message: "Membership added successfully",
            data: newMembership,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/memberships:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
