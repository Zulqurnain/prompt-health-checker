import { estimateSentencePiece } from "../heuristic";
import type { TokenEstimate } from "@/types";
import type { TokenizerAdapter } from "../types";

export const metaAdapter: TokenizerAdapter = {
  estimate(text, _wordCount, _charCount): TokenEstimate {
    const inputTokens = estimateSentencePiece(text);
    const contextWindow = 128_000;
    const safeOutputBudget = Math.min(4096, contextWindow - inputTokens);

    return {
      family: "Meta Llama",
      icon: "meta",
      tokenizerMode: "sentencepiece",
      confidence: "Estimated",
      inputTokens,
      safeOutputBudget: Math.max(0, safeOutputBudget),
      totalEstimate: inputTokens + safeOutputBudget,
      contextWindow,
      note:
        "Llama 3 uses a tiktoken-compatible BPE tokenizer (vocab 128k). Llama 2 used SentencePiece. Estimates use a blended heuristic. Via llama.cpp or local inference the payload is known; via third-party APIs it may differ.",
      models: ["Llama 3.1 405B", "Llama 3.1 70B", "Llama 3.2 Vision"],
    };
  },
};
