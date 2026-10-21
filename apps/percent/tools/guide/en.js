module.exports = {
  metaTitle: 'Percentage Calculator Guide: Formulas, Discounts & Points',
  description: 'How to calculate percentages by hand: X% of a number, what percent one number is of another, percent change, stacked discounts, reverse percentages and the difference between percent and percentage points.',
  h1: 'Percentage calculator: how to work out any percentage',
  updated: '2026-10-22',
  intro: 'Percentages are everywhere: sale tags, pay slips, exam results, interest rates, election polls. Most of them come down to three small formulas, yet a few traps catch almost everyone, such as adding back a discount or mixing up percent and percentage points. This guide shows how the percentage calculator works, how to do the same sums with pen and paper, where the classic mistakes hide and a few mental shortcuts for everyday life.',
  sections: [
    {
      h: 'How to use the percentage calculator',
      p: [
        'Pick the question you want answered from the six tabs at the top: a percentage of a number, what percent one number is of another, the percent change between two values, a discount or increase, the original value before a change, or the gap between two rates in percentage points. Each tab has two boxes. As soon as both are filled in, the answer appears, together with a line that shows exactly how it was calculated.',
        'You can type decimals with a dot or a comma, so 12.5 and 12,5 both work, and thousands separators such as 1,250 are understood. Results are rounded to at most ten decimal places, which hides the tiny rounding errors computers make with fractions. When you are done, open the summary to see every result from this session in one list and copy what you need.',
      ],
      list: [
        'Everything is calculated in your browser; the numbers you type are never sent anywhere.',
        'The copy button copies the result together with its formula.',
        'The discount tab has quick buttons for 10, 20, 30 and 50 percent off.',
      ],
    },
    {
      h: 'The three basic formulas, by hand',
      p: [
        'Percent simply means “per hundred”, so 15% is 15 out of every 100, or 0.15. With that in mind, almost every percentage question becomes one of three formulas. To find a percentage of a number, multiply and divide by 100: 15% of 200 is 200 × 15 ÷ 100 = 30. To find what percent one number is of another, divide the part by the whole and multiply by 100: 30 out of 120 is 30 ÷ 120 × 100 = 25%. To find the whole when you know a part and its percentage, divide the part by the percentage and multiply by 100: if 30 is 25%, the whole is 30 ÷ 25 × 100 = 120.',
        'The trick is always to ask “percent of what?”. The number after the word “of” is the base, and the base goes on the bottom of the fraction. Most mistakes happen when the base quietly changes halfway through a problem.',
      ],
      list: [
        'Part = whole × percent ÷ 100',
        'Percent = part ÷ whole × 100',
        'Whole = part ÷ percent × 100',
      ],
    },
    {
      h: 'Percent change, discounts and the reverse trap',
      p: [
        'Percent change compares a new value with an old one: (new − old) ÷ old × 100. A price that goes from 80 to 100 rose by 25%, but a price that falls from 100 to 80 dropped by only 20%, because the base is different in each direction. That asymmetry explains a famous puzzle: take 20% off 100 and you get 80, add 20% back and you reach only 96.',
        'The same logic makes stacked discounts smaller than they look. An extra 20% off a price already reduced by 30% is not 50% off; it is 0.7 × 0.8 = 0.56 of the original, a 44% discount. To undo a percentage change, divide instead of subtracting. If a jacket costs 80 after 20% off, the original price was 80 ÷ 0.8 = 100. If a bill of 110 includes 10% tax, the amount before tax was 110 ÷ 1.1 = 100, not 99. The “Original value” tab shows this division and even warns you about the tempting wrong answer.',
      ],
    },
    {
      h: 'Percent versus percentage points',
      p: [
        'When two percentages are compared, there are two honest ways to describe the gap, and they give very different numbers. If a savings rate rises from 4% to 6%, it went up by 2 percentage points: you simply subtract one rate from the other. In relative terms the rate grew by 50%, because the increase of 2 is half of the starting 4. News reports and adverts sometimes pick whichever sounds more dramatic, so it pays to check which one is meant.',
        'Percentage points are the right choice for interest rates, tax rates, unemployment, polls and conversion rates, where the numbers are already percentages. The “Point gap” tab gives both figures at once: the difference in points and the relative change in percent. In Korean this unit is written %p, in English often pp.',
      ],
    },
    {
      h: 'Everyday examples and mental shortcuts',
      p: [
        'You do not always need a calculator. Ten percent is the number with the decimal point moved one place left, so 10% of 64 is 6.4; five percent is half of that, and twenty percent is double. Percentages can also be swapped: 8% of 50 is the same as 50% of 8, which is 4. For a restaurant tip, find 10% and add half again to get 15%.',
        'For bigger decisions, write the formula down. Compare a salary rise with inflation by subtracting the two rates in points, check a sale price by multiplying by the remaining share instead of subtracting twice, and when a loan offer quotes a monthly rate, remember that twelve months of compounding add up to more than twelve times the rate.',
      ],
      list: [
        '25% off means you pay 0.75 of the price; 40% off means 0.6.',
        'A 50% drop needs a 100% rise to recover.',
        'Doubling is +100%; halving is −50%.',
      ],
    },
  ],
  cta: 'Open the percentage calculator',
};
