/* Calcul IMC — français. Même structure de clés et mêmes marqueurs que en.js (voir les commentaires).
 * Espace fine insécable ( ) avant ? ! : ; et à l’intérieur des guillemets « » (norme typographique française).
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'Calcul IMC – Indice de masse corporelle adulte',
    description: 'Calcul IMC gratuit pour adultes : entrez votre taille et votre poids en cm/kg ou en pieds/livres pour connaître votre indice de masse corporelle, sa catégorie OMS et votre poids santé.',
    ogTitle: 'Calcul IMC ⚖️ Votre IMC et votre poids santé',
    ogDescription: 'Indice de masse corporelle en cm/kg ou pieds/livres, seuils OMS et asiatiques, et la fourchette de poids santé pour votre taille.',
  },
  siteName: 'Calcul IMC',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Calcul IMC',
    h1Html: 'Votre IMC, <em>dès la saisie</em>',
    hook: 'Entrez votre taille et votre poids pour situer votre IMC sur une échelle de couleurs et voir le poids santé pour votre taille.',
  },

  ui: {
    unitsLabel: 'Unités',
    metric: 'cm · kg',
    imperial: 'pi · lb',
    height: 'Taille',
    weight: 'Poids',
    cm: 'cm',
    kg: 'kg',
    ft: 'pi',
    inch: 'po',
    lb: 'lb',
    more: '+ Âge et sexe (facultatif)',
    less: '− Masquer âge et sexe',
    age: 'Âge',
    years: 'ans',
    sex: 'Sexe',
    sexNone: 'Non précisé',
    female: 'Femme',
    male: 'Homme',
    asiaToggle: 'Seuils asiatiques',
    yourBmi: 'Votre IMC',
    waiting: 'Entrez votre taille et votre poids, votre IMC s’affichera ici.',
    scaleLabel: 'Échelle de l’IMC',
    rangeTitle: 'Poids santé pour votre taille',
    toLose: 'Environ {w} au-dessus de la fourchette santé',
    toGain: 'Environ {w} en dessous de la fourchette santé',
    inRange: 'Vous êtes dans la fourchette de poids santé.',
    under18: 'Ce calcul est réservé aux adultes (18 ans et plus). Pour les enfants et les ados, l’IMC se lit sur des courbes de corpulence selon l’âge et le sexe : la catégorie ci-dessus ne s’applique pas.',
    senior: 'Après 65 ans, un IMC un peu plus élevé est souvent jugé acceptable. Votre médecin peut vous dire ce qui vous convient.',
    sexNote: 'Les seuils de l’IMC adulte sont les mêmes pour les femmes et les hommes, même si les femmes ont en général plus de masse grasse à IMC égal.',
    disclaimerTitle: 'À garder en tête',
    disclaimer: [
      'L’IMC est un simple repère de dépistage, pas un diagnostic ni un avis médical.',
      'Il ne distingue pas le muscle de la graisse : les sportifs très musclés peuvent avoir un IMC élevé.',
      'Il ne s’applique pas pendant la grossesse, et ce calcul est réservé aux adultes de 18 ans et plus.',
    ],
    decimalHint: 'Décimales : « . » ou « , », les deux marchent.',
    finish: 'Voir mon résumé ✓',
    needOne: 'Entrez d’abord votre taille et votre poids.',
    localNote: 'Calculé sur votre appareil. Rien de ce que vous saisissez n’est envoyé ni enregistré.',
    summaryTitle: 'Résumé de votre IMC',
    summaryNote: 'Ce résumé n’existe que sur cette page. Rien n’est enregistré.',
    sumScale: 'Seuils',
    sumRange: 'Poids santé',
    again: 'Recommencer',
    live: 'IMC {bmi}, {cat}',
    shareTitle: 'Calcul IMC',
    shareText: 'Calculez votre IMC et votre poids santé en quelques secondes ⚖️',
  },

  scales: {
    who: {
      name: 'OMS',
      note: 'Catégories de l’Organisation mondiale de la santé pour les adultes.',
      labels: ['Maigreur', 'Poids normal', 'Surpoids', 'Obésité modérée', 'Obésité sévère', 'Obésité massive'],
    },
    alt: {
      name: 'Asie-Pacifique',
      note: 'Seuils OMS Asie-Pacifique (2000) : chez beaucoup de personnes d’origine asiatique, les risques pour la santé apparaissent à un IMC plus bas.',
      labels: ['Maigreur', 'Poids normal', 'Surpoids (à risque)', 'Obésité modérée', 'Obésité sévère'],
    },
  },

  errors: {
    badNum: 'Uniquement des chiffres, avec « . » ou « , » pour les décimales.',
    heightRange: 'Vérifiez la taille : elle doit être comprise entre 50 et 272 cm.',
    weightRange: 'Vérifiez le poids : il doit être compris entre 10 et 650 kg.',
    inchRange: 'Les pouces doivent rester sous 12. Mettez les pieds entiers dans la première case.',
    ageRange: 'L’âge doit être un nombre entier entre 2 et 120.',
  },

  og: {
    brand: '⚖️ Calcul IMC',
    kicker: 'Taille · Poids · IMC',
    title: 'Où se situe votre IMC ?',
    desc: 'Avec le poids santé pour votre taille',
  },

  faq: [
    { q: 'Comment calcule-t-on l’IMC ?', a: 'On divise le poids en kilos par la taille en mètres au carré. Pour 1,70 m et 65 kg, cela donne 65 ÷ (1,7 × 1,7) ≈ 22,5. Si vous saisissez des pieds et des livres, le calcul est converti automatiquement.' },
    { q: 'Quel est un IMC normal chez l’adulte ?', a: 'Selon l’OMS, un IMC de 18,5 à 24,9 correspond à un poids normal, de 25 à 29,9 à un surpoids, et 30 ou plus à une obésité. Pour les personnes d’origine asiatique, des seuils plus bas sont souvent recommandés ; activez-les avec l’option « Seuils asiatiques ».' },
    { q: 'Pourquoi mon IMC est élevé alors que je fais du sport ?', a: 'L’IMC ne regarde que le poids et la taille : il ne sait pas si ce poids vient du muscle ou de la graisse. Les sportifs musclés se retrouvent souvent en « surpoids » tout en étant secs. Le tour de taille ou une mesure de composition corporelle en disent plus.' },
    { q: 'Peut-on l’utiliser pour un enfant ou pendant la grossesse ?', a: 'Non. Avant 18 ans, on utilise les courbes de corpulence du carnet de santé selon l’âge et le sexe, et la prise de poids pendant la grossesse suit ses propres repères. Parlez-en à un médecin ou à une sage-femme.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Calcul IMC',
    description: 'Politique de confidentialité de Calcul IMC : votre taille, votre poids et votre âge restent dans votre navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Calcul IMC (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. La taille, le poids, l’âge et le sexe que vous saisissez sont calculés uniquement dans votre navigateur. Ils ne sont ni envoyés à notre serveur, ni enregistrés, ni ajoutés à un lien. Le Service retient seulement, sur votre appareil, les unités utilisées en dernier (cm et kg ou pieds et livres). Si vous utilisez les boutons de partage, seuls l’adresse de la page et un court texte sans vos chiffres sont partagés, avec les personnes de votre choix.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour retenir votre langue et vos unités, afficher des publicités et comprendre son utilisation. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions risquent alors de mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon vos visites sur ce site et d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, calculs, notes). Vos mesures n’entrent jamais dans ces chiffres, et rien ne permet de vous identifier personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contactez l’éditeur du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 24 octobre 2026.'],
    ],
    back: '← Retour au Calcul IMC',
  },
};
