/**
 * Serverless function : proxy vers l'API Gemini.
 *
 * La cle API reste cote serveur (variable d'environnement GEMINI_API_KEY)
 * et n'est jamais exposee au navigateur. Si la fonction n'est pas deployee
 * (hebergement statique), le client bascule sur l'appel direct avec
 * VITE_GEMINI_API_KEY - voir src/services/gemini.ts.
 */

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
// Le free tier de Gemini est limite a 20 requetes/jour sur la famille
// gemini-3.5/3.6-flash. Les modeles "lite" ont leur propre quota : on bascule
// automatiquement dessus quand le quota du modele principal est epuise,
// sinon le chat du portfolio devient inutilisable en fin de journee.
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/** L'erreur de quota free tier est-elle la cause du refus ? */
function isQuotaError(data) {
    const message = data?.error?.message || '';
    return /quota|rate limit|resource_exhausted/i.test(message);
}

/** Convertit un historique au format OpenAI vers le format Gemini. */
function toGeminiPayload(messages) {
    const systemText = messages
        .filter((m) => m.role === 'system')
        .map((m) => m.content)
        .join('\n\n');

    const contents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages must be a non-empty array' });
    }

    const callGemini = async (model) => {
        const response = await fetch(`${ENDPOINT}/${model}:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(toGeminiPayload(messages)),
        });
        return { response, data: await response.json() };
    };

    try {
        let { response, data } = await callGemini(MODEL);

        // Quota du modele principal epuise -> on tente le modele de secours.
        if (!response.ok && isQuotaError(data) && FALLBACK_MODEL && FALLBACK_MODEL !== MODEL) {
            console.warn(`Quota epuise sur ${MODEL}, bascule sur ${FALLBACK_MODEL}`);
            ({ response, data } = await callGemini(FALLBACK_MODEL));
        }

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json({
                error: data?.error?.message || 'Failed to fetch from Gemini',
            });
        }

        // Signale une reponse tronquee par la limite de tokens plutot que de
        // laisser une phrase coupee au milieu.
        const candidate = data?.candidates?.[0];
        if (candidate?.finishReason === 'MAX_TOKENS') {
            const parts = candidate?.content?.parts || [];
            const text = parts.map((p) => p.text ?? '').join('').trim();
            if (text && !/[.!?]$/.test(text)) {
                candidate.content.parts.push({
                    text: '\n\n_(reponse tronquee : demande plus de details pour la suite)_',
                });
            }
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
