import SearchBar from "@/components/food/SearchBar";
import FilterBar from "@/components/food/FilterBar";
import RestaurantList from "@/components/food/RestaurantList";
import FoodMap from "@/components/food/FoodMap";
import RestaurantDetailPanel from "@/components/food/RestaurantDetailPanel";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="food-layout">
      {/* ── Left Panel ─────────────────────────── */}
      <aside className="food-panel">
        <div className="food-panel__header">
          <div className="food-panel__logo">
            <MapPin size={18} className="food-panel__logo-icon" />
          </div>
          <div>
            <h1 className="food-panel__title">Campus Food Map</h1>
            <p className="food-panel__subtitle">大学城美食探索</p>
          </div>
        </div>
        <div className="food-panel__search">
          <SearchBar />
        </div>
        <div className="food-panel__filters">
          <FilterBar />
        </div>
        <div className="food-panel__list">
          <RestaurantList />
        </div>
      </aside>

      {/* ── Right: Map + floating Detail Panel ── */}
      <main className="food-map-container">
        <FoodMap />
        <RestaurantDetailPanel />
      </main>
    </div>
  );
}
