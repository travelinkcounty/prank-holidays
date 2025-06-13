import HotelsPage from "./hotels";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels - Travelink County",
  description: "Explore our collection of hotels, from budget-friendly options to luxury accommodations. Find the perfect place to stay for your next adventure.",
};

export default function Hotels() {
  return <HotelsPage />;
}   