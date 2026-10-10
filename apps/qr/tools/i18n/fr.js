/* Générateur de QR code — Français (/fr/)
 * L’encodeur est dans qr-core.js ; ce fichier contient tous les textes visibles. Même structure de clés que en.js.
 * Espaces fines insécables ( ) avant ? ! : ; — sauf dans privacy.
 * Garder les jetons {bytes} {v} {n} {ratio} {value} tels quels.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Générateur de QR code gratuit – Wi-Fi, PNG, SVG',
    description: 'Générateur de QR code gratuit pour un lien, un texte, un Wi-Fi, un e-mail ou un numéro. Choisis couleurs, correction d’erreur et taille, puis télécharge en PNG ou SVG. Sans inscription.',
    ogTitle: 'Générateur de QR code 🔳 gratuit et privé',
    ogDescription: 'Un QR code pour un lien, un Wi-Fi, un e-mail ou un numéro en quelques secondes. Rien ne quitte ton navigateur.',
  },
  siteName: 'Générateur de QR code',
  privacyLink: 'Confidentialité',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'Générateur de QR code',
    h1Html: 'Tu tapes, ça <em>s’affiche</em>,<br>tu partages',
    hook: 'Lien, texte, Wi-Fi, e-mail ou numéro de téléphone deviennent un QR code pendant que tu écris. Gratuit, sans inscription, fabriqué dans ton navigateur.',
  },

  ui: {
    typeLabel: 'Que doit contenir le QR code ?',
    types: { link: 'Lien', text: 'Texte', wifi: 'Wi-Fi', email: 'E-mail', phone: 'Tél.' },
    link: { label: 'Adresse du site', placeholder: 'exemple.fr/menu' },
    text: { label: 'Ton texte', placeholder: 'Une note, un code, un petit message…' },
    wifi: {
      ssid: 'Nom du réseau (SSID)', ssidPh: 'Livebox-1234',
      password: 'Mot de passe', passwordPh: 'Clé Wi-Fi',
      security: 'Sécurité',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (ancien)', nopass: 'Sans mot de passe' },
      hidden: 'Réseau masqué',
    },
    email: { to: 'Adresse e-mail', toPh: 'prenom@exemple.fr', subject: 'Objet (facultatif)', subjectPh: 'Bonjour', body: 'Message (facultatif)', bodyPh: 'Écris ton message…' },
    phone: { label: 'Numéro de téléphone', placeholder: '06 12 34 56 78' },

    previewLabel: 'Aperçu du QR code',
    previewReady: 'Aperçu du QR code, version {v}',
    emptyPreview: 'Ton QR code s’affiche ici dès que tu écris',
    info: '{bytes} octets · version {v} · {n}×{n} modules',
    encodes: 'Contenu : {value}',
    tooLong: 'Trop long pour un seul QR code. Raccourcis-le ou choisis une correction plus faible (L).',
    encodeFail: 'Impossible de créer ce QR code. Essaie de modifier le texte.',
    warnContrast: 'Contraste faible ({ratio}:1). La lecture peut échouer : préfère un code foncé sur fond clair.',
    warnInverted: 'Code clair sur fond foncé. Certaines applis ne lisent pas les codes inversés.',
    warnQuiet: 'Une marge étroite peut gêner la lecture. Garde au moins 2 modules (4 est la norme).',

    downloadPng: 'Télécharger PNG',
    downloadSvg: 'Télécharger SVG',
    copyImage: 'Copier l’image',
    savedPng: 'PNG enregistré. Scanne-le une fois avec ton téléphone avant d’imprimer.',
    savedSvg: 'SVG enregistré. Parfait pour l’impression, net à toutes les tailles.',
    copied: 'Image copiée. Colle-la dans un document ou une discussion.',
    copyFail: 'La copie d’image n’est pas autorisée ici. Utilise Télécharger PNG.',
    saveFail: 'L’enregistrement a échoué. Réessaie.',

    options: '🎨 Couleurs, taille et correction',
    colors: 'Couleurs',
    fg: 'Code',
    bg: 'Fond',
    resetColors: 'Réinitialiser',
    ecc: 'Correction d’erreur',
    eccHint: 'Plus le niveau est haut, mieux le code résiste aux rayures et aux logos, mais plus il est dense. M convient presque toujours.',
    size: 'Taille de l’image',
    margin: 'Zone de silence (marge)',
    marginHint: 'La bordure vide autour du code, en modules. La norme est 4.',
    localNote: '🔒 Fabriqué dans ton navigateur. Ce que tu tapes n’est jamais envoyé à un serveur.',
  },

  result: {
    doneTitle: 'Ton QR code est prêt ✓',
    doneText: 'Teste-le avec l’appareil photo d’un téléphone avant de l’imprimer ou de le partager. Modifie les champs ci-dessus pour en créer un autre.',
    again: 'Créer un autre QR code',
    shareTitle: 'Générateur de QR code – gratuit et privé',
    shareText: 'Crée un QR code pour un lien, un Wi-Fi ou un texte en quelques secondes, directement dans ton navigateur 🔳',
  },

  og: {
    brand: '🔳 Générateur de QR code',
    kicker: 'Lien · Wi-Fi · Texte · PNG et SVG',
    title: 'Un QR code en quelques secondes',
    desc: 'Gratuit, privé, fait dans ton navigateur',
  },

  faq: [
    { q: 'Ce que je tape est-il envoyé quelque part ?', a: 'Non. Le QR code est calculé par JavaScript dans ton navigateur : liens, mots de passe Wi-Fi et messages n’arrivent jamais sur un serveur. Rien n’est enregistré non plus, tout disparaît quand tu fermes la page.' },
    { q: 'Les QR codes expirent-ils ?', a: 'Non. Ce sont des QR codes statiques : le contenu est inscrit dans le motif lui-même, sans redirection ni lien de suivi. Un code imprimé fonctionne tant que le lien ou le réseau visé existe.' },
    { q: 'Comment marche le QR code Wi-Fi ?', a: 'Il enregistre le nom du réseau, le mot de passe et le type de sécurité au format standard WIFI:. L’appareil photo d’un iPhone ou d’un Android propose alors de se connecter, sans recopier la clé de la box.' },
    { q: 'Quel niveau de correction choisir ?', a: 'M (environ 15 % de récupération) convient à la plupart des usages. Choisis Q ou H pour une surface rugueuse, un code qui risque d’être rayé ou un logo posé au centre. L donne le code le plus petit pour un long contenu affiché à l’écran.' },
    { q: 'PNG ou SVG ?', a: 'Le PNG est une image classique pour les sites, les messageries et les documents. Le SVG est un fichier vectoriel qui reste parfaitement net à toutes les tailles, idéal pour les affiches, les flyers et l’imprimeur.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Générateur de QR code',
    description: 'Politique de confidentialité du Générateur de QR code : ce que tu tapes reste dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Générateur de QR code (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les liens, textes, informations Wi-Fi, adresses e-mail et numéros que tu saisis sont transformés en QR code uniquement dans ton navigateur. Ils ne sont ni envoyés à notre serveur ni enregistrés. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions pourraient alors mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs qui ne gardent que des totaux quotidiens par langue (pages vues, codes créés, notes). Le contenu de tes QR codes n’en fait jamais partie et rien de tout cela ne t’identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 11 octobre 2026.'],
    ],
    back: '← Retour au Générateur de QR code',
  },
};
