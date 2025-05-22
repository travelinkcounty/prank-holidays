import Management from "./management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Management - Prank Holidays",
  description: "Management of our services and packages.",
};

export default function ManagementPage() {
    return <Management />;
}

