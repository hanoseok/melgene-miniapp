module.exports = {
  metaTitle: "Lotto Number Generator Guide: Random Numbers Explained",
  description: "How the lotto number generator works, whether its numbers are truly random, the maths behind lottery combinations, and how to use it responsibly for fun.",
  h1: "Lotto Number Generator: how random lottery numbers really work",
  updated: "2026-10-09",
  intro: "The lotto number generator picks sets of numbers for Korea 6/45, a Euro-style game, US Powerball or a range you choose, and rolls them out of a drawing machine on screen. It is made for fun only. This guide explains how to use it, why its numbers are random in a precise sense, what the mathematics of lottery combinations looks like, creative uses beyond the lottery, and how to play responsibly.",
  sections: [
    {
      h: "How the generator works",
      p: [
        "You start by choosing a game. Korea 6/45 draws six numbers from 1 to 45. The Euro-style game draws five numbers from 1 to 50 plus two stars from 1 to 12. US Powerball draws five numbers from 1 to 69 plus one Powerball from 1 to 26. A custom game lets you set the highest number, up to 100, and how many numbers to draw, up to ten. Then you choose how many games to produce, from one to five.",
        "Before you draw, you may add numbers to keep and numbers to skip. Kept numbers appear in every game and the remaining numbers are drawn around them; skipped numbers never appear. These two settings apply to the main numbers only, not to the stars or the Powerball. When you press the draw button the numbers are chosen first, then the balls tumble in the machine and roll out one at a time, and finally every game is shown sorted from low to high. Ball colours follow the familiar Korean ranges, and a copy button puts the result on your clipboard."
      ],
      list: [
        "Choose Korea 6/45, Euro-style, US Powerball or a custom range.",
        "Choose how many games to draw, from 1 to 5.",
        "Optionally list numbers to keep and numbers to skip, separated by commas.",
        "Press the draw button and watch the balls roll out.",
        "Copy the numbers, draw again, or go back to the settings."
      ]
    },
    {
      h: "Are the numbers really random?",
      p: [
        "The generator uses your browser’s cryptographic random source, the same kind of randomness used to create security keys. Drawing a whole number from a range sounds easy, but a careless method can favour some numbers. For example, if you take a large random value and use the remainder after dividing by 45, the smaller remainders come up slightly more often. To avoid this, the tool throws away the few random values that would cause that imbalance and tries again, a technique called rejection sampling.",
        "Numbers are then picked without repeats using a partial shuffle, so each remaining number has the same chance at each step. The rolling-ball animation plays after the result is already decided and has no influence on it. This is why every allowed number is equally likely, and why the tool cannot be steered by timing or by tapping the button in a particular way."
      ]
    },
    {
      h: "The maths of lottery combinations",
      p: [
        "A lottery is a counting problem. In a 6/45 game there are 8,145,060 different sets of six numbers. In a 5/50 plus 2/12 game there are 2,118,760 ways to choose the five main numbers and 66 ways to choose the two stars, which gives 139,838,160 combinations in total. In a 5/69 plus 1/26 game there are 11,238,513 ways to choose the five numbers and 26 choices for the Powerball, giving 292,201,338 combinations. The more combinations there are, the less any single ticket stands for.",
        "Every combination is exactly as likely as every other, including 1, 2, 3, 4, 5, 6. Past results do not change future draws, so there are no hot or cold numbers, and keeping or skipping numbers does not change anything about the chances. One genuine difference is how many other players choose the same numbers. Many people pick birthdays, so combinations made only of small numbers are probably shared more often if they win, but that is about sharing a prize, not about winning."
      ]
    },
    {
      h: "Ways to use the generator",
      p: [
        "A fair, quick random picker is useful well beyond the lottery. The custom mode makes it a small toolbox for anything that needs unbiased numbers."
      ],
      list: [
        "Pick lucky numbers for fun, keeping a birthday or anniversary number in every game.",
        "Draw winners for a raffle or giveaway by numbering the entries and drawing one number.",
        "Create bingo-style number sets or draw a number from 1 to 100 for a party game.",
        "Settle who goes first, choosing a seat number or a team number.",
        "Teach probability in a classroom by comparing many draws."
      ]
    },
    {
      h: "Playing responsibly and your privacy",
      p: [
        "This tool is not a lottery operator, cannot sell tickets and cannot predict or improve your chances of winning. If you buy tickets, treat the cost as entertainment spending: set a budget in advance, only buy from licensed operators, respect the minimum age rules where you live, and stop if it stops being fun. If gambling is causing you trouble, please contact a local support service.",
        "The numbers you type and the numbers drawn are processed in your browser and are not sent to our server. Nothing about your games is stored. The page may remember basic preferences such as your language. Use the copy button if you want to keep a result."
      ]
    }
  ],
  cta: "Draw my numbers"
};
