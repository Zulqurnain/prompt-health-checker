import type { SuggestionItem, StructureComponents, WeakWordMatch, AmbiguityIssue } from "@/types";

export function generateSuggestions(
  structure: StructureComponents,
  weakWords: WeakWordMatch[],
  ambiguityIssues: AmbiguityIssue[],
  wordCount: number,
  score: number
): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  if (!structure.role) {
    suggestions.push({
      type: "add_role",
      priority: "high",
      title: "Add a role definition",
      description: 'Start with "You are a [expert/persona]…" to anchor the AI\'s perspective and expertise level.',
    });
  }

  if (!structure.task) {
    suggestions.push({
      type: "clarify_goal",
      priority: "high",
      title: "State the task explicitly",
      description: "Use a direct action verb: Write, Generate, Analyze, Summarize, Explain, List, Compare…",
    });
  }

  if (!structure.outputFormat) {
    suggestions.push({
      type: "specify_output",
      priority: "high",
      title: "Specify the output format",
      description: 'Tell the AI exactly what format you want: "Return a JSON object", "Write a numbered list", "Use markdown headers".',
    });
  }

  if (!structure.constraints) {
    suggestions.push({
      type: "add_constraints",
      priority: "medium",
      title: "Add constraints",
      description: 'Define what to avoid or limit: "Do not include…", "Maximum 200 words", "Only use…", "Avoid jargon".',
    });
  }

  if (!structure.context) {
    suggestions.push({
      type: "add_context",
      priority: "medium",
      title: "Provide background context",
      description: "Explain the situation, project, or domain so the AI can tailor the response appropriately.",
    });
  }

  if (!structure.audience) {
    suggestions.push({
      type: "define_audience",
      priority: "medium",
      title: "Define the audience",
      description: 'Specify who the output is for: "for a non-technical manager", "for a senior developer", "for beginners".',
    });
  }

  if (!structure.examples) {
    suggestions.push({
      type: "add_examples",
      priority: "low",
      title: "Add examples",
      description: 'Provide a sample input/output pair to show what you mean: "For example: Input → Output".',
    });
  }

  if (!structure.successCriteria) {
    suggestions.push({
      type: "add_success_criteria",
      priority: "low",
      title: "Define success criteria",
      description: "State what a correct response looks like: "The response is good if it covers X, Y, and Z."",
    });
  }

  if (!structure.tone) {
    suggestions.push({
      type: "add_tone",
      priority: "low",
      title: "Specify tone or style",
      description: 'Include a tone directive: "Write in a professional tone", "Keep it concise and direct", "Use plain language".',
    });
  }

  if (weakWords.length > 3) {
    suggestions.push({
      type: "remove_hedging",
      priority: "high",
      title: "Remove hedging language",
      description: `Found ${weakWords.length} weak/hedge word(s). Replace them with direct, confident language to reduce ambiguity.`,
    });
  }

  const hasAmbiguity = ambiguityIssues.some((i) => i.type !== "multiple_tasks");
  if (hasAmbiguity) {
    suggestions.push({
      type: "reduce_ambiguity",
      priority: "high",
      title: "Reduce ambiguity",
      description: "Clarify vague references, overbroad scope, and unclear pronouns so the AI has no room to misinterpret.",
    });
  }

  const hasMultipleTasks = ambiguityIssues.some((i) => i.type === "multiple_tasks");
  if (hasMultipleTasks) {
    suggestions.push({
      type: "break_steps",
      priority: "medium",
      title: "Break into numbered steps",
      description: "You have multiple tasks in one prompt. Use numbered steps or separate prompts to get better, focused results.",
    });
  }

  if (wordCount < 15 && score < 50) {
    suggestions.push({
      type: "add_context",
      priority: "high",
      title: "Expand the prompt significantly",
      description: "This prompt is very short. The AI needs more information to produce a useful, accurate response.",
    });
  }

  return suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}
