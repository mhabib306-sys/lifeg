#!/bin/bash
# VPS deploy: pull, build, fix permissions for nginx (www-data)
# Run from repo root: ./scripts/deploy-vps.sh  or  npm run deploy:vps
# Used by GitHub Actions and manual deploys.
set -e

cd "$(dirname "$0")/.."

echo "==> Pulling latest from main..."
if [ -n "$(git status --porcelain)" ]; then
  echo "Stashing local changes..."
  git stash push -u -m "deploy-vps-$(date +%s)"
  STASHED=1
fi
git pull origin main
if [ "$STASHED" = "1" ]; then
  git stash pop || true
fi

echo "==> Building..."
npm run build

echo "==> Fixing permissions for nginx (www-data)..."
sudo "$(dirname "$0")/fix-dist-permissions.sh"

echo "==> Done. App served from dist/"
