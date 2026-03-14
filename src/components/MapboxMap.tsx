import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { type Map as MapboxMapInstance, type MapboxGeoJSONFeature } from "mapbox-gl";
import { useMapUiStore, type MapViewState } from "@/stores/mapUiStore";
import { buildDemoGeoJson, DEMO_LAYER_ID, DEMO_SOURCE_ID } from "@/utils/mapboxDemo";

type Props = {
  accessToken?: string;
  styleUrl: string;
  initialView: MapViewState;
  viewOverride?: Partial<MapViewState>;
  showDemoMarkers?: boolean;
  showDemoGeoJson?: boolean;
};

function formatError(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}

function pickProps(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object") return {};
  return input as Record<string, unknown>;
}

export default function MapboxMap({
  accessToken,
  styleUrl,
  initialView,
  viewOverride,
  showDemoGeoJson = true,
  showDemoMarkers = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMapInstance | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafMoveRef = useRef<number | null>(null);
  const styleRef = useRef<string>(styleUrl);
  const togglesRef = useRef({ showDemoGeoJson, showDemoMarkers });

  const setView = useMapUiStore((s) => s.setView);
  const setLastPointerEvent = useMapUiStore((s) => s.setLastPointerEvent);
  const setSelectedFeature = useMapUiStore((s) => s.setSelectedFeature);
  const setMapError = useMapUiStore((s) => s.setMapError);
  const mapError = useMapUiStore((s) => s.mapError);

  const effectiveView = useMemo<MapViewState>(() => {
    return {
      lng: viewOverride?.lng ?? initialView.lng,
      lat: viewOverride?.lat ?? initialView.lat,
      zoom: viewOverride?.zoom ?? initialView.zoom,
      bearing: viewOverride?.bearing ?? initialView.bearing,
      pitch: viewOverride?.pitch ?? initialView.pitch,
    };
  }, [initialView, viewOverride]);

  const [bootError, setBootError] = useState<string | null>(null);

  const tokenStatus = useMemo(() => {
    if (!accessToken) return "missing";
    if (!accessToken.trim()) return "missing";
    return "ok";
  }, [accessToken]);

  useEffect(() => {
    togglesRef.current = { showDemoGeoJson, showDemoMarkers };
  }, [showDemoGeoJson, showDemoMarkers]);

  useEffect(() => {
    setBootError(null);
    setMapError(null);
    if (tokenStatus !== "ok") return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    try {
      mapboxgl.accessToken = accessToken as string;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: styleUrl,
        center: [effectiveView.lng, effectiveView.lat],
        zoom: effectiveView.zoom,
        bearing: effectiveView.bearing,
        pitch: effectiveView.pitch,
        attributionControl: false,
      });

      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-left");
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

      const ro = new ResizeObserver(() => map.resize());
      ro.observe(containerRef.current);
      resizeObserverRef.current = ro;

      const pushView = () => {
        const center = map.getCenter();
        setView({
          lng: Number(center.lng.toFixed(6)),
          lat: Number(center.lat.toFixed(6)),
          zoom: Number(map.getZoom().toFixed(3)),
          bearing: Number(map.getBearing().toFixed(2)),
          pitch: Number(map.getPitch().toFixed(2)),
        });
      };

      const ensureDemoGeoJson = () => {
        if (!togglesRef.current.showDemoGeoJson) return;
        const data = buildDemoGeoJson({ lng: initialView.lng, lat: initialView.lat });
        if (!map.getSource(DEMO_SOURCE_ID)) {
          map.addSource(DEMO_SOURCE_ID, { type: "geojson", data });
        } else {
          const src = map.getSource(DEMO_SOURCE_ID) as mapboxgl.GeoJSONSource;
          src.setData(data);
        }

        if (!map.getLayer(DEMO_LAYER_ID)) {
          map.addLayer({
            id: DEMO_LAYER_ID,
            type: "circle",
            source: DEMO_SOURCE_ID,
            paint: {
              "circle-radius": 7,
              "circle-color": "#3B82F6",
              "circle-stroke-color": "rgba(255,255,255,0.9)",
              "circle-stroke-width": 1,
              "circle-opacity": 0.95,
            },
          });
        }

        map.setLayoutProperty(DEMO_LAYER_ID, "visibility", togglesRef.current.showDemoGeoJson ? "visible" : "none");
      };

      const removeMarkers = () => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
      };

      const ensureMarkers = () => {
        removeMarkers();
        if (!togglesRef.current.showDemoMarkers) return;
        const m1 = new mapboxgl.Marker({ color: "#22C55E" })
          .setLngLat([initialView.lng + 0.01, initialView.lat + 0.01])
          .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML("<div style='font-size:12px'>Demo Marker</div>"))
          .addTo(map);
        markersRef.current = [m1];
      };

      const trySelectFeature = (features: MapboxGeoJSONFeature[]) => {
        const feature = features[0];
        if (!feature) {
          setSelectedFeature(null);
          return;
        }
        setSelectedFeature({ layerId: feature.layer.id, properties: pickProps(feature.properties) });
      };

      map.on("load", () => {
        pushView();
        ensureDemoGeoJson();
        ensureMarkers();
      });

      map.on("style.load", () => {
        ensureDemoGeoJson();
        ensureMarkers();
      });

      map.on("moveend", () => pushView());

      map.on("click", (e) => {
        setLastPointerEvent({
          type: "click",
          lng: Number(e.lngLat.lng.toFixed(6)),
          lat: Number(e.lngLat.lat.toFixed(6)),
          zoom: Number(map.getZoom().toFixed(3)),
          at: Date.now(),
        });
        const features = map.queryRenderedFeatures(e.point, { layers: [DEMO_LAYER_ID] });
        trySelectFeature(features);
      });

      map.on("mousemove", (e) => {
        if (rafMoveRef.current) return;
        rafMoveRef.current = window.requestAnimationFrame(() => {
          rafMoveRef.current = null;
          setLastPointerEvent({
            type: "move",
            lng: Number(e.lngLat.lng.toFixed(6)),
            lat: Number(e.lngLat.lat.toFixed(6)),
            zoom: Number(map.getZoom().toFixed(3)),
            at: Date.now(),
          });
        });
      });

      map.on("error", (ev) => {
        const err = (ev as { error?: unknown }).error;
        if (!err) return;
        setMapError(formatError(err));
      });

      return () => {
        if (rafMoveRef.current) {
          window.cancelAnimationFrame(rafMoveRef.current);
          rafMoveRef.current = null;
        }
        removeMarkers();
        map.remove();
        mapRef.current = null;
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
      };
    } catch (e) {
      setBootError(formatError(e));
      setMapError(formatError(e));
    }
  }, [
    accessToken,
    effectiveView.bearing,
    effectiveView.lat,
    effectiveView.lng,
    effectiveView.pitch,
    effectiveView.zoom,
    initialView.lat,
    initialView.lng,
    setLastPointerEvent,
    setMapError,
    setSelectedFeature,
    setView,
    styleUrl,
    tokenStatus,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (styleRef.current === styleUrl) return;
    styleRef.current = styleUrl;
    map.setStyle(styleUrl);
  }, [styleUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.isStyleLoaded()) return;

    if (showDemoGeoJson) {
      const data = buildDemoGeoJson({ lng: initialView.lng, lat: initialView.lat });
      if (!map.getSource(DEMO_SOURCE_ID)) {
        map.addSource(DEMO_SOURCE_ID, { type: "geojson", data });
      } else {
        const src = map.getSource(DEMO_SOURCE_ID) as mapboxgl.GeoJSONSource;
        src.setData(data);
      }

      if (!map.getLayer(DEMO_LAYER_ID)) {
        map.addLayer({
          id: DEMO_LAYER_ID,
          type: "circle",
          source: DEMO_SOURCE_ID,
          paint: {
            "circle-radius": 7,
            "circle-color": "#3B82F6",
            "circle-stroke-color": "rgba(255,255,255,0.9)",
            "circle-stroke-width": 1,
            "circle-opacity": 0.95,
          },
        });
      }
    }

    if (map.getLayer(DEMO_LAYER_ID)) {
      map.setLayoutProperty(DEMO_LAYER_ID, "visibility", showDemoGeoJson ? "visible" : "none");
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (showDemoMarkers) {
      const m1 = new mapboxgl.Marker({ color: "#22C55E" })
        .setLngLat([initialView.lng + 0.01, initialView.lat + 0.01])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML("<div style='font-size:12px'>Demo Marker</div>"))
        .addTo(map);
      markersRef.current = [m1];
    }
  }, [initialView.lat, initialView.lng, showDemoGeoJson, showDemoMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({
      center: [effectiveView.lng, effectiveView.lat],
      zoom: effectiveView.zoom,
      bearing: effectiveView.bearing,
      pitch: effectiveView.pitch,
    });
  }, [effectiveView.bearing, effectiveView.lat, effectiveView.lng, effectiveView.pitch, effectiveView.zoom]);

  const overlay = (() => {
    if (tokenStatus !== "ok") {
      return {
        title: "缺少 Mapbox Token",
        body: "请在 .env.local 中配置 VITE_MAPBOX_ACCESS_TOKEN 后重启 dev server。",
      };
    }
    if (bootError) {
      return { title: "地图初始化失败", body: bootError };
    }
    if (mapError) {
      return { title: "地图加载错误", body: mapError };
    }
    return null;
  })();

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {overlay ? (
        <div className="absolute inset-0 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111A2E] p-4 text-[#E6EAF2]">
            <div className="text-sm font-semibold">{overlay.title}</div>
            <div className="mt-2 text-sm text-[#AAB3C5]">{overlay.body}</div>
            <div className="mt-3 text-xs text-[#AAB3C5]">你可以在“关于”页面查看配置方式。</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
