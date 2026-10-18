module.exports = {
  metaTitle: 'Spin the Bottle Guide: How to Play, Fair Picks & Party Ideas',
  description: 'How to play spin the bottle online as a family-friendly party picker: setting up names, mission cards, why every seat has the same chance, game variations and tips for a fun table.',
  h1: 'Spin the bottle online: a fair, family-friendly way to decide who is next',
  updated: '2026-10-19',
  intro: 'Spin the bottle is one of those games almost everybody recognises: people sit in a circle, someone spins a bottle in the middle and whoever it points at is up. This app keeps that simple moment but puts it on your phone, so you never need a real bottle or a perfectly flat table. You lay the phone in the middle, type the names of the people sitting around it and let the bottle choose. It works as a quick way to settle who goes first, who picks the next song or who clears the plates. This guide covers where the game comes from, how to play here, ideas for different groups and why the result is genuinely fair.',
  sections: [
    {
      h: 'Where spinning a pointer to choose comes from',
      p: [
        'Long before there were apps, people used spinning objects to let chance decide. Medieval and early modern Europe had the teetotum, a small top with letters on its sides that told the player what to do when it fell. Children in many countries still spin tops, coins or pens to see who goes first. Pointing games are popular for the same reason: everyone can watch the object slow down, so nobody can claim the choice was rigged.',
        'The bottle version became a classic party pastime in the twentieth century, simply because an empty bottle was always at hand and spins nicely on a table. Over the years groups have used it for all sorts of harmless purposes: choosing who tells the next story, who answers a question, who starts a card game. This app is built for exactly that kind of play, as a friendly decision tool for parties, family evenings, classrooms and game nights.',
      ],
    },
    {
      h: 'How to play with this app',
      p: [
        'There are two ways to play. Just spin needs no setup at all: tap the button and the bottle stops at a random angle, then everyone looks at where the neck points. With names is better when the phone is in the middle of a real table. Type between 2 and 12 names, one per line, in the order you are sitting, going clockwise. The names appear evenly spaced around the table on screen, like seats, and the bottle stops pointing at one of them.',
        'You can start a spin with the big button or by tapping the bottle. You can also flick the bottle with your finger, which feels more like the real thing. Each spin takes a few seconds, turns several times and slows down gently before it stops. The person picked is highlighted, the result is shown below the table, and a short history keeps your last ten spins so nobody forgets who already had a turn.',
      ],
      list: [
        'Pick Just spin, or With names and type everyone in seating order.',
        'Leave No repeats on if everyone should get a turn before anyone goes twice.',
        'Optionally switch on Mission card after each spin for a small friendly challenge.',
        'Put the phone flat in the middle of the table and tap or flick the bottle.',
        'Read out the result, then spin again or start a new round.',
      ],
    },
    {
      h: 'Game ideas for different groups',
      p: [
        'At a party or a Halloween get-together, spin to decide who picks the next song, who goes first in a costume parade or who starts a round of charades. With mission cards switched on, the person picked gets a light, kind challenge such as a quick impression or a compliment for a neighbour. The cards appear one at a time, so every spin brings a little surprise. If your group prefers its own ideas, choose My own list and write a mission on each line.',
        'At home it is a painless way to share chores: whoever the bottle picks loads the dishwasher or walks the dog. Teachers can use it to choose who reads aloud, who answers first or which group presents next, with No repeats making sure every student gets a turn. On board game nights it settles who starts, and in a meeting it can choose who shares an update first. The rule of thumb is simple: if a decision would normally end in an argument about fairness, let the bottle make it.',
      ],
    },
    {
      h: 'Why the result is fair',
      p: [
        'A real bottle on a real table is not perfectly fair. Bumps in the surface, the shape of the glass and the way someone flicks it all tilt the odds. The app avoids that by deciding the result before anything moves. When you press spin, it asks your browser’s cryptographic random number generator, the same source used for security keys, to choose a seat. It uses a method called rejection sampling, which removes the tiny bias that simple random code can have, so with eight names every person has exactly a one in eight chance.',
        'Only then does the animation start. The app works out how far the bottle has to turn to land inside the chosen person’s slice of the table, adds a few full turns and a small random offset so it never stops at exactly the same spot, and slows the bottle down smoothly. How hard you flick it only changes the direction it spins, never who it lands on. With No repeats on, the app chooses only among people who have not been picked yet in the current round, which is still completely even among them. Your names never leave your device.',
      ],
    },
    {
      h: 'Tips for a good spin',
      p: [
        'Type the names in the order people are actually sitting so the screen matches the table; that way everyone can see the neck point straight at the right person. Lay the phone flat and turn the screen brightness up if the room is dark. For bigger groups, short names or nicknames are easier to read around the edge of the table.',
        'Keep mission cards kind and optional. Anyone should be able to pass, and the best challenges are ones that make the whole table laugh rather than put one person on the spot. If you want to play again later with the same group, use Copy link with these names after a spin: the link opens the same table, and the names travel inside the link rather than through a server. Most of all, enjoy the moment of suspense as the bottle slows down.',
      ],
    },
  ],
  cta: 'Spin the bottle now',
};
