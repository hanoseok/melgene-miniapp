/* Which Monster Are You? — English (site root /, default + x-default)
 * Same 12 monster ids and question/choice order as monster-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as monster-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq never name a monster or quote a question.
 * Placeholders: {name} {emoji} {catch} {pct} {n} {total} — keep them as-is when translating.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = rounded display font stack for titles/buttons,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Which Monster Are You? Halloween Personality Test',
    description: 'Which monster are you? Take this free Halloween personality test: 10 spooky-cute questions, about one minute, no sign-up. Find the monster that matches your vibe.',
    ogTitle: 'Which Monster Are You? 🎃 Halloween Personality Test',
    ogDescription: 'A free, one-minute Halloween personality test. Answer 10 spooky-cute questions and meet your monster twin.',
  },
  siteName: 'Which Monster Are You?',
  privacyLink: 'Privacy Policy',

  start: {
    badge: '🎃 Halloween special',
    h1Kicker: 'Halloween Personality Test',
    h1Html: 'Which <em>monster</em><br>are you?',
    hook: 'One spooky night, ten little choices. Somewhere in the dark, a monster that’s just like you is waiting.',
    metaTime: '⏱️ About 1 minute',
    metaCount: '🦇 10 questions',
    start: 'Summon my monster →',
  },

  quiz: {
    backAria: 'Previous question',
    progressAria: 'Progress',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Summoning your monster…',
    sub: 'Stirring the cauldron',
  },

  result: {
    title: 'Which Monster Are You? I got {name}',
    eyebrow: 'The monster that matches you is',
    strengthsLabel: 'Monster powers',
    partyLabel: 'At a Halloween party, you’re…',
    bestLabel: 'Best buddy',
    rivalLabel: 'Friendly rival',
    sameShare: '{pct}% of players got this monster too',
    shareText: 'My Halloween monster is {name} {emoji} — “{catch}” Which monster are you?',
    ctaStrong: 'A friend sent you their monster',
    ctaSub: 'Which one are you? It takes a minute.',
    retry: 'Take the test again',
  },

  og: {
    eyebrow: 'My Halloween monster',
    brand: '🎃 Which Monster Are You?',
    defaultKicker: 'Halloween Personality Test',
    defaultTitle: 'Which monster are you?',
    defaultDesc: '10 spooky-cute questions · about 1 minute',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'How does the monster test work?', a: 'Each answer adds points to a few monsters, and the one with the most points is your match. Ties are settled by a fixed rule, so the same answers always give the same monster.' },
    { q: 'Is it scary?', a: 'Not at all. It’s a cute, family-friendly Halloween quiz — no gore and no jump scares, just a bit of spooky fun.' },
    { q: 'Can I get a different monster?', a: 'Yes. Your result depends only on your answers, so answering differently can summon a different monster.' },
    { q: 'Are my answers saved?', a: 'No. Your answers are scored in your browser and never stored. We only count which monster came up, anonymously, to show how common each result is.' },
  ],

  privacy: {
    title: 'Privacy Policy | Which Monster Are You?',
    description: 'Privacy Policy for Which Monster Are You? — how we use cookies, advertising and anonymous statistics.',
    h1: 'Privacy Policy',
    introHtml: 'Which Monster Are You? (the "Service") respects your privacy and processes only the minimum information necessary, as described below.',
    sections: [
      ['1. Information we collect', 'You can use the Service without signing up or logging in. Your answers are scored inside your browser and are never sent to or stored on our servers. We only count, anonymously, which monster type came up, so we can show how common each result is.'],
      ['2. Cookies and similar technologies', 'The Service may use cookies to show ads and to understand how the Service is used. You can refuse or delete cookies in your browser settings; some features may not work properly if you do.'],
      ['3. Advertising (Google AdSense)', 'The Service shows ads through Google AdSense. Google and its partners may use cookies to serve ads based on your previous visits to this and other websites. You can learn more and change your ad personalization settings in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistics', 'We keep anonymous daily totals (page views, completed tests, ratings) to improve the Service. These totals do not identify you personally.'],
      ['5. Contact', 'If you have any questions about this Privacy Policy, please contact the site operator.'],
      ['6. Effective date', 'This policy is effective as of September 27, 2026.'],
    ],
    back: '← Back to the monster test',
  },

  questions: [
    { q: 'A last-minute invite to a Halloween party pops up on your phone. First thought?', choices: [
      'What do I wear? It has to be iconic.',
      'Will there be food? Then I’m in.',
      'Hmm… who else is going?',
      'I’m bringing decorations. And a playlist.',
    ] },
    { q: 'Thirty minutes into the party. Where are you?', choices: [
      'Middle of the dance floor, limbs everywhere',
      'At the snack table. Plate number three.',
      'In a quiet corner, deep in one serious talk',
      'Somehow already friends with everyone',
    ] },
    { q: 'A scream echoes down a pitch-dark hallway. You…', choices: [
      'Scream even louder, then burst out laughing',
      'Charge toward it. Someone might need help!',
      'Freeze and quietly blend into the wall',
      'Calmly check the time. Probably a prank.',
    ] },
    { q: 'It’s midnight and you’re snacky. What do you reach for?', choices: [
      'Something red and fancy: cherry juice and dark chocolate',
      'Whatever’s in the fridge. All of it.',
      'Hot cocoa with my own secret blend of spices',
    ] },
    { q: 'Your costume strategy?', choices: [
      'Handmade. I’ve been building it since August.',
      'An old bedsheet with two eyeholes. Done.',
      'Wrap myself in whatever’s around. Toilet paper counts.',
      'A different look every hour. Keep them guessing.',
    ] },
    { q: 'Ding-dong! Trick-or-treaters at your door. You…', choices: [
      'Hand out full-size candy bars and hype every costume',
      'Pop out from behind the door with a (gentle) jump scare',
      'Lights off. Peek through the curtains. Nobody’s home.',
    ] },
    { q: 'How would your friends describe you?', choices: [
      'Looks intimidating, is actually a giant softie',
      'Always on time and weirdly calm about everything',
      'Does whatever they want and somehow gets away with it',
      'Mysterious. Has a remedy for literally everything',
    ] },
    { q: '3 a.m. The party is winding down. You’re…', choices: [
      'Just getting started. After-party at my place!',
      'Asleep on the couch. Since eleven.',
      'Packing leftovers into neatly labeled containers',
      'Fixing the speaker someone broke so the music goes on',
    ] },
    { q: 'You step outside and there’s a huge full moon. You feel…', choices: [
      'Wild. I need to run somewhere. Anywhere!',
      'Dreamy. Perfect night for a slow, silent wander.',
      'Cozy. Back inside: blanket, tea, old movie.',
      'Lucky. Quick, make a wish!',
    ] },
    { q: 'Pick your Halloween night motto.', choices: [
      'Dance like nobody’s watching. They’re all ghosts anyway.',
      'Nine lives, zero worries.',
      'Right on time, every time.',
      'There’s a spell for that.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampire',
      catch: 'Fashionably late, dramatically fabulous.',
      desc: 'You’re a creature of the night with impeccable taste — in outfits, in music, in snacks. People are drawn to you before you’ve said a word, and you know exactly how to make an entrance. You’d rather stay up until sunrise over a great conversation than go to bed early. Yes, you’re a little dramatic. That’s exactly why everyone loves you.',
      strengths: ['Magnetic charm', 'Flawless taste', 'Night-owl stamina'],
      party: 'The one who arrives last and instantly becomes the main event.',
    },
    werewolf: {
      name: 'Werewolf',
      catch: 'Loyal to the pack, wild at heart.',
      desc: 'You’ve got boundless energy and a heart the size of a full moon. Your friends are your pack, and you’d sprint across town at midnight if one of them needed you. You’re honest to a fault, hungry most of the time, and your moods are… let’s say lunar. When you’re in, you’re all in — and the whole room feels it.',
      strengths: ['Fierce loyalty', 'Endless energy', 'Honest (in a nice way)'],
      party: 'Leading the snack raid, then howling along to every single song.',
    },
    witch: {
      name: 'Witch',
      catch: 'Brews ideas, casts plans, never runs out of tricks.',
      desc: 'Curious, clever and a little mischievous — you always have a plan, a backup plan and a secret ingredient. You love collecting odd facts and turning them into something useful (or delightfully chaotic). Friends come to you for advice because your answers actually work. Independent to the core, you’d rather ride your own broom than wait for a lift.',
      strengths: ['Sharp problem-solving', 'Endless curiosity', 'A remedy for everything'],
      party: 'Mixing mysterious drinks in the kitchen and reading everyone’s fortune.',
    },
    ghost: {
      name: 'Ghost',
      catch: 'Quiet, gentle, and secretly the funniest one here.',
      desc: 'You float through life softly and notice everything everyone else misses. You’re not exactly shy — you just prefer a few real friends to a crowded room. When you do speak up, it’s a perfectly timed line that makes everyone laugh. You’re also a master of the quiet exit: here one second, peacefully home in bed the next.',
      strengths: ['Sharp observer', 'Deadpan timing', 'A calming presence'],
      party: 'Drifting between rooms, overhearing the best stories, then vanishing without a trace.',
    },
    zombie: {
      name: 'Zombie',
      catch: 'Slow, steady, and absolutely unbothered.',
      desc: 'Nothing rattles you. Deadlines, drama, chaos — you just shuffle forward at your own pace and somehow still get there. You run on snacks and naps, and you’re living proof that “chill” is a superpower. Friends love how easygoing you are; you’re up for anything as long as food is involved. Just don’t wake you before noon.',
      strengths: ['Unshakable calm', 'Goes with the flow', 'Surprisingly persistent'],
      party: 'On the couch with a plate in each hand, completely at peace.',
    },
    mummy: {
      name: 'Mummy',
      catch: 'An old soul wrapped in cozy layers.',
      desc: 'You love your home, your routines and your perfectly organized shelves. You keep things for years — ticket stubs, old photos, friendships — and you take good care of all of them. Some call you old-fashioned; you call it timeless. Under all those layers is a warm, loyal heart people can count on for centuries.',
      strengths: ['Rock-solid reliable', 'Beautifully organized', 'Keeps friends forever'],
      party: 'Wrapped in a blanket by the fire, telling the best stories from “back in the day.”',
    },
    frank: {
      name: 'Frankenstein’s Monster',
      catch: 'Big, gentle, and built with heart.',
      desc: 'You might look serious at first, but anyone who knows you knows you’re the kindest soul in the room. You’re a maker — you fix things, build things, and show love by doing rather than saying. Sometimes you feel a little misunderstood, but the friends who get you would do anything for you. It’s alive… and it’s adorable.',
      strengths: ['Handy with anything', 'Heart of gold', 'Steady and dependable'],
      party: 'Quietly fixing the lights, then slow-dancing awkwardly when the right song comes on.',
    },
    pumpkin: {
      name: 'Jack-o’-Lantern',
      catch: 'Glowing grin, instant good vibes.',
      desc: 'You light up every room — almost literally. Your optimism is contagious, your laugh is loud, and you’re usually the one who made the plans in the first place. You make people feel welcome and never forget a name. Even on the darkest night you find something to smile about, and you help everyone else find it too.',
      strengths: ['Contagious positivity', 'Born host', 'Makes everyone feel welcome'],
      party: 'The host, the hype, and the reason everyone showed up.',
    },
    blackcat: {
      name: 'Black Cat',
      catch: 'Mysterious, independent, impossibly cool.',
      desc: 'You do things your own way and look effortlessly cool doing it. You’re picky about who gets close, but once you choose someone, they have a friend for all nine lives. You love a good nap, a quiet spot and being left alone — until you suddenly want all the attention. Some say you’re bad luck. Your friends know you’re the lucky charm.',
      strengths: ['Effortless style', 'Sharp instincts', 'Choosy but loyal'],
      party: 'Perched on the best seat in the house, lovingly judging everyone.',
    },
    reaper: {
      name: 'Grim Reaper',
      catch: 'Calm, punctual, and never misses a deadline.',
      desc: 'You’re the calm in everyone’s storm. While others panic, you check the schedule, make a plan and get it done — right on time, every time. Your humor is so dry that people realize you were joking an hour later. The hood looks intimidating, but you’re actually the one making sure everyone gets home safe.',
      strengths: ['Cool under pressure', 'Perfect timing', 'Secretly caring'],
      party: 'Checking the time at 11:58, then very calmly announcing the last song.',
    },
    fox: {
      name: 'Nine-Tailed Fox',
      catch: 'A shapeshifter with a smile for every room.',
      desc: 'You fit in anywhere — the fancy dinner, the chaotic house party, the family reunion. You read people instantly and always know the right thing to say. Clever and playful, you love a good game and usually win it. Behind all those charming faces is someone fiercely loyal to the few who’ve seen your real tails.',
      strengths: ['Reads the room instantly', 'Quick wit', 'Adapts to anything'],
      party: 'Switching costumes twice and somehow becoming best friends with the host’s grandma.',
    },
    skeleton: {
      name: 'Skeleton',
      catch: 'Funny bone? You’re all funny bones.',
      desc: 'You don’t take life too seriously — and honestly, that’s your secret. You crack jokes at the worst moments, dance at the slightest excuse and can cheer anyone up in thirty seconds. You travel light and live simply: no drama, no fuss, just good vibes. People feel lighter around you, like they’ve dropped a few pounds of worry.',
      strengths: ['Instant mood-lifter', 'Fearlessly goofy', 'Refreshingly low-drama'],
      party: 'Rattling on the dance floor and starting a conga line nobody asked for.',
    },
  },
};
