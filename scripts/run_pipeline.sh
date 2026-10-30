#!/usr/bin/env bash
# ==============================================================================
# NVIDIA (NVIDIA · NVDA) Local PC Data & Gemma LLM Pipeline
# ==============================================================================
# Usage:
#   ./scripts/run_pipeline.sh           # Fetch data + synthesize with local Ollama
#   ./scripts/run_pipeline.sh --deploy  # Fetch + synthesize + push + telegram notify
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "=========================================================="
echo "🚀 [1/3] Fetching fresh NVIDIA (NVDA) market data..."
echo "=========================================================="
python3 "${SCRIPT_DIR}/fetch_nvidia_live.py"

echo ""
echo "=========================================================="
echo "🧠 [2/3] Running local Gemma Ollama synthesis..."
echo "=========================================================="
python3 "${SCRIPT_DIR}/synthesize_nvidia.py"

if [[ "$1" == "--deploy" || "$1" == "--push" ]]; then
  echo ""
  echo "=========================================================="
  echo "📦 [3/3] Building & Deploying to Cloudflare..."
  echo "=========================================================="
  npm run build
  git add public/data/
  if git diff --staged --quiet; then
    echo "No data changes to commit."
  else
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    git commit -m "chore(data): update NVIDIA quant data and local Gemma synthesis [${TIMESTAMP}]"
    git push origin main
    echo "✅ Pushed to GitHub."
  fi

  # Dispatch Telegram notification via centralized stock-api dispatcher
  if [[ -f "/Users/yoonj/workspace/stock-api/notify_service_report.py" ]]; then
    echo "📣 Dispatching Telegram notification to channel..."
    python3 /Users/yoonj/workspace/stock-api/notify_service_report.py --service nvidia || true
  fi
else
  echo ""
  echo "✅ Pipeline complete! Pre-compiled data ready in public/data/"
  echo "Tip: Run './scripts/run_pipeline.sh --deploy' to push and update the live site."
fi
