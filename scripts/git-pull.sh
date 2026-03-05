#!/bin/bash
cd /vercel/share/v0-project
git fetch origin
git pull origin main --rebase
echo "Done. Current HEAD:"
git log --oneline -5
