import MapInspector from "@/components/MapInspector";
import MapboxMap from "@/components/MapboxMap";

export default function Home() {
  return (
    <div className="grid h-[calc(100vh-56px)] grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0B1220]">
        <MapboxMap
          accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          styleUrl="mapbox://styles/mapbox/dark-v11"
          showDemoGeoJson
          showDemoMarkers
          initialView={{ lng: 121.4737, lat: 31.2304, zoom: 11.5, bearing: 0, pitch: 0 }}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111A2E]">
        <MapInspector />
      </div>
    </div>
  );
}
