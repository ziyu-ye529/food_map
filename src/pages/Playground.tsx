import { useMemo, useState } from "react";
import MapInspector from "@/components/MapInspector";
import MapboxMap from "@/components/MapboxMap";
import { type MapViewState } from "@/stores/mapUiStore";

type StylePreset = { label: string; value: string };

const STYLES: StylePreset[] = [
  { label: "Streets", value: "mapbox://styles/mapbox/streets-v12" },
  { label: "Light", value: "mapbox://styles/mapbox/light-v11" },
  { label: "Dark", value: "mapbox://styles/mapbox/dark-v11" },
  { label: "Satellite", value: "mapbox://styles/mapbox/satellite-streets-v12" },
];

const DEFAULT_VIEW: MapViewState = { lng: 121.4737, lat: 31.2304, zoom: 11.5, bearing: 0, pitch: 0 };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function Playground() {
  const [styleUrl, setStyleUrl] = useState(STYLES[2]?.value ?? STYLES[0].value);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showGeo, setShowGeo] = useState(true);
  const [viewDraft, setViewDraft] = useState<MapViewState>(DEFAULT_VIEW);

  const viewOverride = useMemo(() => {
    return {
      lng: viewDraft.lng,
      lat: viewDraft.lat,
      zoom: viewDraft.zoom,
      bearing: viewDraft.bearing,
      pitch: viewDraft.pitch,
    };
  }, [viewDraft]);

  return (
    <div className="grid h-[calc(100vh-56px)] grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0B1220]">
        <MapboxMap
          accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          styleUrl={styleUrl}
          showDemoGeoJson={showGeo}
          showDemoMarkers={showMarkers}
          initialView={DEFAULT_VIEW}
          viewOverride={viewOverride}
        />
      </div>

      <div className="grid h-full grid-rows-[auto_1fr] gap-4">
        <div className="rounded-xl border border-white/10 bg-[#111A2E] p-4 text-[#E6EAF2]">
          <div className="text-sm font-semibold">Playground</div>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-xs font-semibold text-[#AAB3C5]">样式切换</div>
              <select
                value={styleUrl}
                onChange={(e) => setStyleUrl(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none ring-0 focus:border-white/20"
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#0B1220]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#AAB3C5]">视图参数</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="grid gap-1">
                  <span className="text-xs text-[#AAB3C5]">Lng</span>
                  <input
                    value={viewDraft.lng}
                    onChange={(e) => setViewDraft((v) => ({ ...v, lng: Number(e.target.value) }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono outline-none focus:border-white/20"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-[#AAB3C5]">Lat</span>
                  <input
                    value={viewDraft.lat}
                    onChange={(e) => setViewDraft((v) => ({ ...v, lat: Number(e.target.value) }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono outline-none focus:border-white/20"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-[#AAB3C5]">Zoom</span>
                  <input
                    value={viewDraft.zoom}
                    onChange={(e) => setViewDraft((v) => ({ ...v, zoom: clamp(Number(e.target.value), 0, 22) }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono outline-none focus:border-white/20"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-[#AAB3C5]">Bearing</span>
                  <input
                    value={viewDraft.bearing}
                    onChange={(e) => setViewDraft((v) => ({ ...v, bearing: clamp(Number(e.target.value), -180, 180) }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono outline-none focus:border-white/20"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-[#AAB3C5]">Pitch</span>
                  <input
                    value={viewDraft.pitch}
                    onChange={(e) => setViewDraft((v) => ({ ...v, pitch: clamp(Number(e.target.value), 0, 85) }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono outline-none focus:border-white/20"
                  />
                </label>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setViewDraft(DEFAULT_VIEW)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#E6EAF2] transition hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#AAB3C5]">图层/数据开关</div>
              <div className="mt-2 grid gap-2">
                <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm">Demo Marker</span>
                  <input
                    type="checkbox"
                    checked={showMarkers}
                    onChange={(e) => setShowMarkers(e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm">Demo GeoJSON</span>
                  <input
                    type="checkbox"
                    checked={showGeo}
                    onChange={(e) => setShowGeo(e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111A2E]">
          <MapInspector />
        </div>
      </div>
    </div>
  );
}

