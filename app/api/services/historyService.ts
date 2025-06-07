import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class HistoryService {
    static histories: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initHistories() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for histories...");
        const historiesCollection = db.collection("histories");

        historiesCollection.onSnapshot((snapshot: any) => {
            this.histories = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Histories updated, count:", this.histories.length);
        });

        this.isInitialized = true;
    }

    // Get all histories (Uses cache unless forceRefresh is true)
    static async getAllHistories(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing histories from Firestore...");
            const snapshot = await db.collection("histories").orderBy("createdOn", "desc").get();
            this.histories = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached histories. No Firestore read.");
        }
        return this.histories;
    }

    // Get all histories by user ID
    static async getHistoriesByUserId(userId: string) {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }
            
            const histories = await this.getAllHistories();
            const userHistories = histories.filter((history: any) => history.userId == userId);
            
            consoleManager.log(`✅ Fetched ${userHistories.length} histories for user:`, userId);
            return userHistories;
        } catch (error) {
            consoleManager.error("❌ Error fetching histories by user ID:", error);
            throw new Error("Failed to fetch histories by user ID");
        }
    }

    // Add a new history with createdOn timestamp
    static async addHistory(historyData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newHistoryRef = await db.collection("histories").add({
                ...historyData,
                createdOn: timestamp,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ New history added with ID:", newHistoryRef.id);

            // Force refresh the cache after adding a new history
            await this.getAllHistories(true);

            return { id: newHistoryRef.id, ...historyData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding history:", error);
            throw new Error("Failed to add history");
        }
    }

    // Get history by ID (fetches from cache first)
    static async getHistoryById(historyId: string) {
        try {
            // Check if history exists in cache
            const cachedHistory = this.histories.find((h: any) => h.id === historyId);
            if (cachedHistory) {
                consoleManager.log("✅ History fetched from cache:", historyId);
                return cachedHistory;
            }

            // Fetch from Firestore if not in cache
            const historyRef = db.collection("histories").doc(historyId);
            const doc = await historyRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ History not found:", historyId);
                return null;
            }

            consoleManager.log("✅ History fetched from Firestore:", historyId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching history by ID:", error);
            throw new Error("Failed to fetch history");
        }
    }

    // Update history with updatedOn timestamp
    static async updateHistory(historyId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const historyRef = db.collection("histories").doc(historyId);
            await historyRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ History updated:", historyId);

            // Force refresh the cache after updating a history
            await this.getAllHistories(true);

            return { id: historyId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating history:", error);
            throw new Error("Failed to update history");
        }
    }

    // Delete history
    static async deleteHistory(historyId: string) {
        try {
            await db.collection("histories").doc(historyId).delete();
            consoleManager.log("✅ History deleted:", historyId);

            // Force refresh the cache after deleting a history
            await this.getAllHistories(true);

            return { success: true, message: "History deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting history:", error);
            throw new Error("Failed to delete history");
        }
    }
}

export default HistoryService;
