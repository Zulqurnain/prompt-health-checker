import { estimateStandard } from "../heuristic";
import type { TokenizerAdapter, TokenizerAdapterResult } from "../types";

export const xaiAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenizerAdapterResult {
    const inputTokens = estimateStandard(text);
    const contextWindow = 131_072;
    const safeOutputBudget = Math.min(4096, contextWindow - inputTokens);

    return {
      family: "xAI Grok",
      icon: "xai",
      tokenizerMode: "heuristic",
      confidence: "Low Confidence",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "Grok's tokenizer is not publicly documented. This estimate uses a standard BPE heuristic. The Grok app includes undisclosed system prompts and tool integrations that add unknown token overhead.",
      models: ["Grok-2", "Grok-1.5", "Grok Vision"],
    };
  },
};
