import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class PlanService {
    static plans: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initPlans() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for plans...");
        const plansCollection = db.collection("plans");

        plansCollection.onSnapshot((snapshot: any) => {
            this.plans = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Plans updated, count:", this.plans.length);
        });

        this.isInitialized = true;
    }

    // Get all plans (Uses cache unless forceRefresh is true)
    static async getAllPlans(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing plans from Firestore...");
            const snapshot = await db.collection("plans").orderBy("createdOn", "desc").get();
            this.plans = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached plans. No Firestore read.");
        }
        return this.plans;
    }

    // Add a new plan with createdOn timestamp
    static async addPlan(planData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newPlanRef = await db.collection("plans").add({
                ...planData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New plan added with ID:", newPlanRef.id);

            // Force refresh the cache after adding a new plan
            await this.getAllPlans(true);

            return { id: newPlanRef.id, ...planData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding plan:", error);
            throw new Error("Failed to add plan");
        }
    }

    // Get plan by ID (fetches from cache first)
    static async getPlanById(planId: string) {
        try {
            // Check if plan exists in cache
            const cachedPlan = this.plans.find((p: any) => p.id === planId);
            if (cachedPlan) {
                consoleManager.log("✅ Plan fetched from cache:", planId);
                return cachedPlan;
            }

            // Fetch from Firestore if not in cache
            const planRef = db.collection("plans").doc(planId);
            const doc = await planRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Plan not found:", planId);
                return null;
            }

            consoleManager.log("✅ Plan fetched from Firestore:", planId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching plan by ID:", error);
            throw new Error("Failed to fetch plan");
        }
    }

    // Update plan with updatedOn timestamp
    static async updatePlan(planId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const planRef = db.collection("plans").doc(planId);
            await planRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Plan updated:", planId);

            // Force refresh the cache after updating a plan
            await this.getAllPlans(true);

            return { id: planId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating plan:", error);
            throw new Error("Failed to update plan");
        }
    }

    // Delete plan
    static async deletePlan(planId: string) {
        try {
            await db.collection("plans").doc(planId).delete();
            consoleManager.log("✅ Plan deleted:", planId);

            // Force refresh the cache after deleting a plan
            await this.getAllPlans(true);

            return { success: true, message: "Plan deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting plan:", error);
            throw new Error("Failed to delete plan");
        }
    }
}

export default PlanService;
