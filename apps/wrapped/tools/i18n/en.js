/* Year in Review Card — English (site root /, default + x-default)
 * Themes, limits, year logic and the canvas drawing live in wrapped-core.js / wrapped.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Never write a year as digits: use {year} (the year being reviewed) and {next} (the year after) — the browser fills them in.
 * Placeholders: {name} {year} {next} {word} — keep them as-is when translating. card.* is drawn onto the card image.
 * editor.ideas = 5 example "word of the year" ideas written for this language (max 16 characters each), not translations.
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
    title: "Year in Review Card Maker: Your Year in One Card",
    description: "Year in review card maker: add your word of the year, best moment, song, food, place and next year’s goal, pick a theme and save or share your own wrapped card.",
    ogTitle: "Year in Review Card Maker 🎁",
    ogDescription: "Wrap up your year in one card: your word, your song, your best moment and what comes next."
  },
  siteName: "Year in Review Card",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎁 Year-end special",
    h1Kicker: "Year in review card maker",
    h1Html: "Wrap up<br><em>your year</em>",
    hook: "One word, one song, one moment you’ll never forget. Fill in a few lines and get a card that sums up your year.",
    start: "Make my card →"
  },
  editor: {
    title: "Your year, in a few lines",
    themesAria: "Card themes",
    themes: {
      aurora: "Aurora",
      sunset: "Sunset",
      mint: "Mint",
      midnight: "Midnight",
      paper: "Paper",
      neon: "Neon"
    },
    previewAria: "Preview of your card",
    fields: {
      nm: { label: "Your name (optional)", placeholder: "e.g. Sam" },
      w: { label: "Your word of the year", placeholder: "One word for your year" },
      mo: { label: "Best moment", placeholder: "e.g. Seeing the sea with my sister" },
      so: { label: "Song of the year", placeholder: "The song you played on repeat" },
      fo: { label: "Food of the year", placeholder: "e.g. Midnight ramen" },
      pl: { label: "Place of the year", placeholder: "e.g. The little café by work" },
      th: { label: "Someone to thank", placeholder: "e.g. Mom, my team, Alex" },
      go: { label: "Goal for next year", placeholder: "e.g. Run a 10K" }
    },
    ideasAria: "Word ideas",
    ideas: ["Growth", "Brave", "Rest", "Change", "Joy"],
    needWord: "Add your word of the year first — the rest is optional.",
    done: "Finish my card"
  },
  card: {
    kicker: "YEAR IN REVIEW",
    titleMine: "My {year}",
    titleName: "{name}’s {year}",
    word: "My word of the year",
    rows: {
      mo: "Best moment",
      so: "Song of the year",
      fo: "Food of the year",
      pl: "Place of the year",
      th: "Thank you to",
      go: "Goal for {next}"
    }
  },
  result: {
    eyebrowMine: "Your {year} is wrapped!",
    eyebrowFriend: "{name}’s {year} in review",
    eyebrowFriendNoName: "A friend’s {year} in review",
    imageAlt: "Year in review card. Word of the year: {word}",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    copyText: "Copy text",
    copied: "Text copied!",
    copyFail: "Couldn’t copy the text. Try again.",
    edit: "Edit",
    retry: "Make another card",
    retryFriend: "Make mine",
    shareTitle: "Year in Review Card",
    shareText: "{name}’s {year} in review 🎁 Take a look:",
    shareTextNoName: "My {year} in review 🎁 Take a look:",
    fileName: "year-in-review"
  },
  og: {
    brand: "🎁 Year in Review Card",
    defaultKicker: "Year in review card maker",
    defaultTitle: "Wrap up your year in one card",
    defaultDesc: "6 themes · word, song, moment · save or share",
    cardKicker: "YEAR IN REVIEW",
    cardWord: "Growth",
    cardRows: ["Best moment", "Song of the year", "Goal"]
  },
  faq: [
    {
      q: "What do I need to fill in?",
      a: "Only your word of the year. Your name, best moment, song, food, place, the person you want to thank and your goal are all optional — empty lines simply don’t appear on the card."
    },
    {
      q: "Which year does the card show?",
      a: "The year you are wrapping up, taken from your device’s date. In January the card still shows the year that just ended, so you can make it a little late."
    },
    {
      q: "Can I save the card as a picture?",
      a: "Yes. “Save image” makes a 1080×1350 PNG that fits stories and chats. On a phone it opens the share sheet; on a computer it downloads."
    },
    {
      q: "Where is what I write kept?",
      a: "Only in your own browser while you edit, and inside the link if you share it. Nothing you type is sent to our server, so anyone with the link can read the card — share it with people you trust."
    }
  ],
  privacy: {
    title: "Privacy Policy | Year in Review Card",
    description: "Privacy Policy for the Year in Review Card: how your card text is handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The Year in Review Card (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. The words you type on your card are never sent to a server. They stay in your browser (a draft is kept in local storage while you edit) and in the URL when you share. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished cards, star ratings). None of this identifies you personally, and none of it includes what you wrote."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your card, encoded in the URL, so anyone who has the link can see it. Saved images are created inside your browser. Please avoid putting addresses, phone numbers or other personal details on your card."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 3, 2026."
      ]
    ],
    back: "← Back to the Year in Review Card"
  }
};
