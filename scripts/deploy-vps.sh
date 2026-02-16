#!/bin/bash
# VPS deploy: pull, build, fix permissions for nginx (www-data)
# Run from repo root: ./scripts/deploy-vps.sh  or  npm run deploy:vps
set -e

cd "$(dirname "$0")/.."

echo "==> Pulling latest from main..."
git pull origin main

echo "==> Building..."
npm run build

echo "==> Fixing permissions for nginx (www-data)..."
sudo chown -R www-data:www-data dist
sudo chmod -R u+rX,g+rX,o+rX dist

echo "==> Done. App served from dist/"
