import { describe, it, expect } from "vitest";
import { analyzePrompt } from "../analyze";
import { detectWeakWords } from "../weakWords";
import { detectStructure } from "../structureDetector";
import { getStrengthLabel } from "../scorer";

describe("analyzePrompt", () => {
  it("scores a weak prompt below 35", () => {
    const result = analyzePrompt("can you maybe help me with something");
    expect(result.score).toBeLessThan(35);
    expect(result.strength).toMatch(/Weak|Fair/);
  });

  it("scores an expert prompt above 65", () => {
    const expertPrompt = `You are a senior TypeScript engineer.

Write a utility function that deep-merges two objects, handling arrays by concatenation, not replacement.

Constraints:
- Handle circular references gracefully
- No external dependencies
- Return a strongly typed result

Format: TypeScript function with JSDoc comment.

Success criteria: The function correctly merges {a: [1,2]} and {a: [3]} into {a: [1,2,3]}.`;

    const result = analyzePrompt(expertPrompt);
    expect(result.score).toBeGreaterThan(65);
    expect(["Strong", "Expert"]).toContain(result.strength);
  });

  it("detects weak words correctly", () => {
    const matches = detectWeakWords("can you maybe try to write something kind of like this");
    const words = matches.map((m) => m.word.toLowerCase());
    expect(words).toContain("can you");
    expect(words).toContain("maybe");
    expect(words).toContain("try to");
    expect(words).toContain("kind of");
  });

  it("detects no weak words in clean prompt", () => {
    const matches = detectWeakWords("Write a REST API in Go with JWT authentication.");
    expect(matches.length).toBe(0);
  });

  it("detects structure components", () => {
    const text = `You are a data analyst. Generate a CSV report for quarterly sales. Format: CSV with headers. Avoid empty rows.`;
    const structure = detectStructure(text);
    expect(structure.role).toBe(true);
    expect(structure.task).toBe(true);
    expect(structure.outputFormat).toBe(true);
    expect(structure.constraints).toBe(true);
  });

  it("returns correct strength labels", () => {
    expect(getStrengthLabel(0)).toBe("Weak");
    expect(getStrengthLabel(20)).toBe("Weak");
    expect(getStrengthLabel(28)).toBe("Fair");
    expect(getStrengthLabel(46)).toBe("Good");
    expect(getStrengthLabel(65)).toBe("Strong");
    expect(getStrengthLabel(82)).toBe("Expert");
    expect(getStrengthLabel(100)).toBe("Expert");
  });

  it("generates token estimates for all 7 families", () => {
    const result = analyzePrompt("Write a blog post about AI prompt engineering.");
    expect(result.tokenEstimates).toHaveLength(7);
    const families = result.tokenEstimates.map((t) => t.family);
    expect(families).toContain("OpenAI");
    expect(families).toContain("Anthropic");
    expect(families).toContain("Google Gemini");
    expect(families).toContain("Meta Llama");
    expect(families).toContain("Mistral");
    expect(families).toContain("xAI Grok");
    expect(families).toContain("DeepSeek");
  });

  it("always returns positive token counts", () => {
    const result = analyzePrompt("Hi");
    for (const est of result.tokenEstimates) {
      expect(est.inputTokens).toBeGreaterThan(0);
      expect(est.safeOutputBudget).toBeGreaterThanOrEqual(0);
    }
  });

  it("generates rewritten prompts with all variants", () => {
    const result = analyzePrompt("Can you maybe write a blog post about TypeScript?");
    expect(result.rewritten.improved).toBeTruthy();
    expect(result.rewritten.concise).toBeTruthy();
    expect(result.rewritten.expert).toBeTruthy();
    expect(result.rewritten.chatgptStyle).toBeTruthy();
    expect(result.rewritten.claudeStyle).toBeTruthy();
  });
});
