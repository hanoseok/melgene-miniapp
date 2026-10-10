/* Melgene Apps portal (hub) — English (default language, site root /).
 * privacy.introHtml and privacy.sections bodies are raw HTML; everything else is plain text.
 * ui is used by script.js and inlined into the page as window.PAGE_I18N.
 * No spoilers: curation copy describes each app's mood, never its actual questions or results. */
module.exports = {
  siteName: 'Melgene Apps',
  // Header wordmark: 'Melgene' + small badge (must equal shared STRINGS.en.brandBadge).
  brand: { word: 'Melgene', badge: 'Apps' },
  // --font-sans / --font-display for this language (Gabarito covers Latin incl. é ü ñ œ).
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Free Mini Games & Personality Tests | Melgene Apps',
    description:
      'Free mini games and personality tests that open right in your browser. No download, no sign-up, and each mini app takes about a minute.',
    ogTitle: 'Melgene Apps: free mini games & personality tests',
    ogDescription: 'Mini games, personality tests and more. No download, no sign-up: tap one and play in a minute.',
  },
  homeAria: 'Melgene Apps home',
  // Small visible <h1> under the header: brand + the search term people actually type.
  h1: 'Free mini games & personality tests',
  // "Today's Mini Apps" carousel. id = SITE_CONFIG.SITES id, one entry per app; the page shows 6 random of the 10 newest SITES apps, so every one of those 10 needs an entry here.
  curation: {
    h2: 'Today’s Mini Apps',
    items: [
      {
        id: 'qr',
        kicker: "Handy tool",
        headline: "Turn any link into a QR code",
        blurb: "Links, text or Wi-Fi. Download PNG or SVG — made right in your browser.",
      },
      {
        id: 'randnum',
        kicker: "Fair draw",
        headline: "Pick random numbers in one tap",
        blurb: "Any range, with or without repeats. Great for raffles and giveaways.",
      },
      {
        id: 'coffee',
        kicker: "Personality quiz",
        headline: "Which coffee are you?",
        blurb: "12 everyday questions, 2 minutes. Find your coffee match.",
      },
      {
        id: 'sweeper',
        kicker: "Puzzle classic",
        headline: "Dodge the mines, clear the board",
        blurb: "Read the numbers and flag the danger. First tap is safe.",
      },
      {
        id: 'hangul-name',
        kicker: "Hangul Day special",
        headline: "See your name written in Korean",
        blurb: "Type your name and get it in Hangul on a card you can save.",
      },
      {
        id: 'dice',
        kicker: "Tabletop helper",
        headline: "Roll the dice right in your browser",
        blurb: "Up to six dice, from d4 to d20. Fair rolls with a satisfying tumble.",
      },
      {
        id: 'brick',
        kicker: 'Arcade classic',
        headline: 'One ball, a wall of neon bricks',
        blurb: 'Bounce it off your paddle and clear the wall. 3 lives, faster stages.',
      },
      {
        id: 'mentalage',
        kicker: 'Personality quiz',
        headline: 'How old is your mind?',
        blurb: '12 everyday questions, 2 minutes. Your mental age as a number.',
      },
      {
        id: 'fancytext',
        kicker: 'Make it yourself',
        headline: 'Make your text stand out',
        blurb: 'Turn plain text into fancy fonts and copy it in one tap.',
      },
      {
        id: 'mole',
        kicker: 'Reflex game',
        headline: 'Whack the moles, dodge the bombs',
        blurb: 'Tap the moles before they hide. 30 seconds, one rank.',
      },
      {
        id: 'nickname',
        kicker: 'Make it yourself',
        headline: 'Find a nickname that fits you',
        blurb: 'Pick a vibe and get a fresh nickname in one tap.',
      },
      {
        id: 'coinflip',
        kicker: 'Can\'t decide?',
        headline: 'Heads or tails? Roll the dice',
        blurb: 'Flip a coin or roll up to three dice, fair every time.',
      },
      {
        id: 'lotto',
        kicker: 'Feeling lucky?',
        headline: 'Lucky numbers for fun',
        blurb: 'Pick a game and draw up to five sets of balls.',
      },
      {
        id: 'invite',
        kicker: 'Make it yourself',
        headline: 'Make a Halloween party invitation',
        blurb: 'Add the party details, pick a theme, then save or share it.',
      },
      {
        id: 'lunch',
        kicker: 'Can\'t decide?',
        headline: 'Spin the reel for today\'s meal',
        blurb: 'Pick a meal and a mood and let the slot machine choose.',
      },
      {
        id: 'merge',
        kicker: 'Quick game',
        headline: 'Drop, match, merge, grow',
        blurb: 'Two of a kind merge into something bigger. Don\'t overflow the jar!',
      },
      {
        id: 'costume',
        kicker: 'Personality quiz',
        headline: 'Who will you be this Halloween?',
        blurb: 'Answer a few situations and get the costume that fits you.',
      },
      {
        id: 'ghost',
        kicker: 'Make it yourself',
        headline: 'Build your own little ghost',
        blurb: 'Pick a shape, a face and a hat, then save it or send it.',
      },
      {
        id: 'team',
        kicker: 'Split into teams',
        headline: 'Fair random teams in one tap',
        blurb: 'Type the names, pick how many teams and shuffle.',
      },
      {
        id: 'lovestyle',
        kicker: 'Personality quiz',
        headline: 'What kind of partner are you?',
        blurb: 'Ten little dating moments, two minutes. See how you love.',
      },
      {
        id: 'animal',
        kicker: 'Personality quiz',
        headline: 'Which animal are you?',
        blurb: 'Eight everyday moments, two minutes. Meet your wild side.',
      },
      {
        id: 'game2048',
        kicker: 'Puzzle game',
        headline: 'Slide, merge, reach 2048',
        blurb: 'Swipe the tiles and combine matching numbers. Halloween edition.',
      },
      {
        id: 'aura',
        kicker: 'Personality quiz',
        headline: 'What color is your aura?',
        blurb: 'Answer a few everyday moments and see the glow you give off.',
      },
      {
        id: 'candy-catch',
        kicker: 'Quick game',
        headline: 'Catch the falling candy',
        blurb: 'Slide your pumpkin bucket, dodge the spooky stuff, chain combos.',
      },
    ],
  },
  browse: {
    h2: 'All mini apps',
    searchLabel: 'Search mini apps',
    searchPlaceholder: 'Search mini apps',
    catLabel: 'Categories',
    sortLabel: 'Sort by',
  },
  ui: {
    cats: { all: 'All', game: 'Games', test: 'Personality Tests', create: 'Create', vote: 'Vote' },
    sorts: { popular: 'Popular', rating: 'Top rated', newest: 'Newest' },
    totalHtml: 'Played <strong>{n} times</strong> so far',
    play: 'Play now',
    newBadge: 'NEW',
    plays: '{n} plays',
    ratingAria: 'Rated {avg} out of 5 from {votes} ratings',
    prev: 'Previous pick',
    next: 'Next pick',
    goTo: 'Show pick {n}',
    count: '{n} apps',
    countOne: '1 app',
    emptyCat: 'No mini apps in this category yet.',
    emptySearch: 'Nothing matches “{q}”. Try another word or browse them all.',
    reset: 'Show all',
  },
  faqTitle: 'FAQ',
  // Visible at the bottom of the portal (+ FAQPage JSON-LD). Short, spoiler-free.
  faq: [
    [
      'What is Melgene Apps?',
      'Melgene Apps is a free collection of mini apps: quick mini games, personality tests and apps that turn a few answers into something of your own. Each one takes about a minute and opens right in your browser.',
    ],
    [
      'Do I need to download anything or sign up?',
      'No. Every mini game and test is a web page that works on phones, tablets and computers, so you can send a link and your friends can play right away. If you play often, choose “Add to Home Screen” in your browser menu to keep it like an app.',
    ],
    [
      'Do you collect personal data?',
      'No. We never ask for your name, email or phone number. Hearts, ratings and play counts are anonymous totals per app, and a share link stores only the answers needed to show that result.',
    ],
    [
      'How often are new mini apps added?',
      'We keep adding new games and personality tests based on what’s trending. New apps wear a NEW badge for two weeks and come first when you sort by Newest.',
    ],
  ],
  privacyLink: 'Privacy Policy',
  og: {
    h1Html: 'Free mini games &amp;<br>personality tests',
    tag: 'No download. No sign-up. Just play.',
  },
  privacy: {
    title: 'Privacy Policy | Melgene Apps',
    description: 'Privacy Policy for Melgene Apps: advertising (Google AdSense), anonymous play counts, hearts and ratings, cookies and browser storage.',
    h1: 'Privacy Policy',
    introHtml:
      'Melgene Apps (the “Service”) is a collection of mini apps you can use without an account. We respect your privacy and process only the minimum information needed to run the Service, as described below.',
    sections: [
      [
        '1. Information we don’t collect',
        'The Service never asks for or collects personal information such as your name, email, phone number or an account. What you enter in each mini app is processed in your own browser by default.',
      ],
      [
        '2. Anonymous counts: plays, hearts and ratings (Supabase)',
        'To show play counts, hearts and ratings, we store only the following in Supabase (a database service): running totals per mini app (plays and hearts), star ratings (1–5) per mini app, and daily totals per date, mini app and language (page views, completed plays and whether an ad was shown). So that the same visit isn’t counted twice within 30 seconds, the server briefly keeps a one-way hash of your IP address and deletes it automatically, usually within a day. To count each browser’s rating once, your browser keeps a random identifier and the server stores only a one-way hash of it. When you create a share link, we store only the answers needed to show that result to whoever opens it. None of this is used to identify you.',
      ],
      [
        '3. Advertising (Google AdSense Auto ads)',
        'The Service shows ads through Google AdSense Auto ads, which means Google chooses where ads appear. Google and its partners may use cookies to show ads based on your interests. You can review and change personalized ad settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.',
      ],
      [
        '4. Analytics (Google Analytics)',
        'The Service may use Google Analytics (GA4) for visitor statistics and to improve the Service. This data is used only for statistics and does not identify you personally.',
      ],
      [
        '5. Cookies and browser storage',
        'Settings such as your language, the category and sort you last used, and the ratings you gave are saved only in your browser (localStorage, plus a cookie that remembers your language). You can delete or block cookies and site data in your browser settings at any time.',
      ],
      ['6. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['7. Effective date', 'This policy is effective as of September 26, 2026.'],
    ],
    back: '← Back to Melgene Apps',
  },
  // Footer on every portal page (About · Guides · Terms · Privacy · Contact). Trust pages below are plain text (escaped).
  footerNav: { about: 'About', guides: 'Guides', terms: 'Terms', privacy: 'Privacy', contact: 'Contact' },
  aboutPage: {
    title: 'About Us | Melgene Apps',
    description: 'Melgene Apps is a small independent studio making free browser mini games, personality tests and creation tools in 12 languages. Here is how we build them.',
    h1: 'About Melgene Apps',
    lead: 'Melgene Apps is a small, independent studio that makes free mini apps you can open in any browser: quick games, light-hearted personality tests, little creation tools and helpers for everyday decisions. No download, no account, and most of them take about a minute.',
    sections: [
      {
        h: 'What we make',
        p: [
          'Every mini app on Melgene does one thing well. Some are arcade-style games you can finish on a coffee break, like whack-a-mole, brick breaker or a merge puzzle. Some are personality tests that turn a handful of everyday situations into a playful result you can share. Others help you make something, such as a fancy text style, a party invitation or a nickname, or settle a small decision with a spinning wheel, a ladder game or a coin flip.',
          'We add new apps regularly, often around seasons and holidays, and we keep improving the older ones based on how people actually use them.',
        ],
      },
      {
        h: 'Why we build them',
        p: ['We think the best small moments online are quick, kind and free. Many sites that offer games or quizzes bury them under sign-ups, pop-ups and app-install prompts. Our goal is the opposite: you tap a link, the app opens, you play, and you can send it to a friend with one more tap.'],
      },
      {
        h: 'How each app is made and tested',
        p: ['Each app starts as a short plan that describes who it is for, how long a round should take and what the result screen shows. We then build it as a lightweight web page and test it before release:'],
        list: [
          'On small phone screens (360 px wide) as well as tablets and desktop browsers',
          'In all 12 languages, checking that every line fits and reads naturally',
          'With automated checks for broken links, missing translations and page structure',
          'Without spoilers: start screens tease the idea but never reveal questions or results',
        ],
      },
      {
        h: 'Mobile first, in 12 languages',
        p: ['Most people play on a phone, so every app is designed for a narrow screen first. Melgene Apps is available in English, Japanese, Chinese, Korean, French, German, Thai, Vietnamese, Spanish, Italian, Portuguese and Russian. We write each language for local readers instead of translating word for word, and we use the names people in each country actually search for.'],
      },
      {
        h: 'Privacy-friendly by design',
        p: ['You never need an account, and we never ask for your name, email address or phone number. What you type into an app is processed in your own browser. Play counts, hearts and ratings are anonymous totals per app. The site is supported by advertising from Google AdSense; you can read the details in our Privacy Policy.'],
      },
      {
        h: 'A note on personality tests',
        p: ['Our personality tests, mental age tests and similar quizzes are made for entertainment. They are not psychological, medical or professional assessments, and a result should never be used to make important decisions about yourself or anyone else. Enjoy them as a conversation starter and a bit of fun.'],
      },
      {
        h: 'Get in touch',
        p: ['We read every message. If you find a bug, have an idea for a new mini app or want to talk about a partnership, visit our Contact page or email contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Contact Us | Melgene Apps',
    description: 'Contact Melgene Apps by email for feedback, bug reports, partnership inquiries or privacy requests. We usually reply within a few business days.',
    h1: 'Contact us',
    lead: 'Questions, ideas or problems? We are a small team and we read every message ourselves.',
    emailH: 'Email',
    emailNote: 'We usually reply within a few business days.',
    sections: [
      {
        h: 'What you can contact us about',
        p: ['Feel free to write to us about anything related to Melgene Apps, for example:'],
        list: [
          'Feedback and ideas for new mini games, tests or tools',
          'Bug reports: something does not load, a button does not respond or text is cut off',
          'Translation mistakes or wording that sounds unnatural in your language',
          'Partnership, licensing or press inquiries',
          'Privacy requests and questions about data or cookies',
        ],
      },
      {
        h: 'Reporting a bug',
        p: ['To help us fix it quickly, please include the name of the mini app, the language you were using, your device and browser (for example, iPhone with Safari or Android with Chrome) and a short description of what happened. A screenshot helps a lot.'],
      },
      {
        h: 'Response time',
        p: ['We usually answer within a few business days; around holidays it may take a little longer. We will never ask you for passwords or payment details.'],
      },
    ],
  },
  termsPage: {
    title: 'Terms of Use | Melgene Apps',
    description: 'Terms of Use for Melgene Apps: free browser mini games and tests provided as is for entertainment, acceptable use, share links and third-party ads.',
    h1: 'Terms of Use',
    updated: 'Last updated: October 9, 2026',
    lead: 'These Terms of Use apply to Melgene Apps (the “Service”), including the portal and every mini app on our sites. By using the Service, you agree to these terms. If you do not agree, please do not use the Service.',
    sections: [
      { h: '1. The Service', p: ['Melgene Apps offers free mini games, personality tests, creation tools and decision helpers that run in your web browser. No account is required. We may add, change or remove apps and features at any time.'] },
      { h: '2. Provided as is', p: ['The Service is provided “as is” and “as available”, without warranties of any kind. We work hard to keep it running smoothly, but we do not guarantee that it will always be available, error-free or suitable for a particular purpose. To the extent permitted by law, we are not liable for any loss or damage resulting from your use of the Service.'] },
      { h: '3. For entertainment only', p: ['Results from personality tests, mental age tests, random pickers and similar features are for fun. They are not scientific, psychological, medical, financial or professional advice. Random results, such as lottery numbers, do not improve your chances of winning anything.'] },
      {
        h: '4. Acceptable use',
        p: ['When using the Service, you agree not to:'],
        list: [
          'Use it for anything unlawful, harmful or abusive',
          'Enter content that is hateful, harassing, sexually explicit or that infringes anyone’s rights',
          'Try to disrupt or overload the Service, scrape it at scale or gain unauthorized access to it',
          'Manipulate play counts, hearts, ratings or ads, including with automated tools or invalid clicks',
        ],
      },
      { h: '5. What you create and share', p: ['Some apps let you type names or text, create an image or generate a share link. You are responsible for what you enter and share. A share link stores only the information needed to show that result, and anyone with the link can open it, so please do not include personal or sensitive information. We may remove share links that break these terms.'] },
      { h: '6. Advertising and cookies', p: ['The Service is free because it is supported by ads. Ads are provided by third parties such as Google AdSense, which may use cookies and similar technologies to show and measure ads, including personalized ads. We do not control the content of third-party ads or the sites they link to. You can learn more and manage your choices in our Privacy Policy and in Google Ad Settings.'] },
      { h: '7. Intellectual property', p: ['The design, code, text, illustrations and other materials of the Service belong to Melgene Apps or its licensors and are protected by law. You may use the Service for personal, non-commercial purposes and share links to it freely. Please do not copy, republish or sell the apps or their content without our permission.'] },
      { h: '8. Changes to these terms', p: ['We may update these Terms of Use from time to time. When we do, we will change the date at the top of this page. If you keep using the Service after an update, you accept the revised terms.'] },
      { h: '9. Contact', p: ['If you have questions about these terms, please email contact@melgene.com or use our Contact page.'] },
    ],
  },
  guidesPage: {
    title: 'Guides & Tips for Every Mini App | Melgene Apps',
    description: 'How to play, tips and background for Melgene mini games, personality tests and tools. Read a short guide, then jump straight into the app.',
    h1: 'Guides & tips',
    lead: 'Each guide explains how a mini app works, how to get better at it and a few things worth knowing before you start. No spoilers: questions and results stay a surprise.',
    read: 'Read the guide',
    play: 'Play',
    empty: 'Guides are on their way. Check back soon!',
  },
};
