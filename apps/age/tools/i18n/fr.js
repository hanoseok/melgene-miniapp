/* Calcul de l’âge — français. Même structure de clés que en.js (voir commentaires).
 * Pluriels : catégories one / many / other (Intl.PluralRules fr). Espace fine insécable (U+202F) avant ? ! : ;
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },
  dateOrder: 'dmy',

  meta: {
    title: 'Calcul de l’âge – Quel âge ai-je exactement ?',
    description: 'Calcul de l’âge gratuit : entrez votre date de naissance pour connaître votre âge exact en années, mois et jours, le compte à rebours avant votre anniversaire, vos jours vécus et votre signe.',
    ogTitle: 'Calcul de l’âge 🎂 Quel âge ai-je, au jour près ?',
    ogDescription: 'Votre âge exact en années, mois et jours, le compte à rebours avant l’anniversaire et vos jours vécus.',
  },
  siteName: 'Calcul de l’âge',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Calcul de l’âge',
    h1Html: 'Quel âge ai-je, <em>au jour près</em> ?',
    hook: 'Choisissez votre date de naissance : votre âge exact, le temps qu’il reste avant la prochaine fête et le nombre de jours déjà vécus.',
  },

  ui: {
    birthLabel: 'Date de naissance',
    year: 'Année',
    month: 'Mois',
    day: 'Jour',
    asOfLabel: 'Âge à cette date (facultatif)',
    asOfHint: 'Laissez vide pour aujourd’hui. Choisissez une autre date pour voir quel âge vous aviez, ou aurez.',
    todayBtn: 'Aujourd’hui',
    compute: 'Calculer mon âge 🎂',
    localNote: 'Calculé sur votre appareil avec la date locale. Rien n’est envoyé ni enregistré.',
  },

  result: {
    asOf: 'Au {date}',
    ageLabel: 'Votre âge',
    big: { one: '{n} an', many: '{n} d’ans', other: '{n} ans' },
    y: { one: '{n} an', many: '{n} d’ans', other: '{n} ans' },
    m: { one: '{n} mois', many: '{n} de mois', other: '{n} mois' },
    d: { one: '{n} jour', many: '{n} de jours', other: '{n} jours' },
    sep: ', ',
    born: 'Né(e) un {weekday}',
    nextTitle: 'Prochain anniversaire',
    nextIn: { one: 'Encore {n} jour', many: 'Encore {n} de jours', other: 'Encore {n} jours' },
    turning: 'Vous aurez {n} ans',
    birthdayToday: 'Joyeux anniversaire ! 🎉',
    turnedToday: 'Vous avez {n} ans aujourd’hui',
    leapNote: 'Né(e) un 29 février : les années sans 29 février, ce calcul fête votre anniversaire le 28 février.',
    totalsTitle: 'Vous avez vécu',
    totals: { days: 'Jours', weeks: 'Semaines', months: 'Mois', hours: 'Heures' },
    weeksRest: '{w} sem. {d} j',
    hoursNote: 'Heures = jours entiers × 24, à partir du début de votre jour de naissance.',
    signsTitle: 'Votre naissance en bref',
    weekdayLabel: 'Jour',
    zodiacLabel: 'Signe',
    animalLabel: 'Signe chinois',
    zodiac: { aries: 'Bélier', taurus: 'Taureau', gemini: 'Gémeaux', cancer: 'Cancer', leo: 'Lion', virgo: 'Vierge', libra: 'Balance', scorpio: 'Scorpion', sagittarius: 'Sagittaire', capricorn: 'Capricorne', aquarius: 'Verseau', pisces: 'Poissons' },
    animals: { rat: 'Rat', ox: 'Buffle', tiger: 'Tigre', rabbit: 'Lapin', dragon: 'Dragon', snake: 'Serpent', horse: 'Cheval', goat: 'Chèvre', monkey: 'Singe', rooster: 'Coq', dog: 'Chien', pig: 'Cochon' },
    milestonesTitle: 'Dates à fêter',
    msDays: '{n} jours de vie',
    msRound: 'Vos {n} ans',
    msToday: 'Aujourd’hui !',
    msPassed: 'Passé',
    again: 'Calculer un autre âge',
    live: 'Résultat : {label}',
    shareTitle: 'Calcul de l’âge',
    shareText: 'J’ai déjà vécu {days} jours 🎂 Et toi, combien ?',
  },

  errors: {
    noDate: 'Choisissez l’année, le mois et le jour de naissance.',
    badDate: 'Ce jour n’existe pas dans ce mois. Vérifiez le jour.',
    future: 'Cette naissance est après la date de calcul. Vérifiez l’année ou le champ « Âge à cette date ».',
    tooOld: 'Cela ferait plus de 130 ans. Vérifiez l’année.',
    badAsOf: 'Choisissez une date entre 1900 et 2199 pour « Âge à cette date ».',
  },

  korea: {
    show: false,
    title: '',
    man: '',
    manHint: '',
    yeon: '',
    yeonHint: '',
    counting: '',
    countingHint: '',
    unit: '',
    note: '',
  },

  og: {
    brand: '🎂 Calcul de l’âge',
    kicker: 'Années · Mois · Jours',
    title: 'Quel âge avez-vous, au jour près ?',
    desc: 'Âge exact, compte à rebours et jours vécus',
  },

  faq: [
    { q: 'Comment l’âge exact est-il calculé ?', a: 'Vous prenez un an à chaque anniversaire. Les mois et les jours sont comptés depuis le dernier anniversaire, mois par mois ; si un mois n’a pas votre jour de naissance (le 31 par exemple), son dernier jour sert de repère. Le calcul utilise le calendrier de votre appareil, donc ni le fuseau horaire ni l’heure d’été ne décalent le résultat.' },
    { q: 'Je suis né(e) un 29 février. Quand est mon anniversaire ?', a: 'Les années bissextiles, le 29 février. Les autres années, ce calcul le place au 28 février, dernier jour du mois. Pour les démarches officielles, certains pays retiennent le 1er mars : renseignez-vous si besoin.' },
    { q: 'Puis-je connaître mon âge à une date passée ?', a: 'Oui. Indiquez n’importe quel jour entre 1900 et 2199 dans « Âge à cette date » : vous verrez votre âge, vos jours vécus et le prochain anniversaire à cette date. Laissez vide pour aujourd’hui.' },
    { q: 'Ma date de naissance est-elle enregistrée ?', a: 'Non. Le calcul se fait uniquement dans votre navigateur. La date n’est envoyée à aucun serveur, n’est pas enregistrée sur l’appareil et n’apparaît pas dans le lien partagé.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Calcul de l’âge',
    description: 'Politique de confidentialité de Calcul de l’âge : votre date de naissance reste dans le navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Calcul de l’âge (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. La date de naissance et la date de calcul saisies sont traitées uniquement dans votre navigateur : elles ne sont ni envoyées à notre serveur, ni enregistrées sur votre appareil, ni inscrites dans un lien. Les boutons de partage transmettent seulement l’adresse de la page et un court texte avec le nombre de jours vécus, aux personnes que vous choisissez.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour mémoriser votre langue, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences : <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, calculs, notes). Les dates de naissance et les âges n’en font jamais partie, et rien ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contactez l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 19 octobre 2026.'],
    ],
    back: '← Retour au Calcul de l’âge',
  },
};
