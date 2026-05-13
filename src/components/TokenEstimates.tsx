import type { TokenEstimate } from "@/types";
import { ConfidenceBadge } from "./Badge";
import { formatNumber } from "@/utils/copy";

const familyIcons: Record<string, string> = {
  openai: "🤖",
  anthropic: "🔷",
  google: "🌀",
  meta: "🦙",
  mistral: "🌪️",
  xai: "✖️",
  deepseek: "🐋",
};

interface TokenEstimatesProps {
  estimates: TokenEstimate[];
}

export function TokenEstimates({ estimates }: TokenEstimatesProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Token Usage Estimation
        </h2>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-3 mb-5 text-xs text-blue-300 leading-relaxed">
        <span className="font-semibold">Important:</span> These are estimates based on character/word heuristics.
        Consumer apps (ChatGPT, Claude.ai, Cursor, Grok) inject hidden system prompts, memory, tools, and agent context —
        their true token counts are higher and not externally observable. API usage with known payloads will be more accurate.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Family</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Input</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Output Budget</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Context</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {estimates.map((est) => (
              <TokenRow key={est.family} estimate={est} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TokenRow({ estimate: est }: { estimate: TokenEstimate }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors group">
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{familyIcons[est.icon] ?? "🔹"}</span>
          <div>
            <div className="text-slate-200 font-medium text-xs">{est.family}</div>
            <div className="text-[10px] text-slate-600 hidden group-hover:block">
              {est.models.join(", ")}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="text-slate-200 font-mono text-xs tabular-nums">
          {formatNumber(est.inputTokens)}
        </span>
      </td>
      <td className="py-3 px-3 text-right hidden sm:table-cell">
        <span className="text-slate-400 font-mono text-xs tabular-nums">
          {formatNumber(est.safeOutputBudget)}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="text-slate-500 font-mono text-xs tabular-nums">
          {formatNumber(est.contextWindow)}
        </span>
      </td>
      <td className="py-3 px-3">
        <div className="flex flex-col gap-1">
          <ConfidenceBadge confidence={est.confidence} />
          <div className="text-[10px] text-slate-600 hidden group-hover:block leading-tight max-w-xs">
            {est.note}
          </div>
        </div>
      </td>
    </tr>
  );
}
