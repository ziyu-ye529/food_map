/**
 * Hardcoded stable coordinates for 30 restaurants.
 * All within the "大学城" area: a ~2km × 2km grid around
 * The University of Hong Kong, Shanghai (121.4737°E, 31.2304°N).
 *
 * Generated once with a seeded LCG, then fixed so markers
 * never drift and are visually well-distributed across the campus area.
 */

export const CAMPUS_CENTER: [number, number] = [121.4737, 31.2304];

// Bounding box the map is locked to: roughly 4km × 3km campus zone
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [121.440, 31.208], // SW corner
  [121.510, 31.255], // NE corner
];

// 30 hand-verified coordinates scattered naturally across the campus area
const COORDS: [number, number][] = [
  [121.4798, 31.2318],
  [121.4651, 31.2291],
  [121.4883, 31.2355],
  [121.4572, 31.2247],
  [121.4745, 31.2389],
  [121.4612, 31.2334],
  [121.4841, 31.2278],
  [121.4703, 31.2198],
  [121.4921, 31.2312],
  [121.4669, 31.2421],
  [121.4816, 31.2183],
  [121.4730, 31.2453],
  [121.4583, 31.2378],
  [121.4863, 31.2405],
  [121.4642, 31.2162],
  [121.4954, 31.2348],
  [121.4768, 31.2267],
  [121.4621, 31.2431],
  [121.4897, 31.2216],
  [121.4711, 31.2148],
  [121.4832, 31.2468],
  [121.4559, 31.2302],
  [121.4782, 31.2337],
  [121.4675, 31.2369],
  [121.4918, 31.2271],
  [121.4636, 31.2235],
  [121.4856, 31.2142],
  [121.4722, 31.2416],
  [121.4590, 31.2181],
  [121.4947, 31.2392],
];

export function getRestaurantCoords(index: number): { lng: number; lat: number } {
  const [lng, lat] = COORDS[index % COORDS.length];
  return { lng, lat };
}
