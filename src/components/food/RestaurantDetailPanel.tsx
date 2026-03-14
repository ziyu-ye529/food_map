import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useRestaurantStore, selectSelectedRestaurants } from "@/stores/restaurantStore";
import {
  priceToSymbol,
  ratingBadgeClass,
  formatDistance,
  cuisineEmoji,
  cuisinePlaceholderGradient,
} from "@/utils/helpers";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types/restaurant";
import { X, Clock, Wifi, Volume2, Zap, Phone, Tag, ChevronDown } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";

const EXIT_DURATION = 320; // ms — must match CSS animation duration

function DetailCard({
  restaurant: r,
  isRemoving,
  onClose,
}: {
  restaurant: Restaurant;
  isRemoving: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const imageSrc = r.images[0] ? `/source/images/${r.images[0]}` : null;

  return (
    <div className={cn("detail-card", isRemoving && "detail-card--removing")}>
      <button className="detail-card__close" onClick={onClose} aria-label={t("detail.close")}>
        <X size={14} />
      </button>

      <div className="detail-card__cover">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={r.name}
            className="detail-card__cover-img"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              el.parentElement!.style.background = cuisinePlaceholderGradient(r.cuisine);
            }}
          />
        ) : (
          <div
            className="detail-card__cover-placeholder"
            style={{ background: cuisinePlaceholderGradient(r.cuisine) }}
          >
            <span className="detail-card__cover-emoji">{cuisineEmoji(r.cuisine)}</span>
          </div>
        )}
        <div className={cn("detail-card__status", r.isOpenNow ? "detail-card__status--open" : "detail-card__status--closed")}>
          {r.isOpenNow ? `● ${t('detail.openNow')}` : `● ${t('detail.closed')}`}
        </div>
      </div>

      <div className="detail-card__body">
        <div className="detail-card__title-row">
          <h2 className="detail-card__name">{r.name}</h2>
          <div className={cn("rating-badge rating-badge--lg", ratingBadgeClass(r.rating))}>
            ★ {r.rating.toFixed(1)}
          </div>
        </div>

        <div className="detail-card__meta-row">
          <span>{cuisineEmoji(r.cuisine)} {t(`cuisine.${r.cuisine}`)}</span>
          <span className="detail-divider">·</span>
          <span className="detail-price">{priceToSymbol(r.pricePerPerson)} <span className="detail-price__amount">${r.pricePerPerson}/person</span></span>
          <span className="detail-divider">·</span>
          <span>📍 {formatDistance(r.distance, t)}</span>
        </div>

        <blockquote className="detail-card__review">"{t(`review.${r.review}`)}"</blockquote>

        <div className="detail-stats">
          <div className="detail-stat">
            <Clock size={13} className="detail-stat__icon" />
            <span className="detail-stat__label">{t('detail.waitLabel')}</span>
            <span className="detail-stat__val">{r.waitTime === 0 ? t('detail.noWait') : t('detail.wait', { time: r.waitTime })}</span>
          </div>
          <div className="detail-stat">
            <Wifi size={13} className="detail-stat__icon" />
            <span className="detail-stat__label">WiFi</span>
            <span className="detail-stat__val">{r.studyFriendly.hasWifi ? t('detail.yes') : t('detail.no')}</span>
          </div>
          <div className="detail-stat">
            <Volume2 size={13} className="detail-stat__icon" />
            <span className="detail-stat__label">{t('detail.noise')}</span>
            <span className="detail-stat__val">{t(`filter.noise.${r.studyFriendly.noiseLevel}`)}</span>
          </div>
          <div className="detail-stat">
            <Zap size={13} className="detail-stat__icon" />
            <span className="detail-stat__label">{t('detail.outlets')}</span>
            <span className="detail-stat__val">{r.studyFriendly.powerOutlets}</span>
          </div>
        </div>

        <div className="detail-card__row">
          <Clock size={12} className="detail-row__icon" />
          <span>{r.operatingHours}</span>
        </div>
        <div className="detail-card__row">
          <Phone size={12} className="detail-row__icon" />
          <span>{r.contact}</span>
        </div>

        {r.tags.length > 0 && (
          <div className="detail-card__chips">
            <Tag size={11} className="detail-row__icon" />
            {r.tags.map((tag) => (
              <span key={tag} className="detail-chip">{t(`tags.${tag}`)}</span>
            ))}
            {r.hasStudentDiscount && <span className="detail-chip detail-chip--special">🎓 {t('filter.studentDeals')}</span>}
          </div>
        )}

        {r.dietaryOptions.length > 0 && (
          <div className="detail-card__dietary">
            {r.dietaryOptions.map((opt) => (
              <span key={opt} className="dietary-badge">{opt}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantDetailPanel() {
  const { t } = useTranslation();
  const selectedRestaurants = useRestaurantStore(useShallow(selectSelectedRestaurants));
  const deselect = useRestaurantStore((s) => s.deselect);
  const clearSelected = useRestaurantStore((s) => s.clearSelected);

  // Track which IDs are mid-exit-animation so we can keep them rendered
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const removeTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Toast message
  const [removedMsg, setRemovedMsg] = useState<string | null>(null);

  // Start exit animation then deselect after it finishes
  const handleClose = useCallback((id: string, name: string) => {
    setRemovingIds((prev) => new Set([...prev, id]));

    const timer = setTimeout(() => {
      deselect(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRemovedMsg(`${name} removed`);
      removeTimers.current.delete(id);
    }, EXIT_DURATION);

    removeTimers.current.set(id, timer);
  }, [deselect]);

  // Clear all selections immediately with toast
  const handleClearAll = useCallback(() => {
    // Cancel any pending individual timers
    removeTimers.current.forEach((t) => clearTimeout(t));
    removeTimers.current.clear();
    setRemovingIds(new Set());
    clearSelected();
    setRemovedMsg(t('detail.clearAll') + " \u2713");
  }, [clearSelected, t]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      removeTimers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Auto-clear toast
  useEffect(() => {
    if (!removedMsg) return;
    const t = setTimeout(() => setRemovedMsg(null), 2000);
    return () => clearTimeout(t);
  }, [removedMsg]);

  // Merge: real list + still-animating-out items
  const allRestaurants = useRestaurantStore((s) => s.restaurants);
  const displayList = [
    ...selectedRestaurants,
    ...allRestaurants.filter(
      (r) => removingIds.has(r.id) && !selectedRestaurants.find((s) => s.id === r.id)
    ),
  ];

  if (displayList.length === 0) {
    if (!removedMsg) return null;
    return (
      <div className="detail-panel-toast detail-panel-toast--standalone">
        <span>✓ {removedMsg}</span>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      {removedMsg && (
        <div className="detail-panel-toast">
          <span>✓ {removedMsg}</span>
        </div>
      )}

      <div className="detail-panel__header">
        <div className="detail-panel__title">
          {selectedRestaurants.length <= 1 ? t('detail.title') : t('detail.comparing', { count: selectedRestaurants.length })}
          {selectedRestaurants.length > 1 && (
            <span className="detail-panel__compare-badge">{t('detail.compareBadge')}</span>
          )}
        </div>
        <div className="detail-panel__actions">
          <span className="detail-panel__hint">
            <ChevronDown size={12} /> {t('detail.clickToAdd')}
          </span>
          <button className="detail-panel__clear" onClick={handleClearAll}>
            {t('detail.clearAll')}
          </button>
        </div>
      </div>

      <div className="detail-panel__cards">
        {displayList.map((r) => (
          <DetailCard
            key={r.id}
            restaurant={r}
            isRemoving={removingIds.has(r.id)}
            onClose={() => handleClose(r.id, r.name)}
          />
        ))}
      </div>
    </div>
  );
}
