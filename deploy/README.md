# Deploiement sur le VPS - tidiane.deadsec.tech

Portfolio React/Vite/Three.js servi par **Caddy** sur `198.244.151.99` (SSH port 221, utilisateur `tidiane`).

## Architecture

| Element | Emplacement |
|---|---|
| Source (clone git) | `/var/www/portfolio-tidiane` - clone de `realtidiane/mon-portfolio` |
| Site publie (build Vite) | `/var/www/tidiane-site` - racine Caddy |
| Script de publication | `/usr/local/bin/deploy-portfolio.sh` |
| Hook git | `/var/www/portfolio-tidiane/.git/hooks/post-merge` |
| Proxy Gemini (`/api/chat`) | `/opt/tidiane-chat` + service `tidiane-chat.service` |
| Cle API (cote serveur) | `/opt/tidiane-chat/.env` (mode 600, proprietaire `tidiane`) |
| Bloc Caddy | `/etc/caddy/conf.d/tidiane-portfolio.caddy` |
| Webhook GitHub | `/opt/deploy-webhook/deploy-webhook.py` -> `127.0.0.1:9010` (inchange) |

Flux : `push sur main` -> webhook GitHub -> `git pull` dans `/var/www/portfolio-tidiane`
-> hook `post-merge` -> `npm ci` + `npm run build` -> `rsync --delete dist/ -> /var/www/tidiane-site`
-> Caddy sert le nouveau build.

Le navigateur -> Caddy (TLS) -> soit le statique, soit le proxy Node sur `127.0.0.1:8787`.
La cle Gemini **n'est jamais** envoyee au navigateur.

## Deployer manuellement

```bash
# Depuis n'importe quelle machine qui a acces au VPS
ssh -p 221 tidiane@198.244.151.99
sudo /usr/local/bin/deploy-portfolio.sh
```

Le script est idempotent : il reconstruit et republie. En cas d'echec du build ou de `npm ci`,
**le site en ligne est conserve** (la publication n'a lieu qu'apres un build reussi).

## Piege : la cle dans le bundle

`.env` contient `VITE_GEMINI_API_KEY`. **Toute variable `VITE_*` est inlines dans le bundle par Vite** -
un `npm run build` classique publie donc la cle dans le JavaScript servi au public.

Sur le VPS, la cle ne va que dans `/opt/tidiane-chat/.env` (cote serveur). Le build de deploiement
se fait **sans** le `.env`. Le script `deploy/deploy.sh` le fait automatiquement et refuse de
deployer si `AQ.Ab` est trouve dans `dist/`.

Si le portfolio est aussi heberge en statique pur (GitHub Pages), il faut `VITE_GEMINI_API_KEY`
dans le build - dans ce cas, **restreindre la cle par domaine** dans Google AI Studio
(AI Studio -> Get API key -> Restrictions -> *Websites* -> `tidiane.deadsec.tech`).

## Verification

```bash
curl -sI https://tidiane.deadsec.tech/                 # 200
curl -s https://tidiane.deadsec.tech/ | grep -o 'index-[A-Za-z0-9_-]*\.js'   # hash du bundle
curl -s -o /dev/null -w '%{http_code}\n' https://tidiane.deadsec.tech/myworks # 200 (SPA)
curl -s -o /dev/null -w '%{http_code}\n' https://tidiane.deadsec.tech/play    # 200 (SPA)
curl -s -X POST https://tidiane.deadsec.tech/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"test"}]}'                        # JSON Gemini
sudo systemctl status tidiane-chat --no-pager
sudo tail -20 /var/log/deploy-portfolio.log
```

## Pieges

- **CSP** - trois directives sont indispensables pour cette SPA :
  `worker-src 'self' blob:` (le decodeur DRACO du modele 3D tourne dans un `Worker`),
  `connect-src 'self' blob:` (le modele chiffre est charge via `fetch(blobUrl)`) et
  `media-src 'self' blob:` (videos au survol des cartes projet).
  Sans elles, le modele 3D ne se charge pas du tout et l'ecran de chargement reste bloque.
- **Caddy** - ne jamais reecrire `/etc/caddy/Caddyfile` (racine en lecture seule, tout passe
  par `import` du dossier `conf.d/`). Ne jamais `sudo caddy run` hors systemd.
- **fail2ban** - 3 echecs d'authentification SSH suffisent a bannir l'IP (10 min a 1 h).
  Recuperation : `sudo fail2ban-client set sshd unbanip <IP>`.
- **Cache navigateur** - apres deploiement, le navigateur peut garder l'ancien bundle.
  `Ctrl+Shift+R` ou une fenetre privee.
- **Le chargement 3D est long sous GPU logiciel** - sans GPU (SwiftShader, machine virtuelle),
  `compileAsync` ne resout pas vite et l'ecran de chargement trainne. Sur une vraie machine
  avec GPU, c'est quelques secondes.
