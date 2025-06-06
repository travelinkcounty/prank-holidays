import { NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import PackageService from "../../services/packageServices";
import consoleManager from "../../utils/consoleManager";

// Get all packages (GET)
export async function GET(req: Request) {
    try {

        // Fetch packages based on status filter
        const packages = await PackageService.getAllPackages();
        consoleManager.log("Fetched all packages:", packages.length);


        return NextResponse.json({
            statusCode: 200,
            message: "Packages fetched successfully",
            data: packages,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/package:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new package (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const file = formData.get("image");
        const description = formData.get("description");
        const price = formData.get("price");
        const locationId = formData.get("locationId");
        const days = formData.get("days");
        const nights = formData.get("nights");
        
        if (!name || !file) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, and image are required",
            }, { status: 400 });
        }

        // Upload image to Firebase Storage (800x600 for packages)
        const imageUrl = await UploadImage(file);
        consoleManager.log("✅ Package image uploaded:", imageUrl);

        // Save package data in Firestore
        const newPackage = await PackageService.addPackage({
            name,
            image: imageUrl,
            description,
            price,
            locationId,
            days,
            nights,
        });

        consoleManager.log("✅ Package created successfully:", newPackage);

        return NextResponse.json({
            statusCode: 201,
            message: "Package added successfully",
            data: newPackage,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/package:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
