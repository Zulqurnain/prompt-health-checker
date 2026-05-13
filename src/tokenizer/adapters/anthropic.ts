import { estimateStandard } from "../heuristic";
import type { TokenizerAdapter, TokenizerAdapterResult } from "../types";

export const anthropicAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenizerAdapterResult {
    const inputTokens = estimateStandard(text);
    const contextWindow = 200_000;
    const safeOutputBudget = Math.min(8192, contextWindow - inputTokens);

    return {
      family: "Anthropic",
      icon: "anthropic",
      tokenizerMode: "cl100k_base",
      confidence: "Estimated",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "Estimated using character/word heuristics. Claude's tokenizer is not publicly released. The Claude.ai app adds hidden system prompts, memory context, and tool definitions — the true app-level token count is higher than shown here.",
      models: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
    };
  },
};
