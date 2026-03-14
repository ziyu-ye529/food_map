import type { FeatureCollection, Point } from "geojson";

export const DEMO_SOURCE_ID = "demo-geojson";
export const DEMO_LAYER_ID = "demo-points";

export function buildDemoGeoJson(center: { lng: number; lat: number }): FeatureCollection<Point, Record<string, unknown>> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Demo A", category: "example" },
        geometry: { type: "Point", coordinates: [center.lng, center.lat] },
      },
      {
        type: "Feature",
        properties: { name: "Demo B", category: "example" },
        geometry: { type: "Point", coordinates: [center.lng + 0.03, center.lat + 0.02] },
      },
      {
        type: "Feature",
        properties: { name: "Demo C", category: "example" },
        geometry: { type: "Point", coordinates: [center.lng - 0.035, center.lat - 0.015] },
      },
    ],
  };
}
