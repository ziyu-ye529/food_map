import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import SearchBar from "@/components/food/SearchBar";
import FilterBar from "@/components/food/FilterBar";
import RestaurantList from "@/components/food/RestaurantList";
import FoodMap from "@/components/food/FoodMap";
import RestaurantDetailPanel from "@/components/food/RestaurantDetailPanel";
import { MapPin, Globe, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from '../stores/authStore';
import { ProfileModal } from '../components/auth/ProfileModal';

// Possible animation states for the panel content
type LangTransition = "idle" | "out" | "in";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [langTransition, setLangTransition] = useState<LangTransition>("idle");
  const { user, isLoggedIn } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
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
          <div className={cn("flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity", panelContentClass)} onClick={() => setProfileOpen(true)}>
            <h1 className="food-panel__title truncate">{t("app.title")}</h1>
            <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
              <p className="food-panel__subtitle">{t("app.subtitle")}</p>
              {isLoggedIn ? (
                <>
                  <span className="text-[10px] text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                    <UserIcon size={10} className="text-gray-400" />
                    <span className="truncate max-w-[120px]">{user.school} · {user.major}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span className="text-[10px] text-orange-500 font-bold">{t('profile.loginBtn')}</span>
                </>
              )}
            </div>
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
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
