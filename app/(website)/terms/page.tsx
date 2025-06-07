import Terms from "./terms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Travelink County",
  description: "Read our Terms & Conditions to understand how you can use our website and services.",
};  

export default function TermsPage() {
  return <Terms />;
}