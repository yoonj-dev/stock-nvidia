# Test: NVIDIA on Tap (stock-nvidia) Verification

- Data Fetching Test: `python3 scripts/fetch_nvidia_live.py` executed successfully, generating `public/data/NVDA.json` (36 intraday candles, RSI/MFI, real-time price $207.41)
- Local LLM Synthesis Test: `python3 scripts/synthesize_nvidia.py` executed with local `gemma4-daily:latest`, producing 12,437 characters across 4 institutional reports in `public/data/synthesis.json`
- Build Test: `npm run build` compiled in 494ms without errors or type warnings
- Theme Standard Test: `check_theme.sh` passed with 0 warnings
- Cloudflare Dry-Run Test: `npx wrangler deploy --dry-run` passed reading 7 assets from `./dist`
- Telegram Dispatch Test: `python3 ../stock-api/notify_service_report.py --service nvidia --dry-run` passed formatting valid markdown with hashtags and inline URL buttons
