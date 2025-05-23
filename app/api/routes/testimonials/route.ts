import { NextResponse } from "next/server";
import TestimonialService from "../../services/testimonialServices";
import consoleManager from "../../utils/consoleManager";

// Get all testimonials (GET)
export async function GET(req: Request) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let testimonials;

        // Fetch testimonials based on status filter
        if (status === "approved") {
            testimonials = await TestimonialService.getActiveTestimonials();
            consoleManager.log("Fetched active testimonials:", testimonials.length);
        } else {
            testimonials = await TestimonialService.getAllTestimonials();
            consoleManager.log("Fetched all testimonials:", testimonials.length);
        }

        return NextResponse.json({
            statusCode: 200,
            message: "Testimonials fetched successfully",
            data: testimonials,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/testimonials:", error);
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
        const { name, email, message, status, rating } = await req.json();

        
        if (!name || !message) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name and message are required",
            }, { status: 400 });
        }

        // Save testimonial in DB
        const newTestimonial = await TestimonialService.addTestimonial({
            name,
            email,
            message,
            status,
            rating,
        });

        return NextResponse.json({
            statusCode: 201,
            message: "Testimonial added successfully",
            data: newTestimonial,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("Error in POST /api/testimonials:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}