export type TokenizerMode =
  | "cl100k_base"      // OpenAI GPT-3.5/4/4o
  | "o200k_base"       // OpenAI GPT-4o mini, o1, o3
  | "sentencepiece"    // Meta Llama, Mistral
  | "gemini_spm"       // Google Gemini
  | "heuristic";       // Fallback approximation

export interface TokenizerAdapter {
  estimate(text: string, wordCount: number, charCount: number): import("@/types").TokenEstimate;
}
