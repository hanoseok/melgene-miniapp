module.exports = {
  metaTitle: 'D-Day Calculator Guide: Countdowns, Day 100 & Date Math',
  description: 'How to use the D-Day calculator, how days are counted (inclusive or exclusive), why Korean couples call the first day day 1, tips for countdown cards and a short history of counting down.',
  h1: 'D-Day calculator: how to count the days until, since and between dates',
  updated: '2026-10-17',
  intro: 'Counting days sounds simple until you try it. Is a trip that leaves next Saturday six days away or seven? If you started dating on 1 January, is 10 April your 100th day or the day before it? A D-Day calculator answers these questions instantly and the same way every time. This guide explains how to use the three modes, how the counting works, why different people get different answers for the same dates, and how to turn a countdown into a card your friends can open. Along the way you will find a short history of counting down, from rocket launches to wedding apps.',
  sections: [
    {
      h: 'How to use the D-Day calculator',
      p: [
        'Pick a mode with the tabs at the top. Countdown tells you how many days are left until a date and shows it as D-n, where D-1 means tomorrow and D-DAY means today. Under the number a live timer ticks down the hours, minutes and seconds. You can set a time if your event starts at, say, 7:30 in the evening; otherwise it counts to the start of the day.',
        'Days since works the other way round. Enter the day something began, such as the day you met, a baby’s birthday or the first day at a new job, and you see how many days have passed, plus a list of upcoming milestones with their dates. Add days is plain date math: pick a date, choose after or before, type a number and you get the resulting date and weekday.',
        'Give the card a title, an emoji and a color if you like. Then save it as an image, copy a link that opens the same card on another phone, or keep it in My D-days on this device. Nothing you type is sent to a server.',
      ],
      list: [
        'Quick picks fill in the next Halloween, Christmas, New Year’s Day or Valentine’s Day for you.',
        'The Today button sets the date field to today, handy for date math.',
        'Tap a saved D-day to reopen it with fresh numbers.',
        'A shared link is recounted on the receiver’s device, in their own time zone.',
      ],
    },
    {
      h: 'How the days are counted',
      p: [
        'The calculator counts calendar days, not 24-hour blocks. It looks at the date on your device, compares it with the target date and counts the midnights in between. That is why D-1 is always tomorrow, even if tomorrow is only ten minutes away. The live timer is the one place where real time matters: it counts the exact hours, minutes and seconds left.',
        'Two details trip up most hand-made spreadsheets. The first is daylight saving time. On the night the clocks change, a day is 23 or 25 hours long, so dividing milliseconds by 86,400,000 gives a number like 1.96 and the countdown jumps a day early. This calculator compares dates at noon in a fixed reference, so every day counts as exactly one. The second is leap years. February 29 exists only in leap years (2024 and 2028, but not 2100), and adding 365 days to 29 February 2024 lands on 28 February 2025. Yearly anniversaries of a 29 February start fall on 28 February in ordinary years.',
      ],
    },
    {
      h: 'Inclusive or exclusive? Why couples in Korea say day 1',
      p: [
        'There are two honest ways to answer “how many days since?”. The exclusive way counts the full days that have passed, so the start date is day 0 and tomorrow is day 1. This is how most date calculators, banks and contracts count. The inclusive way counts the start date itself as day 1, the way you would say “the first day of school”.',
        'In Korea, couples celebrate their 100th day together, and families celebrate a baby’s 100th day, called baegil. Both are counted inclusively: the day you started dating is day 1, so your 100th day is 99 days after it. That is why the switch Count the start day as day 1 exists. Turn it on to match Korean custom or any group that counts the first day; turn it off for a strict count of elapsed days. The milestone list follows the same choice.',
      ],
      list: [
        'Inclusive (switch on): start date = day 1, day 100 = start + 99 days.',
        'Exclusive (switch off): start date = day 0, 100 days = start + 100 days.',
        'Countdowns are unaffected: D-n always counts the days until the date.',
      ],
    },
    {
      h: 'Tips for better countdown cards',
      p: [
        'Short titles look best on the card and in the saved list. “Lisbon ✈️” reads better than a whole sentence, and the emoji already sets the mood. Pick a color that matches the occasion: tomato for celebrations, mint for fresh starts, grape for anniversaries, ocean for trips and ink for deadlines you want to take seriously.',
        'For events with a start time, such as a concert or a flight, set the time so the live timer reaches zero at the right moment. For deadlines, many people count to the end of the day instead; in that case set 23:59. When you share a card with friends abroad, they see the same date counted in their own time zone, so a party on Saturday stays on Saturday for everyone.',
        'Use the date math mode for practical questions too: when a 90-day return window closes, what date is 30 days before a visa appointment, or which weekday your 1000th day falls on.',
      ],
    },
    {
      h: 'A short history of counting down',
      p: [
        'The habit of counting toward a moment is older than clocks, but the dramatic “ten, nine, eight” countdown is surprisingly modern. It was popularized by the 1929 German film Woman in the Moon, whose director added a backwards count before a rocket launch to build suspense. Real rocket engineers later adopted it, and televised launches in the 1960s made it part of everyday life.',
        'The term D-Day comes from military planning, where D stands for the day an operation begins and D-3 or D+2 mark the days before and after it. In Korea, the expression became a common way to talk about any important date, from exams to weddings, and phone apps that show D-day counters for couples are among the most popular in the country. Today the same idea lives on in advent calendars, wedding planners and the New Year’s Eve countdown, and now on a card you can make in a few seconds.',
      ],
    },
  ],
  cta: 'Open the D-Day calculator',
};
