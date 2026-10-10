/* QR Code Generator — English (site root /, default + x-default)
 * The encoder lives in qr-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * The app has one screen (type + input + preview + save buttons + options); the shared end screen appears under it after the first save.
 * FAQ appears only in the shared end screen.
 * Placeholders: {bytes} {v} {n} {ratio} {value} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons (Unbounded: Latin ext, Vietnamese, Cyrillic),
  // sans = optional body font, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'QR Code Generator – Free, Wi-Fi & PNG/SVG',
    description: 'Free QR code generator for links, text, Wi-Fi, email and phone numbers. Pick colors, error correction and size, then download PNG or SVG. Runs in your browser, no sign-up.',
    ogTitle: 'QR Code Generator 🔳 Free, private, PNG & SVG',
    ogDescription: 'Make a QR code for a link, Wi-Fi, email or phone in seconds. Nothing leaves your browser.',
  },
  siteName: 'QR Code Generator',
  privacyLink: 'Privacy Policy',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'QR Code Generator',
    h1Html: 'Type it, <em>scan</em> it,<br>share it',
    hook: 'Links, text, Wi-Fi, email or a phone number become a QR code as you type. Free, no sign-up, made right in your browser.',
  },

  ui: {
    typeLabel: 'What should the QR code hold?',
    types: { link: 'Link', text: 'Text', wifi: 'Wi-Fi', email: 'Email', phone: 'Phone' },
    link: { label: 'Website address', placeholder: 'example.com/menu' },
    text: { label: 'Your text', placeholder: 'A note, a code, a short message…' },
    wifi: {
      ssid: 'Network name (SSID)', ssidPh: 'MyHomeWiFi',
      password: 'Password', passwordPh: 'Wi-Fi password',
      security: 'Security',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (old)', nopass: 'No password' },
      hidden: 'Hidden network',
    },
    email: { to: 'Email address', toPh: 'name@example.com', subject: 'Subject (optional)', subjectPh: 'Hello', body: 'Message (optional)', bodyPh: 'Write a message…' },
    phone: { label: 'Phone number', placeholder: '+1 555 123 4567' },

    previewLabel: 'QR code preview',
    previewReady: 'QR code preview, version {v}',
    emptyPreview: 'Your QR code appears here as you type',
    info: '{bytes} bytes · version {v} · {n}×{n} modules',
    encodes: 'Encodes: {value}',
    tooLong: 'Too much for one QR code. Shorten it or pick a lower error correction level (L).',
    encodeFail: 'Could not make this QR code. Try changing the text.',
    warnContrast: 'Low contrast ({ratio}:1). Scanners may struggle, so use a dark code on a light background.',
    warnInverted: 'Light code on a dark background. Some scanner apps can’t read inverted codes.',
    warnQuiet: 'A narrow quiet zone can make scanning harder. Keep at least 2 (4 is standard).',

    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    copyImage: 'Copy image',
    savedPng: 'PNG saved. Scan it once with your phone before printing.',
    savedSvg: 'SVG saved. Great for print, it stays sharp at any size.',
    copied: 'Image copied. Paste it into a document or chat.',
    copyFail: 'Copying images isn’t allowed here. Use Download PNG instead.',
    saveFail: 'Saving failed. Please try again.',

    options: '🎨 Colors, size & error correction',
    colors: 'Colors',
    fg: 'Code',
    bg: 'Background',
    resetColors: 'Reset',
    ecc: 'Error correction',
    eccHint: 'Higher levels survive scratches and logos but make the code denser. M suits most uses.',
    size: 'Image size',
    margin: 'Quiet zone (margin)',
    marginHint: 'The empty border around the code, in modules. 4 is the standard.',
    localNote: '🔒 Made right in your browser. What you type is never sent to a server.',
  },

  result: {
    doneTitle: 'Your QR code is ready ✓',
    doneText: 'Test it with a phone camera before you print or share it. Edit the fields above any time to make a new one.',
    again: 'Make another QR code',
    shareTitle: 'QR Code Generator – free and private',
    shareText: 'Make a QR code for a link, Wi-Fi or text in seconds, right in your browser 🔳',
  },

  og: {
    brand: '🔳 QR Code Generator',
    kicker: 'Link · Wi-Fi · Text · PNG & SVG',
    title: 'Make a QR code in seconds',
    desc: 'Free, private, made in your browser',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Is what I type sent anywhere?', a: 'No. The QR code is calculated by JavaScript inside your browser, so links, Wi-Fi passwords and messages never reach a server. They are not saved either; closing the page clears them.' },
    { q: 'Do the QR codes expire?', a: 'No. These are static QR codes: the content is stored in the pattern itself, with no redirect or tracking link in between. A printed code keeps working as long as the link or network it points to exists.' },
    { q: 'How does the Wi-Fi QR code work?', a: 'It stores the network name, password and security type in the standard WIFI: format. Most iPhone and Android cameras offer to join the network when they scan it, so guests don’t have to type the password.' },
    { q: 'Which error correction level should I choose?', a: 'M (about 15% recovery) suits most uses. Choose Q or H if the code will be printed on rough surfaces, may get scratched or will have a logo placed over it. L makes the smallest code for long content shown on screens.' },
    { q: 'PNG or SVG?', a: 'PNG is an ordinary image for websites, chats and documents. SVG is a vector file that stays perfectly sharp at any size, which is ideal for posters, flyers and professional printing.' },
  ],

  privacy: {
    title: 'Privacy Policy | QR Code Generator',
    description: 'Privacy Policy for QR Code Generator: what you type stays in your browser, cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'QR Code Generator (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The links, text, Wi-Fi details, email addresses and phone numbers you enter are turned into a QR code only in your browser. They are not sent to our server and are not stored. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, codes made, star ratings). The content of your QR codes is never part of these statistics, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 11, 2026.'],
    ],
    back: '← Back to QR Code Generator',
  },
};
