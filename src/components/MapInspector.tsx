import { Info } from "lucide-react";
import { useMemo } from "react";
import { useMapUiStore } from "@/stores/mapUiStore";

function fmtTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function kvRows(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .slice(0, 20)
    .map(([k, v]) => ({ k, v: typeof v === "string" ? v : JSON.stringify(v) }));
}

export default function MapInspector() {
  const view = useMapUiStore((s) => s.view);
  const lastEvt = useMapUiStore((s) => s.lastPointerEvent);
  const selected = useMapUiStore((s) => s.selectedFeature);
  const error = useMapUiStore((s) => s.mapError);

  const selectedRows = useMemo(() => {
    if (!selected) return [];
    return kvRows(selected.properties);
  }, [selected]);

  return (
    <div className="flex h-full flex-col text-[#E6EAF2]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <Info className="h-4 w-4 text-[#AAB3C5]" />
        <div className="text-sm font-semibold">Inspector</div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-3">
          <section className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-[#AAB3C5]">运行状态</div>
            <div className="mt-2 grid gap-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">Map 状态</span>
                <span className={error ? "text-rose-300" : "text-emerald-300"}>{error ? "Error" : "OK"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">View</span>
                <span className="font-mono text-xs">
                  {view
                    ? `${view.lng}, ${view.lat} | z${view.zoom} | b${view.bearing} | p${view.pitch}`
                    : "-"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-[#AAB3C5]">交互事件</div>
            <div className="mt-2 grid gap-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">Last</span>
                <span>{lastEvt ? lastEvt.type : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">LngLat</span>
                <span className="font-mono text-xs">{lastEvt ? `${lastEvt.lng}, ${lastEvt.lat}` : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">Zoom</span>
                <span className="font-mono text-xs">{lastEvt ? lastEvt.zoom : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#AAB3C5]">Time</span>
                <span className="font-mono text-xs">{lastEvt ? fmtTime(lastEvt.at) : "-"}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-semibold text-[#AAB3C5]">选中要素属性</div>
            {!selected ? (
              <div className="mt-2 text-sm text-[#AAB3C5]">点击示例点或地图以查看属性。</div>
            ) : (
              <div className="mt-2">
                <div className="text-sm">
                  <span className="text-[#AAB3C5]">Layer</span> <span className="font-mono">{selected.layerId}</span>
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-white/10">
                  <table className="w-full text-left text-xs">
                    <tbody>
                      {selectedRows.map((r) => (
                        <tr key={r.k} className="border-b border-white/5 last:border-b-0">
                          <td className="w-32 px-2 py-1 font-mono text-[#AAB3C5]">{r.k}</td>
                          <td className="px-2 py-1 font-mono text-[#E6EAF2]">{r.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

