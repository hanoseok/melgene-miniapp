/* Lancer de dés — français (tu). Même structure que en.js (voir les commentaires). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Lancer de dés en ligne – Simulateur de dés',
    description: 'Lancer de dés en ligne en un seul appui : jette de un à six dés à la fois, choisis le d6 classique ou un d4, d8, d10, d12 ou d20 pour tes jeux de rôle et vois le total aussitôt. Équitable, gratuit, sans inscription.',
    ogTitle: 'Lancer de dés 🎲 Dés en ligne',
    ogDescription: 'Lance de un à six dés, du d6 au d20, et vois le total en un appui.',
  },
  siteName: 'Lancer de dés',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Lancer de dés en ligne',
    h1Html: 'Secoue, lance et<br>laisse les <em>dés</em> décider',
    hook: 'Choisis combien de dés et lesquels, puis lance. Jeux de société, jeux de rôle ou pour savoir qui fait la vaisselle.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: 'Combien de dés ?',
    typeLabel: 'Type de dé',
    typeHint: 'Le d6 est le cube classique. Du d4 au d20 pour les jeux de rôle.',
    roll: 'Lancer les dés 🎲',
    rolling: 'Ça roule…',
    keyHint: 'Astuce : appuie sur Espace pour lancer',
    idle: 'Prêt quand tu veux',
    total: 'Total {n}',
    trayLabel: 'Piste de dés',
    live: 'Tu as obtenu {values}. Total {total}.',
    liveOne: 'Tu as obtenu {values}.',
    fair: 'Chaque face a exactement la même chance (hasard cryptographique)',
  },

  history: {
    title: 'Tes 10 derniers lancers',
    note: 'Conservés seulement tant que la page est ouverte.',
    item: '{dice} : {values} = {total}',
    itemOne: '{dice} : {values}',
  },

  result: {
    again: 'Relancer',
    shareTitle: 'Lancer de dés – Lancer de dés en ligne',
    shareText: 'J’ai lancé {dice} et obtenu {values} = {total} 🎲',
    shareTextOne: 'J’ai lancé {dice} et obtenu {values} 🎲',
  },

  og: {
    brand: '🎲 Lancer de dés',
    kicker: '1 à 6 dés · du d4 au d20',
    title: 'Lancer de dés en ligne',
    desc: 'Un appui, chaque dé et le total',
  },

  faq: [
    { q: 'Le lancer de dés est-il vraiment aléatoire et équitable ?', a: 'Oui. Chaque résultat vient du générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues) avec un échantillonnage par rejet, si bien qu’aucune face n’est ne serait-ce qu’un peu plus probable qu’une autre. Le résultat est fixé avant le début de l’animation ; les dés qui roulent ne sont là que pour le spectacle.' },
    { q: 'Combien de dés puis-je lancer à la fois ?', a: 'De un à six dés par lancer, tous du même type. La piste affiche chaque dé et le total, et tes dix derniers lancers restent dans une petite liste tant que la page est ouverte.' },
    { q: 'C’est quoi, d4, d8, d10, d12 et d20 ?', a: 'Ce sont des dés à 4, 8, 10, 12 et 20 faces, utilisés dans les jeux de rôle comme Donjons et Dragons. Le nombre après le d indique le nombre de faces : un d20 donne de 1 à 20, et 2d6 signifie deux dés à six faces.' },
    { q: 'Puis-je l’utiliser pour des jeux de société ?', a: 'Bien sûr. Sers-t’en quand les dés ont disparu, quand il t’en faut plus que dans la boîte ou quand tu joues en visio. Sur un clavier, appuie sur Espace pour lancer plus vite.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Lancer de dés',
    description: 'Politique de confidentialité de Lancer de dés : tes lancers restent dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Lancer de dés (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Tes réglages de dés et tes résultats sont traités uniquement dans ton navigateur et ne sont pas envoyés à notre serveur. Certaines informations peuvent toutefois être collectées automatiquement pendant l’utilisation, comme indiqué ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue, afficher des publicités et comprendre comment il est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne plus marcher correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, lancers, notes). Rien de tout cela ne t’identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 9 octobre 2026.'],
    ],
    back: '← Retour à Lancer de dés',
  },
};
