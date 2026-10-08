/* Your Name in Korean (hangul-name) — English (site root /, default + x-default)
 * Transliteration lives in hangul-name-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * {hangul} {roman} {name} are placeholders filled in the browser.
 * Start screen = teaser + name input only (no FAQ). FAQ appears only in the shared end screen.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual",
  },
  meta: {
    title: "Your Name in Korean – Hangul Name Converter",
    description: "See your name in Korean! Type it and the Hangul name converter writes it in Korean letters, block by block with pronunciation, on a name card you can save. Free, no sign-up.",
    ogTitle: "Your Name in Korean 🔤 Hangul Name Converter",
    ogDescription: "Type your name and see it written in Hangul, with a name card to save.",
  },
  siteName: "Your Name in Korean",
  privacyLink: "Privacy Policy",
  start: {
    badge: "🇰🇷 October 9 is Hangul Day",
    h1Kicker: "Your Name in Korean",
    h1Html: "How do you write<br>your name in <em>Hangul</em>?",
    hook: "Type your name and watch it turn into Korean letters, with how to read each block.",
    inputLabel: "Your name",
    placeholder: "e.g. Michael Smith",
    start: "Write my name ✍️",
    facts: "Latin, Cyrillic or Japanese kana · name card image · nothing is sent anywhere",
  },
  errors: {
    empty: "Type your name first.",
    invalid: "Try your name in Latin letters (A–Z), Cyrillic or Japanese kana.",
  },
  result: {
    eyebrow: "Your name in Korean",
    eyebrowFriend: "A friend’s name in Korean",
    styleTitle: "Card style",
    save: "Save image",
    saving: "Making your card…",
    saved: "Saved! Check your downloads.",
    saveFail: "Couldn’t save the image. Try a screenshot instead.",
    copy: "Copy text",
    copied: "Copied!",
    copyFail: "Couldn’t copy. Select the name and copy it by hand.",
    breakdownTitle: "How to read it, block by block",
    note: "This is an approximate pronunciation, just for fun. Names can be spelled more than one way in Korean.",
    again: "Try another name",
    shareTitle: "Your Name in Korean",
    shareText: "My name in Korean is {hangul} ✍️ What’s yours?",
    copyText: "{name} in Korean: {hangul} ({roman})",
    fileName: "my-name-in-korean",
    cardTag: "My name in Hangul",
    fromLatin: "read as {name}",
  },
  styles: {
    brush: "Brush",
    cute: "Cute",
    bold: "Poster",
    classic: "Classic",
  },
  og: {
    brand: "🔤 Your Name in Korean",
    kicker: "Hangul Day · Oct 9",
    title: "Your name, written in Hangul",
    desc: "Block by block, with pronunciation and a name card",
  },
  faq: [{
      q: "How accurate is the Korean spelling of my name?",
      a: "Common names use the standard Korean loanword spelling. Other names are spelled by sound with rules from the official Korean loanword guidelines, so the result is a close, friendly approximation rather than an official translation.",
    }, {
      q: "Why can my name be written in more than one way?",
      a: "Korean writes foreign names by how they sound, and the same name sounds different in English, French or Spanish. Some spellings also follow tradition, so you may see a slightly different version elsewhere. Both can be right.",
    }, {
      q: "Can I use it for a tattoo or a gift?",
      a: "It’s great for fun, cards and profiles. For anything permanent, like a tattoo, engraving or printed gift, please double-check the spelling and the lettering with a native Korean speaker first.",
    }, {
      q: "Is my name saved or sent anywhere?",
      a: "No. The conversion and the name card image are made inside your browser. Your name is not sent to a server or stored. A share link only carries the name inside the link itself.",
    }],
  privacy: {
    title: "Privacy Policy | Your Name in Korean",
    description: "Privacy Policy for Your Name in Korean: the name you type stays in your browser, cookies, advertising and statistics.",
    h1: "Privacy Policy",
    introHtml: "Your Name in Korean (the \"Service\") respects your privacy and processes only the minimum information described below.",
    sections: [["1. Your name stays in your browser", "The Service works without an account or login. The name you type is converted into Korean letters only in your browser, and the name card image is drawn and saved on your device. Your name is not sent to our server and is not stored. If you share a link, the name is placed inside the link itself (after the # sign), so it reaches only the people you send it to."], ["2. Cookies and similar technologies", "The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do."], ["3. Advertising (Google AdSense)", "The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google Ad Settings</a>."], ["4. Statistics", "To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, names converted, star ratings). They never include the names you type, and none of this identifies you personally."], ["5. Contact", "If you have any questions about this Privacy Policy, please contact the site operator."], ["6. Effective date", "This policy is effective as of October 9, 2026."]],
    back: "← Back to Your Name in Korean",
  },
};
