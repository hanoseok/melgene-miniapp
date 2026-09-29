/* Jeu attrape-bonbons d’Halloween — Français (/fr/)
 * Même structure de clés que en.js. Règles et points dans candy-catch-core.js.
 * Espace fine insécable (U+202F) avant ? ! : ; — pas de coupure au mauvais endroit.
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
    title: 'Jeu attrape-bonbons d’Halloween – Arcade gratuit',
    description: 'Jeu attrape-bonbons d’Halloween : glisse ton seau citrouille, attrape les bonbons, évite araignées et fantômes, enchaîne les combos. 50 s, gratuit, sans téléchargement.',
    ogTitle: 'Jeu attrape-bonbons d’Halloween 🍬 Combien tu en attrapes ?',
    ogDescription: 'Il pleut des bonbons. 50 secondes, 3 vies — jusqu’où rempliras-tu ton seau ?',
  },
  siteName: 'Attrape-bonbons d’Halloween',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Des bonbons ou un sort · arcade',
    h1Kicker: 'Jeu attrape-bonbons d’Halloween',
    h1Html: 'Combien de bonbons<br>vas-tu <em>attraper</em> ?',
    hook: 'Ce soir, il pleut des bonbons. Remplis ton seau avant la fin du temps — mais tout ce qui tombe n’est pas sucré.',
    how: { move: 'Glisse ou ← →', catch: 'Attrape les bonbons', avoid: 'Évite les bestioles' },
    facts: '50 secondes · 3 vies · combos',
    start: 'C’est parti →',
  },

  play: {
    score: 'Score',
    time: 'Temps',
    lives: 'Vies',
    livesAria: 'Vies restantes : {n}',
    combo: 'Combo ×{n}',
    pause: 'Pause',
    paused: 'En pause',
    resume: 'Reprendre',
    go: 'Go !',
    fieldAria: 'Zone de jeu. Glisse le doigt, bouge la souris ou utilise les flèches pour déplacer le seau.',
  },

  result: {
    timeUp: 'Temps écoulé !',
    outOfLives: 'Plus de vies !',
    points: 'points',
    best: 'Record : {n}',
    newBest: 'Nouveau record !',
    caught: 'Bonbons attrapés',
    streak: 'Plus long combo',
    top: 'Top {n} %',
    beat: 'Mieux que {pct} % des joueurs',
    beatAll: 'Mieux que tous les autres scores',
    others: 'Comparé à {n} autres scores',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Jeu attrape-bonbons d’Halloween',
    shareText: 'J’ai fait {score} points à l’attrape-bonbons d’Halloween 🍬 Tu fais mieux ?',
  },

  og: {
    brand: '🍬 Attrape-bonbons d’Halloween',
    defaultKicker: 'Jeu d’arcade gratuit',
    defaultTitle: 'Combien de bonbons vas-tu attraper ?',
    defaultDesc: 'Glisse le seau · attrape les bonbons · 50 secondes',
  },

  faq: [
    { q: 'Comment on joue ?', a: 'Glisse le doigt sur la zone de jeu, bouge la souris ou maintiens les flèches ← → pour déplacer le seau citrouille. Attrape les bonbons qui tombent et évite les choses qui font peur. Une partie dure 50 secondes, ou jusqu’à ce que tes trois vies soient perdues.' },
    { q: 'Comment marchent les points et les combos ?', a: 'Chaque bonbon rapporte des points, et les plus rares et les plus chics rapportent davantage. Attrape des bonbons à la suite pour faire grimper le combo : plus la série est longue, plus le multiplicateur est grand. Un bonbon raté ou une mauvaise prise le remet à zéro.' },
    { q: 'Le pourcentage est-il réel ?', a: 'Oui. À la fin d’une partie, seul ton score est envoyé anonymement à notre serveur et comparé à ceux des autres. Le pourcentage n’apparaît que s’il existe de vrais scores à comparer ; sinon, rien ne s’affiche.' },
    { q: 'Pourquoi le jeu s’est-il arrêté tout seul ?', a: 'Le jeu se met en pause automatiquement quand tu changes d’onglet ou d’appli, pour que tu ne perdes pas de vie pendant ton absence. Touche Reprendre pour continuer. Ton record est gardé dans ce navigateur.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Attrape-bonbons d’Halloween',
    description: 'Politique de confidentialité du jeu attrape-bonbons d’Halloween : scores anonymes, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le jeu attrape-bonbons d’Halloween (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul votre score (arrondi à la dizaine) est envoyé à notre serveur sous forme de décompte anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement lors de l’utilisation, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions risquent alors de ne pas fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences : <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contactez l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 30 septembre 2026.'],
    ],
    back: '← Retour à l’attrape-bonbons d’Halloween',
  },
};
