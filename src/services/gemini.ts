/**
 * Client Gemini pour le chat du portfolio.
 *
 * Deux chemins possibles, dans cet ordre :
 *  1. Proxy serveur (/api/chat) - la cle reste cote serveur (hebergeur serverless).
 *  2. Appel direct depuis le navigateur avec VITE_GEMINI_API_KEY - pour un
 *     hebergement purement statique (GitHub Pages, Netlify, Cloudflare Pages).
 *
 * Dans les deux cas la reponse est normalisee en texte simple.
 */

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.5-flash';

export interface ChatTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const model = () =>
  import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL;

/**
 * Convertit un historique au format OpenAI (system/user/assistant)
 * vers le format Gemini (systemInstruction + contents user/model).
 */
function toGeminiPayload(turns: ChatTurn[]) {
  const systemText = turns
    .filter((t) => t.role === 'system')
    .map((t) => t.content)
    .join('\n\n');

  const contents = turns
    .filter((t) => t.role !== 'system')
    .map((t) => ({
      role: t.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: t.content }],
    }));

  return {
    systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  };
}

/** Extrait le texte de la reponse Gemini. */
function extractText(data: any): string {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!Array.isArray(parts)) return '';
  let text = parts.map((p: any) => p?.text ?? '').join('').trim();

  // Le modele a atteint la limite de tokens : on le signale plutot que de
  // laisser une phrase coupee au milieu.
  if (candidate?.finishReason === 'MAX_TOKENS' && !/[.!?]$/.test(text)) {
    text += '\n\n_(reponse tronquee : demande plus de details pour la suite)_';
  }

  return text;
}

/** Proxy serveur : la cle est lue depuis les variables d'environnement de l'hebergeur. */
async function callViaProxy(turns: ChatTurn[]): Promise<string | null> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: turns }),
    });

    // 404 = pas de serverless function sur cet hebergeur -> on tente le direct
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);

    const text = await res.text();

    // Hebergement statique : /api/chat renvoie index.html (le fallback SPA du
    // serveur), pas du JSON -> il n'y a pas de proxy, on tente l'appel direct.
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) return null;

    const data = JSON.parse(text);
    return extractText(data) || null;
  } catch {
    return null;
  }
}

/** Appel direct : necessite VITE_GEMINI_API_KEY dans l'environnement du build. */
async function callDirect(turns: ChatTurn[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Cle Gemini introuvable. Definissez GEMINI_API_KEY (proxy serveur) ou VITE_GEMINI_API_KEY (appel direct).'
    );
  }

  const res = await fetch(`${GEMINI_ENDPOINT}/${model()}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(toGeminiPayload(turns)),
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error(
        'QUOTA_EXHAUSTED: le quota gratuit Gemini est epuise pour aujourd hui. Reessayez dans quelques heures.'
      );
    }
    if (res.status === 403) {
      throw new Error('ACCESS_DENIED: la cle Gemini est refusee par l API.');
    }
    throw new Error(data?.error?.message || `Gemini API error ${res.status}`);
  }

  const text = extractText(data);
  if (!text) throw new Error('Reponse vide du modele.');
  return text;
}

/**
 * Envoie l'historique de conversation et renvoie la reponse en texte.
 * Leve une erreur explicite si aucun chemin n'aboutit.
 */
export async function sendToGemini(turns: ChatTurn[]): Promise<string> {
  const proxied = await callViaProxy(turns);
  if (proxied) return proxied;
  return callDirect(turns);
}
