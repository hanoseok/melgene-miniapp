/* Decorate a Christmas Tree — English (site root /, default + x-default)
 * Tree shapes, ornaments, limits and the canvas drawing live in xmastree-core.js / xmastree.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no tools, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {n} {max} — keep them as-is when translating. card.by is drawn onto the tree image.
 * editor.presets = short tree messages written for this language (max 50 characters each), not translations.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Decorate a Christmas Tree Online",
    description: "Decorate a Christmas tree online: pick a tree, hang baubles, stars and candy canes, switch on twinkling lights and snow, then save the picture or share a link.",
    ogTitle: "Decorate a Christmas Tree 🎄",
    ogDescription: "Hang ornaments, light it up and share your own Christmas tree in a minute."
  },
  siteName: "Decorate a Christmas Tree",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎄 Holiday special",
    h1Kicker: "Decorate a Christmas tree",
    h1Html: "Trim your own<br><em>twinkling tree</em>",
    hook: "Hang baubles and candy canes, switch on the lights, let it snow, and send your tree to someone you love.",
    start: "Start decorating →"
  },
  editor: {
    title: "Decorate your tree",
    canvasAria: "Your Christmas tree. Tap to hang the selected ornament, drag an ornament to move it.",
    hint: "Tap the tree to hang an ornament · drag to move it",
    paletteLabel: "Ornaments",
    kinds: {
      red: "Red bauble",
      gold: "Gold bauble",
      blue: "Blue bauble",
      purple: "Purple bauble",
      silver: "Silver bauble",
      star: "Star",
      bell: "Bell",
      cane: "Candy cane",
      gift: "Gift",
      bow: "Bow",
      sock: "Stocking",
      flake: "Snowflake",
      cookie: "Cookie",
      erase: "Eraser"
    },
    undo: "Undo",
    clear: "Clear",
    auto: "Surprise me",
    count: "{n}/{max} ornaments",
    full: "Your tree is full! Move or erase an ornament first.",
    styleLabel: "Tree",
    styles: {
      classic: "Classic",
      snowy: "Snowy",
      nordic: "Nordic",
      pink: "Pink"
    },
    bgLabel: "Background",
    bgs: {
      night: "Starry night",
      cozy: "Cozy room",
      snowfield: "Snowy field",
      red: "Festive red"
    },
    topperLabel: "Tree topper",
    toppers: {
      none: "None",
      star: "Star",
      angel: "Angel",
      bow: "Bow"
    },
    extrasLabel: "Extras",
    snow: "Snow",
    lights: "Lights",
    fields: {
      name: {
        label: "Your name",
        placeholder: "e.g. Sam"
      },
      message: {
        label: "Short message",
        placeholder: "e.g. Merry Christmas!"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "Merry Christmas from our house to yours!",
      "Wishing you a cozy, sparkly Christmas!",
      "Peace, love and lots of cookies 🍪",
      "Home is where the tree lights glow.",
      "Ho ho ho! Have a jolly holiday!"
    ],
    done: "Finish my tree"
  },
  card: {
    by: "Decorated by {name}"
  },
  result: {
    eyebrowMine: "Your tree is ready!",
    eyebrowFriend: "{name} decorated this tree for you",
    eyebrowFriendNoName: "Someone decorated this tree for you",
    imageAlt: "Decorated Christmas tree with {n} ornaments",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    edit: "Keep decorating",
    retry: "Decorate a new tree",
    retryFriend: "Decorate my own tree",
    shareTitle: "Decorate a Christmas Tree",
    shareText: "{name} decorated a Christmas tree 🎄 Take a look:",
    shareTextNoName: "Look at the Christmas tree I decorated 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Decorate a Christmas Tree",
    defaultKicker: "Decorate a Christmas tree",
    defaultTitle: "Trim your own twinkling tree",
    defaultDesc: "Ornaments · lights · snow · save or share"
  },
  faq: [
    {
      q: "How do I hang an ornament?",
      a: "Pick an ornament in the row under the tree, then tap anywhere on the tree. To move one, press it and drag. Choose the eraser to remove a single ornament, or use Undo to step back."
    },
    {
      q: "Can I change the tree after adding ornaments?",
      a: "Yes. You can switch the tree shape, background and topper, and turn snow or lights on and off at any time. Your ornaments stay where you put them."
    },
    {
      q: "How do I save or send my tree?",
      a: "Tap “Finish my tree”. “Save image” makes a 1080×1350 PNG, and the share buttons send a link. Whoever opens the link sees your tree with its twinkling lights and can decorate one of their own."
    },
    {
      q: "Where is my tree kept?",
      a: "Your ornaments, name and message live only in the link and, while you decorate, in your own browser. They are never sent to our server, so anyone with the link can see them."
    }
  ],
  privacy: {
    title: "Privacy Policy | Decorate a Christmas Tree",
    description: "Privacy Policy for Decorate a Christmas Tree: how your tree, name and message are handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "Decorate a Christmas Tree (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. Your tree, the name and the message you type are never sent to a server. They stay in your browser (a draft is kept in local storage while you decorate) and in the URL when you share. Some information may be collected automatically while you use the Service, as described below."
      ],
      [
        "2. Cookies and similar technologies",
        "The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work as expected if you do."
      ],
      [
        "3. Advertising (Google AdSense)",
        "The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."
      ],
      [
        "4. Statistics",
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished trees, star ratings). None of this identifies you personally, and none of it includes your name or message."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your tree, encoded in the URL, so anyone who has the link can see it. Saved images are created inside your browser. Please avoid putting addresses, phone numbers or other personal details in your message."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 5, 2026."
      ]
    ],
    back: "← Back to Decorate a Christmas Tree"
  }
};
