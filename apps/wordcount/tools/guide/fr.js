module.exports = {
  metaTitle: 'Compteur de mots : guide pour compter caractères et octets',
  description: 'Comment un compteur de mots compte caractères avec et sans espaces, mots et octets, pourquoi Word et les sites ne donnent pas le même total, les limites courantes et nos conseils pour écrire pile à la bonne longueur.',
  h1: 'Guide du compteur de mots : ce qui est compté, pourquoi les outils diffèrent et comment tenir une limite',
  updated: '2026-10-15',
  intro: 'Les limites de longueur sont partout : une lettre de motivation en 1 500 caractères espaces comprises sur Parcoursup, un post de 280 caractères, une méta-description coupée vers 155 caractères, un résumé de mémoire limité en mots. Un bon compteur te dit où tu en es pendant que tu écris, pour ne pas couper dans la panique à la dernière minute. Ce guide explique comment utiliser l’outil, comment chaque chiffre est défini, pourquoi les logiciels ne tombent pas toujours d’accord, quelles limites tu vas rencontrer et comment écrire à la bonne longueur.',
  sections: [
    {
      h: 'Comment utiliser le compteur de mots',
      p: [
        'Tape directement dans la zone ou colle un texte venu d’ailleurs. La barre bleu foncé en haut de la zone affiche les quatre chiffres les plus consultés : caractères espaces comprises, caractères sans espaces, mots et octets. Elle reste visible quand tu fais défiler un long brouillon. En dessous, le comptage détaillé ajoute les phrases, les paragraphes, les lignes et une estimation du temps de lecture et de parole.',
        'Si tu écris pour une limite, choisis 500, 1 000 ou 1 500 caractères, ou saisis ta propre valeur. Une barre se remplit au fil du texte, passe à l’orange près de la fin et au rouge quand tu dépasses, en indiquant combien il reste ou combien couper. L’interrupteur « Compter les espaces » choisit si la limite suit le chiffre avec ou sans espaces. À la fin, « Voir le bilan » affiche un récapitulatif à copier.',
      ],
      list: [
        'Colle ou tape ton texte : les chiffres changent à chaque frappe.',
        'Fixe un objectif et décide si les espaces comptent.',
        'Choisis la règle des octets de ton formulaire : UTF-8, UTF-8 + CRLF ou ancien 2 octets.',
        'Nettoie un texte collé avec « Nettoyer les espaces » ou « Joindre les lignes » ; « Annuler » le récupère.',
        'Ton brouillon reste dans ce navigateur, un rechargement ne le perd pas.',
      ],
    },
    {
      h: 'Comment chaque chiffre est défini',
      p: [
        'Les caractères espaces comprises comptent tout ce que l’œil voit comme un caractère, plus les espaces et les retours à la ligne, chaque retour valant 1. Une lettre accentuée comme é, une ligature, un drapeau ou un emoji famille composé de plusieurs codes comptent chacun pour un seul caractère. Les caractères sans espaces retirent de ce total toutes les espaces, tabulations et retours à la ligne.',
        'Les mots sont trouvés par le découpage linguistique intégré au navigateur. Une suite de lettres ou de chiffres forme un mot, l’apostrophe ne coupe pas « aujourd’hui », et les mots à trait d’union comme « peut-être » comptent pour un. Les phrases se terminent par un point, un point d’interrogation ou d’exclamation ; les paragraphes sont séparés par une ligne vide.',
        'Le temps de lecture suppose environ 238 mots par minute en lecture silencieuse, une moyenne d’adulte, et le temps de parole environ 150 mots par minute, un rythme d’exposé détendu.',
      ],
      list: [
        'UTF-8 : 1 octet pour les lettres sans accent, chiffres et espaces, 2 pour é, è, à, ç, 3 pour le chinois, le japonais et le coréen, 4 pour la plupart des emoji.',
        'UTF-8 + CRLF : pareil, mais chaque retour à la ligne vaut 2 octets, comme un fichier texte Windows.',
        'Ancien 2 octets : ASCII 1 octet, tout autre caractère 2, un retour 2 (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Pourquoi Word, Google Docs et les sites ne donnent pas le même total',
      p: [
        'Il n’existe pas de règle officielle unique, donc de petits écarts sont normaux. Word ne compte pas les marques de paragraphe dans ses caractères, alors que beaucoup de formulaires en ligne comptent les retours à la ligne, parfois pour deux. Certains outils comptent chaque unité de code Unicode, ce qui fait d’un emoji deux caractères ou plus. Les traitements de texte ne traitent pas tous de la même façon les mots composés, les nombres ou les adresses e-mail.',
        'Le plus sûr : lire les consignes du formulaire, régler le compteur de la même façon et garder une petite marge de quelques caractères au lieu de viser pile la limite. Avant d’envoyer, colle le texte dans le vrai champ pour vérifier le chiffre affiché par le site.',
      ],
    },
    {
      h: 'Les limites que tu vas rencontrer',
      p: [
        'Les dossiers de candidature fixent souvent une longueur en caractères espaces comprises, comme le projet de formation motivé de Parcoursup limité à 1 500 caractères. Les résumés d’articles et de mémoires sont plutôt limités en mots. Dans les deux cas, vérifie si la consigne parle de caractères ou de mots, avec ou sans espaces.',
        'Les réseaux sociaux ont chacun leur plafond, qui change de temps en temps. Sur X, un post standard accepte 280 caractères, mais les caractères chinois, japonais et coréens comptent double. Les moteurs de recherche affichent en général 150 à 160 caractères d’une méta-description avant de la couper.',
      ],
      list: [
        'X (Twitter) : 280 caractères.',
        'Légende Instagram : 2 200 caractères.',
        'YouTube : titre de 100 caractères, description de 5 000.',
        'SMS : 160 caractères, ou 70 s’il contient des emoji ou des caractères spéciaux.',
        'Méta-description : viser 150 à 160 caractères.',
      ],
    },
    {
      h: 'Conseils pour écrire à la bonne longueur',
      p: [
        'Écris d’abord tout ce que tu as à dire sans regarder le compteur, puis coupe. Raccourcir un long brouillon donne presque toujours un texte plus net que gonfler un texte trop court. Commence par les gains faciles : la phrase qui reformule la question, les tournures comme « il est important de noter que », les adverbes comme « vraiment » ou « très ». Le panneau des mots répétés aide aussi : un mot qui revient cinq fois dans un texte court trahit une répétition.',
      ],
      list: [
        'Vise 90 à 100 % de la limite ; une réponse trop courte paraît bâclée.',
        'Garde quelques caractères de marge pour les formulaires qui comptent autrement les retours.',
        'Après un copier-coller depuis un PDF, utilise « Nettoyer les espaces ».',
        'Pour un discours, lis à voix haute et vérifie le temps de parole.',
        'Enregistre aussi la version finale ailleurs : le brouillon ne vit que dans ce navigateur.',
      ],
    },
  ],
  cta: 'Compter mon texte maintenant',
};
