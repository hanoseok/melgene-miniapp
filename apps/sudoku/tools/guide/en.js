module.exports = {
  metaTitle: 'Sudoku Guide: Rules, Solving Techniques and History',
  description: 'How to play Sudoku online: the rules, using notes and hints, solving techniques from singles to X-Wing, what the four levels mean and a short history of the number puzzle.',
  h1: 'Sudoku: how to play, solve smarter and enjoy every grid',
  updated: '2026-10-12',
  intro: 'Sudoku is a free logic puzzle played on a 9 by 9 grid. Some squares already hold digits, and your job is to fill in the rest so that every row, every column and every 3 by 3 box contains the digits 1 to 9 exactly once. You never need arithmetic, and a well-made puzzle never needs a guess. This guide covers the rules, the controls on a phone and a computer, the techniques that take you from Easy to Expert, and a little of the puzzle\'s surprisingly international history.',
  sections: [
    {
      h: 'What Sudoku is and how the rules work',
      p: [
        'The grid is made of 81 squares arranged in nine rows, nine columns and nine boxes of three by three squares. The puzzle starts with a set of given digits, usually somewhere between twenty and forty of them. Those givens are fixed. Every empty square must receive one digit from 1 to 9, and no digit may appear twice in the same row, the same column or the same box. When every square is filled without breaking that rule, the puzzle is solved.',
        'The digits are really just nine different symbols. You could play with letters or colours and nothing would change, which is why Sudoku is a puzzle of placement and elimination rather than a maths problem. Every grid on this page is created in your browser and checked by a solver before you see it, so each one has exactly one solution and can be completed by reasoning alone.',
      ],
    },
    {
      h: 'Controls and a quick start',
      p: [
        'Choose a level and tap New puzzle. Tap any empty square to select it; its row, column and box are shaded so you can see what it touches, and every copy of the digit in that square is highlighted across the board. Then tap a number on the pad below the grid. The small figure under each number shows how many of that digit are still missing, which is a quick way to spot the digits that are nearly finished.',
        'Your game is saved in this browser after every move. If you close the page, the start screen offers a Continue game button with your level and time. The clock pauses whenever you switch to another tab or app, and the grid is hidden until you come back, so an interruption never costs you anything.',
      ],
      list: [
        'Notes switches the pad to pencil mode: tapping a number writes or removes a small candidate in the selected square.',
        'Erase clears the selected square, and Undo steps back through your moves one at a time.',
        'Hint fills one correct square for you. You get three per puzzle, and a puzzle solved with a hint is not added to the time comparison.',
        'Check shows digits that do not match the solution in red. With Check off, only direct clashes in a row, column or box are outlined.',
        'On a computer, use the arrow keys to move, the digits 1 to 9 to fill, Backspace to erase, N for notes and Z to undo.',
      ],
    },
    {
      h: 'Solving techniques, from singles to X-Wing',
      p: [
        'Almost every puzzle begins with singles. A naked single is a square where eight of the nine digits are already ruled out by its row, column and box, so only one digit can go there. A hidden single is the opposite view: inside one row, column or box there is only one square left that can take a particular digit. Scanning each digit across the three boxes of a band is the fastest way to find hidden singles, and Easy puzzles here can be finished with these two ideas alone.',
        'Medium and Hard puzzles ask for a little more. With pointing, a digit that can only sit in one row inside a box cannot appear anywhere else in that row. With naked pairs, two squares in the same group that share the same two candidates claim both digits, so you can remove them from the rest of the group. Hard grids may also need naked triples or an X-Wing, where a digit is confined to the same two columns in two different rows. Expert puzzles have the fewest clues and can require longer chains of reasoning.',
      ],
      list: [
        'Fill in notes only when the singles run out. Notes are most useful on harder grids.',
        'Remove a candidate from the notes in the row, column and box as soon as you place a digit. The game does this for you.',
        'If you are stuck, count the remaining copies of each digit on the pad and focus on the digits with only one or two left.',
        'Never guess on purpose. If two choices seem possible, look for a third square that decides between them.',
      ],
    },
    {
      h: 'A short history of Sudoku',
      p: [
        'The puzzle is older than its name. Latin squares, grids in which each symbol appears once per row and column, were studied by the mathematician Leonhard Euler in the eighteenth century, and French newspapers printed number puzzles with similar rules in the 1890s. The modern form, with its nine boxes, appeared in 1979 in an American puzzle magazine under the title Number Place, and it is usually credited to the puzzle designer Howard Garns.',
        'In 1984 the Japanese publisher Nikoli introduced it in Japan and gave it the name Sudoku, a shortening of a phrase meaning that each digit must remain single. In Japan it is still often called Number Place, or Nanpure for short. The puzzle became a worldwide craze in 2004 and 2005, after British newspapers began printing it daily, and it has been a fixture of newspapers, puzzle books and phones ever since.',
      ],
    },
    {
      h: 'Levels, the daily puzzle and fair comparisons',
      p: [
        'The four levels are set by two things: how many clues remain, and which techniques a built-in grader needs to solve the grid. Easy leaves many clues and can be finished with singles only. Medium removes more clues and allows simple eliminations. Hard is chosen to require at least one of the intermediate techniques, and Expert strips the grid down to the fewest clues while keeping a single solution. Today\'s puzzle uses the date to create one grid per level that everyone in the world shares, and it changes at midnight UTC, which makes it easy to race a friend on the same puzzle.',
        'When you solve a puzzle without hints, your time is saved as your personal best for that level in your own browser, and the result screen shows where it sits among other players\' real times. The only thing sent to our server is the level and a time rounded to five seconds, never your name, and the comparison stays hidden when there is nothing to compare with yet.',
      ],
    },
  ],
  cta: 'Play Sudoku now',
};
