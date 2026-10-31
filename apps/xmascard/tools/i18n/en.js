/* Christmas Card Maker — English (site root /, default + x-default)
 * Theme ids, limits and the canvas drawing live in xmascard-core.js / xmascard.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {greeting} {n} {max} — keep them as-is when translating. card.* is drawn onto the card image.
 * editor.defaultGreeting = which greeting is picked first (merry | holidays | newyear | seasons).
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
    title: "Christmas Card Maker: Make & Send an E-Card",
    description: "Christmas card maker: pick a festive theme and greeting, add names and a warm message, then save the card as an image or send a link that opens like an envelope.",
    ogTitle: "Christmas Card Maker 🎄",
    ogDescription: "Make a cozy Christmas card in a minute and send it to someone you love."
  },
  siteName: "Christmas Card Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎄 Holiday special",
    h1Kicker: "Christmas card maker",
    h1Html: "Send a little<br><em>Christmas cheer</em>",
    hook: "Pick a cozy design, write a few warm words and send a card that opens like a real envelope.",
    start: "Make my card →"
  },
  editor: {
    title: "Design your card",
    themesAria: "Card designs",
    themes: {
      classic: "Classic",
      snowy: "Snowy night",
      golden: "Golden",
      cute: "Cute",
      minimal: "Minimal",
      forest: "Winter forest"
    },
    previewAria: "Preview of your card",
    greetingsLabel: "Greeting",
    decoLabel: "Decorations",
    decos: {
      snow: "Snow",
      lights: "Lights",
      sparkle: "Sparkle"
    },
    fields: {
      to: {
        label: "To",
        placeholder: "e.g. Grandma"
      },
      from: {
        label: "From",
        placeholder: "e.g. Sam"
      },
      message: {
        label: "Your message",
        placeholder: "Write a few warm words…"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "Wishing you a cozy Christmas full of laughter, good food and the people you love most.",
      "Thank you for being there all year. Merry Christmas, and here’s to an even better one ahead!",
      "May your holidays be calm, bright and full of little moments worth remembering.",
      "Sending warm hugs from afar. Can’t wait to celebrate together again soon!",
      "Eat the cookies, open the gifts, take the nap. You’ve earned it. Happy holidays!"
    ],
    defaultGreeting: "merry",
    done: "Finish my card"
  },
  card: {
    greetings: {
      merry: "Merry Christmas!",
      holidays: "Happy Holidays!",
      newyear: "Happy New Year!",
      seasons: "Season’s Greetings"
    },
    to: "Dear {name},",
    from: "With love, {name}"
  },
  open: {
    eyebrow: "You’ve got a Christmas card",
    fromName: "from {name}",
    fromNone: "from someone who thought of you",
    open: "Open the card"
  },
  result: {
    eyebrowMine: "Your card is ready!",
    eyebrowFriend: "A card from {name}",
    eyebrowFriendNoName: "A card just for you",
    imageAlt: "Christmas card: {greeting}",
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
    shareTitle: "Christmas Card Maker",
    shareText: "{name} sent you a Christmas card 🎄 Open it here:",
    shareTextNoName: "Someone sent you a Christmas card 🎄 Open it here:",
    fileName: "christmas-card"
  },
  og: {
    brand: "🎄 Christmas Card Maker",
    defaultKicker: "Christmas card maker",
    defaultTitle: "Send a little Christmas cheer",
    defaultDesc: "6 cozy designs · save the image or send a link",
    cardGreeting: "Merry Christmas!"
  },
  faq: [
    {
      q: "How do I make my card?",
      a: "Pick a design and a greeting, switch the snow, lights or sparkle on or off, then add who it is for, who it is from and a short message. The preview updates as you type. Tap “Finish my card” when it looks right."
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
    title: "Privacy Policy | Christmas Card Maker",
    description: "Privacy Policy for the Christmas Card Maker: how your card text is handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The Christmas Card Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
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
        "This policy is effective as of November 1, 2026."
      ]
    ],
    back: "← Back to the Christmas Card Maker"
  }
};
