export type TokenizerMode =
  | "cl100k_base"      // OpenAI GPT-3.5/4/4o
  | "o200k_base"       // OpenAI GPT-4o mini, o1, o3
  | "sentencepiece"    // Meta Llama, Mistral
  | "gemini_spm"       // Google Gemini
  | "heuristic";       // Fallback approximation

export type ConfidenceLevel =
  | "Exact"
  | "High Confidence"
  | "Estimated"
  | "Low Confidence";

export interface TokenizerAdapterResult {
  family: string;
  icon: string;
  tokenizerMode: TokenizerMode;
  confidence: ConfidenceLevel;
  inputTokens: number;
  safeOutputBudget: number;
  totalEstimate: number;
  contextWindow: number;
  note: string;
  models: string[];
}

export interface TokenizerAdapter {
  estimate(text: string, wordCount: number, charCount: number): TokenizerAdapterResult;
}
