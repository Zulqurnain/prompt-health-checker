import { clsx } from "clsx";
import type { StrengthLabel, ConfidenceLevel } from "@/types";

type BadgeVariant = "strength" | "confidence" | "priority" | "status";

const strengthColors: Record<StrengthLabel, string> = {
  Weak: "bg-red-500/15 text-red-400 border-red-500/30",
  Fair: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Good: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Strong: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const confidenceColors: Record<ConfidenceLevel, string> = {
  Exact: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "High Confidence": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Estimated: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Low Confidence": "bg-red-500/15 text-red-400 border-red-500/30",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  strengthLabel?: StrengthLabel;
  confidenceLabel?: ConfidenceLevel;
  className?: string;
}

export function Badge({ label, variant = "status", strengthLabel, confidenceLabel, className }: BadgeProps) {
  const baseClass = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border";

  if (variant === "strength" && strengthLabel) {
    return (
      <span className={clsx(baseClass, strengthColors[strengthLabel], className)}>
        {label}
      </span>
    );
  }

  if (variant === "confidence" && confidenceLabel) {
    return (
      <span className={clsx(baseClass, confidenceColors[confidenceLabel], className)}>
        {label}
      </span>
    );
  }

  return (
    <span className={clsx(baseClass, "bg-slate-700/50 text-slate-300 border-slate-600/50", className)}>
      {label}
    </span>
  );
}

export function StrengthBadge({ strength }: { strength: StrengthLabel }) {
  return <Badge label={strength} variant="strength" strengthLabel={strength} />;
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  return <Badge label={confidence} variant="confidence" confidenceLabel={confidence} />;
}
