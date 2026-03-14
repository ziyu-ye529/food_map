import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { useRestaurantStore, selectFilteredRestaurants, selectHasActiveFilters } from "@/stores/restaurantStore";
import RestaurantCard from "./RestaurantCard";
import { UtensilsCrossed } from "lucide-react";

export default function RestaurantList() {
  const { t } = useTranslation();
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
        <p className="empty-title">{t('list.empty')}</p>
        <p className="empty-sub">{t('list.tryAdjusting')}</p>
        {hasActiveFilters && (
          <button className="empty-clear-btn" onClick={clearAllFilters}>
            {t('filter.reset')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="restaurant-list__count">
        {filteredRestaurants.length === 1 
          ? t('list.found_one', { count: 1 }) 
          : t('list.found_other', { count: filteredRestaurants.length })}
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
