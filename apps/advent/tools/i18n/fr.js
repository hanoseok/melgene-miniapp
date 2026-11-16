/* Calendrier de l’Avent — français (fr/)
 * Designs, limites, dates et format du lien dans advent-core.js ; écrans et canvas dans advent.js. Ce fichier contient tous les textes visibles.
 * Les clés en Html sont insérées telles quelles (seulement <br> et <em>) ; les corps de privacy.sections aussi.
 * Écran d’accueil = simple accroche (pas de formulaire ni de FAQ). La FAQ n’apparaît que sur l’écran de fin commun.
 * Espaces fines insécables avant ? ! : ; (U+202F). Variables {name} {n} {day} {date} {title} à garder telles quelles.
 * Pluriels selon Intl.PluralRules (one, other). editor.ideas = messages écrits en français (pas des traductions), 80 caractères max.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Calendrier de l’Avent à offrir : 24 cases",
    description: "Créez gratuitement un calendrier de l’Avent personnalisé : un petit mot derrière chacune des 24 cases, envoyé par lien. Une case s’ouvre chaque jour dès le 1er décembre.",
    ogTitle: "Calendrier de l’Avent à offrir 🎄",
    ogDescription: "Cachez 24 petits mots pour quelqu’un que vous aimez. Une case s’ouvre chaque jour de décembre."
  },
  siteName: "Calendrier de l’Avent",
  privacyLink: "Confidentialité",
  start: {
    badge: "🎄 Compte à rebours de Noël",
    h1Kicker: "Calendrier de l’Avent",
    h1Html: "24 petites cases,<br>une <em>surprise</em> par jour",
    hook: "Glissez un mot derrière chaque case pour quelqu’un que vous aimez. Dès le 1er décembre, une case s’ouvre chaque jour.",
    start: "Créer mon calendrier →"
  },
  editor: {
    title: "Remplissez le calendrier",
    themesAria: "Designs du calendrier",
    themes: {
      classic: "Classique",
      snow: "Enneigé",
      gold: "Or étoilé",
      candy: "Bonbon"
    },
    fields: {
      to: { label: "Pour", placeholder: "ex. Léa" },
      from: { label: "De la part de", placeholder: "ex. Hugo" }
    },
    daysLabel: "Les mots derrière les cases",
    daysHint: "80 caractères max par case. Une case vide cache une petite douceur.",
    dayAria: "Message de la case {day}",
    diceAria: "Idée au hasard pour la case {day}",
    placeholder: "Écrire un mot…",
    counter: "{n}/24 cases remplies",
    fillAll: "🎲 Remplir les vides",
    preview: "👀 Aperçu",
    create: "Créer le lien",
    needOne: "Écrivez au moins un message."
  },
  ideas: [
    "Bonjour ! Aujourd’hui est une super journée pour être toi.",
    "Le chocolat chaud est pour moi cette semaine. Tu choisis le café.",
    "Quelle chance de t’avoir dans ma vie. C’est tout, c’est le mot.",
    "Mets ta chanson préférée et danse une minute. Prescription médicale.",
    "Tu te souviens de ce fou rire qui ne s’arrêtait plus ? Moi oui.",
    "Bon pour : une soirée film, tu choisis, je m’occupe du pop-corn.",
    "Tu as plus de courage que tu ne le crois, et plus de douceur que tu ne le sais.",
    "Mission du jour : prendre en photo un truc qui te fait sourire.",
    "Petit rappel : un grand verre d’eau et on s’étire.",
    "Si la journée te paraît longue, ce mot est un petit câlin.",
    "Avec toi, les jours ordinaires ont un air de vacances.",
    "On s’appelle ce soir ? J’ai envie que tu me racontes ta journée.",
    "Bon pour : un câlin, valable à vie, sans date d’expiration.",
    "Offre-toi une petite douceur aujourd’hui. Tu l’as bien méritée.",
    "Déjà la moitié du chemin jusqu’à Noël ! Bravo, tu tiens le rythme.",
    "Sors deux minutes et lève les yeux. Il neige peut-être pas loin.",
    "Trois choses que j’aime chez toi : ton rire, ton cœur, tes playlists.",
    "Note un beau moment de cette année. Moi je commence : te rencontrer.",
    "Bon pour : une corvée de ton choix, faite sans râler.",
    "Tu es ma notification préférée.",
    "Allume une bougie ce soir et fais un vœu.",
    "Se reposer, c’est aussi avancer. Vas-y doucement aujourd’hui.",
    "Demain, Noël sera encore plus proche. Tiens bon !",
    "Joyeux réveillon ! Merci d’être toi.",
    "Choisissons un truc chouette à faire ensemble l’an prochain.",
    "Ce soir, plaid tout doux et chocolat chaud obligatoires.",
    "Info du jour : tu es très facile à aimer.",
    "Envoie un mot gentil à quelqu’un aujourd’hui. Commencer par moi, c’est permis.",
    "Peu importe la distance, tu es toujours près de mon cœur.",
    "Marrons chauds ou bredele ? Aujourd’hui, c’est jour de gourmandise."
  ],
  calendar: {
    heading: "Calendrier de l’Avent",
    forName: "Pour {name}",
    forNone: "Un calendrier de l’Avent pour toi",
    fromName: "De la part de {name}",
    before: {
      one: "La première case s’ouvre le {date}. Plus que {n} jour !",
      other: "La première case s’ouvre le {date}. Plus que {n} jours !"
    },
    during: "Nous sommes le {date}. Ouvre la case du jour !",
    after: "Noël est arrivé. Toutes les cases sont ouvertes.",
    locked: {
      one: "La case {day} s’ouvre le {date}, dans {n} jour.",
      other: "La case {day} s’ouvre le {date}, dans {n} jours."
    },
    hint: "Touche une case pour l’ouvrir",
    doorAria: "Case {day}",
    dayTitle: "{date}",
    treat: "Pas de message aujourd’hui, juste une petite douceur pour toi.",
    close: "Fermer",
    makeOwn: "🎄 Créer le mien"
  },
  preview: {
    badge: "👀 Mode aperçu",
    note: "Cet écran n’est visible que par vous. Toutes les cases sont ouvertes pour relire vos messages. Chez votre proche, elles s’ouvrent une par jour.",
    back: "← Retour"
  },
  result: {
    eyebrowMine: "Votre calendrier de l’Avent est prêt !",
    eyebrowFriend: "Un calendrier rien que pour toi",
    linkLabel: "Lien du calendrier",
    copy: "Copier",
    copied: "Lien copié !",
    copyFail: "Copie impossible. Sélectionnez le lien et copiez-le.",
    note: "Les messages n’existent que dans ce lien. Toute personne qui l’a peut ouvrir chaque case le jour venu : envoyez-le seulement à la bonne personne.",
    save: "Enregistrer l’image",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Faites une capture d’écran.",
    imageAlt: "Calendrier de l’Avent avec 24 cases fermées",
    preview: "Aperçu de toutes les cases",
    edit: "Modifier",
    retry: "Créer un autre calendrier",
    retryFriend: "Créer le mien",
    shareTitle: "Calendrier de l’Avent",
    shareText: "Je t’ai fait un calendrier de l’Avent 🎄 Une case s’ouvre chaque jour dès le 1er décembre :",
    shareTextFriend: "Créez un calendrier de l’Avent pour quelqu’un que vous aimez 🎄",
    fileName: "calendrier-avent"
  },
  og: {
    brand: "🎄 Calendrier de l’Avent",
    kicker: "Calendrier de l’Avent à offrir",
    title: "24 cases, une surprise par jour",
    desc: "4 designs · un mot par case · à offrir par lien"
  },
  faq: [
    {
      q: "Quand les cases s’ouvrent-elles ?",
      a: "La case 1 s’ouvre le 1er décembre, la case 2 le 2 décembre, et ainsi de suite jusqu’au 24, selon la date du téléphone ou de l’ordinateur de votre proche. Du 25 décembre au 31 janvier, tout est ouvert ; avant décembre, tout reste fermé."
    },
    {
      q: "Où sont enregistrés mes messages ?",
      a: "Uniquement dans le lien. Rien de ce que vous écrivez n’est envoyé à notre serveur, donc toute personne qui a le lien peut lire les messages quand les cases s’ouvrent. Envoyez-le seulement à la bonne personne."
    },
    {
      q: "Puis-je modifier un message après l’envoi ?",
      a: "Non : les messages sont dans le lien lui-même, qui ne peut pas être modifié ensuite. Modifiez votre calendrier, créez un nouveau lien et envoyez celui-là."
    },
    {
      q: "Que voit-on derrière une case vide ?",
      a: "Une petite douceur du jour : un biscuit, un sucre d’orge ou une étoile. Vous pouvez remplir toutes les cases, seulement quelques-unes, ou laisser le dé proposer des idées."
    }
  ],
  privacy: {
    title: "Confidentialité | Calendrier de l’Avent",
    description: "Politique de confidentialité du Calendrier de l’Avent : traitement de vos messages, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Le Calendrier de l’Avent (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Les noms et messages que vous saisissez ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur (un brouillon est gardé en stockage local pendant l’édition) et dans le lien lorsque vous le partagez. Les cases déjà ouvertes sont mémorisées uniquement dans le navigateur de la personne qui reçoit le lien. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre son utilisation. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions peuvent alors ne pas marcher correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences : <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, calendriers créés, notes). Rien de tout cela ne vous identifie, ni ne contient ce que vous avez écrit."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec le Service contiennent votre calendrier, encodé dans l’URL : toute personne qui a le lien peut lire chaque message une fois sa case ouverte. Les images enregistrées ne montrent que les numéros des cases et sont créées dans votre navigateur. Évitez d’écrire une adresse, un numéro de téléphone ou d’autres données personnelles."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique, contactez l’exploitant du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 17 novembre 2026."
      ]
    ],
    back: "← Retour au Calendrier de l’Avent"
  }
};
