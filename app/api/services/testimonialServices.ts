import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class TestimonialService {
    static testimonials: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initTestimonials() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for testimonials...");
        const testimonialsCollection = db.collection("testimonials");

        testimonialsCollection.onSnapshot((snapshot: any) => {
            this.testimonials = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Testimonials updated, count:", this.testimonials.length);
        });

        this.isInitialized = true;
    }

    // Get all testimonials (Uses cache unless forceRefresh is true)
    static async getAllTestimonials(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing testimonials from Firestore...");
            const snapshot = await db.collection("testimonials").orderBy("createdOn", "desc").get();
            this.testimonials = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached testimonials. No Firestore read.");
        }
        return this.testimonials;
    }

    // Get all active testimonials (Uses cache unless forceRefresh is true)
    static async getActiveTestimonials(forceRefresh = false) {
        // Fetch all testimonials (either from cache or Firestore)
        const allTestimonials = await this.getAllTestimonials(forceRefresh);

        // Filter testimonials where status is 'active'
        const activeTestimonials = allTestimonials.filter((testimonial: any) => testimonial.status === "approved");

        consoleManager.log("Returning active testimonials. Count:", activeTestimonials.length);
        return activeTestimonials;
    }

    // Add a new testimonial with createdOn timestamp
    static async addTestimonial(testimonialData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newTestimonialRef = await db.collection("testimonials").add({
                ...testimonialData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New testimonial added with ID:", newTestimonialRef.id);

            // Force refresh the cache after adding a testimonial
            await this.getAllTestimonials(true);

            return { id: newTestimonialRef.id, ...testimonialData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding testimonial:", error);
            throw new Error("Failed to add testimonial");
        }
    }

    // Get testimonial by ID (fetches from cache first)
    static async getTestimonialById(testimonialId: string) {
        try {
            // Check if testimonial exists in cache
            const cachedTestimonial = this.testimonials.find((t: any) => t.id === testimonialId);
            if (cachedTestimonial) {
                consoleManager.log("✅ Testimonial fetched from cache:", testimonialId);
                return cachedTestimonial;
            }

            // Fetch from Firestore if not in cache
            const testimonialRef = db.collection("testimonials").doc(testimonialId);
            const doc = await testimonialRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Testimonial not found:", testimonialId);
                return null;
            }

            consoleManager.log("✅ Testimonial fetched from Firestore:", testimonialId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching testimonial by ID:", error);
            throw new Error("Failed to fetch testimonial");
        }
    }

    // Update testimonial with updatedOn timestamp
    static async updateTestimonial(testimonialId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const testimonialRef = db.collection("testimonials").doc(testimonialId);
            await testimonialRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Testimonial updated:", testimonialId);

            // Force refresh the cache after updating a testimonial
            await this.getAllTestimonials(true);

            return { id: testimonialId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating testimonial:", error);
            throw new Error("Failed to update testimonial");
        }
    }

    // Delete testimonial
    static async deleteTestimonial(testimonialId: string) {
        try {
            await db.collection("testimonials").doc(testimonialId).delete();
            consoleManager.log("✅ Testimonial deleted:", testimonialId);

            // Force refresh the cache after deleting a testimonial
            await this.getAllTestimonials(true);

            return { success: true, message: "Testimonial deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting testimonial:", error);
            throw new Error("Failed to delete testimonial");
        }
    }
}

export default TestimonialService;
