import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

export function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}