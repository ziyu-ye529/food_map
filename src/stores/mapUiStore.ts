import { create } from "zustand";

export type MapViewState = {
  lng: number;
  lat: number;
  zoom: number;
  bearing: number;
  pitch: number;
};

export type MapPointerEvent = {
  type: "click" | "move";
  lng: number;
  lat: number;
  zoom: number;
  at: number;
};

export type MapFeatureSelection = {
  layerId: string;
  properties: Record<string, unknown>;
};

type MapUiState = {
  view: MapViewState | null;
  lastPointerEvent: MapPointerEvent | null;
  selectedFeature: MapFeatureSelection | null;
  mapError: string | null;
  setView: (view: MapViewState) => void;
  setLastPointerEvent: (evt: MapPointerEvent) => void;
  setSelectedFeature: (sel: MapFeatureSelection | null) => void;
  setMapError: (error: string | null) => void;
};

export const useMapUiStore = create<MapUiState>((set) => ({
  view: null,
  lastPointerEvent: null,
  selectedFeature: null,
  mapError: null,
  setView: (view) => set({ view }),
  setLastPointerEvent: (lastPointerEvent) => set({ lastPointerEvent }),
  setSelectedFeature: (selectedFeature) => set({ selectedFeature }),
  setMapError: (mapError) => set({ mapError }),
}));

