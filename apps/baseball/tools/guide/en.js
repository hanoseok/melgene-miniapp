module.exports = {
  metaTitle: 'Bulls and Cows Guide: How to Play Number Baseball',
  description: 'How to play Bulls and Cows, also called Number Baseball: the rules, strikes and balls, reasoning tips, a short history and how the game relates to Mastermind.',
  h1: 'Bulls and Cows (Number Baseball): how to play and think it through',
  updated: '2026-10-18',
  intro: 'Bulls and Cows is a classic code-breaking game for one player: a secret number is hidden, you guess, and every guess earns a small clue. In many countries it is known as Number Baseball because the clues are called strikes, balls and outs. This guide explains the rules of the version on this site, how to read the clues, a few ways of thinking that make the puzzle easier, where the game comes from and how to enjoy it with friends.',
  sections: [
    {
      h: 'What Bulls and Cows is',
      p: [
        'The computer picks a secret number made of different digits. In the classic level it has 3 digits, and in the tougher level it has 4. A digit never appears twice, but zero is allowed, even at the start, so 072 is a perfectly good secret number. That gives 720 possible secrets with three digits and 5,040 with four, and each one is equally likely because the digits are shuffled with a fair random shuffle every round.',
        'Your job is to find the number using as few guesses as possible. After each guess you are told how close you were, but not which digits were right, and that is where the puzzle comes from. Nothing is timed unless you switch the timer on, and there is no hint button, so the whole game is about careful reasoning.',
      ],
    },
    {
      h: 'How a round works',
      p: [
        'Choose 3 or 4 digits on the start screen and press Start. Type a number of the same length with the on-screen keypad or your keyboard, then press Guess. Your guess must not repeat a digit, and a number you already tried is not counted again.',
      ],
      list: [
        'A strike means a digit is correct and in the right position.',
        'A ball means a digit is in the secret number but in a different position.',
        'An out means none of your digits appear in the secret number at all.',
        'You win when every digit is a strike. The result shows how many tries you needed.',
        'If you get stuck, press Give up twice to reveal the answer and start a fresh round. A given-up round does not count towards your records.',
      ],
    },
    {
      h: 'Ways of thinking that help',
      p: [
        'Beginners often guess at random and hope. A better habit is to treat every answer as a small fact and to write down what each fact rules out. Even a simple notebook, on paper or in your head, makes the puzzle feel far less like luck.',
      ],
      list: [
        'Add the strikes and the balls. That total tells you how many of your digits are in the secret number, wherever they sit.',
        'An out is very valuable. It removes every digit you used at once, so you never need to think about those again.',
        'Change only one or two things between guesses. If the clue changes, you know the swapped digit is the reason.',
        'Test positions separately from digits. Once you know a digit belongs, move it around to find where it sits.',
        'Make sure every guess could still be the answer. If a guess contradicts something you already learned, it cannot win and wastes a turn.',
        'Do not chase the first lucky strike. Check that it fits all the earlier clues before you build on it.',
      ],
    },
    {
      h: 'Where the game comes from',
      p: [
        'Bulls and Cows is an old pencil-and-paper game, usually played by two people who take turns being the code maker and the guesser. It is the ancestor of Mastermind, the board game with coloured pegs that was published in the early 1970s. A computer version called Moo was played on a university mainframe in Cambridge in that same decade, and the game has been a favourite of programmers ever since.',
        'The idea has travelled widely under local names. In Korea it is Number Baseball and the clues use baseball words, which is the version this page follows. In Japan it is often called Hit and Blow, in China it is 1A2B, and in languages such as Russian and Spanish the animal names bulls and cows are used. Computers have shown that every four-digit secret can be solved in at most seven guesses with perfect play, and a bit over five guesses on average, so a score near that is excellent for a person.',
      ],
    },
    {
      h: 'Playing with friends and tracking progress',
      p: [
        'The game is easy to turn into a friendly contest. Agree on the number of digits, everyone plays the same level a few times, and compare who needs the fewest tries. Because nothing is hidden except the secret number, you can also talk through your reasoning together after a round, which is a great way to learn new tricks.',
        'Your best result for each level is saved in this browser only. When you solve a round, your number of tries is compared with the real results of other players on the same level, and if there is nothing to compare with yet, the comparison is simply left out. Try to beat your own best, then try the four-digit level for a bigger challenge.',
      ],
    },
  ],
  cta: 'Play Bulls and Cows now',
};
