module.exports = {
  metaTitle: 'Random Order Picker Guide: Fair Turn Order for Any Group',
  description: 'How to use the Random Order Picker for presentation order, game turns and chore rotas, why the shuffle is fair, and tips for revealing the order to a group.',
  h1: 'Random Order Picker guide: a fair order from first to last',
  updated: '2026-11-15',
  intro: 'Deciding who goes first sounds small until a whole class, team or family is waiting for the answer. Someone always feels the order was rigged, or that the same people end up first every time. The Random Order Picker settles it in one step: you type the names, press shuffle once, and the complete order from first to last is fixed on the spot. This guide explains how the tool works, why the result is fair, where a random order is useful, and how to reveal it in a way that keeps everyone on board.',
  sections: [
    {
      h: 'How it works',
      p: [
        'The first screen is the whole setup. Pick a label for what the order is for, such as presentations, game turns or chores. The label only changes the heading on the result, so you can ignore it if you just need a plain list. Then type or paste the names, one per line. A list copied from a group chat or a spreadsheet works, and commas also split names. If you would rather not use names at all, switch to numbers and choose how many, from 2 to 40, which is handy for seat numbers, roll numbers or ticket stubs.',
        'Choose whether the order should be revealed from first place or from last place, then press shuffle. Each place is revealed as a numbered card: tap the card or the Next button to show the next one, turn on auto play to let the cards appear by themselves, or press Show all to jump straight to the complete list. The final screen shows everyone in order with large numbers, plus buttons to copy the list as text or copy a link.',
      ],
      list: [
        'Pick a label: any order, presentations, game turns or chores.',
        'Enter 2 to 40 names, one per line, or switch to numbers 1 to N.',
        'Choose to reveal from first place or from last place.',
        'Press shuffle once; the whole order is fixed at that moment.',
        'Reveal card by card, play it automatically, or show all at once.',
      ],
    },
    {
      h: 'Why the shuffle is fair',
      p: [
        'A fair order needs every possible arrangement to be equally likely, and it needs the result to be settled before anyone sees it. When you press shuffle, the app asks your browser’s cryptographic random number generator for random values, the same kind of source used to create security keys. It then uses rejection sampling, which throws away the rare values that would make some positions slightly more likely than others, and the Fisher–Yates shuffle, a well-known method that gives every one of the possible orders exactly the same chance.',
        'The complete order exists from that moment on. Revealing the cards one by one does not draw anything new; it simply shows a result that is already fixed. Nothing is sent to a server, so nobody, including us, can see or change the list. If someone doubts the result, you can open the shared link on another phone and the same order appears, because the link stores the finished order rather than a new shuffle.',
      ],
    },
    {
      h: 'Where a random order helps',
      p: [
        'Any time a group has to line up, a random order removes the argument about who goes first. Teachers use it for presentation slots and reading turns. Teams use it for stand-up meetings or the order of speakers in a workshop. Families and flatmates use it for chore rotas, and friends use it to decide turn order in board games, karaoke or a video game tournament.',
        'This is different from picking a single winner. A winner picker stops after one name, and a team splitter divides people into groups. Here everyone gets a position from first to last, which is exactly what you need when every person will have a turn and only the sequence is in question.',
      ],
      list: [
        'School: presentation order, reading aloud, lab partners taking turns.',
        'Work: speaking order in meetings, demo slots, on-call rotation.',
        'Home: who does the dishes on which day, who picks the movie.',
        'Games: turn order for board games, quiz rounds or karaoke.',
      ],
    },
    {
      h: 'Tips for running it in a group',
      p: [
        'Shuffle where everyone can see the screen, or share your screen in a video call. When people watch the button being pressed once, they trust the result more than a list that arrives already finished. If you need to repeat the shuffle, say so before you start, for example because a name was misspelled, rather than after the order is known.',
        'For long lists, auto play keeps the pace steady without anyone tapping, and Show all is the quickest route when you only need the list. Copy as text pastes a numbered list straight into a chat or a document. Your last list is remembered on the device, so a weekly rota only takes a tap to shuffle again next time.',
      ],
    },
    {
      h: 'Reveal from first or from last, and sharing the result',
      p: [
        'Revealing from first place is practical: the person who goes first finds out right away and can start getting ready. Revealing from last place turns the order into a small countdown, because the final card shows who goes first. Classes and parties often enjoy the suspense, while meetings usually prefer the quick version.',
        'The copy link button creates an address that contains the finished order. Anyone who opens it sees the same list with a note that it was not shuffled again, and can start their own shuffle with the same names if they want a new order. The link only carries the names you entered, so share it with the people who should see it.',
      ],
    },
  ],
  cta: 'Shuffle an order now',
};
