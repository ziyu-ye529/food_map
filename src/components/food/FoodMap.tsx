import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useShallow } from "zustand/react/shallow";
import { useRestaurantStore, selectFilteredRestaurants } from "@/stores/restaurantStore";
import { ratingColor, cuisineEmoji } from "@/utils/helpers";
import { CAMPUS_CENTER, CAMPUS_BOUNDS } from "@/utils/restaurantCoords";
import type { Restaurant } from "@/types/restaurant";

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;
const STYLE_URL = "mapbox://styles/mapbox/light-v11";
const ZOOM = 14;
const MIN_ZOOM = 12.5;
const MAX_ZOOM = 17;

function createMarkerEl(r: Restaurant): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "food-marker";
  wrap.dataset.id = r.id;

  const color = ratingColor(r.rating);
  const pin = document.createElement("div");
  pin.className = "food-marker__pin";
  pin.style.setProperty("--marker-color", color);
  pin.innerHTML = `<span class="food-marker__emoji">${cuisineEmoji(r.cuisine)}</span>`;

  const label = document.createElement("div");
  label.className = "food-marker__label";
  label.textContent = r.name;

  wrap.appendChild(pin);
  wrap.appendChild(label);
  return wrap;
}

export default function FoodMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; el: HTMLElement }>>(new Map());
  const initializedRef = useRef(false);

  const restaurants = useRestaurantStore((s) => s.restaurants);
  const filteredRestaurants = useRestaurantStore(useShallow(selectFilteredRestaurants));
  // Multi-select: use selectedIds array
  const selectedIds = useRestaurantStore(useShallow((s) => s.selectedIds));
  const hoveredId = useRestaurantStore((s) => s.hoveredId);
  const toggleSelected = useRestaurantStore((s) => s.toggleSelected);

  // Initialize map once
  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;

    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: CAMPUS_CENTER,
      zoom: ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: CAMPUS_BOUNDS,
      bearing: 0,
      pitch: 0,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-left");

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current!);

    map.on("load", () => {
      // Add current location marker (center of campus)
      const locEl = document.createElement("div");
      locEl.className = "current-location-marker";
      locEl.innerHTML = `<div class="current-location-marker__pulse"></div><div class="current-location-marker__dot"></div>`;
      
      const locMarker = new mapboxgl.Marker({ element: locEl, anchor: "center" })
        .setLngLat(CAMPUS_CENTER)
        .addTo(map);

      // Add restaurant markers
      restaurants.forEach((r) => {
        if (r.lng === undefined || r.lat === undefined) return;
        const el = createMarkerEl(r);
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([r.lng, r.lat])
          .addTo(map);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          useRestaurantStore.getState().toggleSelected(r.id);
        });

        markersRef.current.set(r.id, { marker, el });
      });

      // Track location marker so we can clean it up
      markersRef.current.set("__current_location__", { marker: locMarker, el: locEl });
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      ro.disconnect();
      initializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filtered: show/hide markers
  useEffect(() => {
    const filteredSet = new Set(filteredRestaurants.map((r) => r.id));
    markersRef.current.forEach(({ el }, id) => {
      el.style.display = filteredSet.has(id) ? "" : "none";
    });
  }, [filteredRestaurants]);

  // Sync hoveredId
  useEffect(() => {
    markersRef.current.forEach(({ el }, id) => {
      el.classList.toggle("food-marker--hovered", id === hoveredId);
    });
  }, [hoveredId]);

  // Track previous selectedIds to detect additions vs removals
  const prevSelectedIdsRef = useRef<string[]>([]);
  // Debounce timer for map movement — so rapid selections only animate once
  const mapMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Part 1: update marker visuals IMMEDIATELY (no debounce) ────────────
  useEffect(() => {
    const selectedSet = new Set(selectedIds);
    markersRef.current.forEach(({ el }, id) => {
      if (selectedSet.has(id)) {
        el.classList.add("food-marker--active");
        el.classList.remove("food-marker--hovered");
        el.dataset.selectionOrder = String(selectedIds.indexOf(id) + 1);
      } else {
        el.classList.remove("food-marker--active");
        delete el.dataset.selectionOrder;
      }
    });
    prevSelectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  // ── Part 2: map movement, DEBOUNCED 280ms ───────────────────────────────
  // Cancels any in-progress timer on every new selection, so the map only
  // starts moving to the *final* target after the user pauses clicking.
  useEffect(() => {
    // Clear any pending move timer — the cleanup also runs, but this guards
    // against the edge case where cleanup runs AFTER the timer fires.
    if (mapMoveTimerRef.current !== null) {
      clearTimeout(mapMoveTimerRef.current);
      mapMoveTimerRef.current = null;
    }

    if (selectedIds.length === 0) return;

    // Debounce ALL camera moves at 280ms so rapid clicks collapse into one.
    mapMoveTimerRef.current = setTimeout(() => {
      const currentMap = mapRef.current;
      if (!currentMap) return;

      // ⚠️ Stop any in-flight animation FIRST — this prevents the
      // "jump to [0,0] / top-left" artifact caused by interrupting
      // an active flyTo/easeTo/fitBounds with a new one.
      currentMap.stop();

      const mapH = containerRef.current?.offsetHeight ?? 0;
      const mapW = containerRef.current?.offsetWidth ?? 0;

      // Measure panel height so markers aren't hidden behind it
      const panelEl = containerRef.current
        ?.closest(".food-map-container")
        ?.querySelector(".detail-panel") as HTMLElement | null;
      const panelH = panelEl && panelEl.offsetHeight > 0 ? panelEl.offsetHeight : 320;
      
      if (selectedIds.length === 1) {
        const entry = markersRef.current.get(selectedIds[0]);
        if (entry) {
          // For single selection, push the center point upwards by padding the bottom
          // so the marker stays comfortably above the detail card.
          const singleSafeBottom = Math.min(panelH + 40, Math.max(0, mapH * 0.5));
          
          currentMap.easeTo({
            center: entry.marker.getLngLat(),
            zoom: Math.max(currentMap.getZoom(), 15),
            padding: { bottom: singleSafeBottom, top: 0, left: 0, right: 0 },
            duration: 480,
          });
        }
        return;
      }

      // 2+ selected: fitBounds to show all markers above the compare panel
      const lngLats = selectedIds
        .map((id) => markersRef.current.get(id)?.marker.getLngLat())
        .filter(Boolean) as mapboxgl.LngLat[];
      if (lngLats.length < 2) return;

      const selectionBounds = lngLats.reduce(
        (b, ll) => b.extend(ll),
        new mapboxgl.LngLatBounds(lngLats[0], lngLats[0])
      );

      // CRITICAL FIX: If padding top+bottom >= container height, Mapbox math breaks 
      // and jumps to top-left [0,0]. We strictly clamp padding to a safe percentage of map size.
      // Dialed back slightly: +80px buffer, max 55% of map height to avoid overflow bugs
      const safeBottom = Math.min(panelH + 80, Math.max(0, mapH * 0.55));
      const safeTop = Math.min(100, Math.max(0, mapH * 0.15));
      const safeLR = Math.min(80, Math.max(0, mapW * 0.15));
      const padding = { top: safeTop, bottom: safeBottom, left: safeLR, right: safeLR };

      // Skip if all markers already sit inside the effective visible area
      const visibleBounds = currentMap.getBounds();
      const latSpan = visibleBounds.getNorth() - visibleBounds.getSouth();
      const lngSpan = visibleBounds.getEast() - visibleBounds.getWest();
      
      const effSouth = visibleBounds.getSouth() + latSpan * (mapH > 0 ? safeBottom / mapH : 0);
      const effNorth = visibleBounds.getNorth() - latSpan * (mapH > 0 ? safeTop / mapH : 0);
      const effWest  = visibleBounds.getWest()  + lngSpan * (mapW > 0 ? safeLR / mapW : 0);
      const effEast  = visibleBounds.getEast()  - lngSpan * (mapW > 0 ? safeLR / mapW : 0);
      
      const sw = selectionBounds.getSouthWest();
      const ne = selectionBounds.getNorthEast();

      if (
        sw.lat >= effSouth && ne.lat <= effNorth &&
        sw.lng >= effWest  && ne.lng <= effEast
      ) return; // already fully visible — skip animation

      currentMap.fitBounds(selectionBounds, { padding, maxZoom: 15, duration: 560 });
    }, 280);

    // Cleanup: always cancel the pending timer on re-render
    return () => {
      if (mapMoveTimerRef.current !== null) {
        clearTimeout(mapMoveTimerRef.current);
        mapMoveTimerRef.current = null;
      }
    };
  }, [selectedIds]);


  // Click map background → clear all selections
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = () => useRestaurantStore.getState().clearSelected();
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [toggleSelected]);

  return (
    <div className="food-map-root">
      <div ref={containerRef} className="food-map-canvas" />
    </div>
  );
}
