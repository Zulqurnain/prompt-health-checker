import { clsx } from "clsx";
import type { StrengthLabel } from "@/types";

interface HealthScoreProps {
  score: number;
  strength: StrengthLabel;
  wordCount: number;
  charCount: number;
  sentenceCount: number;
}

const strengthConfig: Record<StrengthLabel, { color: string; ring: string; glow: string; emoji: string }> = {
  Weak:   { color: "text-red-400",     ring: "stroke-red-500",    glow: "shadow-red-500/20",    emoji: "⚠️" },
  Fair:   { color: "text-orange-400",  ring: "stroke-orange-500", glow: "shadow-orange-500/20", emoji: "📊" },
  Good:   { color: "text-yellow-400",  ring: "stroke-yellow-500", glow: "shadow-yellow-500/20", emoji: "✓" },
  Strong: { color: "text-blue-400",    ring: "stroke-blue-500",   glow: "shadow-blue-500/20",   emoji: "💪" },
  Expert: { color: "text-emerald-400", ring: "stroke-emerald-500",glow: "shadow-emerald-500/20",emoji: "⭐" },
};

const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

export function HealthScore({ score, strength, wordCount, charCount, sentenceCount }: HealthScoreProps) {
  const cfg = strengthConfig[strength];
  const offset = CIRC - (score / 100) * CIRC;

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Prompt Health Score
      </h2>
      <div className="flex items-center gap-8">
        {/* Ring chart */}
        <div className={clsx("relative flex-shrink-0 rounded-full shadow-xl", cfg.glow)}>
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            {/* Background track */}
            <circle
              cx="70" cy="70" r={RADIUS}
              fill="none"
              stroke="rgba(148,163,184,0.1)"
              strokeWidth="10"
            />
            {/* Progress arc */}
            <circle
              cx="70" cy="70" r={RADIUS}
              fill="none"
              className={cfg.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx("text-3xl font-bold tabular-nums", cfg.color)}>{score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>

        {/* Labels */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">Strength Rating</div>
            <div className={clsx("text-2xl font-bold", cfg.color)}>
              {cfg.emoji} {strength}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatPill label="Words" value={wordCount} />
            <StatPill label="Chars" value={charCount} />
            <StatPill label="Sentences" value={sentenceCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800/60 rounded-lg px-3 py-2">
      <div className="text-lg font-semibold text-slate-200 tabular-nums">{value.toLocaleString()}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}
