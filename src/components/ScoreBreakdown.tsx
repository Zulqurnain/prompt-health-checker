import { clsx } from "clsx";
import type { ScoreBreakdown } from "@/types";
import { SCORE_WEIGHTS } from "@/config/scoring";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

const dimensions: Array<{ key: keyof Omit<ScoreBreakdown, "penalties">; label: string; description: string }> = [
  { key: "clarity",      label: "Clarity",       description: "How clear and direct the task is" },
  { key: "specificity",  label: "Specificity",   description: "Amount of concrete, specific detail" },
  { key: "context",      label: "Context",       description: "Background information provided" },
  { key: "constraints",  label: "Constraints",   description: "Scope limits and restrictions defined" },
  { key: "outputFormat", label: "Output Format", description: "Desired format clearly specified" },
  { key: "examples",     label: "Examples",      description: "Sample inputs or outputs provided" },
  { key: "audience",     label: "Audience",      description: "Target reader or user defined" },
  { key: "tone",         label: "Tone",          description: "Communication style specified" },
  { key: "predictability", label: "Predictability", description: "How well AI can predict desired output" },
  { key: "completeness", label: "Completeness",  description: "Coverage of all required components" },
];

function ScoreBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 70 ? "bg-emerald-500" :
    pct >= 40 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="flex items-center gap-3 group">
      <div className="w-28 text-xs text-slate-400 text-right shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-12 text-right text-xs tabular-nums">
        <span className={
          pct >= 70 ? "text-emerald-400" :
          pct >= 40 ? "text-yellow-400" :
          "text-red-400"
        }>{value}</span>
        <span className="text-slate-600">/{max}</span>
      </div>
    </div>
  );
}

export function ScoreBreakdownCard({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
        Score Breakdown
      </h2>
      <div className="flex flex-col gap-3">
        {dimensions.map(({ key, label }) => (
          <ScoreBar
            key={key}
            value={breakdown[key]}
            max={SCORE_WEIGHTS[key]}
            label={label}
          />
        ))}
        {/* Penalties row */}
        {breakdown.penalties < 0 && (
          <div className="flex items-center gap-3 mt-1 pt-3 border-t border-slate-800">
            <div className="w-28 text-xs text-red-400 text-right shrink-0">Penalties</div>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-red-600 ml-auto"
                style={{ width: `${Math.abs(breakdown.penalties) / 25 * 100}%` }}
              />
            </div>
            <div className="w-12 text-right text-xs tabular-nums text-red-400">
              {breakdown.penalties}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
