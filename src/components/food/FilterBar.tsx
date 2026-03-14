import { useState, useRef, useEffect } from "react";
import { ChevronDown, Heart, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRestaurantStore, ALL_TAGS } from "@/stores/restaurantStore";
import { cn } from "@/lib/utils";

const NOISE_LEVELS = ["All", "Quiet", "Moderate", "Loud"] as const;

export default function FilterBar() {
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filterOpenNow = useRestaurantStore((s) => s.filterOpenNow);
  const filterStudentDiscount = useRestaurantStore((s) => s.filterStudentDiscount);
  const filterWifi = useRestaurantStore((s) => s.filterWifi);
  const filterFavorites = useRestaurantStore((s) => s.filterFavorites);
  const filterNoiseLevel = useRestaurantStore((s) => s.filterNoiseLevel);
  const filterTags = useRestaurantStore((s) => s.filterTags);
  const toggleOpenNow = useRestaurantStore((s) => s.toggleOpenNow);
  const toggleStudentDiscount = useRestaurantStore((s) => s.toggleStudentDiscount);
  const toggleWifi = useRestaurantStore((s) => s.toggleWifi);
  const toggleFavorites = useRestaurantStore((s) => s.toggleFavorites);
  const setNoiseLevel = useRestaurantStore((s) => s.setNoiseLevel);
  const toggleTag = useRestaurantStore((s) => s.toggleTag);

  // Count active "more" filters for the badge
  const moreActiveCount = [
    filterStudentDiscount,
    filterWifi,
    filterNoiseLevel !== "All",
    filterTags.length > 0,
  ].filter(Boolean).length;

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  return (
    <div className="filter-bar">
      {/* ── Single row ── */}
      <div className="filter-bar__chips">

        {/* Open Now */}
        <button
          className={cn("filter-chip", filterOpenNow && "filter-chip--active")}
          onClick={toggleOpenNow}
        >
          <span className={cn("filter-chip__dot", filterOpenNow ? "filter-chip__dot--green" : "filter-chip__dot--gray")} />
          {t("filter.openNow")}
        </button>

        {/* Favorites */}
        <button
          className={cn("filter-chip filter-chip--icon", filterFavorites && "filter-chip--active filter-chip--fav")}
          onClick={toggleFavorites}
        >
          <Heart size={13} fill={filterFavorites ? "currentColor" : "none"} />
          {t("filter.favorites")}
        </button>

        {/* More → popover */}
        <div className="filter-more-wrap">
          <button
            ref={triggerRef}
            className={cn("filter-chip filter-chip--more", moreOpen && "filter-chip--more-open", moreActiveCount > 0 && "filter-chip--active")}
            onClick={() => setMoreOpen((v) => !v)}
          >
            <SlidersHorizontal size={13} />
            {t("filter.more")}
            {moreActiveCount > 0 && (
              <span className="filter-more-badge">{moreActiveCount}</span>
            )}
            <ChevronDown size={11} className={cn("filter-more-chevron", moreOpen && "filter-more-chevron--open")} />
          </button>

          {/* Popover panel */}
          {moreOpen && (
            <div ref={popoverRef} className="filter-popover">
              <div className="filter-popover__header">
                <span className="filter-popover__title">{t("filter.title")}</span>
                <button className="filter-popover__close" onClick={() => setMoreOpen(false)}>
                  <X size={14} />
                </button>
              </div>

              {/* Student / WiFi chips */}
              <div className="filter-popover__row">
                <button
                  className={cn("filter-chip filter-chip--sm", filterStudentDiscount && "filter-chip--active")}
                  onClick={toggleStudentDiscount}
                >
                  🎓 {t("filter.studentDeals")}
                </button>
                <button
                  className={cn("filter-chip filter-chip--sm", filterWifi && "filter-chip--active")}
                  onClick={toggleWifi}
                >
                  📶 {t("filter.wifi")}
                </button>
              </div>

              {/* Noise level — expanded buttons, no dropdown */}
              <div className="filter-popover__section">
                <p className="filter-popover__section-label">🔊 {t("filter.noise.label")}</p>
                <div className="filter-popover__row filter-popover__row--wrap">
                  {NOISE_LEVELS.map((level) => (
                    <button
                      key={level}
                      className={cn("filter-chip filter-chip--sm", filterNoiseLevel === level && "filter-chip--active")}
                      onClick={() => setNoiseLevel(level)}
                    >
                      {t(`filter.noise.${level}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="filter-popover__section">
                <p className="filter-popover__section-label">🏷 {t("filter.tagsLabel")}</p>
                <div className="filter-popover__row filter-popover__row--wrap">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      className={cn("tag-chip", filterTags.includes(tag) && "tag-chip--active")}
                      onClick={() => toggleTag(tag)}
                    >
                      {t(`tags.${tag}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

