/* Past Life Quiz — English (site root /, default + x-default)
 * Same 16 archetype ids and question/choice order as data.js (scoring weights live only there).
 * Korean-history archetypes get a one-line explanation so the joke lands for global readers.
 * Keys ending in Html are inserted as raw HTML; privacy.sections bodies are HTML too.
 * No spoilers: meta/landing/seo copy never names a result type or quotes a question.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Past Life Test: Who Were You in a Past Life?',
    description: 'Free past life test: answer 12 quick questions about your everyday habits and find out who you were in a past life. No install, no sign-up, just 2 minutes.',
    ogTitle: 'Past Life Test — Who were you in a past life?',
    ogDescription: 'A free 2-minute past life test: 12 everyday questions, 16 possible past lives. Who were you?',
  },
  siteName: 'Past Life Test',
  landing: {
    badge: '🔮 More fun than your horoscope',
    h1Kicker: 'Past Life Test',
    h1Html: 'Who were you<br>in a <em>past life</em>?',
    hookHtml: 'Twelve questions. Two minutes.<br>Then meet the you that you forgot.',
    metaTime: '⏱️ 2 minutes',
    metaResults: '📜 16 past lives',
    start: 'Reveal my past life →',
    backAria: 'Previous question',
    loading: 'Dusting off your past-life memories…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'How does the past life quiz work?', a: 'Each of your 12 answers adds points to a few past lives, and the one with the most points is yours. Every language version uses exactly the same scoring.' },
    { q: 'Is it accurate?', a: 'It’s for fun, not fortune-telling — a playful mirror of your everyday habits. That said, plenty of people find their result uncannily relatable.' },
    { q: 'Can I get a different result?', a: 'Yes. Your result depends only on your answers, so answering differently can lead you to a different past life.' },
    { q: 'Are my answers saved?', a: 'No. Your answers are scored right in your browser and are never sent or stored. No sign-up needed.' },
  ],
  privacyLink: 'Privacy Policy',
  result: {
    title: 'Past Life Test: {name}',
    shareText: 'My past life: {name} {emoji} — "{tagline}." Who were you?',
    ctaStrong: 'A friend sent you their past-life result',
    ctaSub: 'Curious who you were? It takes 2 minutes.',
    eyebrow: 'In a past life, you were',
    adviceLabel: 'Advice for this life —',
    good: 'Past-life soulmate',
    bad: 'Past-life nemesis',
    retry: 'Take the quiz again',
  },
  og: {
    eyebrow: 'In a past life, you were',
    brand: '🔮 Past Life Test',
    defaultTitle: 'Past Life Test',
    defaultDesc: '12 questions, 2 minutes. Who were you in a past life?',
  },
  privacy: {
    description: 'Privacy Policy for Past Life Quiz — how we use cookies, advertising, and analytics.',
    h1: 'Privacy Policy',
    introHtml: 'Past Life Quiz (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. Your quiz answers are processed only inside your browser and are never stored on our servers. Some information may be collected automatically while you use the Service, as described below.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Analytics (Google Analytics)', 'The Service may use Google Analytics (GA4) to understand visitor numbers and traffic sources so we can improve it. This data is used only for statistics and does not identify you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of January 1, 2026.'],
    ],
    back: '← Back to Past Life Quiz',
  },

  types: {
    sura: {
      name: 'Head Chef of the Korean Royal Kitchen',
      tagline: 'One pinch of salt could change the King\'s mood',
      story: 'In the royal kitchen of Korea\'s Joseon Dynasty — yes, the one from the K-drama "Jewel in the Palace" — the King\'s mood for the day was decided at your fingertips. More important than "too salty or too bland?" was "who is this meal really for?", and you always figured that out first. You ran dozens of kitchen maids like clockwork, yet never shared a single recipe with anyone. A perfectionist to the core: serving the best royal table of the day was your entire sense of pride.',
      traits: ['The food and the vibe both have to be perfect', 'Lets results do the talking, not gossip', 'Throws the pantry wide open for their people'],
      advice: 'It\'s okay to over-season now and then. Everyone will forgive you.',
    },
    celadon: {
      name: 'Master Celadon Potter of Goryeo',
      tagline: 'Fired a thousand vases, smashed most of them on principle',
      story: 'You stayed up all night by the kiln, determined to recreate the legendary jade-green glaze of Korea\'s Goryeo Dynasty — a color so prized that visiting Chinese envoys wrote home about it. If the shade was even slightly off, you reached for the hammer without a second thought, while your apprentices tiptoed around standards they couldn\'t quite understand. To you, a celadon vase wasn\'t a dish; it was a piece of the sky. Your failures far outnumbered your finished works, but what the world remembers is the masterpieces.',
      traits: ['Standards: high. Way too high.', 'Slow, but finishes things properly', 'Quietly, extremely stubborn'],
      advice: 'Stopping at attempt ninety-nine can still be beautiful.',
    },
    hwarang: {
      name: 'Hwarang Knight of Silla',
      tagline: 'Olympic-level looks and skills, back in the 6th century',
      story: 'Top of the class in swordsmanship and scholarship — and wildly popular to boot. You were the ace of the Hwarang, the elite "flower knights" of ancient Korea\'s Silla kingdom. Even while roaming mountains and rivers to train body and mind, a crowd of secret admirers was always cheering you on from somewhere. You valued honor above life itself and found winning dirty more shameful than losing. On the battlefield or in the marketplace, your name was always the talk of the town.',
      traits: ['Ends up the center of attention wherever you go', 'Treats honor and principles as sacred', 'Gets a whole different look in your eyes when there\'s competition'],
      advice: 'Having fun together pays off just as much as winning.',
    },
    viking: {
      name: 'Viking Navigator',
      tagline: 'If it wasn\'t on the map, you wanted to go even more',
      story: 'Steering your longship into the North Sea fog, "dangerous" just meant "sounds fun." For the thrill of spotting a coastline no map had ever shown, a storm or two was a fair price. Settling down? Never — you were always more curious about the next voyage. Your crew got nervous, but they followed you anyway. After all, you always made it back alive.',
      traits: ['Your eyes light up at anything new', 'Weirdly calm in a crisis', 'Staying in one place too long makes you restless'],
      advice: 'Sometimes it\'s fine to drop anchor and actually enjoy where you are.',
    },
    pharaoh_cat: {
      name: 'The Pharaoh\'s Cat',
      tagline: 'Worshipped as a god, spent the whole day napping',
      story: 'In the palaces of ancient Egypt, you were a cat revered as divine. Did you do anything in particular? No. You simply sat in the best patch of sunlight and watched the humans worship you of their own accord. But the second you looked even slightly annoyed, the entire palace panicked — though nobody likes to talk about that. You seemed to do nothing at all, yet your sheer presence kept everything under control.',
      traits: ['Observes elegantly, moves minimally', 'Can reset the mood of a room with one look', 'A genius at dodging chores'],
      advice: 'Even gods get more respect when they show up in person once in a while.',
    },
    renaissance: {
      name: 'Renaissance Painter\'s Apprentice',
      tagline: 'Got caught being talented while mixing paint',
      story: 'In a Florentine workshop, you ground pigments and washed brushes in the shadow of a great master. Then one day, while the master was out, you filled in a corner of the background — and it turned out to be the most natural part of the whole painting. You built your skills quietly, so nobody noticed, but surely. Tucked into the tip of your brush was a dream: one day, a painting with your own name on it.',
      traits: ['An unusually sharp eye for detail', 'Quietly excellent, no fanfare needed', 'Taste so strong you can\'t let "good enough" slide'],
      advice: 'Your skills are ready. Time to start signing your own name.',
    },
    jeongi: {
      name: 'Star Storyteller of Old Seoul',
      tagline: 'Mastered the cliffhanger 200 years before Netflix',
      story: 'In the markets of old Seoul, people dropped everything when you showed up. You were a jeon-gi-su, a professional storyteller who read popular novels aloud to the crowd. Your signature move: stopping dead at the most suspenseful moment and waiting for the coins to rain down before you\'d continue. Truth be told, half the story was improvised on the spot, but it was so convincing nobody ever noticed. In your hands, even the neighbors\' gossip became an epic.',
      traits: ['A gift for embellishing any story', 'Impeccable timing and room-reading', 'Knows exactly how to draw a crowd'],
      advice: 'Sometimes you can just tell people how it ends.',
    },
    silkroad: {
      name: 'Silk Road Caravan Merchant',
      tagline: 'Every border crossed meant more friends',
      story: 'Crossing deserts and snowy mountain passes with silk and spices, foreign languages were never a problem for you — a few gestures and a grin, and the deal was done. Every oasis town had a friend waiting to welcome you, and that network was your greatest asset. You left behind people, not just goods: a born globetrotter and the ultimate social butterfly.',
      traits: ['Makes friends anywhere, fast', 'Gets a good deal without losing the warmth', 'Adapts to new cultures in no time'],
      advice: 'Sometimes it\'s okay to accept a gift without haggling.',
    },
    monk_scribe: {
      name: 'Medieval Monastery Scribe',
      tagline: 'Copied by candlelight without a single typo',
      story: 'In a medieval European monastery, your job was copying scripture onto parchment all day long. Totally absorbed, never glancing sideways — and yet you secretly doodled ridiculous little drawings in the margins. Where others saw endless repetition, you found your own rhythm and calm. (True story: real medieval manuscripts are full of marginal doodles, like knights battling giant snails.)',
      traits: ['Once you focus, the world disappears', 'Quiet on the outside, hilarious on the inside', 'Can\'t let even a tiny mistake slide'],
      advice: 'Close the book and get some fresh air. The world won\'t fall apart.',
    },
    pirate_cook: {
      name: 'Pirate Ship Cook',
      tagline: 'Never drew a sword, still ran the ship',
      story: 'You never fought once, yet on that ship your word was law — if the crew didn\'t like tonight\'s menu, even the roughest pirates minded their manners around you. You were the one gentle soul among hardened sailors, and on bad days they\'d drift into the galley for a little comfort. Rough around the edges but better at taking care of people than anyone: the real power behind the captain.',
      traits: ['Shows love through actions — especially feeding people', 'Fits right in, even in rough crowds', 'Surprisingly soft-hearted and caring'],
      advice: 'Stop only looking after everyone else. Let someone look after you.',
    },
    amhaeng: {
      name: 'Undercover Royal Inspector of Joseon',
      tagline: 'Hid the King\'s badge under a beggar\'s rags',
      story: 'You shuffled through the markets in rags, but up your sleeve was the mapae — the royal horse badge that proved you were the King\'s secret inspector, sent to catch corrupt officials. Three sentences from a crooked magistrate and you could smell the lie; at the decisive moment, you\'d reveal who you really were and flip the whole situation. Seeing the truth while everyone else was fooled by appearances? That was the thrill. Armed with nothing but a sense of justice, you roamed the country as Joseon\'s undercover fixer.',
      traits: ['Spots lies with uncanny accuracy', 'Looks past appearances to what\'s real', 'Once you know you\'re right, you see it through'],
      advice: 'Not everyone is hiding something. Sometimes, just trust people.',
    },
    gladiator: {
      name: 'Roman Gladiator',
      tagline: 'Colosseum superstar, secretly a total scaredy-cat',
      story: 'The moment you stepped into the Colosseum, the crowd chanted your name. Behind that charismatic face was someone whose knees shook every single time — but nobody ever noticed. "Win this one, then I\'ll retire and open a little tavern," you\'d tell yourself… and then pick up the sword again. Terrified but always stepping into the arena anyway: a star with seriously surprising charm.',
      traits: ['Hides nerves like a pro', 'Your presence explodes the moment you\'re on stage', 'Secretly holds onto humble little dreams'],
      advice: 'Admitting you\'re scared won\'t make anyone respect you less.',
    },
    teahouse: {
      name: 'Qing Dynasty Teahouse Owner',
      tagline: 'Could guess your troubles from your face alone',
      story: 'In a back alley of Qing-era China, your teahouse was never empty. More famous than the tea was your intuition: the moment a customer sat down, you already had a pretty good idea of how their day had gone. Rumors, heart-to-hearts, life advice — it all started in that little teahouse. You never pushed; you just poured a cup, and somehow people already felt better.',
      traits: ['Reads the room in seconds', 'Calm and unhurried, whatever happens', 'People naturally open up to you'],
      advice: 'For once, skip everyone else\'s problems and talk about yours.',
    },
    ninja_mailman: {
      name: 'Edo-Era Ninja (Actually a Mailman)',
      tagline: 'Moved like a shadow, never lost a single letter',
      story: 'You were a real, rigorously trained ninja — but your actual mission was secretly delivering letters. All that roof-leaping, wall-scaling talent went into one thing: delivering precisely and never, ever late. Everyone imagined thrilling missions, but you lived each day with the humble pride of on-time delivery. Turns out the most trustworthy person around was you.',
      traits: ['Always gets the job done, precisely and perfectly', 'Earns respect through consistency, not flash', 'Has a sneaky, unexpected sense of humor'],
      advice: 'Stop hiding those skills. Go ahead and show off a little.',
    },
    atlantis: {
      name: 'Lighthouse Keeper of Atlantis',
      tagline: 'Kept the light burning as the city sank',
      story: 'In the legendary city of Atlantis, on the night the waves kept rising, you kept the lighthouse burning. Amid the terror of a sinking city, you were the one person who stayed steady and held your post. Because of you, the last few ships made it safely out of the harbor. Not flashy — but the kind of presence someone, somewhere, absolutely needs.',
      traits: ['The bigger the crisis, the calmer you get', 'Has the quiet strength to hold the line', 'Thinks far more deeply than you let on'],
      advice: 'It\'s okay to lean on someone else\'s light sometimes.',
    },
    balhae: {
      name: 'Mounted Archer of Balhae',
      tagline: 'Never missed — even at full gallop',
      story: 'Charging through the icy winds of the north — the frontier of Balhae, an ancient kingdom in Manchuria — your bow never wavered. You practiced countless times for that one moment: hitting the target dead-center from a horse at full speed. Loyal to your unit above all, you always rode out in front, and your comrades followed without hesitation. Speed and precision at the same time: a rare combination.',
      traits: ['Stays accurate even when everything moves fast', 'Fiercely loyal to your crew', 'Once there\'s a goal, you go straight for it'],
      advice: 'Sometimes it\'s fine to just ride, no target in sight.',
    },
  },

  questions: [
    {
      q: 'At a get-together with friends, you usually…',
      choices: [
        'Decide what everyone\'s eating first. The menu sets the mood.',
        'Sit in a corner and quietly watch what\'s going on.',
        'Naturally become the life of the party.',
        'Keep an eye out for new places and new faces.',
      ],
    },
    {
      q: 'When something unexpected goes wrong, you…',
      choices: [
        'Yawn first. Someone will sort it out eventually.',
        'Quietly dig in on your own until you find the cause.',
        'Turn it into a hilarious story to tell later.',
      ],
    },
    {
      q: 'When planning a trip, you…',
      choices: [
        'Tick off as many countries as humanly possible.',
        'Make it your goal to befriend the locals.',
        'Plan the entire route around food.',
      ],
    },
    {
      q: 'A friend tells you they\'ve been treated unfairly. You…',
      choices: [
        'Say, "Okay, let\'s gather evidence first."',
        'Move fast and go check it out right away.',
        'Sit them down, make some tea, and listen.',
        'Quietly help out behind the scenes.',
      ],
    },
    {
      q: 'The deadline is looming and you\'ve got zero ideas. You…',
      choices: [
        'Turn off the lights and zone out — then it suddenly hits you.',
        'Crank out a bunch of quick drafts and pick the best one.',
        'Gather every material and reference perfectly before starting.',
      ],
    },
    {
      q: 'When you shop, you…',
      choices: [
        'Keep going back until you find the one that\'s just right.',
        'Buy it now. Regret it later.',
      ],
    },
    {
      q: 'Your role in a group project?',
      choices: [
        'Set the direction and push everyone forward.',
        'Quietly finish your part to perfection.',
        'Handle the details and the final polish.',
      ],
    },
    {
      q: 'If you posted something on social media, it\'d be…',
      choices: [
        'A really good photo of me.',
        'Stories about the fascinating people I met while traveling.',
        'One line from a book I read today.',
        'A photo of the dish I just cooked.',
      ],
    },
    {
      q: 'Someone comes to you for advice. You…',
      choices: [
        'Start by laying out the facts.',
        'Get angry right alongside them.',
        'Listen quietly and comfort them.',
      ],
    },
    {
      q: 'When you learn something new, your style is…',
      choices: [
        'Follow the manual step by step, no mistakes.',
        'Quietly observe and figure it out on your own first.',
        'Jump right in and get a feel for it.',
      ],
    },
    {
      q: 'You\'re running late to meet someone. You…',
      choices: [
        'Already late, so you stroll in and grab a seat first.',
        'Calculate the exact route for a perfectly timed arrival.',
        'Show up late, but make an entrance.',
        'Try a totally new route while you\'re at it.',
      ],
    },
    {
      q: 'Sum up your day in one sentence:',
      choices: [
        'Dodged every annoying task. Perfect day.',
        'Found a little beauty in something small.',
        'Wait till you hear what happened today.',
      ],
    },
  ],
};
