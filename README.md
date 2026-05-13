# Prompt Health Checker

**Analyze prompt quality, estimate tokens across AI model families, and strengthen prompts before sending to AI.**

Live at: [tools.zulqurnainj.com/prompt-health-checker](https://tools.zulqurnainj.com/prompt-health-checker)

---

## Features

- **Prompt Health Score** (0–100) with transparent, weighted breakdown
- **Structural analysis** — detects Role, Task, Context, Constraints, Format, Examples, Audience, Tone, Success Criteria
- **Weak/hedge word detection** with inline highlighting — identifies "maybe", "try to", "can you", etc.
- **Ambiguity detection** — vague pronouns, overbroad scope, multiple mixed tasks, contradictions
- **AI analysis summary** — what is good, what is weak, what is missing, how to improve
- **Improvement suggestions** — prioritized, actionable recommendations
- **Prompt rewriter** — 5 variants: Improved, Concise, Expert, ChatGPT Style, Claude Style
- **Token estimation** — 7 AI model families with confidence badges
- **Prompt history** — recent analyses stored in localStorage

## Token Estimation: Exact vs. Estimated

This tool is honest about what it can and cannot know.

| Provider | Confidence | Reason |
|---|---|---|
| OpenAI API (direct) | **Estimated** | cl100k_base heuristic; exact via tiktoken |
| Anthropic API (direct) | **Estimated** | Tokenizer not public; character heuristic |
| Google Gemini API | **Estimated** | Custom SPM; exact via countTokens API |
| Meta Llama (local) | **Estimated** | BPE/SPM heuristic |
| Mistral | **Estimated** | SentencePiece heuristic |
| xAI Grok | **Low Confidence** | Tokenizer undocumented |
| DeepSeek | **Estimated** | SPM heuristic |

**Consumer apps** (ChatGPT, Claude.ai, Gemini, Cursor, Grok) add hidden system prompts, memory, tool definitions, and agent scaffolding. Their true token counts are **not observable from outside the API** and will be higher than what is shown here.

---

## Technical Limitations

- v1 uses deterministic heuristics — no LLM API calls required
- Tokenizer adapters use character/word-ratio approximations (±10–20% for typical English text)
- Code-heavy or non-English prompts may have higher token counts than estimated
- offLlama integration planned for v2 (local LLM-powered meta-analysis)

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The dev server runs at `http://localhost:5173/prompt-health-checker/`

---

## Production Deployment (cPanel Shared Hosting)

### 1. Build

```bash
npm run build
```

This produces a `dist/` folder with static files.

### 2. File structure after build

```
dist/
  index.html
  .htaccess
  assets/
    index-[hash].js
    index-[hash].css
```

### 3. Upload to cPanel

Upload the contents of `dist/` to your cPanel hosting under:

```
public_html/tools/prompt-health-checker/
```

Or if `tools.zulqurnainj.com` is a subdomain/addon domain pointing to its own folder:

```
public_html/prompt-health-checker/
```

**Use cPanel File Manager or SFTP (port 21098):**

```
Host:     server385.web-hosting.com
Port:     21098 (SFTP)
Username: zulqhhkj
```

### 4. Verify .htaccess is in place

The `.htaccess` file in `public/` is copied to `dist/` during build. It handles SPA routing so all routes resolve to `index.html`.

### 5. Verify asset paths

Vite is configured with `base: "/prompt-health-checker/"` in `vite.config.ts`. All asset URLs will be prefixed correctly for subdirectory hosting.

### 6. Test

Visit: `https://tools.zulqurnainj.com/prompt-health-checker/`

If assets 404, check that:
- Files are in the right folder
- `.htaccess` is present and readable
- `mod_rewrite` is enabled (it is on Namecheap Shared hosting)

---

## Architecture

```
src/
  config/
    scoring.ts        — weight config, penalty config, regex patterns
  engine/
    normalizer.ts     — text normalization, word/char/sentence counting
    weakWords.ts      — hedge word detection and highlighting
    structureDetector.ts — structural component detection
    ambiguityDetector.ts — ambiguity and contradiction detection
    scorer.ts         — weighted score calculation
    suggestionGenerator.ts — improvement suggestion generation
    promptRewriter.ts — rules-based prompt rewriting
    summaryGenerator.ts — AI-style analysis summary generation
    analyze.ts        — main entry point, orchestrates all engines
  tokenizer/
    heuristic.ts      — character/word ratio estimation functions
    types.ts          — adapter interface
    adapters/         — one adapter per model family
    registry.ts       — runs all adapters, returns array of estimates
  components/         — React UI components
  utils/
    localStorage.ts   — history persistence
    copy.ts           — clipboard utilities
  types/index.ts      — all TypeScript types
```

---

## Future Roadmap

- **Exact tokenizer adapters**: Bundle tiktoken-wasm for exact OpenAI counts in-browser
- **offLlama integration**: Optional local LLM meta-analysis via [offLlama](https://github.com/Zulqurnain/offllama)
- **PDF export**: Export full analysis report as PDF
- **Shareable links**: Encode prompt + result in URL for sharing
- **Browser extension**: Analyze prompts directly in ChatGPT, Claude, or Gemini UI
- **Team mode**: Shared prompt library with team scoring history
- **Provider-specific prompting guides**: Model-specific tips per family

---

## License

MIT — free to use, modify, and deploy.

Built by [Zulqurnain Haider](https://zulqurnainj.com)
