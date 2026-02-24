#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> git add..."
git add -A
echo ">>> git status..."
git status
echo ">>> git commit..."
git commit -m "PWA icon PNG, deploy" || true
echo ">>> git push..."
git push origin main
echo ">>> done. Vercel will auto-deploy."
