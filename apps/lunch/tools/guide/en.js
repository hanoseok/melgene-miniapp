module.exports = {
  metaTitle: "What Should I Eat? Random Food Picker Guide & Tips",
  description: "How the slot-machine food picker works, how to use meal and mood tags, why the pick is fair, and ideas for office lunches, dates and families.",
  h1: "What should I eat today? How to let the reels decide",
  updated: "2026-10-09",
  intro: "Few daily questions are as tiring as what to eat. This guide explains how the food picker works, how to get better answers out of it, why the result is genuinely random, and a few ways to use it with colleagues, friends and family.",
  sections: [
    {
      h: "How the food picker works",
      p: [
        "You start by choosing which meal you are deciding about: breakfast, lunch, dinner or a late-night snack. Optionally you tick one or more mood tags, then press the button and the slot-machine reels spin for about two seconds before stopping on a single dish. Only that one dish is shown, so you are not pulled back into scrolling through an endless list.",
        "Behind the reels is a list of everyday dishes that people in your language area really eat, each tagged with the meals it suits and the moods it fits. The picker filters that list by your choices and draws one result from what is left. If you open it in the morning, it will already suggest breakfast, and so on through the day, based on your local time."
      ],
      list: [
        "Choose the meal: breakfast, lunch, dinner or late night.",
        "Tick any moods: hearty, light, spicy or easy to eat alone. With several ticked, a dish only has to match one.",
        "Press the spin button and wait for the reels to stop.",
        "Not feeling it? Tap the skip button to remove that dish and spin again.",
        "Happy with it? Share the result or go and eat."
      ]
    },
    {
      h: "Getting better answers",
      p: [
        "Mood tags are the most useful control. Leave them empty and the picker draws from every dish for that meal, which is ideal when you truly have no preference. If you know you want something hot and filling, tick hearty and the pool shrinks to dishes that fit. Because a dish only needs to match one ticked tag, ticking two or three moods widens the pool instead of emptying it.",
        "The skip button is your veto, and it is worth using honestly. If the reels land on something you ate yesterday, skip it and spin again. Skipped dishes stay out until you press the bring-back button or reload the page, so a few skips quickly narrow the field. A good house rule is one veto per person, which keeps a group from spinning forever.",
        "Treat the result as the starting point of a plan, not an order. If the answer is a noodle dish, you still decide which place, which size and which side. The reels remove the hardest step, which is picking a category when everything seems equally fine."
      ]
    },
    {
      h: "Why choosing food is so tiring",
      p: [
        "When every option is available, picking one can feel harder than any single option deserves. Researchers who study choice have described a pattern often called choice overload: the more alternatives you compare, the more you worry about missing the best one, and the less satisfied you tend to feel with whatever you choose. Food decisions are a perfect trap because they recur every day and the stakes are low but the options are endless.",
        "Handing the first decision to chance solves a different problem than it seems to. You are not asking the picker to know your taste. You are replacing an exhausting search with a quick draw, and noticing your own reaction to the result. If you feel a small pang of disappointment, you have just learned what you actually wanted, and you can skip. If you feel relief, you have your lunch."
      ]
    },
    {
      h: "Is the pick really fair?",
      p: [
        "Yes. The dish is chosen using your browser's cryptographic random number generator, the same kind of source that is used for security purposes, and it is chosen before the reels start. The spinning is only a show that ends at the dish already drawn, so nothing about timing, tapping speed or luck with the animation can steer the outcome.",
        "To keep every dish equally likely, the draw uses a method called rejection sampling. A common shortcut, taking a big random number and dividing by the list length, can give some dishes slightly better odds when the numbers do not divide evenly. Rejection sampling throws away the few values that would cause that imbalance and tries again, so every dish that fits your choices has exactly the same chance."
      ]
    },
    {
      h: "Ways to use it with other people",
      p: [
        "At the office, post the result in the team chat and let the reels settle the daily argument. Groups tend to be more relaxed about a decision when nobody is personally responsible for it, and a random pick has no favourite. For couples, the picker is a gentle way to break the classic standoff of each person saying they do not mind. For families, it works well for letting a child press the button while everyone agrees in advance to accept the first answer.",
        "You can also turn it into a small game by choosing the meal and moods together, then predicting what will land. Your last meal and mood choices are remembered in your own browser, so the screen opens ready for your usual setup, while the dishes you skip are forgotten as soon as you reload. The result can be shared as a short message so a friend can try the same spin."
      ]
    }
  ],
  cta: "Spin for today's meal"
};
