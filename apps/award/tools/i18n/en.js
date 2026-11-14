/* Award Certificate Maker — English (site root /, default + x-default)
 * Design ids, limits and the canvas drawing live in award-core.js / award.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {n} {max} {title} — keep them as-is when translating. card.* is drawn onto the certificate image.
 * editor.titleExamples / editor.reasons = ideas written for this language (not translations). reasons ≤ 140 characters.
 * fonts.serif = the certificate font drawn on the canvas (must support this language's script).
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Award Certificate Maker: Funny Awards Free",
    description: "Award certificate maker: write a funny or heartfelt award, pick a frame and seal, then save it as an A4 image or send a link that opens like a ceremony.",
    ogTitle: "Award Certificate Maker 🏆",
    ogDescription: "Make a funny or heartfelt award certificate in a minute and hand it out with a link."
  },
  siteName: "Award Certificate Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🏆 Year-end awards season",
    h1Kicker: "Award certificate maker",
    h1Html: "Someone out there<br>deserves <em>an award</em>",
    hook: "Name the award, say why they earned it and hand it over with a link that opens like a real ceremony.",
    start: "Make an award →"
  },
  editor: {
    title: "Design the certificate",
    themesAria: "Certificate designs",
    themes: {
      gold: "Classic gold",
      pastel: "Cute pastel",
      minimal: "Minimal",
      ribbon: "Retro ribbon"
    },
    previewAria: "Preview of your certificate",
    examplesAria: "Award title ideas",
    sealLabel: "Seal",
    seals: {
      none: "None",
      red: "Red seal",
      gold: "Gold medal"
    },
    fields: {
      title: {
        label: "Award title",
        placeholder: "e.g. Office MVP of the Year"
      },
      to: {
        label: "Awarded to",
        placeholder: "e.g. Jamie"
      },
      reason: {
        label: "Why they won",
        placeholder: "Write what they did to earn it…"
      },
      date: {
        label: "Date"
      },
      issuer: {
        label: "Presented by",
        placeholder: "e.g. The Snack Committee"
      }
    },
    titleExamples: [
      "Office MVP of the Year",
      "Best Snack Sharer",
      "World’s Okayest Cook",
      "Kindest Human Award"
    ],
    dice: "🎲 Random",
    counter: "{n}/{max}",
    reasons: [
      "For answering every “quick question” with patience, snacks and a smile, even on Mondays.",
      "For keeping the group chat alive with memes of truly outstanding quality all year long.",
      "For always knowing where the charger, the scissors and the good pens are hiding.",
      "For turning every ordinary Tuesday into something worth telling stories about.",
      "For laughing at our jokes, even the ones we told three times.",
      "For being the first to say “I’ll help” and the last to leave the cleanup.",
      "For heroic levels of calm in the face of printer jams, delays and burnt toast.",
      "For sharing the last cookie when nobody would have known.",
      "For remembering birthdays, coffee orders and the little things that matter.",
      "For showing up, every single time, exactly when it counted.",
      "For bravely trying the new recipe so the rest of us didn’t have to.",
      "For being proof that kindness is a superpower. We are lucky to know you."
    ],
    done: "Finish the award"
  },
  card: {
    heading: "Certificate of Award",
    defaultTitle: "Award of Excellence",
    presented: "This certificate is proudly presented to",
    name: "{name}",
    closing: "In recognition of the above, this award is presented with great thanks.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Award ceremony",
    forName: "An award for {name}",
    forNone: "An award just for you",
    hint: "Tap the scroll to unroll it",
    open: "Unroll the award"
  },
  result: {
    eyebrowMine: "Your award is ready!",
    eyebrowFriend: "Congratulations, {name}!",
    eyebrowFriendNoName: "Congratulations!",
    imageAlt: "Award certificate: {title}",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    edit: "Edit",
    retry: "Make another award",
    retryFriend: "Make my own award",
    shareTitle: "Award Certificate Maker",
    shareText: "There’s an award for {name} 🏆 Open the ceremony here:",
    shareTextNoName: "Someone made you an award 🏆 Open the ceremony here:",
    fileName: "award-certificate"
  },
  og: {
    brand: "🏆 Award Certificate Maker",
    defaultKicker: "Award certificate maker",
    defaultTitle: "Someone deserves an award",
    defaultDesc: "4 designs · seal · A4 image or ceremony link",
    sampleTitle: "Best Snack Sharer"
  },
  faq: [
    {
      q: "How do I make a certificate?",
      a: "Pick one of four designs, type the award title, the winner’s name and the reason, then set the date, who it is from and a seal. The preview updates as you type. Tap “Finish the award” when it looks right."
    },
    {
      q: "What size is the saved image?",
      a: "“Save image” makes a 1240×1754 PNG, the same shape as an A4 sheet, so it prints neatly on A4 or Letter paper and still looks sharp in a chat. On a phone it opens the share sheet; on a computer it downloads."
    },
    {
      q: "What does the winner see when they open my link?",
      a: "A short award ceremony: a rolled scroll appears, they tap it, and the certificate unrolls with their name on it. The heading and date appear in their own language, and they can make an award of their own."
    },
    {
      q: "Where is the text I type kept?",
      a: "Only inside the share link and in your own browser. Nothing you type is sent to our server, so anyone with the link can read the certificate. Share it only with the people you mean."
    }
  ],
  privacy: {
    title: "Privacy Policy | Award Certificate Maker",
    description: "Privacy Policy for the Award Certificate Maker: how your certificate text is handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The Award Certificate Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. The award title, names, reason and date you type are never sent to a server. They stay in your browser (a draft is kept in local storage while you edit) and in the URL when you share. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished certificates, star ratings). None of this identifies you personally, and none of it includes what you wrote."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your certificate, encoded in the URL, so anyone who has the link can see it. Saved images are created inside your browser. Please avoid putting addresses, phone numbers or other personal details on the certificate."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 15, 2026."
      ]
    ],
    back: "← Back to the Award Certificate Maker"
  }
};
