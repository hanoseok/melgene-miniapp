module.exports = {
  metaTitle: 'Animal Race Picker Guide: Fair Random Races & Party Ideas',
  description: 'How to use the animal race picker to choose a winner or decide who buys the coffee: setting up runners, why every name has the same chance, office and party ideas, and a short history of drawing lots.',
  h1: 'Animal race picker: a fair and fun way to let a race decide',
  updated: '2026-10-22',
  intro: 'Some decisions are too small to argue about and too awkward to make on your own: who buys the next round of coffee, who presents first, who gets the last slice. The animal race picker turns that moment into a short show. Every person gets an animal on their own lane, a countdown starts, and the animals dash to the finish line with sprints, stumbles and close finishes. When the dust settles you know who came first and who came last. This guide explains how to use it, why the outcome is genuinely random, ideas for different groups and a little history of letting chance decide.',
  sections: [
    {
      h: 'How to use the race picker',
      p: [
        'Start by choosing what the race decides. With 1st place wins, the first animal across the line is the winner, which suits prizes, picking a volunteer or choosing who starts a game. With Last place pays, the slowest runner is the one who has to do something, such as buying coffee, washing the cups or taking the next turn at karaoke.',
        'Then set the number of runners, anywhere from 2 to 10, and type a name on each lane. You can leave lanes empty if you are in a hurry; they race under a default name like Player 3. Tap the start button and the screen switches to the track. After a three-second countdown the race lasts roughly six to nine seconds, and the finish order appears with medals for the top three and the decisive spot highlighted.',
      ],
      list: [
        'Pick a mode: first place wins, or last place pays.',
        'Choose how many runners and type a name on each lane.',
        'Press start and watch the countdown and the race.',
        'Read the finish order, then race again with the same names or change them.',
        'Copy a link with the names to let friends run their own race.',
      ],
    },
    {
      h: 'Why every name has exactly the same chance',
      p: [
        'The race looks chaotic, but the result is not decided by the animation. The moment you press start, the app draws the complete finish order using your browser’s cryptographic random number generator, crypto.getRandomValues. It uses rejection sampling to avoid the small bias that a simple remainder calculation would create, and a Fisher–Yates shuffle, the standard method for putting a list into random order. Every possible order of the runners is equally likely.',
        'Only after that does the app plan the animation. Each lane gets its own speed curve with bursts and stumbles, scaled so that the animals reach the line in exactly the order that was already drawn. That is why the leader can change several times and the finish is often a photo finish. The animal on a lane is purely decoration: the rabbit is not faster than the turtle, and lane 1 is no luckier than lane 10.',
      ],
    },
    {
      h: 'Ideas for offices, parties and classrooms',
      p: [
        'At work, the race picker is a light way to handle chores that nobody volunteers for. It also works for choosing the order of presentations or who picks the lunch place this week. Because everyone watches the same screen, nobody can say the choice was rigged, and the countdown turns a dull decision into a ten-second break.',
        'At parties and family gatherings, use it to decide who goes first in a board game, who chooses the next song, or who has to tell a joke. Teachers can use it to pick the order of turns or the next reader without always calling on the same pupils.',
      ],
      list: [
        'Coffee or snack run: last place pays.',
        'Meeting order: run once and use the full finish order.',
        'Game night: the winner chooses the next game.',
        'Classroom: first place answers the warm-up question.',
        'Household chores: last place takes out the bins.',
      ],
    },
    {
      h: 'A short history of drawing lots and racing for it',
      p: [
        'People have always looked for ways to let chance settle things fairly. Drawing lots appears in ancient texts from many cultures, and drawing straws, flipping coins and counting-out rhymes are still common today. The point is the same in every case: the outcome should not depend on who argues loudest.',
        'Races add suspense to that idea. Fairground and parlour games with little mechanical horses, toy racing games on boards and the classic fable of the tortoise and the hare all play with the thrill of watching an uncertain contest unfold. This app combines both traditions: a fair draw, made the instant you press start, and a race that makes waiting for the answer fun.',
      ],
    },
    {
      h: 'Tips for a better race',
      p: [
        'Agree on the mode and the stakes before anyone presses start, so the result is accepted without debate. Keep names short so they fit in the lane on a phone, and put the phone where everyone can see it, or share the screen in a video call.',
      ],
      list: [
        'Say out loud what first or last place means before the race.',
        'Use short names or nicknames for small screens.',
        'For several decisions in a row, race again with the same names.',
        'Recent results stay on your device, so you can check who paid last time.',
        'If motion makes you uncomfortable, your system’s reduce motion setting shows the result straight away.',
      ],
    },
  ],
  cta: 'Start an animal race now',
};
