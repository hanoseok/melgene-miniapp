/* Jeu de la pastèque – Halloween (Suika Game) — français (/fr/)
 * Même structure de clés que en.js. Règles, paliers et points dans merge-core.js.
 * Espace fine insécable (U+202F) avant ? ! : ;
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Jeu de la pastèque – Halloween (Suika Game) gratuit',
    description: 'Le jeu de la pastèque version Halloween : lâche des friandises dans le bocal, fusionne les paires identiques et fais grandir une citrouille géante. Gratuit, sans téléchargement.',
    ogTitle: 'Jeu de la pastèque – Halloween 🎃 Jusqu’où iras-tu ?',
    ogDescription: 'Lâche, assemble, fusionne. Reste sous la ligne et vois jusqu’où tu peux grimper.',
  },
  siteName: 'Jeu de la pastèque – Halloween',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Halloween · puzzle de fusion',
    h1Kicker: 'Jeu de la pastèque – Halloween',
    h1Html: 'Jusqu’où iras-tu<br>en <em>fusionnant</em> ?',
    hook: 'Lâche des friandises dans le bocal. Deux pareilles se touchent et fusionnent en plus gros — mais ne dépasse surtout pas la ligne.',
    how: { aim: 'Vise et lâche', match: 'Deux pareils', line: 'Sous la ligne' },
    facts: 'Sans chrono · à ton rythme',
    start: 'Commencer →',
  },

  play: {
    score: 'Score',
    best: 'Record',
    next: 'Suivant',
    nextAria: 'Pièce suivante : {name}',
    pause: 'Pause',
    paused: 'En pause',
    resume: 'Reprendre',
    full: 'Bocal plein !',
    chainAria: 'Ordre des fusions, de la plus petite pièce à la plus grande',
    fieldAria: 'Bocal de jeu. Bouge ou glisse pour viser, puis relâche ou clique pour lâcher. Flèches pour viser, Espace pour lâcher.',
  },

  result: {
    full: 'Le bocal déborde !',
    points: 'points',
    best: 'Record : {n}',
    newBest: 'Nouveau record !',
    biggest: 'Plus grosse pièce',
    merges: 'Fusions',
    top: 'Top {n} %',
    beat: 'Mieux que {pct} % des joueurs',
    beatAll: 'Mieux que tous les autres scores',
    others: 'Comparé à {n} autres scores',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Jeu de la pastèque – Halloween',
    shareText: 'J’ai fait {score} points au jeu de la pastèque version Halloween 🎃 Tu fais mieux ?',
  },

  tiers: ['Bonbon maïs', 'Bonbon', 'Sucette', 'Châtaigne', 'Pomme', 'Champignon', 'Chauve-souris', 'Fantôme', 'Boule de cristal', 'Citrouille', 'Citrouille-lanterne'],

  og: {
    brand: '🎃 Jeu de la pastèque – Halloween',
    defaultKicker: 'Jeu de fusion d’Halloween gratuit',
    defaultTitle: 'Jusqu’où iras-tu en fusionnant ?',
    defaultDesc: 'Lâche · assemble deux pareils · fusionne',
  },

  faq: [
    { q: 'Comment on joue ?', a: 'Bouge le doigt ou la souris au-dessus du bocal pour viser, puis relâche (ou clique) pour lâcher la pièce. Les flèches servent à viser et Espace à lâcher. Quand deux pièces identiques se touchent, elles fusionnent en la taille au-dessus.' },
    { q: 'Quand la partie se termine-t-elle ?', a: 'Il n’y a pas de chrono. La partie s’arrête quand la pile reste au-dessus de la ligne pointillée pendant environ deux secondes. Garde de la place et prépare tes fusions.' },
    { q: 'Comment marche le score ?', a: 'Chaque fusion rapporte des points, et les grosses fusions en rapportent plus. Les réactions en chaîne font grimper le score très vite.' },
    { q: 'Le top % est-il réel ?', a: 'Oui. À la fin d’une partie, seul ton score est envoyé anonymement à notre serveur et comparé à ceux des autres. Le top % n’apparaît que s’il y a de vrais scores à comparer, sinon rien ne s’affiche. Le jeu se met aussi en pause tout seul quand tu changes d’onglet.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Jeu de la pastèque – Halloween',
    description: 'Politique de confidentialité du jeu de la pastèque version Halloween : scores anonymes, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le jeu de la pastèque – Halloween (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul votre score (arrondi à la dizaine) est envoyé à notre serveur sous forme de décompte anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement lors de l’utilisation, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions risquent alors de ne pas fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences : <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contactez l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 2 octobre 2026.'],
    ],
    back: '← Retour au jeu de la pastèque – Halloween',
  },
};
