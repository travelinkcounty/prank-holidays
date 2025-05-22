import Contact from "./contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Prank Holidays",
  description: "Contact us for more information about our services and packages.",
};

export default function ContactPage() {
  return <Contact />;
}