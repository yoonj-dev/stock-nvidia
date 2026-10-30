# Plan: NVIDIA on Tap (stock-nvidia) Implementation

- Phase 1 (Environment & Scaffolding): Setup project config (`package.json`, `wrangler.toml`, `.nvmrc`, `vite.config.ts`, `tsconfig.json`)
- Phase 2 (Data & AI Pipeline): Implement `fetch_nvidia_live.py` (NVDA metrics, candles, earnings, volatility alerts) and `synthesize_nvidia.py` (local Gemma Ollama 4 institutional reports)
- Phase 3 (Frontend Engineering): Build responsive UI components (`NvidiaStockHero`, `LocalLlmSynthesizer`, `NvidiaFourPillars`, `TradingViewSection`, `ValuationCalculator`, `Header`, `Footer`) with Theme Mode Standard
- Phase 4 (Pipeline & Automation): Create `run_pipeline.sh` integrating fetch, synthesize, build, and Telegram dispatch via `stock-api/notify_service_report.py`
- Phase 5 (Verification & Branding): Run `check_theme.sh`, `npm run build`, `wrangler deploy --dry-run`, present branding asset concept for user approval
