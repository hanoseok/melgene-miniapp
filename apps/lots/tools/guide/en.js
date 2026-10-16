module.exports = {
  metaTitle: 'Draw Lots Guide: How to Use, Fairness, Ideas & History',
  description: 'How to draw lots online with folded paper slips, why the shuffle is fair, ideas for classrooms, offices, parties and gift exchanges, and a short history of drawing lots.',
  h1: 'Draw lots online: how it works, why it is fair and where to use it',
  updated: '2026-10-17',
  intro: 'Drawing lots is one of the oldest ways people have found to make a decision nobody can argue with. You write the outcomes on scraps of paper, fold them so they all look the same, and let each person take one. This online version keeps that feeling: the phone goes around the table, every player taps a folded slip and watches it open. This guide explains how to set up a draw, how the shuffle stays fair, how to keep results private while the phone travels, some ideas for using it at school, at work and at parties, and where the custom of drawing lots comes from.',
  sections: [
    {
      h: 'How to set up and run a draw',
      p: [
        'Start by choosing how many slips you need, anywhere from 2 to 50. If you want each turn to say whose turn it is, open Add names and type one name per line; the number of slips then follows the number of people automatically. Next decide what is written on the slips. Winners and blanks is the quick option: pick how many winning slips there are and the rest are blanks. Custom prizes lets you write your own lines, such as Buys coffee, First place or Sings a song, each with a count. The total has to match the number of slips, and Fill rest with Blank tops it up for you.',
        'Press Fold the slips and the board fills with numbered paper squares. The first person taps any slip they like, it unfolds and shows what they got, then they tap Next person and hand the phone on. When the last slip is taken, or when you press Finish now, you see a clear list of who got what, grouped by prize as well. You can copy it as text for a group chat or copy a result link that shows the same draw to anyone who opens it.',
      ],
      list: [
        'Choose the number of slips, or add names to get one slip per person.',
        'Pick Winners and blanks, or write custom prizes with counts.',
        'Keep Hide each result after viewing on if the phone will be passed around.',
        'Press Fold the slips and let each person tap one slip in turn.',
        'Copy the who-got-what summary or the result link when you are done.',
      ],
    },
    {
      h: 'Why the draw is fair',
      p: [
        'Fairness in a paper draw depends on good mixing. If the folded slips are not stirred properly, the ones dropped in last tend to stay on top. The app solves this with a single, thorough shuffle at the moment you press Fold the slips. It uses your browser’s cryptographic random number generator, the same kind of randomness used for security keys, together with a method called rejection sampling that removes the tiny bias simple random code can have. The slips are then mixed with the Fisher–Yates shuffle, which gives every possible order exactly the same chance.',
        'Because each slip’s content is fixed at that moment, it truly does not matter who goes first or which square someone taps. The person choosing feels in control, which is half the fun, but the odds are identical for everyone: with one winner among ten slips, each player has a one in ten chance no matter where they are in the queue. The unfolding animation only shows the content that was already there. Nothing is sent to a server and nothing can be changed afterwards.',
      ],
    },
    {
      h: 'Keeping it secret while the phone goes around',
      p: [
        'With real paper, people keep their slip in their hand until everyone has drawn. On a shared phone, the same suspense needs a little help. When Hide each result after viewing is on, taken slips stay closed on the board, and after each person taps Next person a hand-over screen covers everything until the next player says they are ready. Nobody can peek at what came earlier, which keeps the last players just as curious as the first.',
        'If you would rather watch the results build up together, for example when the whole group is looking at one screen, turn the option off. Opened slips then stay visible on the board with their labels. Either way the final summary appears only after the draw ends, so you can reveal everything at once for a bigger moment.',
      ],
    },
    {
      h: 'Ideas for using lots at school, at work and at parties',
      p: [
        'Lots are perfect whenever a choice has to feel neutral. Teachers use them to give out presentation slots or jobs nobody volunteers for. Offices use them for who brings snacks, who takes the holiday shift or who books the next team lunch. At parties they add a small game to everyday decisions, and in families they end the eternal question of who does the dishes.',
      ],
      list: [
        'Classroom: write presentation dates or group roles on the slips and add the students’ names.',
        'Office: one Buys coffee slip among the team, or who covers the Friday shift.',
        'Party game: a few Dare slips and Truth slips mixed with blanks.',
        'Gift exchange: secret gift partners or the order for opening presents.',
        'Sports and games: who serves first, which team picks first, or tournament seeds.',
        'Family: chores for the week, the seat by the window, or who chooses the film.',
      ],
    },
    {
      h: 'A short history of drawing lots',
      p: [
        'Drawing lots appears in records from many ancient cultures. Pebbles, marked sticks, bones and pieces of pottery were shaken in a container or held in a closed hand, and the one that came out decided land shares, duties or disputes. In ancient Athens a device called the kleroterion used coloured balls to select citizens for public offices and juries, because people believed chance was harder to corrupt than voting. Many languages still carry traces of this: the English word lottery comes from the same root as lot, the share that fell to you.',
        'Over the centuries the idea moved from temples and town halls into everyday life. Sailors drew straws for unpleasant watches, villages raffled goods at fairs, and children folded paper slips into a hat to decide games. The tools changed, but the principle stayed the same: everyone gets the same chance, and the result is accepted because no person chose it. A phone passed around the table is simply the newest version of that old hat full of paper.',
      ],
    },
  ],
  cta: 'Start drawing lots now',
};
