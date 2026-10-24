#!/usr/bin/env bash
# Deploie le portfolio sur le VPS deadsec.tech (Caddy + Node pour /api/chat).
#
# Usage : bash deploy/deploy.sh [host] [port] [user]
# Exemple: bash deploy/deploy.sh 198.244.151.99 221 tidiane
#
# Le build est realise SANS le .env local : la variable VITE_GEMINI_API_KEY
# serait inlines dans le bundle et la cle deviendrait publique.

set -euo pipefail

HOST="${1:-198.244.151.99}"
PORT="${2:-221}"
USER_NAME="${3:-tidiane}"
SSH="ssh -p $PORT -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 $USER_NAME@$HOST"
SCP="scp -P $PORT -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> 1/7 build de production (sans la cle publique)"
if [ -f .env ]; then mv .env .env.deploy-backup; fi
npm run build
if [ -f .env.deploy-backup ]; then mv .env.deploy-backup .env; fi

echo "==> 2/7 controle de fuite de la cle API"
if grep -rq 'AQ\.Ab' dist/ 2>/dev/null; then
  echo "  !! FUITE : une cle API est presente dans dist/. Deploiement annule."
  exit 1
fi
echo "  bundle propre"

echo "==> 3/7 preparation des artefacts"
tar -czf "$TMP/portfolio-dist.tar.gz" -C dist .
cp deploy/chat-server.mjs "$TMP/"
cp api/chat.js "$TMP/"
cp deploy/tidiane-chat.service "$TMP/"
cp deploy/tidiane.caddy "$TMP/"

# Le .env serveur : uniquement la cle GEMINI cote serveur, mode 600 sur le VPS.
python3 - "$TMP/server.env" <<'PY'
import io, os, sys
out_path = sys.argv[1]
vals = {}
if os.path.exists('.env'):
    for line in io.open('.env', encoding='utf-8'):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            vals[k.strip()] = v.strip().strip('"')
lines = []
if vals.get('GEMINI_API_KEY'):
    lines.append('GEMINI_API_KEY=' + vals['GEMINI_API_KEY'])
lines.append('GEMINI_MODEL=' + (vals.get('GEMINI_MODEL') or 'gemini-3.5-flash'))
lines.append('PORT=8787')
lines.append('HOST=127.0.0.1')
io.open(out_path, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines) + '\n')
PY

echo "==> 4/7 transfert vers $HOST:$PORT"
$SCP "$TMP/portfolio-dist.tar.gz" "$TMP/chat-server.mjs" "$TMP/chat.js" \
     "$TMP/tidiane-chat.service" "$TMP/tidiane.caddy" "$TMP/server.env" \
     "$USER_NAME@$HOST:/tmp/"

echo "==> 5/7 installation cote serveur"
$SSH '
  set -e
  sudo mkdir -p /var/www/tidiane-portfolio
  sudo tar -xzf /tmp/portfolio-dist.tar.gz -C /var/www/tidiane-portfolio
  sudo chown -R root:root /var/www/tidiane-portfolio
  sudo mkdir -p /opt/tidiane-chat
  sudo cp /tmp/chat-server.mjs /tmp/chat.js /opt/tidiane-chat/
  sudo cp /tmp/tidiane-chat.service /etc/systemd/system/
  sudo install -m 600 -o '"$USER_NAME"' -g '"$USER_NAME"' /tmp/server.env /opt/tidiane-chat/.env
  sudo cp /tmp/tidiane.caddy /etc/caddy/conf.d/tidiane.caddy
  sudo systemctl daemon-reload
  sudo systemctl enable --now tidiane-chat
  sudo systemctl restart tidiane-chat
  sudo caddy validate --config /etc/caddy/Caddyfile
  sudo systemctl reload caddy
  rm -f /tmp/portfolio-dist.tar.gz /tmp/chat-server.mjs /tmp/chat.js \
        /tmp/tidiane-chat.service /tmp/tidiane.caddy /tmp/server.env
'

echo "==> 6/7 verification"
sleep 3
$SSH 'systemctl is-active tidiane-chat; systemctl is-active caddy'

echo "==> 7/7 controles publics"
curl -s -o /dev/null -w "  GET /        -> HTTP %{http_code}\n" "https://tidiane.deadsec.tech/"
curl -s -o /dev/null -w "  GET /myworks -> HTTP %{http_code}\n" "https://tidiane.deadsec.tech/myworks"
curl -s -o /dev/null -w "  GET /play    -> HTTP %{http_code}\n" "https://tidiane.deadsec.tech/play"
curl -s -X POST "https://tidiane.deadsec.tech/api/chat" \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"ping"}]}' \
  | head -c 220
echo ""
echo "==> Termine."
