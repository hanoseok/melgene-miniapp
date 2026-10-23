module.exports = {
  metaTitle: 'BMI Calculator Guide: Formula, Categories & Limitations',
  description: 'How BMI is calculated in metric and US units, what the WHO and Asian cutoffs mean, why BMI misjudges athletes, how waist-to-height ratio helps and practical tips for reading your result.',
  h1: 'BMI calculator: how body mass index works and what it misses',
  updated: '2026-10-24',
  intro: 'Body mass index, or BMI, is the number doctors, insurers and fitness apps use most often to sort adults into underweight, healthy weight, overweight and obesity. It only needs your height and weight, which makes it fast and easy to compare, but also blunt. This guide explains how the BMI calculator works, the formula behind it, what the categories mean, where BMI goes wrong and which simple measurements give a fuller picture.',
  sections: [
    {
      h: 'How to use the BMI calculator',
      p: [
        'Choose metric (centimeters and kilograms) or US units (feet, inches and pounds), then type your height and weight. Your BMI appears as soon as both are filled in, rounded to one decimal place, with a marker on a colored scale and the name of your category. Below it you can see the healthy weight range for your height and, if you are outside it, roughly how far away you are.',
        'Age and sex are optional. They do not change the number; they only add a note when it matters, for example that the calculator is meant for adults or that slightly higher values are often fine after 65. The Asian cutoffs switch applies the lower thresholds that many Asian health bodies recommend. Everything is calculated in your browser, and nothing you type is sent or stored.',
      ],
      list: [
        'Decimals work with a dot or a comma, so 70.5 and 70,5 are the same.',
        'When you switch units, the numbers you already typed are converted for you.',
        'The summary collects your BMI, category and healthy range in one card.',
      ],
    },
    {
      h: 'The BMI formula, step by step',
      p: [
        'BMI is weight in kilograms divided by height in meters squared. For someone who is 170 cm tall and weighs 65 kg, the height in meters is 1.70, squared that is 2.89, and 65 ÷ 2.89 gives a BMI of about 22.5. Because height is squared, a few centimeters make a real difference: the same 65 kg gives about 23.9 at 165 cm and about 21.2 at 175 cm.',
        'In US units the formula is 703 × weight in pounds ÷ height in inches squared. The 703 simply converts pounds and inches into kilograms and meters. A person who is 5 ft 7 in (67 inches) and weighs 145 lb has a BMI of 703 × 145 ÷ 4,489, or about 22.7. The calculator uses the exact conversions of 2.54 cm per inch and 0.45359237 kg per pound.',
      ],
      list: [
        'Metric: BMI = kg ÷ (m × m)',
        'US units: BMI = 703 × lb ÷ (in × in)',
        'Healthy weight range = 18.5 × m² up to 24.9 × m² (WHO)',
      ],
    },
    {
      h: 'What the categories mean: WHO and Asian cutoffs',
      p: [
        'The World Health Organization groups adult BMI into underweight (below 18.5), healthy weight (18.5 to 24.9), overweight (25 to 29.9) and obesity (30 or more), which is split into class 1 (30 to 34.9), class 2 (35 to 39.9) and class 3 (40 and above). The same cutoffs apply to women and men. They were chosen because, across large populations, the risk of problems such as type 2 diabetes, high blood pressure and heart disease climbs as BMI moves away from the middle range.',
        'Research in Asia found that many people of Asian descent face those risks at a lower BMI, partly because they tend to carry more body fat and more fat around the waist at the same weight. That is why the WHO Asia-Pacific guidance uses 23 as the start of overweight and 25 as the start of obesity. National bodies differ in the details: Korea follows similar cutoffs, Japan calls 25 and above obesity, and China uses 24 for overweight and 28 for obesity.',
      ],
      list: [
        'Below 18.5: underweight in every scale',
        '18.5 to 24.9: healthy weight (WHO)',
        '23 to 24.9: already overweight on the Asia-Pacific scale',
      ],
    },
    {
      h: 'What BMI cannot tell you',
      p: [
        'BMI looks only at total weight, so it cannot tell muscle from fat or show where fat sits. A rugby player or a keen weightlifter can land in the overweight or even obesity band while being lean, and an older adult who has lost muscle can have a normal BMI with too much body fat. Two people with the same BMI can have very different health.',
        'It is also not designed for everyone. Children and teenagers are assessed on growth charts that compare them with others of the same age and sex. During pregnancy, weight gain follows its own guidelines. Very tall or very short adults, and people with conditions that cause fluid retention, may also get misleading results. Treat BMI as a first screening number, not a verdict on your health or fitness.',
      ],
    },
    {
      h: 'Waist-to-height ratio and other useful checks',
      p: [
        'Fat stored around the waist is more closely linked to heart and metabolic disease than fat elsewhere, and BMI cannot see it. A simple tape measure can. Measure your waist halfway between your lowest rib and the top of your hip bone, breathing out normally, then divide it by your height in the same unit. A waist-to-height ratio below 0.5, or keeping your waist to less than half your height, is a widely used sign of lower risk.',
        'Waist circumference on its own is also used, with thresholds that vary by country and sex. Body composition scales, skinfold measurements and scans estimate body fat more directly, though home devices can be inconsistent. If your BMI and your waist measurement point in different directions, that is a good reason to talk with a doctor rather than rely on either number alone.',
      ],
      list: [
        'Waist ÷ height below 0.5: generally lower risk',
        'Measure in the morning, standing, after breathing out',
        'Use the same tape and position each time you check',
      ],
    },
    {
      h: 'Tips for reading and tracking your result',
      p: [
        'Weigh yourself at the same time of day, ideally in the morning, because weight can swing by a kilogram or more between morning and evening. Look at the trend over weeks rather than a single reading, and remember that the healthy range covers many kilograms for a reason: there is no single perfect weight. If you want to change your weight, small steady changes in sleep, movement and meals are easier to keep than strict diets.',
      ],
      list: [
        'Use your height without shoes and your weight in light clothing.',
        'Check your waist as well as your BMI.',
        'Ask a doctor before big changes, especially with a health condition.',
      ],
    },
  ],
  cta: 'Calculate your BMI now',
};
