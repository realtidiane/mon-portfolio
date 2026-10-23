/**
 * Rendu markdown minimal et sur pour le chat.
 *
 * Le modele repond en markdown (**gras**, listes, code inline, titres).
 * Rendu en texte brut, les asterisques apparaissent litteralement - c'est
 * exactement ce qu'on veut corriger ici.
 *
 * Pas de dependance : on echappe d'abord tout le HTML, puis on applique
 * les transformations markdown sur du texte deja sur. Aucun HTML du modele
 * ne peut donc etre injecte dans la page.
 */

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Transforme le markdown inline d'un texte deja echappe. */
function inline(text: string): string {
  return (
    text
      // code inline d'abord : son contenu ne doit pas subir les autres regles
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/~~([^~\n]+)~~/g, '<del>$1</del>')
  );
}

/** Transforme un bloc markdown complet en HTML sur. */
export function renderMarkdown(src: string): string {
  const safe = escapeHtml(src);
  const lines = safe.split('\n');

  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // ligne vide -> on ferme la liste en cours
    if (!line.trim()) {
      closeList();
      continue;
    }

    // titre ### / ## / #
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1].length + 2; // h3..h5
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    // separateur horizontal
    if (/^([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) {
      closeList();
      out.push('<hr />');
      continue;
    }

    // liste ordonnee
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      if (listType !== 'ol') {
        closeList();
        out.push('<ol>');
        listType = 'ol';
      }
      out.push(`<li>${inline(ordered[1])}</li>`);
      continue;
    }

    // liste a puces
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      if (listType !== 'ul') {
        closeList();
        out.push('<ul>');
        listType = 'ul';
      }
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }

    // paragraphe
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  return out.join('\n');
}
