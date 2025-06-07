import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class LocationService {
    static locations: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initLocations() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for locations...");
        const locationsCollection = db.collection("locations");

        locationsCollection.onSnapshot((snapshot: any) => {
            this.locations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Locations updated, count:", this.locations.length);
        });

        this.isInitialized = true;
    }

    // Get all locations (Uses cache unless forceRefresh is true)
    static async getAllLocations(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing locations from Firestore...");
            const snapshot = await db.collection("locations").orderBy("createdOn", "desc").get();
            this.locations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached locations. No Firestore read.");
        }
        return this.locations;
    }

    // Get all featured locations
    static async getFeaturedLocations() {
        try {
            const snapshot = await db.collection("locations").where("featured", "==", true).get();
            consoleManager.log("🔥 Fetched featured locations:", snapshot.docs.length);
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            consoleManager.error("❌ Error fetching featured locations:", error);
            throw new Error("Failed to fetch featured locations");
        }
    }   

    // Add a new location with createdOn timestamp
    static async addLocation(locationData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newLocationRef = await db.collection("locations").add({
                ...locationData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New location added with ID:", newLocationRef.id);

            // Force refresh the cache after adding a new location
            await this.getAllLocations(true);

            return { id: newLocationRef.id, ...locationData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding location:", error);
            throw new Error("Failed to add location");
        }
    }

    // Get location by ID (fetches from cache first)
    static async getLocationById(locationId: string) {
        try {
            // Check if location exists in cache
            const cachedLocation = this.locations.find((l: any) => l.id === locationId);
            if (cachedLocation) {
                consoleManager.log("✅ Location fetched from cache:", locationId);
                return cachedLocation;
            }

            // Fetch from Firestore if not in cache
            const locationRef = db.collection("locations").doc(locationId);
            const doc = await locationRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Location not found:", locationId);
                return null;
            }

            consoleManager.log("✅ Location fetched from Firestore:", locationId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching location by ID:", error);
            throw new Error("Failed to fetch location");
        }
    }

    // Update location with updatedOn timestamp
    static async updateLocation(locationId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const locationRef = db.collection("locations").doc(locationId);
            await locationRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Location updated:", locationId);

            // Force refresh the cache after updating a location
            await this.getAllLocations(true);

            return { id: locationId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating location:", error);
            throw new Error("Failed to update location");
        }
    }

    // Delete location
    static async deleteLocation(locationId: string) {
        try {
            await db.collection("locations").doc(locationId).delete();
            consoleManager.log("✅ Location deleted:", locationId);

            // Force refresh the cache after deleting a location
            await this.getAllLocations(true);

                return { success: true, message: "Location deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting location:", error);
            throw new Error("Failed to delete location");
        }
    }
}

export default LocationService;
