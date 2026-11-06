/* New Year Card Maker 2027 — English (site root /, default + x-default)
 * Design ids, limits and the canvas drawing live in nycard-core.js / nycard.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {greeting} {n} {max} — keep them as-is when translating. card.* is drawn onto the card image.
 * editor.defaultGreeting = which greeting is picked first (happy | formal | luck | year).
 * editor.zodiacOn = whether the Year-of-the-Goat badge starts switched on (East Asian languages: true).
 * editor.presets = message ideas written for this language (max 120 characters each), not translations.
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
    title: "New Year Card Maker 2027: Free E-Card",
    description: "New Year card maker 2027: pick a design and greeting, add names and a short wish, then save the card as an image or send a link that opens like an envelope.",
    ogTitle: "New Year Card Maker 2027 🎆",
    ogDescription: "Make a bright New Year card in a minute and send your first wishes of 2027."
  },
  siteName: "New Year Card Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎆 Hello, 2027",
    h1Kicker: "New Year card maker 2027",
    h1Html: "Start the year<br>with <em>kind words</em>",
    hook: "Pick a design, write a short wish and send a card that opens like a real envelope.",
    start: "Make my card →"
  },
  editor: {
    title: "Design your card",
    themesAria: "Card designs",
    themes: {
      red: "Red & gold",
      washi: "Washi paper",
      goat: "Cute goat",
      minimal: "Minimal",
      snowy: "Snowy night",
      fireworks: "Fireworks"
    },
    previewAria: "Preview of your card",
    greetingsLabel: "Greeting",
    decoLabel: "Extras",
    decos: {
      zodiac: "Goat year",
      year: "2027",
      sparkle: "Sparkle"
    },
    fields: {
      to: {
        label: "To",
        placeholder: "e.g. Aunt May"
      },
      from: {
        label: "From",
        placeholder: "e.g. Sam"
      },
      message: {
        label: "Your message",
        placeholder: "Write a short wish for the year…"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "Wishing you a 2027 full of good health, small adventures and plenty of reasons to laugh.",
      "Thank you for everything last year. Here’s to more coffee, more catch-ups and more of you in 2027!",
      "New year, fresh page. I hope this one brings you calm days and lovely surprises.",
      "May the year ahead be kind to you, and may every plan you make actually happen. Cheers!",
      "Let’s see each other more this year. That’s my only resolution, and I mean it. Happy New Year!"
    ],
    defaultGreeting: "happy",
    zodiacOn: false,
    done: "Finish my card"
  },
  card: {
    greetings: {
      happy: "Happy New Year!",
      formal: "Warmest Wishes for the New Year",
      luck: "Wishing You Joy & Good Luck",
      year: "Cheers to 2027!"
    },
    zodiac: "2027 · Lunar Year of the Goat",
    to: "Dear {name},",
    from: "With love, {name}"
  },
  open: {
    eyebrow: "You’ve got a New Year card",
    fromName: "from {name}",
    fromNone: "from someone who thought of you",
    open: "Open the card"
  },
  result: {
    eyebrowMine: "Your card is ready!",
    eyebrowFriend: "A card from {name}",
    eyebrowFriendNoName: "A card just for you",
    imageAlt: "New Year card: {greeting}",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    copyText: "Copy text",
    copied: "Text copied!",
    copyFail: "Couldn’t copy the text. Try again.",
    edit: "Edit",
    retry: "Make another card",
    retryFriend: "Make my own card",
    shareTitle: "New Year Card Maker",
    shareText: "{name} sent you a New Year card 🎆 Open it here:",
    shareTextNoName: "Someone sent you a New Year card 🎆 Open it here:",
    fileName: "new-year-card-2027"
  },
  og: {
    brand: "🎆 New Year Card Maker",
    defaultKicker: "New Year card maker 2027",
    defaultTitle: "Start the year with kind words",
    defaultDesc: "6 designs · save the image or send a link",
    cardGreeting: "Happy New Year!"
  },
  faq: [
    {
      q: "How do I make my card?",
      a: "Pick a design and a greeting, switch the goat-year badge, the big “2027” or the sparkle on or off, then add who it is for, who it is from and a short message. The preview updates as you type. Tap “Finish my card” when it looks right."
    },
    {
      q: "What is the goat badge?",
      a: "In the East Asian lunar calendar, 2027 is the Year of the Goat (also called the Sheep). Many people in Japan, Korea, China and Vietnam put the year’s animal on their New Year cards. It is just a cute extra, so switch it off if you prefer."
    },
    {
      q: "Can I save the card as a picture?",
      a: "Yes. “Save image” makes a 1080×1350 PNG that fits nicely in chats and stories. On a phone it opens the share sheet; on a computer it downloads."
    },
    {
      q: "What does the person see when they open my link?",
      a: "They see a sealed envelope first, tap to open it and then see your card, with the greeting shown in their own language. They can also make a card of their own."
    },
    {
      q: "Where is my message kept?",
      a: "Only inside the link and, while you are editing, in your own browser. Your message is never sent to our server, so anyone with the link can read it — share it only with the people you mean."
    }
  ],
  privacy: {
    title: "Privacy Policy | New Year Card Maker",
    description: "Privacy Policy for the New Year Card Maker: how your card text is handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The New Year Card Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. The names and message you type are never sent to a server. They stay in your browser (a draft is kept in local storage while you edit) and in the URL when you share. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished cards, star ratings). None of this identifies you personally, and none of it includes your message."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your card, encoded in the URL, so anyone who has the link can see it. Saved images are created inside your browser. Please avoid putting addresses, phone numbers or other personal details in your message."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 7, 2026."
      ]
    ],
    back: "← Back to the New Year Card Maker"
  }
};
