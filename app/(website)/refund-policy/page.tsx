import RefundPolicy from "./refund-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Travlink County",
  description: "Learn about how we handle refunds, cool off periods, and holiday cancellations for our members.",
};

export default function RefundPolicyPage() {
  return <RefundPolicy />;
}