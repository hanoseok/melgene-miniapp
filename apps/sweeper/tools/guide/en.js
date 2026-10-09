module.exports = {
  metaTitle: 'Minesweeper Guide: How to Play, Tips and History',
  description: 'How to play Minesweeper online: reading the numbers, flagging mines, the chord move, tips for faster clears and a short history of the classic puzzle game.',
  h1: 'Minesweeper: how to play, read the numbers and clear faster',
  updated: '2026-10-10',
  intro: 'Minesweeper is a free logic puzzle: a grid of hidden squares, a handful of mines and one goal, which is to reveal every square that is not a mine. There is no luck needed once the board opens up, only careful reading of the numbers. This guide explains the rules, the controls on a phone and a computer, the habits that make clears faster and a little of the game\'s history.',
  sections: [
    {
      h: 'What Minesweeper is and how the rules work',
      p: [
        'Every square on the board starts covered. When you reveal a square, one of three things happens. If it hides a mine, the game is over. If it is safe and has mines among its eight neighbors, it shows a number from 1 to 8 that tells you exactly how many. If it is safe and has no mines around it at all, it shows as empty and the game automatically opens all the empty squares connected to it, which is why a single tap can uncover a large area.',
        'You win when every square that is not a mine has been revealed. Flags are only a note to yourself: they do not count toward winning, but they stop you from tapping a square you have already decided is dangerous, and they let the counter above the board show how many mines are still unmarked. Three levels are available here: Beginner is a small 9 by 9 board with 10 mines, Medium is 12 by 12 with 24 mines, and Expert is 14 by 14 with 40 mines.',
      ],
    },
    {
      h: 'Controls and a quick start',
      p: [
        'The board is built for thumbs. Squares are big enough to tap on a phone, and the whole game fits in a narrow screen without scrolling. Your first tap is always safe: the mines are placed only after that tap, never on the square you chose or on the squares touching it, so the game always opens at least a small area to give you something to work with.',
        'The clock starts with the first tap. If you switch to another tab or app, the clock pauses and the board is covered until you tap to return, so a quick interruption does not ruin a run.',
      ],
      list: [
        'Tap a covered square to reveal it.',
        'Press and hold a covered square for a moment to place or remove a flag. You can also switch the Dig / Flag button above the board to flag mode and tap instead.',
        'Tap a revealed number to use the chord move: if the number of flags around it matches the number, all remaining covered neighbors open at once.',
        'On a computer, right-click places a flag, and the arrow keys, Enter and the F key let you play without a mouse.',
        'The counter shows mines minus flags. It can go below zero if you place too many flags, which is a hint that at least one flag is wrong.',
      ],
    },
    {
      h: 'Strategy: turning numbers into certainty',
      p: [
        'Start with the simplest deductions. A 1 with exactly one covered neighbor means that neighbor is a mine. A number whose flags already match its value means every other covered neighbor is safe. These two rules solve most of a Beginner board and keep opening new numbers to reason about.',
        'When those run out, compare neighboring numbers. If a 1 touches three covered squares and a nearby 1 shares two of them, the mine must be in the shared pair, which means the third square of the first number is safe. Overlapping numbers are where most of the interesting logic lives, so work along the edge of the opened area and never guess while a certain move is still available.',
      ],
      list: [
        'Corner and edge squares have fewer neighbors, so their numbers give stronger clues.',
        'Flag a mine as soon as you are certain, then use the chord move to open the rest around it quickly.',
        'If you must guess, pick the square with the lowest chance of a mine, and prefer a guess that would open new information.',
        'Do not rush the beginning. Speed comes from fewer mistakes and fewer pauses, not from faster tapping.',
      ],
    },
    {
      h: 'A short history of Minesweeper',
      p: [
        'Puzzles about avoiding hidden mines were already around on home computers in the early 1980s, for example Mined-Out on the ZX Spectrum, where you walked across a field and had to work out where the mines were from the count of those next to you. The modern version, with a grid and numbered squares, took shape in the following years and became a standard in the early days of graphical computers.',
        'It became a worldwide habit when Microsoft shipped it with Windows. It is often said that Solitaire taught people to drag and drop, and that Minesweeper taught them to click precisely and to use the right mouse button. Whatever the reason, millions of people have spent coffee breaks on it, and entire communities compete for the fastest clears on the standard boards.',
      ],
    },
    {
      h: 'Times, friendly competition and privacy',
      p: [
        'When you clear a board you see your time, and your best time for each level is saved in your own browser only. If other players have finished the same level, you also see where your time sits among them as a percentage. These numbers are real totals from other games, and the comparison stays hidden when there is nothing to compare with yet.',
        'To challenge a friend, share your result and agree on the same level. The comparison is fair because the layout is random on every game, so luck evens out over a few rounds. No account is required, and the only thing sent to our servers after a win is your level and a rounded time, never your name.',
      ],
    },
  ],
  cta: 'Play Minesweeper now',
};
