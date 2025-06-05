import { NextResponse } from "next/server";
import PackageService from "../../../services/packageServices";
import consoleManager from "../../../utils/consoleManager";
import { ReplaceImage } from "../../../controller/imageController";

// Get a single package by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const packages = await PackageService.getPackageById(id);

        if (!packages) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Package not found",
            }, { status: 404 });
        }

        consoleManager.log("Fetched package:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Package fetched successfully",
            data: packages,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });    
    } catch (error: any) {
        consoleManager.error("Error in GET /api/package/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a package by ID (PUT) - Handles image replacement
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData(); // Get form data
        if (!id) throw new Error("Package ID is required");

        let updateData: any = {};
        const name = formData.get("name");
        const image = formData.get("image"); // File input
        const description = formData.get("description");
        const price = formData.get("price");
        const locationId = formData.get("locationId");
        const days = formData.get("days");


        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (locationId) updateData.locationId = locationId;
        if (days) updateData.days = days;


        // Fetch existing package to get old image URL
        const existingPackage = await PackageService.getPackageById(id);
        if (!existingPackage) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Package not found",
            }, { status: 404 });
        }

        // If a new image is provided, replace the old one; otherwise, keep the existing one
        if (image) {
            if (!existingPackage.image) {
                consoleManager.warn("No old image URL found for replacement.");
            }
            const imageUrl = await ReplaceImage(image, existingPackage.image);
            updateData.image = imageUrl;
        } else {
            updateData.image = existingPackage.image; // Keep the existing image
        }

        // Update package in database
        const updatedPackage = await PackageService.updatePackage(id, updateData);
        consoleManager.log("Package updated successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Package updated successfully",
            data: updatedPackage,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/package/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete a package by ID (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Package ID is required");

        // Fetch existing package to get old image URL
        const existingPackage = await PackageService.getPackageById(id);
        if (!existingPackage) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Package not found",
            }, { status: 404 });
        }

        // Delete package image using ReplaceImage function (null prevents re-upload)
        if (existingPackage.image) {
            await ReplaceImage(null, existingPackage.image);
        }

        // Delete package from DB
        await PackageService.deletePackage(id);
        consoleManager.log("Package deleted successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Package deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/package/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
