module.exports = {
  metaTitle: 'Hot Potato Game Guide: How to Play, Party Ideas & Fair Fuse',
  description: 'How to play the hot potato bomb game on one phone: setting up players and fuse length, party variations, why the secret random fuse is fair, and tips to keep the game safe and fun.',
  h1: 'Hot potato game: how to play the pass-the-bomb party game',
  updated: '2026-10-24',
  intro: 'Hot potato is one of the simplest party games there is: something gets passed around a circle, nobody knows when the music or the timer will stop, and whoever is holding it at that moment is out. This version turns your phone into the potato. You light a cartoon fuse, tap the bomb, hand the phone to the next person and listen to the ticking get faster until, at a secret moment, it goes boom. This guide covers how to play, ideas for different groups, why the timing is genuinely random and a few tips so the game stays fun for everyone.',
  sections: [
    {
      h: 'How to play',
      p: [
        'Choose whether you want to type names. With Just play, nobody types anything: you simply pass the phone round the circle and whoever holds it at the boom is out. With names, enter 2 to 12 players in the order you are sitting. The screen then shows who has the bomb and, after each tap, who it must go to next, and the loser’s name appears on the result.',
        'Next pick a fuse length. A short fuse burns for somewhere between 10 and 25 seconds, a normal one between 20 and 45, and a long one between 40 and 80. You never see the real number. Press the start button, tap the big bomb, hand the phone over, and keep it moving. A short pause after each tap stops one person from tapping through the whole circle on their own.',
      ],
      list: [
        'Pick Just play or type the players in passing order.',
        'Choose a short, normal or long fuse.',
        'Turn on hints or penalty cards if you like.',
        'Light the fuse, tap the bomb and pass the phone.',
        'When it goes boom, the person holding the phone is out.',
      ],
    },
    {
      h: 'Party variations',
      p: [
        'The basic game works for any group, but small twists keep it fresh. For a quick icebreaker, use a short fuse and ask each person to say their name and a favourite food before they are allowed to pass. For a longer game night, play elimination rounds: whoever gets caught sits out, the names are edited, and the last player left wins.',
        'You can also make passing harder. Ask everyone to answer a question in a chosen category before tapping, such as an animal, a country or a film, with no repeats allowed. Hesitate too long and the bomb might go off in your hands. The optional penalty mission cards add a small, friendly challenge for whoever gets caught.',
      ],
      list: [
        'Category round: name something in the category before you pass.',
        'Elimination: the caught player sits out until one remains.',
        'Team play: two teams take turns, and the team caught least wins.',
        'Classroom warm-up: whoever is caught answers the next question.',
        'Family table: the loser picks the next game or clears the plates.',
      ],
    },
    {
      h: 'Why the secret fuse is fair',
      p: [
        'The moment you light the fuse, the app picks the boom time using your browser’s cryptographic random number generator, crypto.getRandomValues. It uses rejection sampling, which throws away the few values that would make some times slightly more likely, so every millisecond in the chosen range has the same chance. The time is decided before anyone passes and is never displayed, not even to the person holding the phone.',
        'The ticking sound, vibration and the optional spark hint do speed up towards the end, because that is what makes hot potato exciting. But the moment the speed-up starts, how sharply it climbs, its top speed and a few fake rushes in the middle are shuffled every round. That way the tempo makes your heart beat faster without telling anyone exactly how much time is left. If the game goes to the background, the fuse pauses, so nobody loses because a notification popped up.',
      ],
    },
    {
      h: 'Safety and fun tips',
      p: [
        'Because the phone is being handed around quickly, a little care goes a long way. Pass it hand to hand rather than throwing it, play sitting down or standing still, and keep drinks away from the circle. Agree before you start what being caught means, so the result is accepted with a laugh rather than a debate.',
      ],
      list: [
        'Hand the phone over, never toss it.',
        'Hold the phone with both hands and keep a firm grip.',
        'Lower the volume or mute it in quiet places, the vibration still works.',
        'Keep penalties kind and skip any card someone is uncomfortable with.',
        'For young children, use a long fuse so the pace stays relaxed.',
      ],
    },
    {
      h: 'Where hot potato comes from',
      p: [
        'Passing an object around while time runs out is an old idea. Many children’s games use music that stops at an unknown moment, and the name hot potato comes from the image of something too hot to hold for long. The game has been played at birthday parties, in school yards and in summer camps for generations, often with a ball, a bean bag or a wrapped parcel.',
        'Later, toy makers added electronic timers and ticking bombs that buzz or pop after a random delay, which removed the need for someone to control the music. This app follows the same idea with one phone: a fair, hidden timer, a tense soundtrack and a quick result, so the whole group can play together without anyone having to sit out as the referee.',
      ],
    },
  ],
  cta: 'Play hot potato now',
};
