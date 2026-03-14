import { Outlet } from "react-router-dom";
import AppBar from "@/components/AppBar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <AppBar />
      <Outlet />
    </div>
  );
}

