/**
 * Convert pricePerPerson to dollar sign symbols.
 */
export function priceToSymbol(price: number): string {
  if (price <= 10) return "$";
  if (price <= 25) return "$$";
  return "$$$";
}

/**
 * Get rating badge color class based on score.
 */
export function ratingBadgeClass(rating: number): string {
  if (rating >= 4.5) return "rating-badge--green";
  if (rating >= 3.5) return "rating-badge--yellow";
  return "rating-badge--red";
}

/**
 * Get rating hex color for map markers.
 */
export function ratingColor(rating: number): string {
  if (rating >= 4.5) return "#22C55E";
  if (rating >= 3.5) return "#F59E0B";
  return "#EF4444";
}

/**
 * Format distance in meters to human-readable string.
 */
export function formatDistance(meters: number, t?: any): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}${t ? t('card.km') : 'km'}`;
}

/**
 * Get a stable emoji icon for cuisine type.
 */
export function cuisineEmoji(cuisine: string): string {
  const map: Record<string, string> = {
    Italian: "🍝",
    "Fast Food": "🍔",
    Mexican: "🌮",
    Sushi: "🍣",
    "Middle Eastern": "🥙",
    Chinese: "🥡",
    Cafe: "☕",
  };
  return map[cuisine] ?? "🍽️";
}

/**
 * Get gradient background for restaurant image placeholder.
 */
export function cuisinePlaceholderGradient(cuisine: string): string {
  const map: Record<string, string> = {
    Italian: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "Fast Food": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    Mexican: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    Sushi: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "Middle Eastern": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    Chinese: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    Cafe: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  };
  return map[cuisine] ?? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}
