/* Halloween Party Invitation Maker — English (site root /, default + x-default)
 * Theme ids, limits and the canvas drawing live in invite-core.js / invite.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {title} — keep them as-is when translating. card.* is drawn onto the invitation image.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Halloween Party Invitation Maker",
    description: "Halloween party invitation maker: add the party name, date, time and place, pick a ghost, pumpkin, bat or witch theme, then save the image or share a link. Free.",
    ogTitle: "Halloween Party Invitation Maker 🎃",
    ogDescription: "Make a spooky party invitation in a minute and send it to your guests."
  },
  siteName: "Halloween Party Invitation Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎃 Halloween special",
    h1Kicker: "Halloween party invitation maker",
    h1Html: "Invite them to<br><em>your spooky party</em>",
    hook: "Name the party, pick a spooky theme and send guests an invitation they will actually want to open.",
    start: "Make my invitation →"
  },
  editor: {
    title: "Design your invitation",
    themesAria: "Invitation themes",
    themes: {
      ghost: "Ghost",
      pumpkin: "Pumpkin",
      bat: "Bat",
      witch: "Witch",
      spider: "Spider"
    },
    previewAria: "Preview of your invitation",
    fields: {
      title: {
        label: "Party name",
        placeholder: "e.g. Haunted House Party"
      },
      date: {
        label: "Date"
      },
      time: {
        label: "Time"
      },
      place: {
        label: "Place",
        placeholder: "e.g. My place, 3rd floor"
      },
      note: {
        label: "A word for your guests",
        placeholder: "e.g. Costumes encouraged!"
      }
    },
    done: "Create invitation"
  },
  card: {
    invited: "You’re invited!",
    defaultTitle: "Halloween Party"
  },
  result: {
    eyebrowMine: "Your invitation is ready!",
    eyebrowFriend: "You’ve got an invitation",
    imageAlt: "Invitation: {title}",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    copyText: "Copy text",
    copied: "Text copied!",
    copyFail: "Couldn’t copy the text. Try again.",
    edit: "Edit",
    retry: "Make another invitation",
    retryFriend: "Make my own invitation",
    shareTitle: "Halloween Party Invitation Maker",
    shareText: "You’re invited to “{title}”! 🎃 Open the invitation:",
    shareTextNoTitle: "You’re invited to my Halloween party! 🎃 Open the invitation:",
    fileName: "party-invitation"
  },
  og: {
    brand: "🎃 Halloween Invitation",
    defaultKicker: "Halloween party",
    defaultTitle: "Make your party invitation",
    defaultDesc: "Pick a spooky theme · save the image or share a link",
    cardTitle: "Halloween Party"
  },
  faq: [
    {
      q: "How do I make my invitation?",
      a: "Pick a theme, type the party name, date, time, place and a word for your guests, and tap “Create invitation”. Every field is optional, and the preview updates as you type."
    },
    {
      q: "Can I save the invitation as a picture?",
      a: "Yes. “Save image” makes a PNG you can post or send in any chat. On a phone it opens the share sheet; on a computer it downloads."
    },
    {
      q: "How does the share link work?",
      a: "The whole invitation is packed into the link itself, so whoever opens it sees exactly the same card. Nothing is stored on our servers, and opening a link does not change your own invitation."
    },
    {
      q: "Can I send just the details as text?",
      a: "Yes. “Copy text” copies the party name, date, time, place, your note and the link, ready to paste into any message."
    }
  ],
  privacy: {
    title: "Privacy Policy | Halloween Party Invitation Maker",
    description: "Privacy Policy for the Halloween Party Invitation Maker: how your invitation details are handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The Halloween Party Invitation Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. The party name, date, time, place and note you type are never sent to a server. They stay in your browser (and in the URL when you share). Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished invitations, star ratings). None of this identifies you personally."
      ],
      [
        "5. Shared links and images",
        "Links created with “Share” contain your invitation details, encoded in the URL. Saved images are created inside your browser. Please avoid typing an exact home address or other personal information as the place."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of October 3, 2026."
      ]
    ],
    back: "← Back to the Invitation Maker"
  }
};
