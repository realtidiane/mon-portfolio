# Portfolio - Cheikh Ahmed Tidiane SY

> **Administrateur Sécurité & Réseaux · Développeur Fullstack**
> Diplômé en cybersécurité (EC2LT, 2023-2026) et en développement d'applications (UNCHK - IDA, 2022-2026).
> Étudiant L3 Cybersécurité - École Supérieure Polytechnique de Dakar (2026-2027).

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r168-black?logo=three.js)](https://threejs.org)

---

## 🚀 Stack Technique

| Catégorie | Technologies |
|-----------|--------------|
| **Frontend** | React 18, TypeScript, Vite 5, React Router 7 |
| **3D / WebGL** | Three.js (r168), @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| **Animation** | GSAP 3 + ScrollTrigger, Lenis (smooth scroll), react-fast-marquee |
| **Cybersécurité** | Kali Linux, Nmap, Metasploit, Burp Suite, BloodHound, Wazuh, YARA, Volatility, IDS/IPS, VPN, TLS, WAF |
| **Reverse Engineering** | Ghidra, IDA Pro, Frida |
| **Backend / Infra** | Node.js, FastAPI, PostgreSQL, MySQL, MongoDB, Docker, Ansible, Proxmox, Ceph, OpenStack |
| **Build** | Vite 5, TypeScript 5, ESLint 9 |

---

## ✨ Fonctionnalités

- **Hero 3D** : Modèle de personnage GLTF chiffré (Three.js / R3F), suivi du curseur, caméra qui réagit au scroll
- **Section Mon Travail** : timeline horizontale épinglée (GSAP ScrollTrigger) avec les projets, leurs captures et leurs technologies
- **Page Tous les travaux** : grille complète des projets sur `/myworks`
- **Chat portfolio** : assistant conversationnel alimenté par **Gemini** (`/play`), répondant en première persona
- **Échecs** : moteur chess.js + moteur WASM RedxChess, historique de coups et interface chess.com-like
- **Timeline d'expérience** : parcours RTN, EC2LT, UNCHK - IDA avec missions et stack détaillée
- **Écran de chargement** : logo, jeu de/reactif et barre de progression avant l'entrée dans la scène
- **Stack technique** : pyramide d'icônes devicon (12 → 10 → 8 → 6 → 4 → 2) sur fond vidéo
- **Curseur custom** : point violet qui suit la souris, remplacé au survol des liens
- **Contact** : téléchargement du CV et formulaire `mailto:`
- **Responsive** : mobile-first, la timeline se désépingle sous 768px

---

## 📦 Installation

```bash
# Prérequis : Node.js 20+
npm install
```

---

## 🛠️ Développement

```bash
npm run dev       # Serveur de développement (HMR, accessible sur le réseau)
npm run build     # Type-check (tsc -b) + build production dans /dist
npm run preview   # Aperçu du build
npm run lint      # ESLint
```

Le chat IA requiert une clé API **Gemini** ([AI Studio](https://aistudio.google.com/apikey)). Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Deux modes de fonctionnement :

| Hébergement | Variable | La clé reste cachée ? |
|---|---|---|
| Avec serverless function (Vercel, Netlify, Cloudflare Workers) | `GEMINI_API_KEY` | **Oui** - lue côté serveur par `api/chat.js` |
| Statique pur (GitHub Pages) | `VITE_GEMINI_API_KEY` | **Non** - la clé est incluse dans le bundle JS |

Le client (`src/services/gemini.ts`) essaie d'abord le proxy `/api/chat`, et bascule automatiquement sur l'appel direct si le proxy n'est pas déployé.

> ⚠️ Sur un hébergement statique, `VITE_GEMINI_API_KEY` est visible dans le JavaScript du navigateur. Restreignez la clé par domaine (AI Studio → *API keys → Restrict key*) ou préférez un hébergement serverless.

Le modèle par défaut est `gemini-3.5-flash`, modifiable via `GEMINI_MODEL` ou `VITE_GEMINI_MODEL`.

---

## 🏗️ Architecture

```
src/
├── main.tsx                  # Point d'entrée
├── App.tsx                   # Routes (/, /myworks, /play)
├── config.ts                 # Contenu : profil, expériences, projets, contact, compétences
├── index.css                 # Variables globales et thème
├── components/
│   ├── Landing.tsx           # Hero 3D + avatar
│   ├── Loading.tsx           # Écran de chargement
│   ├── MainContainer.tsx     # Assemblage des sections
│   ├── Navbar.tsx            # Navigation + scroll Lenis
│   ├── Career.tsx            # Timeline d'expérience
│   ├── WhatIDo.tsx           # Domaines d'expertise
│   ├── TechStackNew.tsx      # Pyramide d'icônes
│   ├── SocialIcons.tsx       # Liens sociaux
│   ├── Contact.tsx           # CV + contact
│   ├── Cursor.tsx            # Curseur custom
│   ├── Work.tsx              # Timeline Mon Travail (épinglée)
│   ├── WorkImage.tsx         # Image de projet + halo
│   ├── HoverLinks.tsx        # Animation de survol
│   └── Character/            # Scène 3D, modèle chiffré, lighting, souris
├── pages/
│   ├── MyWorks.tsx           # Tous les travaux
│   └── Play.tsx              # Échecs + chat IA
├── context/LoadingProvider.tsx
├── utils/                    # Moteur d'échecs, splitter de texte
└── styles/                   # CSS par composant

api/chat.js                   # Serverless function (proxy Gemini, garde la clé côté serveur)
services/gemini.ts         # Client du chat : proxy serveur ou appel direct navigateur
public/
├── draco/                    # Décodeur Draco pour le modèle 3D
├── models/                   # Modèle GLTF chiffré + environnement HDR
├── images/                   # Captures des projets et avatar
└── video/                    # Fond vidéo de la section Stack
```

---

## ⚙️ Points techniques notables

### Modèle 3D chiffré
`src/components/Character/` charge un `character.glb` chiffré (`character.enc`) déchiffré à l'exécution par `utils/decrypt.ts`. Le décodeur Draco est servi depuis `public/draco/`.

### R3F
- `useFrame` de `@react-three/fiber` (pas `drei`) pour les interpolations par frame
- Les classes Three.js sont en minuscules dans le JSX (`<points>`, `<pointsMaterial>`) - sinon React lève `Class constructor cannot be invoked without 'new'`

### GSAP
- `ScrollTrigger` avec `pin: true` sur `.work-section` pour la timeline horizontale
- Le pinning est désactivé sous 768px pour ne pas bloquer le scroll mobile

### Contenu
Tout le contenu textuel vit dans `src/config.ts` : profil, expériences, projets, contact, compétences. Les images de projet sont référencées en chemin absolu (`/images/...`).

---

## 🌐 Déploiement

Le build produit un dossier `dist/` statique.

**Avec serverless function** (Vercel, Netlify, Cloudflare Workers) : le dossier `api/` est déployé comme une fonction et le chat IA utilise `GEMINI_API_KEY` côté serveur. Il faut également un `vercel.json` à la racine pour le fallback SPA (deep links `/play` et `/myworks`) :

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

**Hébergement statique pur** (GitHub Pages) : le reste du site fonctionne tel quel. Le chat IA ne répondra pas tant que `VITE_GEMINI_API_KEY` n'est pas défini au build - et dans ce cas la clé est exposed dans le bundle.

```bash
npm run build   # -> dist/
```

---

## 📄 Licence

MIT - voir [LICENSE](LICENSE).

---

## 👤 Auteur

**Cheikh Ahmed Tidiane SY**  
Administrateur Sécurité & Réseaux · Développeur Fullstack  
Dakar, Sénégal

- 🌐 **Site** : [tidiane.deadsec.tech](https://tidiane.deadsec.tech)
- 🐙 **GitHub** : [github.com/realtidiane](https://github.com/realtidiane)
- 💼 **LinkedIn** : [linkedin.com/in/cheikh-tidiane-sy](https://www.linkedin.com/in/cheikh-tidiane-sy)
- 📧 **Email** : tidianepro.sn@gmail.com
