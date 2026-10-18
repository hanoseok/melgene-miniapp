module.exports = {
  metaTitle: 'Age Calculator Guide: Exact Age, Leap Days & Milestones',
  description: 'How the age calculator works out your exact age in years, months and days, what happens to 29 February birthdays, how age is counted in different cultures and which milestones are worth celebrating.',
  h1: 'Age calculator: how your exact age is worked out',
  updated: '2026-10-19',
  intro: 'Everyone knows roughly how old they are, but “exactly” is a different question. How many months and days since your last birthday? Which weekday were you born on? When do you hit 10,000 days? This guide explains how the age calculator answers those questions, why the months and days are counted the way they are, what happens if you were born on 29 February, and how people in different countries have counted age over the centuries. At the end you will find a few milestones that make good excuses for a party.',
  sections: [
    {
      h: 'How to use the age calculator',
      p: [
        'Choose the year, month and day you were born from the three lists. The day list adjusts to the month you pick, so February only offers 28 or 29 days and you cannot select a date that never existed. Then press the button. By default your age is calculated as of today, using the date on your phone or computer.',
        'If you want your age on another day, fill in the “age on this date” field. This is handy for forms that ask how old you will be on the first day of school, on the closing date of a competition or on a future trip. You can pick any day from 1900 to 2199. The result shows your exact age, a countdown to your next birthday, the total days, weeks, months and hours you have lived, the weekday you were born on, your star sign and your Chinese zodiac animal, followed by upcoming milestones.',
      ],
      list: [
        'Your birth date never leaves your browser: nothing is sent to a server or saved on the device.',
        'Sharing the result shares only the page link and the number of days you have lived.',
        'Press “Calculate another age” to clear the form and start over, for example for a friend.',
      ],
    },
    {
      h: 'How your exact age is calculated',
      p: [
        'Your age in years goes up by one on each birthday. That part is simple. The months and days are where calculators can disagree, so here is the rule this one follows. Starting from your most recent birthday, it adds whole calendar months for as long as it does not pass the target date, and the remaining days are counted one by one. If you were born on the 31st and a month has only 30 days, the last day of that month counts as your “monthly birthday”. So someone born on 31 January is exactly one month older on 28 February in a normal year, not on 3 March.',
        'Counting days safely is trickier than it looks. Many spreadsheets subtract two timestamps and divide by the number of milliseconds in a day. On the night clocks change for daylight saving time, a day lasts 23 or 25 hours, and that division produces fractions that can push a result off by one. This calculator compares calendar dates at noon in a fixed reference, so every day counts as exactly one, whatever your time zone. Hours lived are then simply the whole days multiplied by 24, counted from the start of your birthday.',
      ],
    },
    {
      h: 'Born on 29 February? Here is your birthday',
      p: [
        'About one person in 1,461 is born on a leap day, and they get a real birthday only once every four years. In the years between, something has to give. This calculator celebrates on 28 February, the last day of February, so you turn a year older before the month ends. That is the most common choice among leap-day families and keeps your birthday in the month you were born.',
        'Laws do not always agree. Some countries treat 1 March as the day a leap-year baby comes of age, and others use 28 February. If the exact date matters for a driving licence, a pension or a contract, check the local rule. For everyday purposes, and for knowing when to buy the cake, 28 February works well.',
      ],
      list: [
        'Leap years are divisible by 4, except century years that are not divisible by 400.',
        '2000 was a leap year, 2100 will not be.',
        'The next 29 February birthdays fall in 2028, 2032 and 2036.',
      ],
    },
    {
      h: 'How age is counted around the world',
      p: [
        'In English-speaking countries age is counted in completed years: a newborn is zero, and you add one on each birthday. This is the international standard, and it is what the calculator shows. It has not always been universal. In parts of East Asia people traditionally counted a baby as one year old at birth and added a year at each new year, so two people born a few days apart could be a year different in age. South Korea moved all legal and administrative ages to the international system in June 2023, and Japan made the change decades earlier.',
        'Even in the West the details vary. Some cultures make a big event of a particular age, such as a sweet sixteen, a quinceañera at fifteen or a coming-of-age day at twenty, and legal ages for voting, drinking or driving differ from country to country. The number of years is the same everywhere; what people celebrate is not.',
      ],
    },
    {
      h: 'Fun milestones worth celebrating',
      p: [
        'Round birthdays are the classic, but counting in days gives you more chances to celebrate. Your 10,000th day arrives at about 27 years and 4 months, which many people have never noticed. Your 20,000th day comes at roughly 54 years and 9 months, and 30,000 days is a little after your 82nd birthday. The calculator lists the next ones with their dates, and marks those you have already passed.',
        'The weekday you were born on is another small surprise. Weekdays shift by one each year, or by two after a leap day, so your birthday lands on the same weekday you were born on only every few years. Star signs follow the Gregorian date of your birthday. Chinese zodiac animals here follow your Gregorian birth year; traditionally the animal changes at Lunar New Year in late January or February, so if you were born early in the year your traditional animal may be the previous one.',
      ],
      list: [
        '10,000 days: roughly age 27 and a third.',
        '1 billion seconds: about 31 years and 8 months.',
        'Your half birthday: six months after your birthday, a good excuse for half a cake.',
      ],
    },
  ],
  cta: 'Open the age calculator',
};
