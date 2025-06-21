import { NextResponse } from "next/server";
import { UploadMultipleImages } from "../../controller/imageController";
import SubLocationService from "../../services/subLocationServices";
import consoleManager from "../../utils/consoleManager";
import { v4 as uuidv4 } from 'uuid';


// Get all packages (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
            const locationId = searchParams.get("locationId");

        if (locationId) {
            // Return only featured locations
            const featuredLocations = await SubLocationService.getFeaturedLocations(locationId);
            consoleManager.log("Fetched featured locations:", featuredLocations.length);

            return NextResponse.json({
                statusCode: 200,
                message: "Featured locations fetched successfully",
                data: featuredLocations,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        } else {
            // Return all locations
            const locations = await SubLocationService.getAllLocations();
            consoleManager.log("Fetched all locations:", locations.length);

            return NextResponse.json({
                statusCode: 200,
                message: "Locations fetched successfully",
                data: locations,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        }
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/sub-locations:", error);
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
        const type = formData.get("type");
        const address = formData.get("address");
        const uid = uuidv4();
        const files = formData.getAll("image").slice(0, 5);
        const locationId = formData.get("locationId");
        
        if (!name || !files || files.length === 0) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, and at least one image are required",
            }, { status: 400 });
        }
        if (files.length > 5) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "TOO_MANY_IMAGES",
                errorMessage: "Maximum 5 images allowed.",
            }, { status: 400 });
        }

        // Upload images to Firebase Storage
        const imageUrls = await UploadMultipleImages(files);
        consoleManager.log("✅ Location images uploaded:", imageUrls);

        // Save location data in Firestore
        const newLocation = await SubLocationService.addLocation({
            uid,
            name,
            type,
            address,
            image: imageUrls, // Store as array
            locationId,
        });

        consoleManager.log("✅ Location created successfully:", newLocation);

        return NextResponse.json({
            statusCode: 201,
            message: "Location added successfully",
            data: newLocation,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/sub-locations:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
