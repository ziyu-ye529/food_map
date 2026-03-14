import { useRef, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRestaurantStore, selectFilteredRestaurants, selectHasActiveFilters } from "@/stores/restaurantStore";
import RestaurantCard from "./RestaurantCard";
import { UtensilsCrossed } from "lucide-react";

export default function RestaurantList() {
  // Use useShallow to prevent infinite re-renders from new array references
  const filteredRestaurants = useRestaurantStore(useShallow(selectFilteredRestaurants));
  const hasActiveFilters = useRestaurantStore(selectHasActiveFilters);
  const selectedIds = useRestaurantStore(useShallow((s) => s.selectedIds));
  const clearAllFilters = useRestaurantStore((s) => s.clearAllFilters);

  // Map from restaurant id → card DOM ref for programmatic scroll
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // When a new card is selected (e.g. from map marker click), scroll to it
  useEffect(() => {
    const lastId = selectedIds[selectedIds.length - 1];
    if (!lastId) return;
    const el = cardRefs.current.get(lastId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIds]);

  if (filteredRestaurants.length === 0) {
    return (
      <div className="restaurant-list__empty">
        <UtensilsCrossed size={40} className="empty-icon" />
        <p className="empty-title">No restaurants found</p>
        <p className="empty-sub">Try adjusting your search or filters</p>
        {hasActiveFilters && (
          <button className="empty-clear-btn" onClick={clearAllFilters}>
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="restaurant-list__count">
        {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}
      </div>
      <div className="restaurant-list__scroll">
        {filteredRestaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            ref={(el) => {
              if (el) cardRefs.current.set(r.id, el);
              else cardRefs.current.delete(r.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
