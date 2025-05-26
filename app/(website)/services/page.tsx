import Services from "./services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Travelink County",
  description: "Services of our services and packages.",
};

export default function ServicesPage() {
    return <Services />;
}