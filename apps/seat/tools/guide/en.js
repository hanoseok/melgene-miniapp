module.exports = {
  metaTitle: 'Random Seating Chart Guide: Fair Seats, Rules & Tips',
  description: 'How teachers use a random seating chart: setting up the room, keeping students apart, front-row and fixed seats, how often to reshuffle and why names stay private.',
  h1: 'Random seating chart: how to make new seats fair for the whole class',
  updated: '2026-10-13',
  intro: 'Changing seats is one of the small rituals of a school year, and it is surprisingly easy to get wrong. If the teacher decides alone, someone always feels picked on. If students choose, the same friends cluster together and the quiet kids end up at the edges. A random seating chart solves both problems: the outcome is decided by chance, everyone can see that it was, and the teacher still controls the few rules that really matter. This guide walks through the tool, shows how teachers actually use random seating, explains the rules you can add, and covers what happens to the names you type.',
  sections: [
    {
      h: 'How to make a random seating chart',
      p: [
        'Start with the names. Paste your class list with one name per line, or separate names with commas. If you would rather not type names at all, enter a single number such as 28 and the chart will use seat numbers 1 to 28, which works well with class numbers or attendance numbers. Up to 100 names fit in one chart.',
        'Next, shape the room. Choose how many rows of desks you have and how many seats sit in each row. The map shows the room from the students’ point of view with the teacher’s desk at the top, so the first row on screen is the row closest to the front. Tap any seat to cross it out when it should stay empty, for example an aisle, a broken desk or the spot by the door. When everything looks like your classroom, press Shuffle and watch the seats turn over one by one, or skip the reveal if the bell is about to ring.',
      ],
      list: [
        'Paste names, or type how many students you have.',
        'Set the rows and the seats per row.',
        'Tap seats that must stay empty.',
        'Optionally add rules: keep apart, front rows or fixed seats.',
        'Shuffle, then save a PNG, copy the text table or copy the link.',
      ],
    },
    {
      h: 'How teachers use random seating',
      p: [
        'Most teachers reshuffle on a regular rhythm: every month, at the start of each term or whenever a new unit begins. A predictable schedule matters more than the exact interval, because students accept a seat they do not love much more easily when they know it is temporary and that the next draw is coming.',
        'Doing the shuffle in front of the class works best. Project the screen, let the seats flip one by one and the draw becomes a small event instead of a decision people argue about. Afterwards, save the chart as a PNG for your slides or printout, or copy it as a text table into a class newsletter or substitute plan.',
      ],
      list: [
        'New school year: mix students who do not know each other yet.',
        'Group work: seat students randomly, then turn neighbouring desks into teams.',
        'Exams: shuffle so that friends are not side by side.',
        'Substitute days: leave a printed chart so the cover teacher knows every name.',
      ],
    },
    {
      h: 'Rules: keep apart, front rows and fixed seats',
      p: [
        'Pure chance is fair, but a classroom has real needs. Under Seating rules you can add pairs to keep apart; those two students will never sit next to each other, not even diagonally. You can put students on the front-row list so they always land in the first two rows, which helps students with glasses, hearing aids or attention needs without singling them out. And you can pin a name to a specific seat, for example a student who needs to sit near the door or next to a support assistant.',
        'Use rules sparingly. Every rule takes a little randomness away, and in a full room too many rules can make a valid chart impossible. When that happens the tool tells you instead of quietly breaking a rule, and suggests removing a pair or a pin or adding seats. A good habit is to keep only the rules you would be comfortable explaining to the class.',
      ],
    },
    {
      h: 'Why the shuffle is fair',
      p: [
        'Every chart is drawn with your browser’s cryptographic random number generator, the same kind of randomness used for security keys. The tool uses rejection sampling to avoid tiny biases when turning random bits into seat numbers, and a Fisher–Yates shuffle, which gives every possible arrangement the same chance. When you add keep-apart pairs, the tool keeps drawing complete arrangements until one follows every rule, so all valid charts stay equally likely. Only in very tight rooms does it switch to a careful search to find a chart that works.',
        'The final chart is decided before the reveal starts. The flipping animation only shows a result that is already fixed, so pressing Skip changes nothing about who sits where.',
      ],
    },
    {
      h: 'Sharing the chart and keeping names private',
      p: [
        'The names you type never leave your browser. There is no account and nothing is uploaded to a server. Your last list and room layout are remembered on your own device so they are ready next time, and the Clear button removes them.',
        'When you copy the link, the names and the exact layout are written into the link itself. Anyone who opens it sees the same chart, marked as shared, and nothing is shuffled again, which makes it easy to send to a colleague or post in a class chat. Because the names travel inside the link, avoid posting links with full names in public places. First names, initials or seat numbers are usually enough.',
      ],
    },
  ],
  cta: 'Make a random seating chart now',
};
