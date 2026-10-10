module.exports = {
  metaTitle: 'Random Number Generator Guide: Raffles, Fairness & Tips',
  description: 'How to use the random number generator for raffles, giveaways and classrooms, what random really means, true vs pseudo-random numbers and how to run a fair draw.',
  h1: 'Random number generator: how to use it, and how to keep every draw fair',
  updated: '2026-10-11',
  intro: 'A random number generator looks like the simplest tool on the internet: you type two numbers and get a third. Yet people use it to pick prize winners, call on students, choose lottery-style numbers, sample survey answers and settle arguments, and in every one of those cases the result only matters if everyone trusts it. This guide shows how to use the generator, gives practical ideas for giveaways and classrooms, explains what random actually means, compares true and pseudo-random numbers, and finishes with simple habits that keep a draw honest.',
  sections: [
    {
      h: 'How to use the random number generator',
      p: [
        'Everything happens on one screen. Type the lowest number you want in From and the highest in To, or tap a quick range such as 1–10, 1–45 or 1–100. Both ends are included, so 1 to 10 can give you 1 or 10. Negative numbers work too, and each end can go as far as one billion in either direction.',
        'Next choose how many numbers to draw, from one up to a thousand. Leave Allow repeats off if each number may come up only once, which is what you want for raffle tickets or seat numbers. Turn on Sort results if you would rather read the numbers from smallest to largest. Under More options you can list numbers to skip, such as 13 or a whole run like 20-25, and give the draw a title. Press Draw and the digits roll like a slot machine before stopping on the result.',
      ],
      list: [
        'Set From and To, or tap a quick range.',
        'Choose how many numbers you need.',
        'Decide whether repeats are allowed and whether to sort.',
        'Optionally exclude numbers and name the draw.',
        'Press Draw, then copy the numbers or the result link.',
      ],
    },
    {
      h: 'Giveaways, raffles and classroom ideas',
      p: [
        'Most uses come down to giving each person or item a number and letting the generator choose. For an online giveaway, number the eligible comments or entries in the order they arrived, draw one number per prize with repeats off, and post the result link so followers can see the exact draw with its time and settings. A title such as October giveaway travels with the link.',
        'Teachers use random numbers to keep things fair and a little exciting. When every student has a class number, nobody can complain that the same person is always picked.',
      ],
      list: [
        'Raffle: match the range to the ticket numbers you sold and draw one winner per prize.',
        'Comment giveaway: number the valid entries, draw without repeats and share the result link.',
        'Classroom: pick who answers next, form random pairs or decide the order of presentations.',
        'Office: choose the secret gift partner order, the meeting note-taker or a lunch spot from a numbered list.',
        'Games and study: generate math practice numbers, pick a page to read or roll a custom-sized die.',
      ],
    },
    {
      h: 'What random really means',
      p: [
        'A draw is random when every allowed outcome has the same chance and no one can predict the next result, not the person pressing the button and not the person who wrote the code. Random does not mean evenly spread in the short run. If you draw from 1 to 10 a few times, repeats and streaks are normal, and seeing 7 twice in a row is exactly as likely as seeing 3 and then 8.',
        'People are famously bad at being random. Asked to pick a number from 1 to 10, many choose 7 and few choose 1 or 10, and when we try to write a random sequence we avoid repeats far more than chance would. That is why a generator is useful even for something as small as choosing who goes first: it removes the hidden patterns in human choices.',
      ],
    },
    {
      h: 'True random, pseudo-random and the crypto generator',
      p: [
        'Computers follow instructions, so they cannot invent randomness out of nothing. A pseudo-random generator starts from a seed value and uses a formula to produce a long sequence that looks random. Simple versions are fine for games but can be predictable, and some have subtle patterns. True random numbers come from physical noise, such as thermal noise in electronics or timing jitter in hardware.',
        'Modern browsers offer a cryptographically secure generator, crypto.getRandomValues, which is the one this tool uses. It is seeded by the operating system from hardware noise and designed so that past outputs do not reveal future ones, which is why it is also used for security keys. On top of that, the tool avoids a classic mistake called modulo bias: turning a large random value into a small range with a simple remainder gives some numbers a tiny extra chance. The generator rejects those leftover values and draws again, so every number in your range is exactly equally likely. For draws without repeats it uses a shuffling method that works even across a range of two billion numbers.',
      ],
    },
    {
      h: 'Tips for a fair and transparent draw',
      p: [
        'A fair tool is only half of a fair draw. The other half is setting it up so nobody can doubt the outcome later.',
      ],
      list: [
        'Announce the rules first: the range, how entries are numbered and how many winners there will be.',
        'Freeze the entry list before drawing, and keep a copy of who got which number.',
        'Draw once and keep the result. Redrawing until you like the answer defeats the purpose.',
        'Share the result link. It stores the numbers, settings and time, so viewers see the original draw instead of a new one.',
        'For a live audience, draw on a shared screen or stream so everyone watches the numbers land.',
        'Use exclusions only for numbers that are truly invalid, such as unsold tickets, and say so publicly.',
      ],
    },
  ],
  cta: 'Draw random numbers now',
};
