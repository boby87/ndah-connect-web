// Propage l'usage de formatApiError() à tous les composants qui extraient
// encore manuellement error.error.message. À exécuter une fois :
//   node scripts/refactor-error-handling.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

// Pattern : (<id> as { error?: { message?: string } })?.error?.message ?? '<fallback>'
// Capture l'identifiant et le fallback. Tolère espaces et retours-ligne.
// Le fallback peut contenir des apostrophes échappées (`'Erreur lors de l\'X.'`),
// d'où la sous-pattern `'(?:\\.|[^'\\])*'` qui consomme les `\'` correctement.
const OLD_PATTERN =
  /\(\s*(\w+)\s+as\s+\{\s*error\?:\s*\{\s*message\?:\s*string\s*\}\s*\}\s*\)\?\.error\?\.message\s*\?\?\s*\n?\s*('(?:\\.|[^'\\])*')/g;

const IMPORT_LINE = "import { formatApiError } from '../../../../core/utils';";

const files = globSync('src/app/features/**/*.ts');

let modifiedCount = 0;
let replacementCount = 0;

for (const file of files) {
  let src = readFileSync(file, 'utf8');
  const before = src;

  // Remplace le pattern
  src = src.replace(OLD_PATTERN, (_, ident, fallback) => {
    replacementCount++;
    return `formatApiError(${ident}, ${fallback})`;
  });

  if (src === before) continue; // rien à faire

  // Ajoute l'import si absent
  if (!src.includes("from '../../../../core/utils'") && !src.includes('formatApiError')) {
    // ne devrait jamais arriver puisqu'on vient d'ajouter formatApiError
  }
  if (!src.includes(IMPORT_LINE)) {
    // Insère après la fin du dernier import (gère les imports multi-ligne).
    const lines = src.split('\n');
    let lastImportEndIdx = -1;
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (/^import\s/.test(line)) {
        if (line.trimEnd().endsWith(';')) {
          // Import single-line
          lastImportEndIdx = i;
        } else {
          // Import multi-ligne : avance jusqu'à `} from '...';`
          let j = i + 1;
          while (j < lines.length && !/^\}\s+from\s+'[^']+'\s*;/.test(lines[j])) j++;
          if (j < lines.length) {
            lastImportEndIdx = j;
            i = j;
          }
        }
      } else if (line.trim() === '' || line.trimStart().startsWith('//')) {
        // ligne vide ou commentaire — on continue
      } else {
        // Première ligne non-import : on sort de la zone des imports
        break;
      }
      i++;
    }
    if (lastImportEndIdx >= 0) {
      lines.splice(lastImportEndIdx + 1, 0, IMPORT_LINE);
      src = lines.join('\n');
    }
  }

  writeFileSync(file, src);
  modifiedCount++;
  console.log(`✓ ${file}`);
}

console.log(`\nRefactor terminé : ${modifiedCount} fichier(s), ${replacementCount} remplacement(s).`);
