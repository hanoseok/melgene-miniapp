/* Snowflake Maker — English (site root /, default + x-default)
 * Shape, arms, palettes and the canvas drawing live in snowflake-core.js / snowflake.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no tools, no FAQ). FAQ appears only in the shared end screen.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Snowflake Maker: Make a Symmetrical Snowflake Online",
    description: "Make your own symmetrical snowflake online. Adjust the arms, detail and size, pick a shape and colour, then save a 1080 × 1080 PNG or share a link.",
    ogTitle: "Make a Snowflake ❄️",
    ogDescription: "Grow your own six-sided snowflake in a few taps, then save it or send it to a friend."
  },
  siteName: "Snowflake Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "❄️ Winter special",
    h1Kicker: "Snowflake maker online",
    h1Html: "Grow a snowflake<br><em>all your own</em>",
    hook: "Tap a few times and watch a perfectly symmetrical snowflake take shape. Save it as a picture or send the link to a friend.",
    start: "Start making →"
  },
  editor: {
    title: "Make your snowflake",
    canvasAria: "Preview of your snowflake",
    labels: {
      arms: "Arms per side",
      complexity: "Detail",
      size: "Arm length"
    },
    levels: {
      complexity: ["Simple", "Medium", "Detailed"],
      size: ["Short", "Medium", "Long"]
    },
    buttons: {
      newFlake: "New snowflake",
      shape: "Change shape",
      color: "Change colour",
      save: "Save PNG",
      share: "Share",
      done: "I'm done, show my snowflake"
    },
    shapes: {
      needle: "Needles",
      plate: "Plates",
      spike: "Spikes",
      feather: "Feathers"
    },
    palettes: ["Ice blue", "Frost", "Lilac", "Midnight gold", "Mint"],
    status: {
      copied: "Link copied!",
      copyFail: "Couldn't copy the link. Try Save PNG instead.",
      shared: "Shared!",
      saving: "Making your picture…",
      saved: "Picture saved!",
      saveFail: "Couldn't make the picture. Try a screenshot instead."
    }
  },
  result: {
    eyebrowMine: "Your snowflake is ready!",
    eyebrowFriend: "A friend made this snowflake for you",
    save: "Save PNG",
    edit: "Keep making",
    retry: "Make a new snowflake",
    retryFriend: "Make my own snowflake",
    shareTitle: "Snowflake Maker",
    shareText: "Look at the snowflake I made ❄️ Open the link to see it:",
    fileName: "snowflake"
  },
  og: {
    brand: "❄️ Snowflake Maker",
    defaultKicker: "Snowflake maker online",
    defaultTitle: "Grow a snowflake all your own",
    defaultDesc: "Six arms · shapes · colours · save or share"
  },
  faq: [
    {
      q: "How do I make a snowflake?",
      a: "Tap New snowflake for a fresh design, then use the three sliders for arms, detail and arm length. Each snowflake is one arm copied six times and mirrored, so it always looks symmetrical."
    },
    {
      q: "What do the shape and colour buttons do?",
      a: "Change shape switches how the arms are drawn, between needles, plates, spikes and feathers, and keeps the same design. Change colour switches the background and the ink. Try both on the same design."
    },
    {
      q: "How do I save or share my snowflake?",
      a: "Tap Save PNG to download a 1080 × 1080 picture. Share sends a link that holds your settings, so anyone who opens it sees the same snowflake."
    },
    {
      q: "Is my snowflake stored anywhere?",
      a: "No. The design lives in the picture and in the link. Nothing you make is uploaded to our server when you save or share."
    }
  ],
  privacy: {
    title: "Privacy Policy | Snowflake Maker",
    description: "Privacy Policy for Snowflake Maker: how your snowflake is handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "Snowflake Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. Your snowflake settings are never sent to a server. They stay in your browser and in the link when you share it. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished snowflakes). None of this identifies you personally."
      ],
      [
        "5. Shared links and images",
        "A link created with “Share” contains your snowflake settings inside the URL, so anyone who has the link can see the same snowflake. Saved pictures are created inside your browser and are not uploaded to us."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 11, 2026."
      ]
    ],
    back: "← Back to Snowflake Maker"
  }
};
