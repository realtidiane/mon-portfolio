import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

/**
 * L'ecran de chargement ne s'affiche qu'a la premiere visite de la session.
 * Revenir a l'accueil via "Back to Home" ne doit pas le rejouer : le site
 * est deja monte, on revele directement le hero.
 *
 * Le drapeau est pose au demarrage de l'application (App.tsx), quelle que
 * soit la route : sans cela, un visiteur qui arrive directement sur
 * /myworks ou /play verrait l'ecran de chargement au clic sur "Back to Home".
 */
let siteRevealed = false;

/** Le site est monte : l'ecran de chargement ne sera plus rejoue. */
export const markSiteRevealed = () => {
  siteRevealed = true;
};

/**
 * Lance la revelation du site. On attend que le hero soit monte pour que
 * les animations de texte aient leur cible, puis on joue initialFX.
 */
const revealSite = (attempt = 0) => {
  const heroMounted = document.querySelector(".landing-intro h1");
  if (!heroMounted && attempt < 40) {
    setTimeout(() => revealSite(attempt + 1), 50);
    return;
  }
  import("../components/utils/initialFX").then((module) => {
    if (module.initialFX) {
      module.initialFX();
    }
  });
};

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading on mobile
    if (window.innerWidth <= 768) return false;
    // Skip loading when returning to the home page in the same session
    return !siteRevealed;
  });
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  // Le scroll de la page est bloque tant que l'ecran de chargement est affiche.
  useEffect(() => {
    document.body.classList.toggle("is-loading", isLoading);
    if (!isLoading) {
      siteRevealed = true;
    }
    return () => {
      // Ne jamais laisser le body verrouille si l'on quitte la page
      // pendant l'ecran de chargement.
      document.body.classList.remove("is-loading");
    };
  }, [isLoading]);

  useEffect(() => {
    // Ecran de chargement saute (mobile ou retour vers l'accueil) :
    // on revele directement le site.
    if (!isLoading) {
      revealSite();
    }
  }, []);

  useEffect(() => {}, [loading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
