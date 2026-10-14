/* Oui ou non — français. Même structure de clés que en.js (voir commentaires). Tutoiement. Espace fine insécable (\u202f) avant ? ! : ;
 * oracle : 12 réponses (0-3 positives · 4-7 neutres · 8-11 négatives), courtes car elles tiennent dans la boule. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Oui ou non – roue et tirage au sort en ligne',
    description: 'Tu hésites\u202f? Écris ta question et obtiens un oui ou un non en un clic\u202f: oui/non, oui/non/peut-être, boule mystique ou deux manches gagnantes. Gratuit, équitable, sans inscription.',
    ogTitle: 'Oui ou non 🎱 Pose ta question, la boule répond',
    ogDescription: 'Oui, non, peut-être ou la réponse de la boule mystique. Un tirage au sort équitable pour chaque petit dilemme.',
  },
  siteName: 'Oui ou non',
  privacyLink: 'Confidentialité',

  hero: {
    h1Kicker: 'Oui ou non',
    h1Html: 'Pose ta question.<br>La boule dit <em>oui</em> ou <em>non</em>',
    hook: 'Écris la question qui te fait tourner en rond, choisis un mode et laisse le hasard trancher.',
  },

  ui: {
    questionLabel: 'Ta question (facultatif)',
    questionPh: 'ex. On commande des pizzas ce soir\u202f?',
    questionHint: 'Elle reste sur cet appareil. Elle n’entre dans un lien que si tu partages la réponse.',
    modeLabel: 'Comment la boule doit répondre\u202f?',
    modes: {
      classic: 'Oui / Non',
      maybe: 'Oui / Non / Peut-être',
      oracle: 'Boule mystique',
      best3: '2 manches',
      best5: '3 manches',
    },
    modeHints: {
      classic: 'Un oui ou un non, 50/50.',
      maybe: 'Oui, non ou peut-être, une chance sur trois chacun.',
      oracle: 'Une des 12 réponses de la boule\u202f: certaines disent oui, d’autres non, d’autres «\u202fattends\u202f».',
      best3: 'On lance jusqu’à ce qu’un camp gagne deux manches.',
      best5: 'On lance jusqu’à ce qu’un camp gagne trois manches.',
    },
    ask: 'Demander à la boule 🔮',
    asking: 'La boule réfléchit…',
    fair: 'Hasard crypto équitable · pour le fun, c’est toi qui décides',
  },

  answers: { yes: 'OUI', no: 'NON', maybe: 'PEUT-ÊTRE' },
  tones: { positive: 'Plutôt oui', neutral: 'À voir', negative: 'Plutôt non' },
  oracle: [
    'Fonce\u202f!',
    'Les étoiles disent oui',
    'Vas-y, sans regret',
    'Ton cœur le sait déjà\u202f: oui',
    'La nuit porte conseil',
    'Redemande-moi demain',
    'Parles-en, puis décide',
    'Le brouillard est épais',
    'Pas cette fois',
    'Les étoiles disent non',
    'Laisse tomber celle-là',
    'Attends encore un peu',
  ],

  result: {
    heading: 'La boule a parlé',
    sharedBadge: '🔗 Réponse partagée',
    sharedNote: 'Réponse obtenue le {date}. C’est la réponse d’origine enregistrée dans le lien, l’ouvrir ne relance rien.',
    noQuestion: 'Aucune question écrite',
    bestOf: 'Au meilleur des {n}',
    score: '{yes} {a}\u202f:\u202f{b} {no}',
    flipYes: 'O',
    flipNo: 'N',
    copyLink: 'Partager cette réponse 🔗',
    linkCopied: 'Lien copié avec ta question et la réponse',
    again: 'Redemander',
    askOwn: 'Demander moi-même',
    live: 'Réponse\u202f: {answer}',
    shareTitle: 'Oui ou non',
    shareText: 'J’ai demandé à la boule oui ou non et elle a dit\u202f: {answer} 🎱',
  },

  tally: {
    title: 'Cette session',
    total: 'Réponses\u202f: {n}',
  },

  history: {
    title: 'Dernières réponses',
    note: 'Tes 10 dernières réponses, enregistrées sur cet appareil seulement.',
    clear: 'Effacer',
  },

  errors: {
    badLink: 'Ce lien de réponse est cassé ou incomplet, rien ne peut en être affiché.',
  },

  og: {
    brand: '🎱 Oui ou non',
    kicker: 'Oui · Non · Peut-être · Boule mystique',
    title: 'Pose ta question, obtiens oui ou non',
    desc: 'Un tirage au sort équitable pour chaque petit dilemme',
  },

  faq: [
    { q: 'Comment marche le tirage oui ou non\u202f?', a: 'Écris une question si tu veux, choisis un mode et appuie sur «\u202fDemander à la boule\u202f». La réponse est tirée d’abord, puis la boule tremble ou les manches défilent pour la révéler. Oui/Non, c’est 50/50, Oui/Non/Peut-être donne une chance sur trois à chacun, la boule mystique choisit parmi 12 réponses, et les modes en 2 ou 3 manches gagnantes continuent jusqu’à la majorité.' },
    { q: 'La réponse est-elle vraiment aléatoire\u202f?', a: 'Oui. Chaque réponse vient du générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues) avec un échantillonnage par rejet, donc aucune réponse n’est même un tout petit peu plus probable qu’une autre. L’animation montre seulement un résultat déjà tiré.' },
    { q: 'Dois-je vraiment suivre la réponse\u202f?', a: 'Seulement si tu en as envie. C’est un tirage pour s’amuser, pas un conseil ni une prédiction, alors ne l’utilise pas pour la santé, l’argent, le droit ou la sécurité. Petite astuce\u202f: remarque si tu es soulagé ou déçu quand la réponse apparaît. Ce ressenti est souvent ta vraie réponse.' },
    { q: 'Ma question est-elle enregistrée ou envoyée quelque part\u202f?', a: 'Ta question reste dans ton navigateur. Tes 10 dernières réponses sont gardées sur cet appareil pour que tu puisses les revoir, et tu peux les effacer à tout moment. La question ne quitte ton appareil que si tu appuies sur «\u202fPartager cette réponse\u202f», qui la met dans le lien que tu envoies.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Oui ou non',
    description: 'Politique de confidentialité de Oui ou non : tes questions restent dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Oui ou non (le «\u202fService\u202f») respecte ta vie privée et ne traite que les informations minimales décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les questions que tu écris et les réponses obtenues sont traitées uniquement dans ton navigateur et ne sont pas envoyées à notre serveur. Tes 10 dernières réponses, question comprise, sont conservées dans le stockage local de ton navigateur sur ton appareil, et tu peux les effacer à tout moment avec le bouton Effacer. Quand tu appuies sur «\u202fPartager cette réponse\u202f», la question et la réponse sont écrites dans le lien lui-même et ne sont partagées qu’avec les personnes à qui tu l’envoies.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue et tes dernières réponses, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions peuvent alors ne pas marcher comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et sur d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, questions posées, notes). Tes questions ne font jamais partie de ces comptes, et rien de tout cela ne t’identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 15 octobre 2026.'],
    ],
    back: '← Retour à Oui ou non',
  },
};
