module.exports = {
  metaTitle: "Ladder Game Guide: How Amidakuji Works & Fair Picks",
  description: "Learn how the online ladder game (amidakuji) works, why every player lands on a different result, and how to use it for lunch, coffee runs and chores.",
  h1: "Ladder Game: how to make fair random picks with an online amidakuji",
  updated: "2026-10-09",
  intro: "The ladder game is one of the simplest and most satisfying ways to settle a small decision. Everyone gets a vertical line, the hidden outcomes sit at the bottom, and a web of crossbars decides who ends up where. This guide explains how to play the online version, the history of the game, the maths that makes it work, practical ways to use it with friends, colleagues or family, and how sharing and privacy work.",
  sections: [
    {
      h: "How the ladder game works",
      p: [
        "First choose how many players take part, from two to ten. Type a name for each player along the top and an outcome for each slot along the bottom. An outcome can be anything: a lunch spot, a chore, a prize, or simply Winner and Safe. If you are in a hurry, the quick presets fill in sensible defaults for lunch, who buys coffee, chores or turn order, and the Shuffle button mixes the outcomes so that nobody knows which slot is which.",
        "When you press Build the ladder, the tool draws vertical lines with random horizontal rungs between them. Tap a player and a coloured marker walks down their line: whenever it meets a rung, it crosses to the neighbouring line and keeps going down until it reaches the bottom. The outcome waiting there is that player’s result. You can trace one player at a time for suspense, or choose Reveal all results to see the whole table at once."
      ],
      list: [
        "Choose the number of players, from 2 to 10.",
        "Enter the names and the outcomes, or start from a preset and edit it.",
        "Use Shuffle if you want the outcomes in a random order.",
        "Press Build the ladder and tap a player to trace their path.",
        "Reveal the results one by one, or all at once."
      ]
    },
    {
      h: "Where the ladder game comes from",
      p: [
        "In Japan the game is called amidakuji. The name is usually explained by the resemblance between the lines of the ladder and the rays of light drawn around the halo of Amida Buddha, and kuji means a lottery. Similar line-and-rung drawings are used in other countries too: in Korea the game is known as sadari tagi, literally ladder climbing, and in Chinese-speaking regions it is often called the ghost leg.",
        "Part of the appeal is that it works on a sheet of paper. People can draw the vertical lines, fold the bottom to hide the outcomes, let each person add a rung, and then trace the paths together. That mix of shared effort and surprise is why it became a classic way to hand out chores, order and small prizes in schools and offices."
      ]
    },
    {
      h: "Why every player lands somewhere different",
      p: [
        "The key idea is simple. Each rung only swaps the paths of two neighbouring players, like two people trading places in a queue. Paths never merge and never split, so if two players start in different places they can never end in the same place. In mathematical terms, the ladder always produces a permutation: every player gets exactly one outcome and every outcome goes to exactly one player.",
        "To keep the drawing tidy and valid, this tool never puts two rungs side by side in the same row, so a path can always tell which way to go. A new random layout is created every time you build or rebuild the ladder, and the number of rows grows with the number of players so that there is plenty of mixing. The result cannot be known from the names alone, because it depends on rungs that did not exist until the ladder was generated."
      ]
    },
    {
      h: "Ideas for using the ladder game",
      p: [
        "The ladder game is best when you need one result per person without arguing about it. Because every outcome is used exactly once, it is ideal for dividing tasks or assigning positions."
      ],
      list: [
        "Office lunch: list the restaurants, add a few colleagues and let the ladder pick.",
        "Coffee run: mark one outcome as the person who buys and leave the rest as Safe.",
        "Chores: dishes, vacuuming, laundry and trash, one per person, with no complaints about favouritism.",
        "Turn order: decide who goes first in a board game, a presentation or a school activity.",
        "Teams and prizes: use team names or prize names as the outcomes."
      ]
    },
    {
      h: "Tips, sharing and privacy",
      p: [
        "For a result everyone trusts, enter all names and outcomes in front of the group, press Shuffle, and only then build the ladder. If you want a second round with the same players, choose New ladder: it keeps the names and outcomes but draws a different set of rungs. Names are limited to 12 characters, so short nicknames work best.",
        "The share link contains the names, the outcomes and the layout, so whoever opens it sees exactly the same ladder and can trace the same paths. Nothing is stored on our servers, but the last setup is remembered in your own browser so it is ready next time. Avoid typing sensitive personal information into names or outcomes, since they are part of the link."
      ]
    }
  ],
  cta: "Play the ladder game"
};
