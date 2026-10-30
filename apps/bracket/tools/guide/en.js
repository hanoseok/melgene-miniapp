module.exports = {
  metaTitle: 'Tournament Bracket Guide: Byes, Seeding & Fair Draws',
  description: 'How single-elimination brackets work, what byes and seeding mean, how to run a bracket for game nights, the office, sports or an ideal-type world cup, and why a random draw is fair.',
  h1: 'Tournament brackets: how single elimination, byes and seeding work',
  updated: '2026-10-30',
  intro: 'A tournament bracket is the simplest way to turn a long list into one winner. Two entries meet, one goes through, and the field halves every round until a single champion is left. This guide explains how a single-elimination bracket is built, why some entries get a bye, what seeding means, how to use a bracket for game nights, office contests, sports or a playful ideal-type world cup, and why a properly random draw is the fairest place to start.',
  sections: [
    {
      h: 'How a single-elimination bracket works',
      p: [
        'In single elimination every match has exactly one winner and one loser, and the loser is out. With 8 entries you play 4 quarterfinals, 2 semifinals and 1 final. A neat rule falls out of this: because every match knocks out exactly one entry, a bracket with n entries always needs n − 1 matches to find a champion. Sixteen entries take 15 matches, 64 entries take 63.',
        'The round names count down from the end. The final has 2 entries left, the semifinals 4, the quarterfinals 8, and earlier rounds are usually called the round of 16, round of 32 and so on. In this app you can either pick winners yourself, two cards at a time, or just draw the bracket and tap winners later when real matches are played.',
      ],
      list: [
        'Type 2 to 64 names or items, one per line.',
        'Choose a random draw or keep your own order as the seeding.',
        'Pick winners match by match, or just draw the bracket.',
        'Undo a pick or tap a different name if you change your mind.',
        'Save the finished bracket as a PNG, copy it as text or share a link.',
      ],
    },
    {
      h: 'Byes: what happens when the numbers do not fit',
      p: [
        'A bracket only splits cleanly in halves when the number of places is a power of two: 2, 4, 8, 16, 32 or 64. Real groups rarely are. With 6 players the bracket still has 8 places, so two places stay empty. The entries placed against an empty place get a bye, which means they move to the next round without playing.',
        'Byes should be spread out, not bunched together. A good bracket never puts two empty places against each other, and it divides byes as evenly as possible between the top and bottom halves so neither side of the draw has an easier path. This app places byes using the standard seeding pattern, which does exactly that, and it never counts a bye as a match.',
      ],
    },
    {
      h: 'Seeding: random draw or your own order',
      p: [
        'Seeding decides where each entry starts. In sports, organisers rank the entries and place them so the strongest meet as late as possible: seed 1 plays the lowest seed first, seed 2 is put in the opposite half, and so on. If you keep your own order in this app, your list becomes the seeding. The first line is seed 1, the second is seed 2, and the top seeds receive any byes first.',
        'When nobody should have an advantage, use a random draw. It is the right choice for games nights, raffles, a list of snacks or films, or any group where you do not want to be accused of rigging the matchups.',
      ],
    },
    {
      h: 'Why the random draw is fair',
      p: [
        'A random draw is only fair if every possible order is equally likely. Many quick tools shuffle with a weak random function or a sorting trick that quietly favours some positions. This app uses the browser’s cryptographic random generator and a Fisher–Yates shuffle with rejection sampling, which removes the tiny bias that appears when random numbers are squeezed into a smaller range. The result is that every arrangement of your list has exactly the same chance, and nobody, not even the person holding the phone, chooses who meets whom.',
        'Fairness also means the bracket stays consistent. If you change a winner in an early round, every later result that depended on that match is cleared, so a name can never appear in a round it did not reach.',
      ],
    },
    {
      h: 'Ideas: game nights, the office, sports and ideal-type world cups',
      p: [
        'For a games night, put everyone’s name in, draw the bracket and play real rounds of table tennis, a video game or rock paper scissors, tapping each winner as you go. At the office, a bracket is a light way to vote on a team lunch, a project name or the best mug in the kitchen. Coaches and club organisers can draw a knockout cup for a small league, save the bracket as an image and post it in the group chat.',
        'In Korea the same format is famous as the ideal-type world cup, where you pick your favourite out of two, round after round, until one choice is left. Try it with foods, songs, travel destinations or anything you cannot decide on. The final pick often surprises people, which is half the fun. When you are done, share a link so friends can see your whole path to the champion.',
      ],
    },
  ],
  cta: 'Make a tournament bracket now',
};
