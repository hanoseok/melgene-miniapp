/* Snowman Maker — English (site root /, default + x-default)
 * Body shapes, parts, limits and the canvas drawing live in snowman-core.js / snowman.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no tools, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {n} {max} — keep them as-is when translating. card.named is drawn onto the snowman image.
 * editor.namePresets = short snowman names written for this language (max 20 characters each), not translations.
 * Option names (bodies, eyes, …) sit on small chips: keep them short (about 12 Latin characters).
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
    title: "Build a Snowman Online – Snowman Maker",
    description: "Build a snowman online: stack the snowballs, pick eyes, a carrot nose, a hat, a scarf and arms, give it a name, then save the picture or share a link.",
    ogTitle: "Build a Snowman ⛄",
    ogDescription: "Roll, stack and dress your own snowman in a minute, then send it to a friend."
  },
  siteName: "Snowman Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "⛄ Winter special",
    h1Kicker: "Build a snowman online",
    h1Html: "Roll, stack and<br><em>dress your snowman</em>",
    hook: "No mittens needed. Pick every piece, watch the snow fall, and send your snowman to someone who needs a smile.",
    start: "Start building →"
  },
  editor: {
    title: "Build your snowman",
    canvasAria: "Preview of your snowman in a winter scene",
    stepOf: "Step {n} of {max}",
    steps: {
      body: "Body",
      face: "Face",
      nose: "Nose",
      hat: "Hat",
      scarf: "Scarf",
      arms: "Arms",
      extras: "Extras",
      scene: "Scene",
      name: "Name"
    },
    labels: {
      body: "Snowballs",
      eyes: "Eyes",
      mouth: "Mouth",
      nose: "Nose",
      hat: "Hat",
      scarf: "Scarf colour",
      pattern: "Pattern",
      arms: "Arms",
      extras: "Extras (pick any)",
      scene: "Background",
      name: "Name it (optional)"
    },
    bodies: {
      classic: "Classic",
      duo: "Two balls",
      chubby: "Chubby",
      slim: "Slim"
    },
    eyes: {
      coal: "Coal",
      buttons: "Buttons",
      sparkly: "Sparkly",
      sleepy: "Sleepy"
    },
    mouths: {
      pebbles: "Pebbles",
      smile: "Smile",
      grin: "Big grin",
      oh: "Oh!"
    },
    noses: {
      carrot: "Carrot",
      long: "Long carrot",
      berry: "Berry",
      pinecone: "Pine cone"
    },
    hats: {
      top: "Top hat",
      beanie: "Beanie",
      santa: "Santa hat",
      bucket: "Bucket",
      earmuffs: "Earmuffs",
      none: "No hat"
    },
    scarves: {
      red: "Red",
      green: "Green",
      blue: "Blue",
      yellow: "Yellow",
      purple: "Purple",
      none: "No scarf"
    },
    patterns: {
      solid: "Plain",
      stripes: "Stripes",
      dots: "Dots"
    },
    arms: {
      twigs: "Twigs",
      mittens: "Mittens",
      wave: "Waving",
      none: "No arms"
    },
    extras: {
      broom: "Broom",
      buttons: "Buttons",
      bird: "Little bird",
      flakes: "Sparkles"
    },
    scenes: {
      night: "Snowy night",
      sunny: "Sunny field",
      village: "Village lights"
    },
    random: "Surprise me",
    back: "← Back",
    next: "Next →",
    done: "Finish my snowman",
    namePlaceholder: "e.g. Snowball",
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    namePresets: [
      "Snowball",
      "Mr. Chilly",
      "Flurry",
      "Sir Shivers",
      "Button"
    ]
  },
  card: {
    named: "Meet {name}!"
  },
  result: {
    eyebrowMine: "Your snowman is ready!",
    eyebrowFriend: "Someone built {name} just for you",
    eyebrowFriendNoName: "Someone built a snowman just for you",
    revealHint: "It’s still covered in fresh snow…",
    reveal: "❄️ Brush off the snow",
    imageAlt: "A snowman in a winter scene",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    edit: "Keep building",
    retry: "Build a new snowman",
    retryFriend: "Build my own snowman",
    shareTitle: "Snowman Maker",
    shareText: "Meet {name}, the snowman I built ⛄ Take a look:",
    shareTextNoName: "Look at the snowman I built ⛄",
    fileName: "snowman"
  },
  og: {
    brand: "⛄ Snowman Maker",
    defaultKicker: "Build a snowman online",
    defaultTitle: "Roll, stack and dress your snowman",
    defaultDesc: "Hats · scarves · falling snow · save or share"
  },
  faq: [
    {
      q: "How do I build my snowman?",
      a: "Go through the steps under the picture: snowballs, face, nose, hat, scarf, arms, extras and background. Tap an option to try it; the snowman changes right away. You can jump between steps at any time."
    },
    {
      q: "What does “Surprise me” do?",
      a: "It picks a random combination of every part for you. Keep tapping until you like one, then change any single piece by hand."
    },
    {
      q: "How do I save or send my snowman?",
      a: "Tap “Finish my snowman”. “Save image” makes a 1080×1350 PNG, and the share buttons send a link. Whoever opens the link brushes off the snow to meet your snowman and can build one of their own."
    },
    {
      q: "Where is my snowman kept?",
      a: "Your choices and the name live only in the link and, while you build, in your own browser. They are never sent to our server, so anyone with the link can see them."
    }
  ],
  privacy: {
    title: "Privacy Policy | Snowman Maker",
    description: "Privacy Policy for Snowman Maker: how your snowman and its name are handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "Snowman Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. Your snowman and the name you type are never sent to a server. They stay in your browser (a draft is kept in local storage while you build) and in the URL when you share. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished snowmen, star ratings). None of this identifies you personally, and none of it includes your snowman’s name."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your snowman, encoded in the URL, so anyone who has the link can see it. Saved images are created inside your browser. Please avoid putting addresses, phone numbers or other personal details in the name."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 9, 2026."
      ]
    ],
    back: "← Back to Snowman Maker"
  }
};
