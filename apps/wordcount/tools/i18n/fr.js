/* Compteur de mots — français (fr/)
 * La logique de comptage est dans wordcount-core.js ; ce fichier contient tous les textes visibles dans cette langue.
 * Les clés en Html sont insérées telles quelles (<br> et <em> seulement) ; les corps de privacy.sections aussi.
 * Garder {n} {max} {m} {s} {pct} {chars} {words}. Espace fine insécable ( ) avant ? ! : ;
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Compteur de mots et de caractères en ligne',
    description: 'Compteur de mots et de caractères gratuit : caractères avec et sans espaces, mots, phrases, paragraphes, octets, temps de lecture et objectif de longueur. Tout se passe dans ton navigateur.',
    ogTitle: 'Compteur de mots 📝 caractères, mots, octets en direct',
    ogDescription: 'Colle ton texte et vois tout de suite caractères, mots, phrases, octets et temps de lecture. Rien n’est envoyé.',
  },
  siteName: 'Compteur de mots',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Compteur de mots',
    h1Html: 'Chaque caractère compté,<br><em>pendant que tu écris</em>',
    hook: 'Tape ou colle ton texte. Caractères, mots et octets se mettent à jour en direct, et une barre te prévient quand tu dépasses la limite.',
  },

  ui: {
    editorLabel: 'Ton texte',
    placeholder: 'Tape ou colle ton texte ici…',
    bar: { chars: 'Caractères', noSpaces: 'Sans espaces', words: 'Mots', bytes: 'Octets' },
    toolsLabel: 'Outils de texte',
    tools: { copy: 'Copier', tidy: 'Nettoyer les espaces', join: 'Joindre les lignes', clear: 'Tout effacer', undo: 'Annuler' },
    saved: 'Ton brouillon est enregistré uniquement sur cet appareil, jamais envoyé.',
    copied: 'Texte copié',
    copyFail: 'Copie impossible. Sélectionne le texte et copie-le toi-même.',
    cleared: 'Texte effacé. Touche Annuler pour le récupérer.',
    tidied: 'Espaces en trop et lignes vides supprimés.',
    joined: 'Retours à la ligne supprimés.',
    undone: 'Modification annulée.',
    nothing: 'Rien à modifier.',
    limitLabel: 'Longueur visée',
    limitOff: 'Aucune',
    limitChip: '{n}',
    limitCustom: 'Autre',
    limitCustomPh: 'ex. 280',
    limitCustomAria: 'Longueur visée en caractères',
    limitSpaces: 'Compter les espaces',
    limitText: '{n} / {max} caractères',
    limitLeft: 'encore {n}',
    limitOver: '{n} de trop',
    statsLabel: 'Comptage détaillé',
    stats: {
      chars: 'Caractères (espaces compris)',
      noSpaces: 'Caractères (sans espaces)',
      words: 'Mots',
      sentences: 'Phrases',
      paragraphs: 'Paragraphes',
      lines: 'Lignes',
      reading: 'Temps de lecture',
      speaking: 'Temps de parole',
      bytes: 'Octets',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Ancien 2 octets' },
    byteHint: {
      utf8: 'UTF-8 standard : lettres sans accent et espaces 1 octet, lettres accentuées (é, à, ç) 2, chinois, japonais et coréen 3, emoji 4. Un retour à la ligne vaut 1 octet.',
      neis: 'UTF-8, mais chaque retour à la ligne compte pour 2 octets (CR + LF), comme dans les fichiers texte Windows.',
      legacy: 'Anciens encodages sur 2 octets (EUC-KR, Shift_JIS, GBK) : ASCII 1 octet, tout autre caractère 2, retour à la ligne 2.',
    },
    time: { sec: '{s} s', min: '{m} min', minSec: '{m} min {s} s' },
    timeNote: 'Durées estimées : environ 238 mots par minute en lecture silencieuse et 150 à l’oral.',
    kwLabel: 'Mots les plus répétés',
    kwEmpty: 'Les mots utilisés au moins deux fois s’affichent ici. Les mots courants comme « le » ou « et » sont ignorés.',
    kwCount: '{n}×',
    finish: 'Voir le bilan ✓',
    needText: 'Tape ou colle d’abord un texte.',
    local: 'Compté sur ton appareil. Ton texte n’est jamais envoyé.',
  },

  result: {
    heading: 'Ton texte en un coup d’œil',
    limitOk: 'Dans ton objectif de {max} caractères ({pct} %).',
    limitOver: '{n} caractères de plus que ton objectif de {max}.',
    copySummary: 'Copier le bilan',
    summaryCopied: 'Bilan copié',
    summaryTitle: 'Bilan du comptage',
    again: 'Compter un autre texte',
    live: 'Bilan prêt : {chars} caractères, {words} mots.',
    shareTitle: 'Compteur de mots',
    shareText: 'Compteur de mots et de caractères gratuit, avec octets et temps de lecture. Ton texte reste sur ton appareil 📝',
  },

  og: {
    brand: '📝 Compteur de mots',
    kicker: 'Caractères · mots · octets · lecture',
    title: 'Compte caractères et mots en direct',
    desc: 'Gratuit, et ton texte reste sur ton appareil',
  },

  faq: [
    { q: 'Les espaces et les retours à la ligne sont-ils comptés ?', a: 'Les deux chiffres sont affichés. « Espaces compris » compte aussi les espaces et les retours à la ligne (1 chacun). « Sans espaces » retire tous les espaces, tabulations et retours. Le bouton « Compter les espaces » choisit lequel suit la barre d’objectif.' },
    { q: 'Pourquoi mon total diffère-t-il de Word ou Google Docs ?', a: 'Chaque outil a ses règles. Certains comptent un mot composé comme deux mots, d’autres un emoji comme deux caractères, et Word ignore les retours à la ligne. Ici, un emoji ou une lettre accentuée vaut 1 caractère, les mots à trait d’union comptent pour 1 et un retour à la ligne vaut 1.' },
    { q: 'Comment les octets sont-ils comptés ?', a: 'Choisis la règle du formulaire que tu remplis. UTF-8 est utilisé par la plupart des sites. UTF-8 + CRLF compte chaque retour à la ligne pour 2 octets. Ancien 2 octets compte l’ASCII pour 1 octet et tout autre caractère pour 2, comme d’anciens systèmes asiatiques.' },
    { q: 'Mon texte est-il enregistré ou envoyé ?', a: 'Il ne quitte jamais ton appareil. Le brouillon reste dans le stockage local de ce navigateur pour survivre à un rechargement, et « Tout effacer » le supprime. Rien n’est mis dans l’adresse de la page ni dans les liens de partage.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Compteur de mots',
    description: 'Politique de confidentialité du Compteur de mots : ton texte est compté et conservé uniquement dans ton navigateur ; cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Compteur de mots (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Le texte que tu tapes ou colles est compté uniquement dans ton navigateur. Il n’est jamais envoyé à notre serveur ni à aucun autre, et il n’est jamais inscrit dans l’adresse de la page ou dans les liens de partage. Pour garder ton brouillon après un rechargement, le texte et tes réglages sont enregistrés dans le stockage local du navigateur de cet appareil uniquement ; le bouton « Tout effacer » supprime le brouillon, tout comme l’effacement des données du site dans ton navigateur.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue et tes réglages, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne pas marcher comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur tes visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier tes préférences, consulte les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, utilisations, notes). Ces compteurs ne contiennent jamais ton texte ni ses chiffres et ne permettent pas de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 15 octobre 2026.'],
    ],
    back: '← Retour au Compteur de mots',
  },
};
