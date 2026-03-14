import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import SearchBar from "@/components/food/SearchBar";
import FilterBar from "@/components/food/FilterBar";
import RestaurantList from "@/components/food/RestaurantList";
import FoodMap from "@/components/food/FoodMap";
import RestaurantDetailPanel from "@/components/food/RestaurantDetailPanel";
import { MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Possible animation states for the panel content
type LangTransition = "idle" | "out" | "in";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [langTransition, setLangTransition] = useState<LangTransition>("idle");
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleLanguage = () => {
    // Prevent double-click during transition
    if (langTransition !== "idle") return;

    // Start spinning the globe icon
    setSpinning(true);
    setTimeout(() => setSpinning(false), 450);

    // Phase 1: fade out
    setLangTransition("out");

    // Phase 2: switch language at the halfway point
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const nextLang = i18n.language === "en" ? "zh" : "en";
      i18n.changeLanguage(nextLang);
      // Phase 3: fade in
      setLangTransition("in");

      timerRef.current = setTimeout(() => {
        setLangTransition("idle");
      }, 260);
    }, 200);
  };

  const panelContentClass = cn(
    langTransition === "out" && "lang-transition-out",
    langTransition === "in" && "lang-transition-in"
  );

  return (
    <div className="food-layout">
      {/* ── Left Panel ─────────────────────────── */}
      <aside className="food-panel">
        <div className="food-panel__header">
          <div className="food-panel__logo">
            <MapPin size={18} className="food-panel__logo-icon" />
          </div>
          <div className={cn("flex-1", panelContentClass)}>
            <h1 className="food-panel__title">{t("app.title")}</h1>
            <p className="food-panel__subtitle">{t("app.subtitle")}</p>
          </div>
          <button
            className={cn("lang-toggle", spinning && "lang-toggle--spinning")}
            onClick={toggleLanguage}
            title="Toggle Language"
          >
            <Globe size={16} className="lang-toggle-icon" />
            <span className={panelContentClass}>
              {i18n.language === "en" ? "中" : "EN"}
            </span>
          </button>
        </div>
        <div className={cn("food-panel__search", panelContentClass)}>
          <SearchBar />
        </div>
        <div className={cn("food-panel__filters", panelContentClass)}>
          <FilterBar />
        </div>
        <div className={cn("food-panel__list", panelContentClass)}>
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
