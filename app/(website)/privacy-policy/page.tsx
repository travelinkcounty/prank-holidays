import PrivacyPolicy from "./privacy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Travelink County",
  description: "Learn about how we collect, use, and protect your personal information when you use our website.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}