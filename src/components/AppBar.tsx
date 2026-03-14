import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Info, Map, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

const NAV: NavItem[] = [
  { to: "/", label: "地图演示", icon: <Map className="h-4 w-4" /> },
  { to: "/playground", label: "Playground", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { to: "/about", label: "关于", icon: <Info className="h-4 w-4" /> },
];

export default function AppBar() {
  return (
    <div className="flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0B1220] px-4 text-[#E6EAF2]">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
          <Map className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold">React Mapbox Scaffold</div>
      </div>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#AAB3C5] transition hover:bg-white/5 hover:text-[#E6EAF2]",
                isActive && "bg-white/10 text-[#E6EAF2]"
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="text-xs text-[#AAB3C5]">Vite + React + Mapbox GL JS</div>
    </div>
  );
}
