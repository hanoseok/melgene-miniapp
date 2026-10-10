module.exports = {
  metaTitle: 'Guide du QR code : créer, imprimer et scanner',
  description: 'Comment fonctionne un QR code, comment en créer un pour un lien ou le Wi-Fi, conseils d’impression (taille, contraste, correction d’erreur), son histoire et comment scanner en sécurité.',
  h1: 'Créer un QR code qui se scanne du premier coup',
  updated: '2026-10-11',
  intro: 'Les QR codes sont partout : sur les tables des restaurants, les billets de concert, les colis et les affiches. On dirait du bruit aléatoire, mais chaque petit carré a un rôle. Ce guide explique ce qu’un QR code contient vraiment, comment en créer un pour un lien, un message ou ton réseau Wi-Fi, comment l’imprimer pour qu’il se lise du premier coup, d’où vient l’idée et comment rester prudent quand tu scannes des codes faits par d’autres.',
  sections: [
    {
      h: 'Qu’est-ce qu’un QR code ?',
      p: [
        'QR veut dire Quick Response, « réponse rapide ». Un QR code est un code-barres en deux dimensions : au lieu d’une seule rangée de traits, il range l’information dans une grille carrée de cases sombres et claires appelées modules. Les trois grands carrés dans les coins sont des motifs de repérage. Ils indiquent à l’appareil photo où se trouve le code, comment il est tourné et quelle est sa taille, c’est pourquoi on peut le scanner à l’envers ou de biais.',
        'Le reste de la grille contient tes données et des données de correction d’erreur calculées avec les codes de Reed-Solomon, les mêmes mathématiques que sur les CD ou dans les sondes spatiales. Grâce à cette redondance, un lecteur peut reconstituer le contenu même si une partie du code est sale, déchirée ou cachée. La plus petite version, la 1, mesure 21 × 21 modules ; la plus grande, la 40, fait 177 × 177 et peut contenir près de trois mille octets. Plus le contenu est long, plus la grille est grande et serrée.'
      ]
    },
    {
      h: 'Créer un QR code ici',
      p: [
        'Le générateur fonctionne entièrement dans ton navigateur. Le code est calculé sur ton propre appareil au moment où tu tapes : rien n’est envoyé, enregistré ni conservé, et il n’y a aucun compte à créer.'
      ],
      list: [
        'Choisis ce que le code doit contenir : un lien, un texte, un accès Wi-Fi, un e-mail ou un numéro de téléphone.',
        'Remplis les champs. Si tu tapes une adresse sans https://, elle est ajoutée automatiquement pour que le téléphone l’ouvre comme un lien.',
        'Regarde l’aperçu en direct. Ouvre les options pour changer les couleurs, la correction d’erreur, la taille de l’image ou la zone de silence.',
        'Télécharge un PNG pour l’écran et les documents, ou un SVG pour l’impression. Sur les navigateurs compatibles, tu peux aussi copier l’image directement.',
        'Scanne le résultat avec ton téléphone avant de le partager ou de l’imprimer.'
      ]
    },
    {
      h: 'Le QR code Wi-Fi pour tes invités',
      p: [
        'Un QR code Wi-Fi évite à tes invités de recopier la longue clé inscrite sous la box. Il enregistre le nom du réseau, le mot de passe et le type de sécurité dans un format texte standard qui commence par WIFI:. Les appareils photo intégrés de l’iPhone et d’Android reconnaissent ce format et proposent de se connecter d’un seul geste.',
        'Choisis le même réglage de sécurité que ta box. Presque toutes les box récentes utilisent le WPA2 ou le WPA3, qui se rangent tous deux sous WPA. Ne choisis « Sans mot de passe » que pour un réseau ouvert, et coche « Réseau masqué » si ta box ne diffuse pas son nom. Les caractères spéciaux comme le point-virgule, la virgule, les deux-points ou les guillemets sont échappés automatiquement. Si tu changes de mot de passe, crée un nouveau code : l’ancien ne marchera plus.'
      ]
    },
    {
      h: 'Conseils d’impression : taille, contraste et correction',
      p: [
        'La plupart des échecs de lecture viennent de l’impression, pas du code lui-même. Quelques règles simples changent tout.'
      ],
      list: [
        'Taille : en règle générale, le code doit mesurer au moins un dixième de la distance de lecture. Un code scanné à 30 cm doit faire environ 3 cm de large, une affiche lue à 3 m environ 30 cm.',
        'Contraste : un code foncé sur fond clair. Le noir sur blanc reste le plus sûr. Les couleurs pâles, les dégradés et les codes clairs sur fond sombre perturbent beaucoup de lecteurs, d’où l’avertissement du générateur en cas de faible contraste.',
        'Zone de silence : garde une bordure vide autour du code. La norme demande quatre modules, et un texte ou une image collé au bord est une cause fréquente d’échec.',
        'Correction d’erreur : le niveau L récupère environ 7 % de dégâts, M environ 15 %, Q environ 25 % et H environ 30 %. M pour l’usage courant, Q ou H pour les autocollants, les panneaux extérieurs ou un petit logo posé dessus, L pour faire tenir un long texte dans un petit code à l’écran.',
        'Longueur du contenu : à taille d’impression égale, un contenu court donne des modules plus gros. Préfère un lien court à une adresse interminable.'
      ]
    },
    {
      h: 'Petite histoire du QR code',
      p: [
        'Le QR code a été inventé en 1994 par Masahiro Hara et son équipe chez Denso Wave, alors une division de l’équipementier automobile japonais Denso, membre du groupe Toyota. Les usines suivaient les pièces avec des codes-barres classiques, et les ouvriers devaient scanner plusieurs étiquettes par caisse, car chaque code-barres ne contenait qu’une vingtaine de caractères. Hara voulait un code capable de stocker bien plus de données et lisible très vite, dans n’importe quel sens.',
        'Les carrés de repérage ont été dessinés avec une proportion de noir et de blanc qui n’apparaît presque jamais dans un texte ou une image imprimés, si bien qu’un lecteur les trouve instantanément. Denso Wave détenait le brevet mais a choisi de ne pas l’exercer, et le format est devenu une norme ISO internationale en 2000. Quand les appareils photo des smartphones ont su lire les QR codes nativement, ceux-ci ont envahi les paiements, les cartes d’embarquement et les menus. Le nom QR Code reste une marque déposée de Denso Wave.'
      ]
    },
    {
      h: 'Scanner en toute sécurité',
      p: [
        'Un QR code n’est qu’un contenant, et n’importe qui peut en imprimer un. Des escrocs collent parfois de faux codes sur les vrais, sur les horodateurs, les affiches ou les tables de restaurant, pour envoyer les gens vers de fausses pages de paiement ou de connexion. Avant d’ouvrir un lien, lis l’adresse affichée par l’appareil photo et vérifie qu’elle correspond bien au commerce attendu. Méfie-toi des codes qui demandent une carte bancaire, un mot de passe ou l’installation d’une appli, et ne scanne jamais un code reçu dans un message inattendu qui te presse d’agir.',
        'Quand tu crées tes propres codes, c’est la même logique à l’envers : utilise des liens que tu contrôles, teste le code avant d’imprimer et, s’il est affiché dans un lieu public, vérifie de temps en temps que personne ne l’a recouvert d’un autocollant.'
      ]
    }
  ],
  cta: 'Créer un QR code maintenant'
};
