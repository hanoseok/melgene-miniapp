/* Pile ou face — français (tu). Même structure que en.js (voir les commentaires). */
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
    title: 'Pile ou face en ligne : lancer de pièce',
    description: 'Tu hésites ? Lance une pièce en ligne, pile ou face, et laisse le hasard trancher. Donne le nom que tu veux aux deux côtés ou lance de un à trois dés. Gratuit, sans inscription.',
    ogTitle: 'Pile ou face 🪙 Pièce et dés',
    ogDescription: 'Lance la pièce ou les dés et laisse le hasard décider.',
  },
  siteName: 'Pile ou face',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🪙 Le départage le plus juste',
    h1Kicker: 'Pile ou face',
    h1Html: 'Pile ou face ?<br>Laisse la <em>pièce</em> décider',
    hook: 'Donne un nom à tes deux options, lance la pièce et suis ce qu’elle indique. Tu peux aussi lancer des dés.',
    facts: 'Pièce et dés · côtés renommables · un tirage équitable à chaque fois',
    start: 'Lancer →',
  },

  tool: {
    title: 'À toi de lancer',
    tabCoin: 'Pièce',
    tabDice: 'Dés',
    namesLabel: 'Nomme les deux côtés',
    namesHint: 'Pile et face par défaut. Remplace-les par tes options, comme Pizza et Sushi.',
    sideA: 'Pile',
    sideB: 'Face',
    fieldA: 'Nom du premier côté',
    fieldB: 'Nom du second côté',
    throwCoin: 'Lancer la pièce 🪙',
    diceLabel: 'Combien de dés ?',
    rollDice: 'Lancer les dés 🎲',
  },

  count: { one: '{n} lancer cette session', other: '{n} lancers cette session' },
  countDice: { one: '{n} lancer cette session', other: '{n} lancers cette session' },

  result: {
    titleCoin: 'La pièce est tombée sur',
    titleDice: 'Tu as obtenu',
    sum: 'Total {n}',
    tallyTitle: 'Cette session',
    tallySide: '{name} {n}',
    againCoin: 'Relancer la pièce',
    againDice: 'Relancer les dés',
    change: 'Retour au lancer',
    shareTitle: 'Pile ou face en ligne',
    shareTextCoin: 'J’ai lancé une pièce et c’est tombé sur {name} 🪙',
    shareTextDice: 'J’ai lancé les dés et j’ai obtenu {n} 🎲',
  },

  og: {
    brand: '🪙 Pile ou face',
    kicker: 'Pile ou face · pièce et dés',
    title: 'Pile ou face ?',
    desc: 'Lance la pièce ou les dés · un tirage équitable tranche',
  },

  faq: [
    { q: 'Comment fonctionne le pile ou face ?', a: 'Nomme tes deux côtés si tu veux, puis appuie sur lancer. Le résultat est tiré d’abord et la pièce tourne pour le montrer, donc ce que tu vois est toujours le vrai résultat. L’onglet Dés permet de lancer de un à trois dés à six faces.' },
    { q: 'Le tirage est-il vraiment équitable ?', a: 'Oui. Le résultat vient du générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues) avec un échantillonnage par rejet, donc pile et face sont exactement aussi probables, comme chaque face d’un dé. L’animation n’est là que pour le spectacle.' },
    { q: 'Puis-je utiliser mes propres options à la place de pile et face ?', a: 'Oui. Écris deux noms dans les champs au-dessus de la pièce, par exemple Pizza et Sushi, et le résultat affiche le nom du gagnant. Laisse un champ vide pour retrouver le nom par défaut.' },
    { q: 'À quoi servent les compteurs de fin ?', a: 'Ils comptent seulement ce que tu as lancé sur cette page depuis son ouverture, avec le nombre de fois où chaque côté est sorti. Ils repartent de zéro au rechargement et ne sont envoyés nulle part.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Pile ou face',
    description: 'Politique de confidentialité de Pile ou face : les noms saisis restent dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Pile ou face (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les noms que tu saisis et tes résultats sont traités uniquement dans ton navigateur et ne sont pas envoyés à notre serveur. Certaines informations peuvent toutefois être collectées automatiquement pendant l’utilisation, comme indiqué ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue, afficher des publicités et comprendre comment il est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne plus marcher correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, lancers, notes). Rien de tout cela ne t’identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 5 octobre 2026.'],
    ],
    back: '← Retour à Pile ou face',
  },
};
