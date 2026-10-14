/* Word Counter — English (site root /, default + x-default)
 * Counting logic lives in wordcount-core.js; this file holds every visible string for this language.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * One screen (text box + live counts); the summary and the shared end screen appear under it after "See summary".
 * FAQ appears only in the shared end screen. Never put the user's text into share text or links.
 * Placeholders like {n} {max} {m} {s} — keep them as-is when translating.
 */
module.exports = {
  // Fonts: css = Google Fonts stylesheet, display = titles/buttons, sans = optional body font,
  // wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto. Numbers always use JetBrains Mono.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Word Counter & Character Count – Free Online Tool',
    description: 'Free word counter and character count tool: characters with and without spaces, words, sentences, paragraphs, bytes, reading time and a target limit. Runs in your browser.',
    ogTitle: 'Word Counter 📝 Characters, words, bytes, live',
    ogDescription: 'Paste your text and see characters, words, sentences, bytes and reading time instantly. Nothing is sent anywhere.',
  },
  siteName: 'Word Counter',
  privacyLink: 'Privacy Policy',

  hero: {
    h1Kicker: 'Word Counter',
    h1Html: 'Count every character,<br><em>as you type</em>',
    hook: 'Type or paste your text. Characters, words and bytes update live, and a target bar tells you when you hit the limit.',
  },

  ui: {
    editorLabel: 'Your text',
    placeholder: 'Type or paste your text here…',
    bar: { chars: 'Characters', noSpaces: 'No spaces', words: 'Words', bytes: 'Bytes' },
    toolsLabel: 'Text tools',
    tools: { copy: 'Copy text', tidy: 'Tidy spaces', join: 'Join lines', clear: 'Clear', undo: 'Undo' },
    saved: 'Your draft is saved only on this device, never uploaded.',
    copied: 'Text copied',
    copyFail: 'Couldn’t copy. Select the text and copy it yourself.',
    cleared: 'Text cleared. Tap Undo to bring it back.',
    tidied: 'Extra spaces and blank lines removed.',
    joined: 'Line breaks removed.',
    undone: 'Change undone.',
    nothing: 'Nothing to change.',
    limitLabel: 'Target length',
    limitOff: 'Off',
    limitChip: '{n}',
    limitCustom: 'Custom',
    limitCustomPh: 'e.g. 280',
    limitCustomAria: 'Custom target length in characters',
    limitSpaces: 'Count spaces',
    limitText: '{n} / {max} characters',
    limitLeft: '{n} left',
    limitOver: '{n} over the limit',
    statsLabel: 'Detailed counts',
    stats: {
      chars: 'Characters (with spaces)',
      noSpaces: 'Characters (no spaces)',
      words: 'Words',
      sentences: 'Sentences',
      paragraphs: 'Paragraphs',
      lines: 'Lines',
      reading: 'Reading time',
      speaking: 'Speaking time',
      bytes: 'Bytes',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Legacy 2-byte' },
    byteHint: {
      utf8: 'Standard UTF-8: English letters and spaces 1 byte, most accented letters 2, Chinese, Japanese and Korean 3, emoji 4. A line break is 1 byte.',
      neis: 'UTF-8, but every line break counts as 2 bytes (CR + LF), as in Windows text files and many school-record systems.',
      legacy: 'Old 2-byte encodings (EUC-KR, Shift_JIS, GBK): ASCII 1 byte, every other character 2 bytes, a line break 2 bytes.',
    },
    time: { sec: '{s} sec', min: '{m} min', minSec: '{m} min {s} sec' },
    timeNote: 'Times are estimates: about 238 words a minute when reading silently and 150 when speaking.',
    kwLabel: 'Most repeated words',
    kwEmpty: 'Words you use two or more times show up here. Common words like “the” are skipped.',
    kwCount: '{n}×',
    finish: 'See summary ✓',
    needText: 'Type or paste some text first.',
    local: 'Counted on your device. Your text is never sent anywhere.',
  },

  result: {
    heading: 'Your text at a glance',
    limitOk: 'Within your {max}-character target ({pct}%).',
    limitOver: '{n} characters over your {max}-character target.',
    copySummary: 'Copy summary',
    summaryCopied: 'Summary copied',
    summaryTitle: 'Word count summary',
    again: 'Start a new text',
    live: 'Summary ready: {chars} characters, {words} words.',
    shareTitle: 'Word Counter',
    shareText: 'Free word and character counter with bytes and reading time. Your text stays on your device 📝',
  },

  og: {
    brand: '📝 Word Counter',
    kicker: 'Characters · words · bytes · reading time',
    title: 'Count characters and words as you type',
    desc: 'Free, live, and your text stays on your device',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text.
  faq: [
    { q: 'Does it count spaces and line breaks?', a: 'Both numbers are shown. “With spaces” counts every visible character plus spaces and line breaks, each line break as 1. “No spaces” leaves out every kind of space, tab and line break. Use the Count spaces switch to choose which one the target bar follows.' },
    { q: 'Why is my count different from Word or Google Docs?', a: 'Each tool has its own rules. Some count a hyphenated word as two, some count emoji as two characters, and Word skips line breaks in its character count. This counter treats an emoji or an accented letter as 1 character, joins hyphenated words, and counts a line break as 1.' },
    { q: 'How are bytes counted?', a: 'Pick the rule that matches the form you are filling in. UTF-8 is what most websites use. UTF-8 + CRLF counts each line break as 2 bytes. Legacy 2-byte counts ASCII as 1 byte and every other character as 2, like older Korean, Japanese and Chinese systems.' },
    { q: 'Is my text saved or uploaded?', a: 'Your text never leaves your device. The draft is kept in this browser’s local storage so it survives a reload, and Clear removes it. Nothing is put in the page address or in share links.' },
  ],

  privacy: {
    title: 'Privacy Policy | Word Counter',
    description: 'Privacy Policy for Word Counter: your text is counted and kept only in your browser; cookies, advertising and statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Word Counter (the "Service") respects your privacy and processes only the minimum information described below.',
    sections: [
      ['1. Information we collect', 'The Service works without an account or login. The text you type or paste is counted only in your browser. It is never sent to our server or any other server, and it is never written into the page address or share links. To keep your draft after a reload, the text and your settings are stored in your browser’s local storage on this device only; pressing Clear deletes the saved draft, and you can also remove it by clearing your browser’s site data.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies and your browser’s local storage to remember your language and settings, to show ads and to understand how the Service is used. You can refuse or delete them in your browser settings; some features may not work as expected if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your preferences in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'To improve the Service we may use Google Analytics (GA4) and our own aggregate counters that keep only daily totals per language (page views, uses, star ratings). These counters never include your text or its counts, and none of this identifies you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of October 15, 2026.'],
    ],
    back: '← Back to Word Counter',
  },
};
