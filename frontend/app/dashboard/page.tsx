import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Developer Dashboard — DevFrame",
  description: "Manage your developer profile, view synced repositories, connect with the community, and track project metrics.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
