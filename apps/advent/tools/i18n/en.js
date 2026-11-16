/* Advent Calendar Maker — English (site root /, default + x-default)
 * Themes, limits, dates and the share-link format live in advent-core.js; screens and canvas in advent.js. This file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no form, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {n} {day} {date} {title} — keep them as-is when translating.
 * Plural objects ({ one, other } …) follow Intl.PluralRules categories for this language; "other" is required.
 * editor.ideas = warm messages written for this language (not translations), each ≤ 80 characters, ~30 of them.
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
    title: "Advent Calendar Maker: 24 Doors for a Friend",
    description: "Free advent calendar maker: hide a short note behind each of 24 doors and send a link. One door opens every day from December 1. No sign-up needed.",
    ogTitle: "Advent Calendar Maker 🎄",
    ogDescription: "Hide 24 little notes for someone you love. One door opens every day in December."
  },
  siteName: "Advent Calendar Maker",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🎄 Countdown to Christmas",
    h1Kicker: "Advent calendar maker",
    h1Html: "24 little doors,<br>one <em>surprise</em> a day",
    hook: "Hide a note behind every door for someone you love. From December 1 they can open one door each day.",
    start: "Make a calendar →"
  },
  editor: {
    title: "Fill your calendar",
    themesAria: "Calendar designs",
    themes: {
      classic: "Classic",
      snow: "Snowy",
      gold: "Starry gold",
      candy: "Candy"
    },
    fields: {
      to: { label: "For", placeholder: "e.g. Sam" },
      from: { label: "From", placeholder: "e.g. Alex" }
    },
    daysLabel: "Messages behind the doors",
    daysHint: "Up to 80 characters each. Empty doors hide a little treat.",
    dayAria: "Message for door {day}",
    diceAria: "Random idea for door {day}",
    placeholder: "Write a note…",
    counter: "{n}/24 doors filled",
    fillAll: "🎲 Fill empty doors",
    preview: "👀 Preview",
    create: "Create the link",
    needOne: "Write at least one message first."
  },
  ideas: [
    "Good morning! Today is a great day to be you.",
    "Hot chocolate is on me this week. Pick the café.",
    "I’m so glad you’re in my life. That’s it, that’s the note.",
    "Put on your favourite song and dance for one minute. Doctor’s orders.",
    "Remember that time we laughed until we cried? Me too.",
    "Coupon: one movie night, your pick, snacks included.",
    "You’re braver than you think and kinder than you know.",
    "Today’s mission: take a photo of something that makes you smile.",
    "Little reminder: drink some water and stretch.",
    "If today feels long, this note is a tiny hug.",
    "You make ordinary days feel like holidays.",
    "Call me tonight? I want to hear about your day.",
    "Coupon: one hug, valid any time, never expires.",
    "Treat yourself to something sweet today. You earned it.",
    "Halfway to Christmas! Proud of you for getting this far.",
    "Go outside and look up. Maybe it’s snowing somewhere near you.",
    "Three things I love about you: your laugh, your heart, your playlists.",
    "Write down one good thing from this year. I’ll go first: meeting you.",
    "Coupon: I’ll do one chore of your choice, no complaints.",
    "You’re my favourite notification.",
    "Light a candle tonight and make a wish.",
    "Rest is productive too. Take it easy today.",
    "Tomorrow is closer to Christmas than today. Hang in there!",
    "Merry Christmas Eve! Thank you for being you.",
    "Let’s plan one fun thing to do together in the new year.",
    "Wrap yourself in your coziest blanket tonight.",
    "Fun fact: you are very easy to love.",
    "Send a nice message to someone today. Starting with me is allowed.",
    "No matter the distance, you’re always close to my heart.",
    "Bake, buy or borrow a cookie. Today is a cookie day."
  ],
  calendar: {
    heading: "Advent Calendar",
    forName: "For {name}",
    forNone: "An advent calendar for you",
    fromName: "From {name}",
    before: {
      one: "The first door opens on {date}. Just {n} day to go!",
      other: "The first door opens on {date}. {n} days to go!"
    },
    during: "It’s {date}. Open today’s door!",
    after: "Christmas is here. Every door is open.",
    locked: {
      one: "Door {day} opens on {date}, in {n} day.",
      other: "Door {day} opens on {date}, in {n} days."
    },
    hint: "Tap a door to open it",
    doorAria: "Door {day}",
    dayTitle: "{date}",
    treat: "No message today, just a little treat for you.",
    close: "Close",
    makeOwn: "🎄 Make one yourself"
  },
  preview: {
    badge: "👀 Preview mode",
    note: "Only you see this. Every door is open here so you can check your messages. Your friend’s doors open one a day.",
    back: "← Back"
  },
  result: {
    eyebrowMine: "Your advent calendar is ready!",
    eyebrowFriend: "A calendar made just for you",
    linkLabel: "Your calendar link",
    copy: "Copy link",
    copied: "Link copied!",
    copyFail: "Couldn’t copy. Select the link and copy it.",
    note: "The messages live only inside this link. Anyone with it can open each door on its day, so send it only to your person.",
    save: "Save image",
    saving: "Making your image…",
    saved: "Image saved!",
    saveFail: "Couldn’t make the image. Try a screenshot instead.",
    imageAlt: "Advent calendar with 24 closed doors",
    preview: "Preview all doors",
    edit: "Edit",
    retry: "Make another calendar",
    retryFriend: "Make one yourself",
    shareTitle: "Advent Calendar Maker",
    shareText: "I made you an advent calendar 🎄 One door opens every day from December 1:",
    shareTextFriend: "Make an advent calendar for someone you love 🎄",
    fileName: "advent-calendar"
  },
  og: {
    brand: "🎄 Advent Calendar Maker",
    kicker: "Advent calendar maker",
    title: "24 doors, one surprise a day",
    desc: "4 designs · notes behind every door · share by link"
  },
  faq: [
    {
      q: "When do the doors open?",
      a: "Door 1 opens on December 1, door 2 on December 2, and so on until December 24, using the date on your friend’s own phone or computer. From December 25 to January 31 every door is open. Before December every door stays locked."
    },
    {
      q: "Where are my messages stored?",
      a: "Only inside the link. Nothing you write is sent to our server, so anyone who has the link can read the messages once each door opens. Send it only to the person it is for."
    },
    {
      q: "Can I change a message after I send the link?",
      a: "No. The link itself holds the messages, so it can’t be edited later. Edit your calendar, create a new link and send that one instead."
    },
    {
      q: "What does my friend see if a door is empty?",
      a: "A small treat for that day, such as a cookie, a candy cane or a little star. You can fill every door, only some, or let the dice suggest ideas."
    }
  ],
  privacy: {
    title: "Privacy Policy | Advent Calendar Maker",
    description: "Privacy Policy for the Advent Calendar Maker: how your messages are handled, cookies, advertising and anonymous statistics.",
    h1: "Privacy Policy",
    introHtml: "The Advent Calendar Maker (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [
      [
        "1. Information we collect",
        "The Service works without an account or login. The names and messages you type are never sent to a server. They stay in your browser (a draft is kept in local storage while you edit) and inside the link when you share. Which doors have been opened is remembered only in the recipient’s browser. Some information may be collected automatically while you use the Service, as described below."
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
        "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, created calendars, star ratings). None of this identifies you personally, and none of it includes what you wrote."
      ],
      [
        "5. Shared links and images",
        "Links created with the Service contain your calendar, encoded in the URL, so anyone who has the link can read each message once its door opens. Saved images show only the door numbers and are created inside your browser. Please avoid putting addresses, phone numbers or other personal details in your messages."
      ],
      [
        "6. Contact",
        "If you have any questions about this Privacy Policy, please contact the site operator."
      ],
      [
        "7. Effective date",
        "This policy is effective as of November 17, 2026."
      ]
    ],
    back: "← Back to the Advent Calendar Maker"
  }
};
