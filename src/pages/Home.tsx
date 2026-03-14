import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import SearchBar from "@/components/food/SearchBar";
import FilterBar from "@/components/food/FilterBar";
import RestaurantList from "@/components/food/RestaurantList";
import FoodMap from "@/components/food/FoodMap";
import RestaurantDetailPanel from "@/components/food/RestaurantDetailPanel";
import { MapPin, Globe, User as UserIcon, ChevronDown, Settings } from "lucide-react";
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
          <div className="food-panel__logo !bg-transparent !shadow-none !w-auto !h-auto">
            <span className="text-3xl filter drop-shadow-sm">🍗</span>
          </div>
          <div className={cn("flex-1 min-w-0 p-0.5 rounded-lg transition-all", panelContentClass)}>
            {/* Line 1: System Title */}
            <h1 className="text-[22px] font-black text-gray-900 tracking-tight leading-none mb-1">
              {t("app.title")}
            </h1>
            
            {/* Line 2: User Name */}
            <div className="mt-2 ml-0.5">
              {isLoggedIn ? (
                <span className="text-[15px] font-bold text-gray-800">
                  {user.name}
                </span>
              ) : (
                <span className="text-[14px] text-orange-500 font-bold cursor-pointer hover:underline" onClick={() => setProfileOpen(true)}>
                  {t('profile.loginBtn')}
                </span>
              )}
            </div>

            {/* Line 3: School · Major */}
            {isLoggedIn && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 ml-0.5 text-[12px] text-gray-500 font-semibold leading-relaxed">
                <span>{user.school}</span>
                <span className="text-gray-300">·</span>
                <span>{user.major}</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center gap-1.5 self-start pt-1">
            <button
              className="lang-toggle !px-2.5"
              onClick={() => setProfileOpen(true)}
              title={t('profile.title')}
            >
              <Settings size={18} className="text-gray-500" />
            </button>
            
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
