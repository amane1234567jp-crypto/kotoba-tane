#!/bin/bash
# AivisSpeech Engine (Docker, CPU) を起動して lines.json を合成する
OUT=$1; set -x
sudo apt-get -qq update >/dev/null && sudo apt-get -qq install -y ffmpeg >/dev/null
pip install -q numpy
mkdir -p ~/.local/share/AivisSpeech-Engine && sudo chown -R 1000:1000 ~/.local/share/AivisSpeech-Engine
docker pull -q ghcr.io/aivis-project/aivisspeech-engine:cpu-latest
docker run -d --name aivis -p 10101:10101 -v ~/.local/share/AivisSpeech-Engine:/home/user/.local/share/AivisSpeech-Engine-Dev ghcr.io/aivis-project/aivisspeech-engine:cpu-latest
for i in $(seq 1 120); do curl -sf 127.0.0.1:10101/version && break; sleep 10; done
echo; docker logs aivis 2>&1 | tail -20
# RUN に書いたジョブだけ合成する（listen = 聞き比べ、jobs/xxx = ゲーム用）。RUN がなければ全部
JOBS=$(cat RUN 2>/dev/null || echo "listen $(ls -d jobs/*/)")
for j in $JOBS; do j=${j%/}; if [ "$j" = listen ]; then python3 synth.py "$OUT"; elif [ -f "$j/lines.json" ]; then python3 synth.py "$OUT" "$j"; fi; done
docker logs aivis 2>&1 | tail -40 > "$OUT/engine_log_tail.txt"
