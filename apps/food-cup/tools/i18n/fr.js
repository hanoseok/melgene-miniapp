/* Tournoi de bouffe – Tu préfères quel plat ? — Français (/fr/)
 * Même structure de clés que en.js. Ids des plats, émojis et tableau : food-cup-core.js.
 * Espace fine insécable (U+202F) avant ? ! : ; comme en typographie française.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tournoi de bouffe – Tu préfères quel plat ?',
    description: 'Tournoi de bouffe : deux plats par duel, touche ton préféré jusqu’à ce qu’il n’en reste qu’un. Le jeu « tu préfères » version bouffe, en une minute et gratuit.',
    ogTitle: 'Tournoi de bouffe 🏆 Tu préfères quel plat ?',
    ogDescription: 'Deux plats, un choix, quinze duels. Quel plat vas-tu couronner ?',
  },
  siteName: 'Tournoi de bouffe',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🍽️ Tu préfères · version bouffe',
    h1Kicker: 'Tournoi de bouffe',
    h1Html: 'Quel plat aura<br>la <em>couronne</em> ?',
    hook: 'Deux plats, un seul choix. Continue jusqu’à ce qu’il ne reste que ton préféré.',
    facts: '16 plats · 15 choix · 1 min',
    start: 'Lancer le tournoi →',
  },

  play: {
    rounds: { r16: 'Huitième de finale', qf: 'Quart de finale', sf: 'Demi-finale', f: 'Finale' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Choix {n} sur {total}',
    hint: 'Tu préfères manger lequel ?',
    vs: 'VS',
    pickAria: 'Choisir : {food}',
    same: '{pct} % ont fait le même choix',
  },

  result: {
    eyebrow: 'Ton plat champion',
    champPct: '{pct} % des joueurs ont aussi couronné ce plat',
    champFirst: 'Tu fais partie des premiers à finir : pas encore de stats.',
    fourTitle: 'Ton dernier carré',
    retry: 'Rejouer (nouveau tableau)',
    shareTitle: 'Tournoi de bouffe – Tu préfères quel plat ?',
    shareText: 'Mon plat champion, c’est {emoji} {food} ! Et toi ?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Burger',
    sushi: 'Sushis',
    noodles: 'Ramen',
    chicken: 'Poulet frit',
    tacos: 'Tacos',
    pasta: 'Pâtes bolo',
    curry: 'Curry',
    dumplings: 'Raviolis chinois',
    steak: 'Steak-frites',
    hotpot: 'Pot-au-feu',
    hotdog: 'Hot-dog',
    friedrice: 'Riz cantonais',
    sandwich: 'Jambon-beurre',
    stew: 'Paella',
    shrimp: 'Tempura',
  },

  og: {
    brand: '🏆 Tournoi de bouffe',
    defaultKicker: 'Tu préfères · version bouffe',
    defaultTitle: 'Quel plat aura la couronne ?',
    defaultDesc: 'Deux plats à la fois · un champion · environ une minute',
  },

  faq: [
    { q: 'Comment marche le tournoi de bouffe ?', a: 'Seize plats sont mélangés dans un tableau au hasard. À chaque duel, deux plats s’affrontent : touche celui que tu préfères manger et il passe au tour suivant. Huitièmes, quarts, demies et finale : 15 choix, et le dernier plat debout est ton champion.' },
    { q: 'Les pourcentages sont-ils réels ?', a: 'Oui. Chaque choix est compté de façon anonyme sur notre serveur, une seule fois par navigateur pour chaque duel. Un pourcentage n’apparaît que lorsque assez de joueurs ont joué ce duel précis ; avant cela, on n’affiche rien plutôt qu’un chiffre inventé.' },
    { q: 'Je peux rejouer ou partager mon résultat ?', a: 'Rejoue autant que tu veux : chaque partie a un nouveau tableau au hasard, donc les duels changent. Avec les boutons de partage, envoie ton champion à tes amis et compare leurs choix.' },
    { q: 'Pourquoi ces seize plats ?', a: 'Ce sont des plats qu’on adore partout dans le monde, de la street food aux plats réconfortants. Les noms suivent ce qu’on dit en français, mais les plats sont les mêmes dans toutes les langues : les pourcentages réunissent donc des joueurs de tous les pays.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Tournoi de bouffe',
    description: 'Politique de confidentialité du Tournoi de bouffe : décomptes anonymes des choix, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Tournoi de bouffe (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Vos choix sont envoyés à notre serveur uniquement sous forme de totaux anonymes (quel plat a gagné quel duel, quel plat vous avez couronné), sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement lors de l’utilisation du Service, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et les duels déjà comptés, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions pourraient alors ne pas marcher comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, tournois terminés, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contactez l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique s’applique à partir du 29 septembre 2026.'],
    ],
    back: '← Retour au Tournoi de bouffe',
  },
};
