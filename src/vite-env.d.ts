/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cle Gemini utilisee par l'appel direct depuis le navigateur (hebergement statique). */
  readonly VITE_GEMINI_API_KEY?: string;
  /** Modele Gemini utilise (defaut : gemini-3.8-flash). */
  readonly VITE_GEMINI_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
