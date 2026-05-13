import { estimateSentencePiece } from "../heuristic";
import type { TokenEstimate } from "@/types";
import type { TokenizerAdapter } from "../types";

export const mistralAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenEstimate {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 32_000;
    const safeOutputBudget = Math.min(4096, contextWindow - inputTokens);

    return {
      family: "Mistral",
      icon: "mistral",
      tokenizerMode: "sentencepiece",
      confidence: "Estimated",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "Mistral models use a SentencePiece tokenizer. Mistral Large and Mixtral have 32k context. Estimates use a SentencePiece heuristic ratio.",
      models: ["Mistral Large", "Mistral 7B", "Mixtral 8x7B"],
    };
  },
};
