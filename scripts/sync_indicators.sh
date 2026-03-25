#!/usr/bin/env bash
# Re-build economic indicator JSON files from the textbook project's processed CSVs.
# Run this whenever the textbook datasets are updated.
#
# Usage:
#   bash scripts/sync_indicators.sh
#   bash scripts/sync_indicators.sh /path/to/alternative/csv/dir

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="${1:-G:/My Drive/book drafts/the south african economy/___Contemporary/data/processed}"

echo "Syncing indicators from: $SOURCE_DIR"
python "$SCRIPT_DIR/build_indicators.py" --source-dir "$SOURCE_DIR"
echo ""
echo "Done. Commit data/indicators_*.json if the output changed."
