/* Pumpkin Carving Online — English (site root /, default + x-default)
 * Part ids, counts and drawings live in pumpkin-core.js; this file holds every visible string.
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
    title: 'Pumpkin Carving Online — Jack-o’-Lantern Maker',
    description: 'Pumpkin carving online: pick the eyes, nose and mouth, light the candle and make your own jack-o’-lantern. Free, no download. Save the image or share the link.',
    ogTitle: 'Pumpkin Carving Online 🎃 Jack-o’-Lantern Maker',
    ogDescription: 'Carve your own jack-o’-lantern in a minute, light the candle and send it to a friend.',
  },
  siteName: 'Jack-o’-Lantern Maker',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Halloween special',
    h1Kicker: 'Pumpkin Carving Online',
    h1Html: 'Carve your own<br><em>jack-o’-lantern</em>',
    hook: 'No knife, no mess. Give your pumpkin a face, light the candle and watch it glow.',
    start: 'Start carving →',
  },

  editor: {
    title: 'Carve your pumpkin',
    hint: 'Tip: tap the pumpkin to try the next one',
    previewAria: 'Your pumpkin. Tap to try the next option',
    tabsAria: 'Pumpkin parts',
    tabs: { shape: 'Shape', color: 'Color', eyes: 'Eyes', nose: 'Nose', mouth: 'Mouth', stem: 'Stem', extra: 'Extras' },
    optionAria: '{part} {n}',
    glow: 'Candle',
    night: 'Night sky',
    nameLabel: 'Name your pumpkin (optional)',
    namePlaceholder: 'e.g. Sir Grins-a-Lot',
    random: 'Random',
    done: 'All done!',
  },

  result: {
    eyebrowMine: 'Your jack-o’-lantern is ready!',
    eyebrowFriend: 'A friend carved this jack-o’-lantern for you',
    untitled: 'My jack-o’-lantern',
    imageAlt: 'Jack-o’-lantern: {name}',
    save: 'Save image',
    saving: 'Making your image…',
    saved: 'Image saved!',
    saveFail: 'Couldn’t make the image. Try a screenshot instead.',
    edit: 'Keep editing',
    retry: 'Carve another pumpkin',
    retryFriend: 'Carve my own pumpkin',
    shareTitle: 'Pumpkin Carving Online — Jack-o’-Lantern Maker',
    shareText: 'I carved a jack-o’-lantern named “{name}” 🎃 Carve yours too!',
    shareTextNoName: 'I carved my own jack-o’-lantern 🎃 Carve yours too!',
    fileName: 'my-jack-o-lantern',
  },

  og: {
    brand: '🎃 Jack-o’-Lantern Maker',
    defaultKicker: 'Pumpkin Carving Online',
    defaultTitle: 'Carve your own jack-o’-lantern',
    defaultDesc: 'Eyes, nose, mouth and candlelight · free in your browser',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'How do I carve my pumpkin?', a: 'Pick a tab (shape, color, eyes, nose, mouth, stem or extras) and tap an option. Tapping the pumpkin itself switches to the next option, and Random mixes everything up. Tap “All done!” when you like it.' },
    { q: 'Can I save my jack-o’-lantern as a picture?', a: 'Yes. “Save image” turns your pumpkin into a PNG. On a phone you can keep it in your photos from the share sheet; on a computer it downloads.' },
    { q: 'How does the share link work?', a: 'Your whole design, including its name, is packed into the link itself. Whoever opens it sees exactly the same pumpkin and can then carve their own. Nothing is stored on our servers.' },
    { q: 'What do the candle and night sky switches do?', a: 'The candle lights up the carved parts with a warm glow, just like a real candle inside. Turn it off for a daytime look. The night sky switch swaps the background between a starry night and a soft light one.' },
  ],

  privacy: {
    title: 'Privacy Policy | Jack-o’-Lantern Maker',
    description: 'Privacy Policy for Jack-o’-Lantern Maker: how your design is handled, cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Jack-o’-Lantern Maker (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. Your pumpkin design and its name are never sent to a server. They stay in your browser (and in the URL when you share). Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, finished pumpkins, star ratings). None of this identifies you personally.'],
      ['5. Shared links and images', 'Links created with “Share” contain your design and the name you typed, encoded in the URL. Saved images are created inside your browser. Please avoid typing personally identifiable information as the name.'],
      ['6. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['7. Effective date', 'This policy is effective as of September 28, 2026.'],
    ],
    back: '← Back to the Jack-o’-Lantern Maker',
  },
};
