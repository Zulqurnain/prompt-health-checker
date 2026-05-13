import { estimateGemini } from "../heuristic";
import type { TokenizerAdapter, TokenizerAdapterResult } from "../types";

export const googleAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenizerAdapterResult {
    const inputTokens = estimateGemini(text);
    const contextWindow = 1_000_000;
    const safeOutputBudget = Math.min(8192, contextWindow - inputTokens);

    return {
      family: "Google Gemini",
      icon: "google",
      tokenizerMode: "gemini_spm",
      confidence: "Estimated",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "Gemini uses a custom SentencePiece tokenizer. Exact counts via the Gemini API countTokens endpoint. Gemini app adds hidden system instructions.",
      models: ["Gemini 1.5 Pro", "Gemini 1.5 Flash", "Gemini 2.0 Flash"],
    };
  },
};
