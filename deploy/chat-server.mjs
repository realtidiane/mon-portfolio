/**
 * Serveur Node minimal pour le proxy Gemini (/api/chat).
 *
 * Le handler api/chat.js est ecrit pour les fonctions serverless Vercel
 * (req.body deja parse, res.status().json()). Ce petit serveur l adapts
 * a un serveur HTTP classique, sur 127.0.0.1 uniquement : Caddy fait le
 * reverse_proxy et gere le TLS.
 *
 * La cle GEMINI_API_KEY reste cote serveur, jamais dans le bundle.
 */
import http from "node:http";

// Le handler est selon le contexte soit a cote du serveur (deploiement VPS),
// soit dans api/ (structure du depot). On accepte les deux.
let handler;
try {
    ({ default: handler } = await import("./chat.js"));
} catch {
    ({ default: handler } = await import("../api/chat.js"));
}

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY = 1024 * 1024; // 1 Mo : l'historique de chat tient largement

const server = http.createServer((req, res) => {
    // Preflight CORS (utile en developpement local sur :5173)
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    let raw = "";
    let aborted = false;

    req.on("data", (chunk) => {
        if (aborted) return;
        raw += chunk;
        if (raw.length > MAX_BODY) {
            aborted = true;
            res.writeHead(413, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Payload too large" }));
            req.destroy();
        }
    });

    req.on("end", async () => {
        if (aborted) return;

        try {
            req.body = raw ? JSON.parse(raw) : {};
        } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
            return;
        }

        // Adaptateur de reponse pour le handler serverless.
        const resShim = {
            status(code) {
                res.statusCode = code;
                return this;
            },
            json(payload) {
                if (!res.getHeader("Content-Type")) {
                    res.setHeader("Content-Type", "application/json");
                }
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify(payload));
            },
        };

        try {
            await handler(req, resShim);
        } catch (error) {
            console.error("Chat proxy error:", error);
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Chat proxy listening on http://${HOST}:${PORT}/api/chat`);
});
