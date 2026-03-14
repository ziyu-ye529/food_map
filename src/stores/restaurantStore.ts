import { create } from "zustand";
import type { Restaurant } from "@/types/restaurant";
import restaurantsRaw from "../../source/restaurants.json";
import { getRestaurantCoords } from "@/utils/restaurantCoords";

// Assign stable coordinates to every restaurant
const ALL_RESTAURANTS: Restaurant[] = (restaurantsRaw as Restaurant[]).map((r, i) => ({
  ...r,
  ...getRestaurantCoords(i),
}));

const ALL_TAGS = [
  "Late Night Bites",
  "Study Cafes",
  "Quick Bite",
  "Date Night",
  "Cheap Eats",
  "Group Friendly",
] as const;

export { ALL_TAGS };

type FilterState = {
  searchQuery: string;
  filterOpenNow: boolean;
  filterStudentDiscount: boolean;
  filterWifi: boolean;
  filterNoiseLevel: "All" | "Quiet" | "Moderate" | "Loud";
  filterTags: string[];
};

type RestaurantState = FilterState & {
  restaurants: Restaurant[];
  /** IDs of cards currently selected for detail view (multi-select) */
  selectedIds: string[];
  hoveredId: string | null;
  // Actions
  setSearch: (q: string) => void;
  toggleOpenNow: () => void;
  toggleStudentDiscount: () => void;
  toggleWifi: () => void;
  setNoiseLevel: (level: "All" | "Quiet" | "Moderate" | "Loud") => void;
  toggleTag: (tag: string) => void;
  clearAllFilters: () => void;
  /** Toggle a restaurant into/out of selectedIds */
  toggleSelected: (id: string) => void;
  /** Deselect a single restaurant */
  deselect: (id: string) => void;
  /** Clear all selections */
  clearSelected: () => void;
  setHoveredId: (id: string | null) => void;
};

function applyFilters(
  restaurants: Restaurant[],
  filters: FilterState
): Restaurant[] {
  const q = filters.searchQuery.toLowerCase().trim();

  return restaurants.filter((r) => {
    if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) {
      return false;
    }
    if (filters.filterOpenNow && !r.isOpenNow) return false;
    if (filters.filterStudentDiscount && !r.hasStudentDiscount) return false;
    if (filters.filterWifi && !r.studyFriendly.hasWifi) return false;
    if (filters.filterNoiseLevel !== "All" && r.studyFriendly.noiseLevel !== filters.filterNoiseLevel) {
      return false;
    }
    if (
      filters.filterTags.length > 0 &&
      !filters.filterTags.some((tag) => r.tags.includes(tag))
    ) {
      return false;
    }
    return true;
  });
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: ALL_RESTAURANTS,
  selectedIds: [],
  hoveredId: null,

  // Filter state
  searchQuery: "",
  filterOpenNow: false,
  filterStudentDiscount: false,
  filterWifi: false,
  filterNoiseLevel: "All",
  filterTags: [],

  // Actions
  setSearch: (searchQuery) => set({ searchQuery }),
  toggleOpenNow: () => set((s) => ({ filterOpenNow: !s.filterOpenNow })),
  toggleStudentDiscount: () => set((s) => ({ filterStudentDiscount: !s.filterStudentDiscount })),
  toggleWifi: () => set((s) => ({ filterWifi: !s.filterWifi })),
  setNoiseLevel: (filterNoiseLevel) => set({ filterNoiseLevel }),
  toggleTag: (tag) =>
    set((s) => ({
      filterTags: s.filterTags.includes(tag)
        ? s.filterTags.filter((t) => t !== tag)
        : [...s.filterTags, tag],
    })),
  clearAllFilters: () =>
    set({
      searchQuery: "",
      filterOpenNow: false,
      filterStudentDiscount: false,
      filterWifi: false,
      filterNoiseLevel: "All",
      filterTags: [],
    }),

  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  deselect: (id) =>
    set((s) => ({ selectedIds: s.selectedIds.filter((x) => x !== id) })),
  clearSelected: () => set({ selectedIds: [] }),
  setHoveredId: (hoveredId) => set({ hoveredId }),
}));

// Derived selectors
export function selectFilteredRestaurants(state: RestaurantState): Restaurant[] {
  const filtered = applyFilters(state.restaurants, state);
  // Sort by distance from close to far
  return filtered.sort((a, b) => a.distance - b.distance);
}

export function selectHasActiveFilters(state: RestaurantState): boolean {
  return (
    state.searchQuery.trim() !== "" ||
    state.filterOpenNow ||
    state.filterStudentDiscount ||
    state.filterWifi ||
    state.filterNoiseLevel !== "All" ||
    state.filterTags.length > 0
  );
}

export function selectSelectedRestaurants(state: RestaurantState): Restaurant[] {
  return state.selectedIds
    .map((id) => state.restaurants.find((r) => r.id === id))
    .filter(Boolean) as Restaurant[];
}
