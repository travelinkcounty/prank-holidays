import Packages from "./packages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Packages - Prank Holidays",
  description: "Packages of our services and packages.",
};

export default function PackagesPage() {
    return <Packages />;
}

