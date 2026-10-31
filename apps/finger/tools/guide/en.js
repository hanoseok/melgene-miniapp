module.exports = {
  metaTitle: 'Finger Chooser Guide: How It Works, Fairness & Party Ideas',
  description: 'How to use the finger chooser on one phone: picking one or several people, splitting into fair teams, why the random pick is fair, party game ideas and tips for big groups.',
  h1: 'Finger chooser: how to pick someone at random with everyone’s fingers',
  updated: '2026-11-01',
  intro: 'A finger chooser is the quickest way to settle a small argument. Put a phone in the middle of the table, everyone presses one finger on the screen, and after a short pause the app lights up one of them. No names to type, no papers to fold, no one holding the hat. This guide explains how to use it, the three modes, why the pick is genuinely fair, and a handful of ideas for parties, classrooms and family dinners.',
  sections: [
    {
      h: 'How to use it',
      p: [
        'On the start screen, choose what you want the app to decide. One winner picks a single finger. Several picks two or more winners at once, which is handy when you need a few volunteers. Teams splits everyone into two, three or four colored teams of nearly equal size. Then open the finger pad.',
        'Now everyone places one finger on the screen at the same time. Each finger gets its own glowing circle in a different color. When enough fingers are down, the circles start to pulse and a ring fills up. Keep still: if someone adds or lifts a finger, the countdown starts again. When the ring is full, the pad decides. The other circles fade, the chosen circle grows and the phone gives a short buzz if it can vibrate.',
      ],
      list: [
        'Pick 1 winner, several winners or teams.',
        'Open the finger pad and put the phone on a flat surface.',
        'Everyone presses one finger on the screen.',
        'Hold still until the ring fills up.',
        'The glowing circle, or the circles of each team color, show the result.',
      ],
    },
    {
      h: 'Using a computer or a single-touch screen',
      p: [
        'Not every screen can feel many fingers at once. Laptops and desktop computers usually have only a mouse, and some phones and tablets track just a few touches. For these, the app switches to click mode. Click once for each player to drop a colored dot, click a dot again if you placed one by mistake, and press Go when everyone is in. The pick that follows works exactly like the finger version.',
        'Click mode is also useful for big groups. Most phones follow about five fingers at the same time, and the pad accepts up to ten. If you have more people than the screen can feel, sit around a tablet, use click mode on a laptop, or split the group into two rounds and let the winners of each round face off.',
      ],
    },
    {
      h: 'Why the pick is fair',
      p: [
        'The app does not decide anything in advance. Only at the moment the ring fills up does it look at the fingers that are on the screen and draw among them using your browser’s cryptographic random generator, crypto.getRandomValues. It uses rejection sampling, which throws away the few raw values that would make some positions slightly more likely, so every finger has exactly the same chance. Where you put your finger, how early you arrived and which color you got make no difference.',
        'Teams use the same source. All fingers are shuffled, and then they are dealt into the teams one by one, starting from a randomly chosen team. That keeps team sizes within one person of each other while giving everyone the same chance of ending up in any team. Because the countdown restarts whenever a finger is added or removed, nobody can wait to see what is happening and slip in or out at the last second.',
      ],
    },
    {
      h: 'Party and everyday ideas',
      p: [
        'The finger chooser shines whenever a group needs a quick, neutral decision. Agree on what the pick means before anyone touches the screen, so the result is accepted with a laugh instead of a debate.',
      ],
      list: [
        'Who pays for coffee or picks up the bill this time.',
        'Who goes first in a board game or card game.',
        'Who does the dishes, takes out the trash or walks the dog.',
        'Who answers the next question in a quiz or truth-or-dare round.',
        'Splitting friends into teams for charades, football or a pub quiz.',
        'Choosing two volunteers in class with the several winners mode.',
      ],
    },
    {
      h: 'Tips for a smooth round',
      p: [
        'Put the phone flat on a table rather than holding it, so nobody accidentally touches the screen with a thumb. Ask everyone to use only one finger and to keep it still; sliding around is fine, but lifting it restarts the wait. If the phone shows a system gesture or pulls down a menu, start a little further from the edges of the screen.',
        'Results from the last ten rounds are listed under the result while the page is open, which helps when you play best of three. They are kept only in memory and disappear when you close the page, and the touches themselves never leave your device.',
      ],
      list: [
        'Lay the phone flat and gather around it.',
        'One finger per person, away from the screen edges.',
        'Do not lift your finger until the result appears.',
        'For more than five people, try a tablet or click mode.',
      ],
    },
  ],
  cta: 'Open the finger chooser',
};
