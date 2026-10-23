module.exports = {
  metaTitle: 'BMI Rechner Ratgeber: Formel, Einstufung und Grenzen',
  description: 'So berechnen Sie den BMI in Kilogramm oder Pfund, das bedeuten die WHO-Grenzwerte und die asiatischen Werte, darum täuscht der BMI bei Sportlern und so ergänzt der Taillenumfang das Ergebnis.',
  h1: 'BMI Rechner: So funktioniert der Body-Mass-Index',
  updated: '2026-10-24',
  intro: 'Der Body-Mass-Index, kurz BMI, ist die Zahl, mit der Ärzte, Versicherungen und Fitness-Apps Erwachsene am häufigsten in Untergewicht, Normalgewicht, Übergewicht und Adipositas einteilen. Er braucht nur Größe und Gewicht, ist daher schnell berechnet, aber auch recht grob. Dieser Ratgeber erklärt, wie der BMI Rechner funktioniert, welche Formel dahintersteckt, was die Kategorien bedeuten, wo der BMI danebenliegt und welche einfachen Messungen ein vollständigeres Bild geben.',
  sections: [
    {
      h: 'So nutzen Sie den BMI Rechner',
      p: [
        'Wählen Sie die Einheiten (Zentimeter und Kilogramm oder Fuß, Zoll und Pfund) und geben Sie Größe und Gewicht ein. Sobald beide Felder ausgefüllt sind, erscheint Ihr BMI mit einer Nachkommastelle, ein Marker auf der Farbskala und der Name der Kategorie. Darunter sehen Sie das Normalgewicht für Ihre Größe und, falls Sie außerhalb liegen, ungefähr den Abstand dazu.',
        'Alter und Geschlecht sind freiwillig. Sie ändern die Zahl nicht, sondern ergänzen nur einen passenden Hinweis, etwa dass der Rechner für Erwachsene gedacht ist oder dass ab 65 ein etwas höherer Wert oft in Ordnung ist. Der Schalter „Asiatische Grenzwerte“ nutzt die niedrigeren Schwellen, die in Asien empfohlen werden. Alles wird in Ihrem Browser berechnet, nichts wird gesendet oder gespeichert.',
      ],
      list: [
        'Dezimalstellen gehen mit Komma oder Punkt: 70,5 und 70.5 sind gleich.',
        'Beim Wechsel der Einheiten werden bereits eingegebene Werte umgerechnet.',
        'Die Zusammenfassung zeigt BMI, Kategorie und Normalgewicht auf einen Blick.',
      ],
    },
    {
      h: 'Die BMI-Formel Schritt für Schritt',
      p: [
        'Der BMI ist das Gewicht in Kilogramm geteilt durch die Körpergröße in Metern zum Quadrat. Bei 1,70 m und 65 kg rechnet man 1,7 × 1,7 = 2,89 und dann 65 ÷ 2,89 ≈ 22,5. Weil die Größe quadriert wird, machen wenige Zentimeter viel aus: Dieselben 65 kg ergeben bei 1,65 m etwa 23,9 und bei 1,75 m etwa 21,2.',
        'In US-Einheiten lautet die Formel 703 × Gewicht in Pfund ÷ Größe in Zoll zum Quadrat. Die 703 rechnet Pfund und Zoll nur in Kilogramm und Meter um. Der Rechner nutzt die exakten Umrechnungen von 2,54 cm pro Zoll und 0,45359237 kg pro Pfund.',
      ],
      list: [
        'Metrisch: BMI = kg ÷ (m × m)',
        'US-Einheiten: BMI = 703 × lb ÷ (in × in)',
        'Normalgewicht = 18,5 × m² bis 24,9 × m² (WHO)',
      ],
    },
    {
      h: 'Was die Kategorien bedeuten',
      p: [
        'Die WHO teilt den BMI Erwachsener ein in Untergewicht (unter 18,5), Normalgewicht (18,5 bis 24,9), Übergewicht oder Präadipositas (25 bis 29,9) und Adipositas (ab 30), die wiederum in Grad I (30 bis 34,9), Grad II (35 bis 39,9) und Grad III (ab 40) unterteilt wird. Die Grenzen gelten für Frauen und Männer gleichermaßen. Sie wurden gewählt, weil in großen Bevölkerungsgruppen das Risiko für Typ-2-Diabetes, Bluthochdruck und Herzkrankheiten steigt, je weiter der BMI vom mittleren Bereich abweicht.',
        'Studien in Asien zeigten, dass viele Menschen asiatischer Herkunft diese Risiken schon bei niedrigerem BMI haben, unter anderem weil sie bei gleichem Gewicht oft mehr Körperfett und mehr Bauchfett tragen. Deshalb setzt die WHO für den asiatisch-pazifischen Raum Übergewicht ab 23 und Adipositas ab 25 an. Einzelne Länder weichen ab: Japan spricht ab 25 von Adipositas, China setzt Übergewicht bei 24 und Adipositas bei 28 an.',
      ],
      list: [
        'Unter 18,5: Untergewicht auf jeder Skala',
        '18,5 bis 24,9: Normalgewicht nach WHO',
        '23 bis 24,9: auf der Asien-Pazifik-Skala bereits Übergewicht',
      ],
    },
    {
      h: 'Was der BMI nicht verrät',
      p: [
        'Der BMI kennt nur das Gesamtgewicht. Er unterscheidet nicht zwischen Muskeln und Fett und zeigt nicht, wo das Fett sitzt. Ein Kraftsportler kann im Bereich Übergewicht oder sogar Adipositas landen und trotzdem schlank sein, während ein älterer Mensch mit wenig Muskulatur einen normalen BMI und zu viel Körperfett haben kann. Zwei Menschen mit demselben BMI können sehr unterschiedlich gesund sein.',
        'Er passt auch nicht für alle. Kinder und Jugendliche werden mit Perzentilkurven für Alter und Geschlecht bewertet, und für die Gewichtszunahme in der Schwangerschaft gibt es eigene Empfehlungen. Sehr große oder sehr kleine Erwachsene und Menschen mit Wassereinlagerungen bekommen ebenfalls leicht irreführende Werte. Sehen Sie den BMI als ersten Richtwert, nicht als Urteil über Ihre Gesundheit.',
      ],
    },
    {
      h: 'Taillenumfang und Taille-Größe-Verhältnis',
      p: [
        'Fett am Bauch hängt enger mit Herz- und Stoffwechselkrankheiten zusammen als Fett an anderen Stellen, und der BMI sieht es nicht. Ein Maßband reicht: Messen Sie in der Mitte zwischen unterster Rippe und Beckenkamm, nachdem Sie normal ausgeatmet haben. Ein Taillenumfang über 80 cm bei Frauen und über 94 cm bei Männern gilt in Deutschland oft als erhöht.',
        'Beliebt ist auch das Verhältnis von Taille zu Körpergröße: Bleibt es unter 0,5, ist die Taille also kleiner als die halbe Körpergröße, gilt das Risiko meist als geringer. Körperfettwaagen und bildgebende Verfahren schätzen das Körperfett direkter, wobei Geräte für zu Hause oft ungenau sind. Wenn BMI und Taillenumfang in verschiedene Richtungen zeigen, sprechen Sie am besten mit Ihrer Ärztin oder Ihrem Arzt.',
      ],
      list: [
        'Taille ÷ Größe unter 0,5: meist geringeres Risiko',
        'Morgens im Stehen nach dem Ausatmen messen',
        'Immer dasselbe Maßband und dieselbe Stelle verwenden',
      ],
    },
    {
      h: 'Tipps zum Lesen und Verfolgen Ihres Ergebnisses',
      p: [
        'Wiegen Sie sich zur gleichen Tageszeit, am besten morgens, denn das Gewicht kann zwischen Morgen und Abend um ein Kilo oder mehr schwanken. Achten Sie auf den Verlauf über mehrere Wochen statt auf einen Einzelwert, und denken Sie daran, dass der Normalbereich aus gutem Grund mehrere Kilo umfasst: Das eine perfekte Gewicht gibt es nicht. Wer abnehmen oder zunehmen möchte, kommt mit kleinen, dauerhaften Änderungen bei Schlaf, Bewegung und Essen weiter als mit strengen Diäten.',
      ],
      list: [
        'Größe ohne Schuhe messen, Gewicht in leichter Kleidung.',
        'Neben dem BMI auch den Taillenumfang prüfen.',
        'Vor großen Veränderungen ärztlichen Rat einholen.',
      ],
    },
  ],
  cta: 'Jetzt BMI berechnen',
};
