import { estimateSentencePiece } from "../heuristic";
import type { TokenizerAdapter, TokenizerAdapterResult } from "../types";

export const deepseekAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenizerAdapterResult {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 64_000;
    const safeOutputBudget = Math.min(4096, contextWindow - inputTokens);

    return {
      family: "DeepSeek",
      icon: "deepseek",
      tokenizerMode: "sentencepiece",
      confidence: "Estimated",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "DeepSeek uses its own SentencePiece-based tokenizer. Estimates use an SP heuristic. DeepSeek V2/V3 context windows vary by deployment.",
      models: ["DeepSeek-V3", "DeepSeek-R1", "DeepSeek-V2"],
    };
  },
};
