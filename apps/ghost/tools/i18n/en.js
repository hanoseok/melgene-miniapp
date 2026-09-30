/* Ghost Maker — English (site root /, default + x-default)
 * Part ids, counts and drawings live in ghost-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser only (no part lists, no FAQ). FAQ appears only in the shared end screen.
 * Placeholders: {name} {part} {n} — keep them as-is when translating.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = display font stack for titles/buttons
  // (Nunito covers Latin ext, Vietnamese and Cyrillic), displayWeight, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Ghost Maker – Make Your Own Halloween Ghost',
    description: 'Ghost Maker: pick a body, eyes, mouth and a hat and make your own cute Halloween ghost. Free, no download, done in a minute. Save the image or share the link.',
    ogTitle: 'Ghost Maker 👻 Make Your Own Cute Ghost',
    ogDescription: 'Make your own little ghost in a minute, watch it float and send it to a friend.',
  },
  siteName: 'Ghost Maker',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '👻 Halloween special',
    h1Kicker: 'Ghost Maker',
    h1Html: 'Make your own<br><em>cute ghost</em>',
    hook: 'Someone shy is hiding under that sheet. Give them a face and a little personality, then watch them float.',
    start: 'Make my ghost →',
  },

  editor: {
    title: 'Design your ghost',
    hint: 'Tip: tap the ghost to try the next one',
    previewAria: 'Your ghost. Tap to try the next option',
    tabsAria: 'Ghost parts',
    tabs: { body: 'Body', color: 'Color', eyes: 'Eyes', mouth: 'Mouth', cheeks: 'Cheeks', hat: 'Hat', item: 'Holding', bg: 'Scene' },
    optionAria: '{part} {n}',
    nameLabel: 'Name your ghost (optional)',
    namePlaceholder: 'e.g. Little Boo',
    random: 'Random',
    done: 'All done!',
  },

  result: {
    eyebrowMine: 'Your ghost is ready to haunt!',
    eyebrowFriend: 'A friend made this little ghost for you',
    untitled: 'My little ghost',
    imageAlt: 'Ghost: {name}',
    save: 'Save image',
    saving: 'Making your image…',
    saved: 'Image saved!',
    saveFail: 'Couldn’t make the image. Try a screenshot instead.',
    edit: 'Keep editing',
    retry: 'Make another ghost',
    retryFriend: 'Make my own ghost',
    shareTitle: 'Ghost Maker – Make Your Own Halloween Ghost',
    shareText: 'Meet my ghost “{name}” 👻 Make yours too!',
    shareTextNoName: 'I made my own little ghost 👻 Make yours too!',
    fileName: 'my-ghost',
  },

  og: {
    brand: '👻 Ghost Maker',
    defaultKicker: 'Halloween Ghost Maker',
    defaultTitle: 'Make your own cute ghost',
    defaultDesc: 'Faces, hats and spooky little friends · free in your browser',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I make my ghost?', a: 'Pick a tab at the top of the editor and tap an option you like. Tapping the ghost itself switches to the next option in that tab, and Random mixes everything up. Tap “All done!” when you’re happy with it.' },
    { q: 'Can I save my ghost as a picture?', a: 'Yes. “Save image” turns your ghost into a PNG. On a phone you can keep it in your photos from the share sheet; on a computer it downloads.' },
    { q: 'How does the share link work?', a: 'Your whole design, including its name, is packed into the link itself. Whoever opens it sees exactly the same ghost and can then make their own. Nothing is stored on our servers.' },
    { q: 'Why is my ghost bobbing up and down?', a: 'Ghosts float! The gentle bobbing is just for fun on screen. If your device is set to reduce motion, the ghost stays still, and the saved image is always still.' },
  ],

  privacy: {
    title: 'Privacy Policy | Ghost Maker',
    description: 'Privacy Policy for Ghost Maker: how your ghost design is handled, cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Ghost Maker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your ghost design and its name are never sent to a server. They stay in your browser (and in the URL when you share). Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished ghosts, star ratings). None of this identifies you personally.'],
      ['5. Shared links and images', 'Links created with “Share” contain your design and the name you typed, encoded in the URL. Saved images are created inside your browser. Please avoid typing personally identifiable information as the name.'],
      ['6. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['7. Effective date', 'This policy is effective as of October 1, 2026.'],
    ],
    back: '← Back to Ghost Maker',
  },
};
