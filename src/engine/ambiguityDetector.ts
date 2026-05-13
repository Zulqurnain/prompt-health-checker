import type { AmbiguityIssue } from "@/types";
import { hasContradictoryInstructions, hasMultipleTasks } from "./normalizer";

const VAGUE_PRONOUNS = /\b(it|this|that|they|them|those|these|something|anything|everything)\b/gi;
const OVERBROAD = /\b(everything|all (of|the)|anything|complete|entire|full|whole|comprehensive)\b/gi;

export function detectAmbiguity(text: string, wordCount: number): AmbiguityIssue[] {
  const issues: AmbiguityIssue[] = [];

  // Vague pronouns without clear antecedents
  const pronounMatches = text.match(VAGUE_PRONOUNS) ?? [];
  if (pronounMatches.length > 3) {
    issues.push({
      type: "vague_pronoun",
      description: `Found ${pronounMatches.length} vague pronoun(s) (it, this, that, they…) that may cause ambiguity about what is being referred to.`,
      penalty: -2,
    });
  }

  // Overbroad scope
  const overbroadMatches = text.match(OVERBROAD) ?? [];
  if (overbroadMatches.length > 1) {
    issues.push({
      type: "overbroad",
      description: "The prompt uses overbroad scope words (everything, all, entire) which may produce an unfocused or too-large response.",
      penalty: -2,
    });
  }

  // Multiple distinct tasks
  if (hasMultipleTasks(text)) {
    issues.push({
      type: "multiple_tasks",
      description: "The prompt appears to combine multiple distinct tasks. Consider separating them or structuring them clearly with numbered steps.",
      penalty: -4,
    });
  }

  // Contradictory instructions
  if (hasContradictoryInstructions(text)) {
    issues.push({
      type: "contradictory",
      description: "Conflicting instructions detected (e.g., 'brief' and 'comprehensive'). The AI will have to guess which to prioritize.",
      penalty: -5,
    });
  }

  // Very short prompts — unclear scope
  if (wordCount < 10) {
    issues.push({
      type: "unclear_scope",
      description: "The prompt is very short. It likely lacks sufficient context for the AI to understand your intent precisely.",
      penalty: -3,
    });
  }

  return issues;
}
