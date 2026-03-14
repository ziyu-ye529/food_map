import { ChevronDown } from "lucide-react";
import { useRestaurantStore, ALL_TAGS } from "@/stores/restaurantStore";
import { cn } from "@/lib/utils";

const NOISE_LEVELS = ["All", "Quiet", "Moderate", "Loud"] as const;

export default function FilterBar() {
  const filterOpenNow = useRestaurantStore((s) => s.filterOpenNow);
  const filterStudentDiscount = useRestaurantStore((s) => s.filterStudentDiscount);
  const filterWifi = useRestaurantStore((s) => s.filterWifi);
  const filterNoiseLevel = useRestaurantStore((s) => s.filterNoiseLevel);
  const filterTags = useRestaurantStore((s) => s.filterTags);
  const toggleOpenNow = useRestaurantStore((s) => s.toggleOpenNow);
  const toggleStudentDiscount = useRestaurantStore((s) => s.toggleStudentDiscount);
  const toggleWifi = useRestaurantStore((s) => s.toggleWifi);
  const setNoiseLevel = useRestaurantStore((s) => s.setNoiseLevel);
  const toggleTag = useRestaurantStore((s) => s.toggleTag);

  return (
    <div className="filter-bar">
      {/* Quick toggle chips */}
      <div className="filter-bar__chips">
        <button
          className={cn("filter-chip", filterOpenNow && "filter-chip--active")}
          onClick={toggleOpenNow}
        >
          <span className={cn("filter-chip__dot", filterOpenNow ? "filter-chip__dot--green" : "filter-chip__dot--gray")} />
          Open Now
        </button>

        <button
          className={cn("filter-chip", filterStudentDiscount && "filter-chip--active")}
          onClick={toggleStudentDiscount}
        >
          🎓 Student Deal
        </button>

        <button
          className={cn("filter-chip", filterWifi && "filter-chip--active")}
          onClick={toggleWifi}
        >
          📶 WiFi
        </button>

        {/* Noise level dropdown */}
        <div className="filter-chip filter-chip--select">
          <ChevronDown size={12} />
          <select
            className="filter-chip__select"
            value={filterNoiseLevel}
            onChange={(e) => setNoiseLevel(e.target.value as typeof filterNoiseLevel)}
          >
            {NOISE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level === "All" ? "🔊 Noise" : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tag chips */}
      <div className="filter-bar__tags">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            className={cn("tag-chip", filterTags.includes(tag) && "tag-chip--active")}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
