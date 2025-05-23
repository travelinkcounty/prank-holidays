import { NextResponse } from "next/server";
import TestimonialService from "../../../services/testimonialServices";
import consoleManager from "../../../utils/consoleManager";

// Get a single testimonial by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const testimonial = await TestimonialService.getTestimonialById(id);

        if (!testimonial) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Testimonial not found",
            }, { status: 404 });
        }

        consoleManager.log("Fetched testimonial:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Testimonial fetched successfully",
            data: testimonial,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/testimonials/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a testimonial by ID (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Testimonial ID is required",
            }, { status: 400 });
        }

        const { title, status, email, message, rating } = await req.json(); // Correct way to parse body

        let updateData: any = {};

        if (title) updateData.title = title;
        if (status) updateData.status = status;
        if (email) updateData.email = email;
        if (message) updateData.message = message;
        if (rating) updateData.rating = rating;
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "No update fields provided",
            }, { status: 400 });
        }

        const existingTestimonial = await TestimonialService.getTestimonialById(id);
        if (!existingTestimonial) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Testimonial not found",
            }, { status: 404 });
        }

        const updatedTestimonial = await TestimonialService.updateTestimonial(id, updateData);
        consoleManager.log("Testimonial updated successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Testimonial updated successfully",
            data: updatedTestimonial,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/testimonials/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete a testimonial by ID (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Testimonial ID is required");

        const existingTestimonial = await TestimonialService.getTestimonialById(id);
        if (!existingTestimonial) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Testimonial not found",
            }, { status: 404 });
        }

        await TestimonialService.deleteTestimonial(id);
        consoleManager.log("Testimonial deleted successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Testimonial deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/testimonials/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
