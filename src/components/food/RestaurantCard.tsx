import { forwardRef } from "react";
import type { Restaurant } from "@/types/restaurant";
import {
  priceToSymbol,
  ratingBadgeClass,
  formatDistance,
  cuisineEmoji,
  cuisinePlaceholderGradient,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/stores/restaurantStore";

type Props = {
  restaurant: Restaurant;
};

const RestaurantCard = forwardRef<HTMLDivElement, Props>(({ restaurant: r }, ref) => {
  const selectedIds = useRestaurantStore((s) => s.selectedIds);
  const hoveredId = useRestaurantStore((s) => s.hoveredId);
  const toggleSelected = useRestaurantStore((s) => s.toggleSelected);
  const setHoveredId = useRestaurantStore((s) => s.setHoveredId);

  const isSelected = selectedIds.includes(r.id);
  const isHovered = hoveredId === r.id;
  const imageSrc = r.images[0] ? `/source/images/${r.images[0]}` : null;

  return (
    <div
      ref={ref}
      className={cn(
        "restaurant-card",
        isSelected && "restaurant-card--active",
        isHovered && !isSelected && "restaurant-card--hovered"
      )}
      onClick={() => toggleSelected(r.id)}
      onMouseEnter={() => setHoveredId(r.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="restaurant-card__selected-badge">✓</div>
      )}

      {/* Thumbnail */}
      <div className="restaurant-card__thumb">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={r.name}
            className="restaurant-card__img"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              el.parentElement!.style.background = cuisinePlaceholderGradient(r.cuisine);
            }}
          />
        ) : (
          <div
            className="restaurant-card__placeholder"
            style={{ background: cuisinePlaceholderGradient(r.cuisine) }}
          >
            <span className="restaurant-card__emoji">{cuisineEmoji(r.cuisine)}</span>
          </div>
        )}
        <div className={cn("status-dot", r.isOpenNow ? "status-dot--open" : "status-dot--closed")} />
      </div>

      {/* Info */}
      <div className="restaurant-card__info">
        <div className="restaurant-card__top">
          <h3 className="restaurant-card__name">{r.name}</h3>
          <div className={cn("rating-badge", ratingBadgeClass(r.rating))}>
            {r.rating.toFixed(1)}
          </div>
        </div>

        <div className="restaurant-card__meta">
          <span className="meta-tag">{cuisineEmoji(r.cuisine)} {r.cuisine}</span>
          <span className="meta-divider">·</span>
          <span className="meta-price">{priceToSymbol(r.pricePerPerson)}</span>
          <span className="meta-divider">·</span>
          <span className="meta-distance">📍 {formatDistance(r.distance)}</span>
        </div>

        <p className="restaurant-card__review">{r.review}</p>

        {r.tags.length > 0 && (
          <div className="restaurant-card__tags">
            {r.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="inline-tag">{tag}</span>
            ))}
            {r.hasStudentDiscount && <span className="inline-tag inline-tag--special">🎓 Student</span>}
          </div>
        )}
      </div>
    </div>
  );
});

RestaurantCard.displayName = "RestaurantCard";
export default RestaurantCard;
