#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IPHONE_SHELL_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ROOT_DIR="$(cd "${IPHONE_SHELL_DIR}/../.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist"
WEB_DIR="${IPHONE_SHELL_DIR}/www"

if [[ ! -d "${DIST_DIR}" ]]; then
  echo "Root dist/ not found. Build web app in root first."
  exit 1
fi

mkdir -p "${WEB_DIR}"
find "${WEB_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -R "${DIST_DIR}/." "${WEB_DIR}/"

echo "Synced ${DIST_DIR} -> ${WEB_DIR}"
