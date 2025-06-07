import { NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import LocationService from "../../services/locationServices";
import consoleManager from "../../utils/consoleManager";

// Get all packages (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get("featured");

        if (featured == "true") {
            // Return only featured locations
            const featuredLocations = await LocationService.getFeaturedLocations();
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
            const locations = await LocationService.getAllLocations();
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
        consoleManager.error("❌ Error in GET /api/locations:", error);
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
        const featured = formData.get("featured") === "true";

        const file = formData.get("image");

        if (!name || !file) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, and image are required",
            }, { status: 400 });
        }

        // Upload image to Firebase Storage (800x600 for locations)
        const imageUrl = await UploadImage(file);
        consoleManager.log("✅ Location image uploaded:", imageUrl);

        // Save location data in Firestore
        const newLocation = await LocationService.addLocation({
            name,
            type,
            image: imageUrl,
            featured,
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
        consoleManager.error("❌ Error in POST /api/locations:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
