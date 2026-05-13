/**
 * Heuristic token estimation using character/word ratios.
 *
 * For English text:
 *  - ~4 characters per token (cl100k_base, o200k_base average)
 *  - ~1.33 tokens per word
 * We average both estimates for better accuracy.
 *
 * These are approximations. Exact counts require running the actual tokenizer.
 */

export function estimateTokens(
  text: string,
  charsPerToken: number,
  tokensPerWord: number
): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  const byChars = chars / charsPerToken;
  const byWords = words * tokensPerWord;

  return Math.max(1, Math.round((byChars + byWords) / 2));
}

/** Standard English heuristic (cl100k_base-like) */
export function estimateStandard(text: string): number {
  return estimateTokens(text, 4.0, 1.33);
}

/** Slightly higher ratio for SentencePiece-based models (Llama, Mistral) */
export function estimateSentencePiece(text: string): number {
  return estimateTokens(text, 3.8, 1.38);
}

/** Gemini SPM tokenizer is generally similar to cl100k */
export function estimateGemini(text: string): number {
  return estimateTokens(text, 4.1, 1.30);
}
