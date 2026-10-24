# Déploiement sur le VPS — tidiane.deadsec.tech

Portfolio React/Vite/Three.js servi par **Caddy** sur `198.244.151.99` (SSH port 221, utilisateur `tidiane`).

## Architecture

| Élément | Emplacement |
|---|---|
| Fichiers statiques (build Vite) | `/var/www/tidiane-portfolio` |
| Proxy Gemini (`/api/chat`) | `/opt/tidiane-chat` + service `tidiane-chat.service` |
| Clé API (côté serveur) | `/opt/tidiane-chat/.env` (mode 600) |
| Bloc Caddy | `/etc/caddy/conf.d/tidiane.caddy` |

Le navigateur → Caddy (TLS) → soit le statique, soit le proxy Node sur `127.0.0.1:8787`.
La clé Gemini **n'est jamais** envoyée au navigateur.

## Déployer

```bash
# 1. Build SANS la variable publique (sinon la clé part dans le bundle)
cd /chemin/vers/Portfolio
mv .env .env.bak && npm run build && mv .env.bak .env
grep -rl 'AQ\.Ab' dist/ && echo "FUITE ! NE PAS DEPLOYER" || echo "bundle propre"

# 2. Transfert
tar -czf portfolio-dist.tar.gz -C dist .
scp -P 221 portfolio-dist.tar.gz tidiane@198.244.151.99:/tmp/
scp -P 221 deploy/chat-server.mjs api/chat.js deploy/tidiane-chat.service \
    deploy/tidiane.caddy tidiane@198.244.151.99:/tmp/

# 3. Serveur : statique + proxy
ssh -p 221 tidiane@198.244.151.99 '
  sudo mkdir -p /var/www/tidiane-portfolio
  sudo tar -xzf /tmp/portfolio-dist.tar.gz -C /var/www/tidiane-portfolio
  sudo mkdir -p /opt/tidiane-chat
  sudo cp /tmp/chat-server.mjs /tmp/chat.js /opt/tidiane-chat/
  sudo cp /tmp/tidiane-chat.service /etc/systemd/system/
  sudo cp /tmp/tidiane.caddy /etc/caddy/conf.d/
  # la cle : mode 600, lisible par tidiane uniquement
  sudo install -m 600 -o tidiane -g tidiane /tmp/server.env /opt/tidiane-chat/.env
  sudo systemctl daemon-reload
  sudo systemctl enable --now tidiane-chat
  sudo systemctl restart tidiane-chat
  sudo caddy validate --config /etc/caddy/Caddyfile
  sudo systemctl reload caddy
'
```

## ⚠ Piège : la clé dans le bundle

`.env` contient `VITE_GEMINI_API_KEY`. **Toute variable `VITE_*` est inlinée dans le bundle par Vite** — un `npm run build` classique publie donc la clé dans le JavaScript servi au public.

Sur le VPS, la clé ne va que dans `/opt/tidiane-chat/.env` (côté serveur). Le build de déploiement se fait donc **sans** le `.env`.

Si le portfolio est aussi hébergé en statique pur (GitHub Pages), il faut `VITE_GEMINI_API_KEY` dans le build — dans ce cas, **restreindre la clé par domaine** dans Google AI Studio (AI Studio → Get API key → Restrictions → * Websites →tidiane.deadsec.tech*).

## Vérification

```bash
curl -sI https://tidiane.deadsec.tech/                      # 200
curl -s https://tidiane.deadsec.tech/ | grep -o 'index-[A-Za-z0-9_-]*\.js'  # nouveau hash
curl -s -o /dev/null -w '%{http_code}\n' https://tidiane.deadsec.tech/myworks   # 200 (SPA)
curl -s -o /dev/null -w '%{http_code}\n' https://tidiane.deadsec.tech/play      # 200 (SPA)
curl -s -X POST https://tidiane.deadsec.tech/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"test"}]}'          # JSON Gemini
sudo systemctl status tidiane-chat --no-pager
```

## Pièges

- **CSP** : `worker-src 'self' blob:` est obligatoire — le décodeur DRACO du modèle 3D
  tourne dans un `Worker` créé depuis un `blob:`. Sans lui, le modèle ne se charge pas.
  `media-src 'self' blob:` est nécessaire pour les vidéos au survol des cartes projet.
- **Caddy** : ne jamais réécrire `/etc/caddy/Caddyfile` (racine en lecture seule, tout passe
  par `import` du dossier `conf.d/`). Ne jamais `sudo caddy run` hors systemd.
- **fail2ban** : 3 échecs d'authentification SSH suffisent à bannir l'IP (10 min à 1 h).
  Récupération : `sudo fail2ban-client set sshd unbanip <IP>`.
- **Cache navigateur** : après déploiement, le navigateur peut garder l'ancien bundle.
  `Ctrl+Shift+R` ou une fenêtre privée.
