module.exports = {
  metaTitle: 'Bingo Caller Guide: How to Host Bingo, 75 vs 90 Ball',
  description: 'How to run a bingo game with an online bingo caller: setting up 75-ball, 90-ball or a custom range, hosting tips for office and family parties, and why a fair random draw matters.',
  h1: 'How to call bingo at a party with an online bingo caller',
  updated: '2026-11-07',
  intro: 'Bingo is one of the few games that works for every age at the same table. Grandparents, children and coworkers who barely know each other can all play, because the rules fit in one sentence: mark the numbers that are called and shout when you complete a line or a full card. The only thing a group really needs is someone to draw the numbers, and that is what this app does. It replaces the cage, the balls and the paper list with one screen that shows a big number, the last few calls and every number drawn so far. This guide explains how to use it, how 75-ball and 90-ball bingo differ, how to host a smooth game at a year-end party, and how the app keeps the draw fair.',
  sections: [
    {
      h: 'How to use this bingo caller',
      p: [
        'First choose the kind of bingo your cards are made for. Pick 75-ball for cards with five columns headed B, I, N, G and O, pick 90-ball for tickets with numbers from 1 to 90, or pick Custom range and type the first and last number yourself. A custom range of 1 to 30 is handy for small children, and a range that matches homemade cards is useful for school or club events. Then press the start button.',
        'On the calling screen, press Draw to call a number. The ball rolls for a moment and then stops on the new number, which is shown in large type together with its letter in 75-ball games. The five previous numbers sit underneath, and the board at the bottom lights up every number that has been called, so players who missed a call can check it at a glance. If you press Draw by mistake, Undo puts the last number back. When someone shouts bingo, use the board to check their card, then keep going or press Finish to see a short summary.',
      ],
      list: [
        'Choose 75-ball, 90-ball or Custom range.',
        'Press Draw for each new number, or switch on Auto draw.',
        'Check winning cards against the board of called numbers.',
        'Use Undo if a number was drawn by accident.',
        'Press Finish to see how many numbers were called and how long the game lasted.',
      ],
    },
    {
      h: '75-ball and 90-ball bingo: what is the difference?',
      p: [
        '75-ball bingo is the version most people in North America, Japan, Korea and Brazil know. Each card is a five by five grid. The columns are labelled B, I, N, G and O, and every letter covers fifteen numbers: B holds 1 to 15, I holds 16 to 30, N holds 31 to 45, G holds 46 to 60 and O holds 61 to 75. The centre square is usually a free space. Because the letter tells players which column to look at, callers announce numbers as “B 7” or “O 64”, and this app shows the letter on the ball for the same reason.',
        '90-ball bingo is the traditional game in the United Kingdom and much of Europe, and it is close to the family lotto games played in Italy, France and Russia. Tickets have three rows and nine columns, and each row holds five numbers. Players usually win in stages: first one line, then two lines, then a full house. Games take a little longer because there are more numbers, so it suits relaxed evenings. If your cards use some other layout, the custom range makes the caller fit them instead of the other way round.',
      ],
    },
    {
      h: 'Hosting tips for year-end and office parties',
      p: [
        'A bingo game at a company year-end party, a family gathering or a school event goes best when the host prepares a few things in advance. Decide the prizes and the winning patterns before you start and say them out loud, because arguments about whether a diagonal counts are the most common way a game loses its energy. Keep the rhythm steady: a new number every five seconds or so feels lively without leaving anyone behind.',
      ],
      list: [
        'Print or hand out cards before the first draw, and keep a few spares.',
        'Announce the winning patterns and prizes clearly at the start.',
        'Put the calling screen on a TV or projector so the room can see it.',
        'Use Auto draw at 5 or 8 seconds for mixed ages, 3 seconds for fast rounds.',
        'Check every winning card against the board before handing out a prize.',
        'Plan a few small prizes for near misses to keep the whole room involved.',
      ],
    },
    {
      h: 'Is the draw really random and fair?',
      p: [
        'Each time you press Draw, the app looks at the numbers that have not come up yet and picks one with your browser’s cryptographic random number generator, the same kind of randomness used for security keys. It also uses a method called rejection sampling, which throws away the rare random values that would make some numbers slightly more likely than others. As a result every remaining number has exactly the same chance on every draw, and a number that has already been called can never appear again in the same game. If you drew all the numbers, you would get every number exactly once in a shuffled order.',
        'The app does not decide the order in advance, so there is no hidden list on the device that someone could peek at. The short rolling animation is only for show: the number is chosen first, and the animation never changes the result. If you prefer reduced motion in your device settings, the number simply appears straight away.',
      ],
    },
    {
      h: 'Showing it on a big screen and other handy features',
      p: [
        'For a room full of people, open the app on a laptop connected to a TV or projector and use the full-screen button, which hides the browser bars and the title bar and makes the ball even bigger. The game is saved on the device as you play, so an accidental refresh or a closed tab does not lose the numbers already called. Read aloud announces each number in your language when your device has a matching voice, and the sound option plays a short chime, both switched off by default. A keyboard or presentation clicker also works: space, Enter, the right arrow key and Page Down all draw the next number.',
      ],
    },
  ],
  cta: 'Start calling bingo numbers',
};
