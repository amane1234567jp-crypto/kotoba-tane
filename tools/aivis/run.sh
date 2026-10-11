#!/bin/bash
# GitHub Actions 上で実行: AivisHub 調査 (+ cast.json があれば合成)
set -x
cd "$(dirname "$0")"
python3 survey.py /tmp/out || echo "survey failed"
if [ -f cast.json ]; then bash synth.sh /tmp/out || echo "synth failed"; fi
