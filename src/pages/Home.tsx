import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import SearchBar from "@/components/food/SearchBar";
import FilterBar from "@/components/food/FilterBar";
import RestaurantList from "@/components/food/RestaurantList";
import FoodMap from "@/components/food/FoodMap";
import RestaurantDetailPanel from "@/components/food/RestaurantDetailPanel";
import { MapPin, Globe, User as UserIcon, ChevronDown } from "lucide-react";
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
          <div className={cn("flex-1 min-w-0 cursor-pointer p-0.5 rounded-lg hover:bg-white/40 transition-all group relative", panelContentClass)} onClick={() => setProfileOpen(true)}>
            {/* Line 1: System Title */}
            <h1 className="text-[13px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="text-orange-600">●</span>
              {t("app.title")}
            </h1>
            
            {/* Line 2: User Name */}
            <div className="flex items-center gap-2 mt-0.5">
              {isLoggedIn ? (
                <span className="text-[13px] font-semibold text-gray-800">
                  {user.name}
                </span>
              ) : (
                <span className="text-[13px] text-orange-500 font-bold">{t('profile.loginBtn')}</span>
              )}
            </div>

            {/* Line 3: School · Major */}
            {isLoggedIn && (
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500 font-medium">
                <span className="truncate">{user.school}</span>
                <span className="text-gray-300">·</span>
                <span className="truncate">{user.major}</span>
              </div>
            )}

            {/* Click Cue */}
            <div className="flex items-center gap-0.5 text-[9px] text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 pr-1">
              <span>{t('profile.clickToView')}</span>
              <ChevronDown size={8} className="-rotate-90" />
            </div>
          </div>

          <div className="flex-shrink-0">
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
