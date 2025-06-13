import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class HotelService {
    static hotels: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initHotels() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for hotels...");
        const hotelsCollection = db.collection("hotels");

        hotelsCollection.onSnapshot((snapshot: any) => {
            this.hotels = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Hotels updated, count:", this.hotels.length);
        });

        this.isInitialized = true;
    }

    // Get all hotels (Uses cache unless forceRefresh is true)
    static async getAllHotels(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing hotels from Firestore...");
            const snapshot = await db.collection("hotels").orderBy("createdOn", "desc").get();
            this.hotels = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached hotels. No Firestore read.");
        }
        return this.hotels;
    }

    // Get all featured hotels
    static async getFeaturedHotels() {
        try {
            const snapshot = await db.collection("hotels").where("featured", "==", true).get();
            consoleManager.log("🔥 Fetched featured hotels:", snapshot.docs.length);
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            consoleManager.error("❌ Error fetching featured hotels:", error);
            throw new Error("Failed to fetch featured hotels");
        }
    }   

    // Add a new hotel with createdOn timestamp
    static async addHotel(hotelData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newHotelRef = await db.collection("hotels").add({
                ...hotelData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New hotel added with ID:", newHotelRef.id);

            // Force refresh the cache after adding a new hotel
            await this.getAllHotels(true);

            return { id: newHotelRef.id, ...hotelData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding hotel:", error);
            throw new Error("Failed to add hotel");
        }
    }

    // Get hotel by ID (fetches from cache first)
    static async getHotelById(hotelId: string) {
        try {
            // Check if hotel exists in cache
            const cachedHotel = this.hotels.find((h: any) => h.id === hotelId);
            if (cachedHotel) {
                consoleManager.log("✅ Hotel fetched from cache:", hotelId);
                return cachedHotel;
            }

            // Fetch from Firestore if not in cache
            const hotelRef = db.collection("hotels").doc(hotelId);
            const doc = await hotelRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Hotel not found:", hotelId);
                return null;
            }

            consoleManager.log("✅ Hotel fetched from Firestore:", hotelId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching hotel by ID:", error);
            throw new Error("Failed to fetch hotel");
        }
    }

    // Update hotel with updatedOn timestamp
    static async updateHotel(hotelId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const hotelRef = db.collection("hotels").doc(hotelId);
            await hotelRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Hotel updated:", hotelId);

            // Force refresh the cache after updating a hotel
            await this.getAllHotels(true);

            return { id: hotelId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating hotel:", error);
            throw new Error("Failed to update hotel");
        }
    }

    // Delete hotel
    static async deleteHotel(hotelId: string) {
        try {
            await db.collection("hotels").doc(hotelId).delete();
            consoleManager.log("✅ Hotel deleted:", hotelId);

            // Force refresh the cache after deleting a hotel
            await this.getAllHotels(true);

            return { success: true, message: "Hotel deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting hotel:", error);
            throw new Error("Failed to delete hotel");
        }
    }
}

export default HotelService;
