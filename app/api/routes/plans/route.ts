import { NextResponse } from "next/server";
import PlanService from "../../services/planServices";
import consoleManager from "../../utils/consoleManager";

// Get all testimonials (GET)
export async function GET(req: Request) {
    try {
        let plans;

         plans = await PlanService.getAllPlans();
        return NextResponse.json({
            statusCode: 200,
            message: "Plans fetched successfully",
            data: plans,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/plans:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new testimonial (POST)
export async function POST(req: Request) {
    try {
        const { name, description, price, image, locationId, features } = await req.json();
        
        if (!name || !description || !price || !image || !locationId || !features) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, description, price, image, locationId, and features are required",
            }, { status: 400 });
        }

        // Save testimonial in DB
        const newPlan = await PlanService.addPlan({
            name,
            description,
            price,
            image,
            locationId,
            features,
        });

        return NextResponse.json({
            statusCode: 201,
            message: "Plan added successfully",
            data: newPlan,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("Error in POST /api/plans:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}