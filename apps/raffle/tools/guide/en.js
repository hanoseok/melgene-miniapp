module.exports = {
  metaTitle: 'Raffle Draw Guide: Run a Fair Giveaway or Party Raffle',
  description: 'How to run a raffle draw online: paste names or use ticket numbers, set prizes and draw order, reveal winners one by one on a big screen, and keep every giveaway fair.',
  h1: 'How to run a fair raffle draw at a party or online giveaway',
  updated: '2026-11-09',
  intro: 'A prize draw is often the moment everyone remembers from a year-end party. People put their phones down, the room goes quiet and the first name gets a cheer. The tricky part is running it smoothly: paper slips get lost, someone draws the same name twice, and nobody is quite sure the bowl was mixed. This raffle draw app replaces the bowl with one screen. You paste the list of participants or choose numbered tickets, write down the prizes and reveal the winners one at a time with a short name shuffle. This guide explains how to set it up, how the options work, how to host a draw that feels exciting, and why the result is fair.',
  sections: [
    {
      h: 'How to run a raffle with this app',
      p: [
        'Start by choosing who is in the draw. Pick Names if you have a guest list, a class list or the usernames from a livestream chat, and paste them one per line. Pick Ticket numbers if people are holding numbered raffle tickets, and enter the highest number. Then list the prizes from the top prize down, with the number of winners for each one. By default there is one grand prize, two second prizes and five third prizes, but you can rename them, change the counts or add up to twelve prizes.',
        'Press Start and the drawing screen appears. Each press of Draw shuffles the names for a moment and stops on a winner. The prize name and the winner are shown in large type, and a list under the stage collects everyone who has won so far. If a prize has several winners and time is short, Draw all at once picks the rest of that prize in one go. When every prize is drawn, open the results to see the winners grouped by prize.',
      ],
      list: [
        'Choose Names or Ticket numbers.',
        'List the prizes from the biggest to the smallest, with how many winners each.',
        'Pick the draw order and decide whether people can win more than once.',
        'Press Draw for each winner, or Draw all at once for the rest of a prize.',
        'Copy the results as text or share the result link with the group.',
      ],
    },
    {
      h: 'Names, ticket numbers and extra tickets',
      p: [
        'Pasting names works best when each person appears once. If the same name shows up twice, the app warns you, because it usually means the list was copied twice or two people share a first name. Each line still counts as one entry, so add a surname or an initial to tell them apart. If you want someone to have a better chance, for example because they bought three tickets or answered three quiz questions, write *3 after their name. That person then holds three tickets and is three times as likely to be picked, but can still only win once if the once-only rule is on.',
        'Ticket numbers suit charity raffles, school fairs and events where people buy paper tickets at the door. Enter the highest number sold and the app draws from 1 up to that number. The winning number is shown clearly so the holder can come forward with the stub.',
      ],
    },
    {
      h: 'Prize order and the win-only-once rule',
      p: [
        'Most parties save the best for last, so the default order draws the smallest prizes first and the grand prize at the very end. That keeps everyone in the room until the final draw. If you prefer to start with the headline prize, for example in a short livestream where viewers may leave early, switch the order to grand prize first.',
        'The rule that each person can win only once is on by default. Once someone wins, their name leaves the draw for the remaining prizes, which spreads the gifts across more people. Turn it off when every prize should be open to everyone, such as separate lucky draws during a long evening. Even then, the same person can never win the same prize twice.',
      ],
    },
    {
      h: 'Hosting tips for year-end parties and livestream giveaways',
      p: [
        'Connect a laptop to the TV or projector and switch on presentation mode. The title bar and extra controls disappear and the prize and name get bigger, so people at the back can read them. A presentation clicker or the space bar draws the next winner, which lets the host stay with the audience instead of standing behind the laptop. Build a little suspense by announcing the prize before each draw, and use Skip if the evening is running late.',
        'For an online giveaway, collect entries in one place first, such as comments under a post or replies in a chat, and paste the usernames into the list. Share your screen during the draw so viewers can watch it happen. Afterwards, copy the results as text into the chat or send the result link, which contains only the prize names and winners. If you press Draw by mistake, Undo last draw cancels it, but it is good practice to tell the audience before you redo anything.',
      ],
    },
    {
      h: 'How the draw stays fair',
      p: [
        'Fairness is the whole point of a raffle, so the app avoids shortcuts. It does not shuffle the list in advance. Each winner is chosen at the moment you press Draw, using the cryptographic random number generator built into your browser, the same kind of randomness used for security keys. Every remaining ticket has exactly the same chance, and a method called rejection sampling removes the small bias that simpler random code can have. The shuffling names on screen are only decoration and are shown after the winner has already been chosen.',
        'Your list never leaves your device. The names, prizes and an unfinished raffle are saved in your browser so a refresh does not ruin the evening, and nothing is uploaded to a server. When you are done, press New raffle to clear the winners, or edit the list and draw again next year.',
      ],
    },
  ],
  cta: 'Start a raffle draw now',
};
