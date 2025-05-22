import Locations from "./locations";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations - Prank Holidays",
  description: "Locations of our services and packages.",
};

export default function LocationsPage() {
    return <Locations />;
}