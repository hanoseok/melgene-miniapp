/* BMI Rechner — Deutsch. Gleiche Schlüssel und Platzhalter wie en.js (siehe Kommentare). Ansprache: Sie. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'BMI Rechner – Body-Mass-Index für Erwachsene',
    description: 'Kostenloser BMI Rechner für Erwachsene: Größe und Gewicht in cm/kg oder ft/lb eingeben und sofort Body-Mass-Index, WHO-Einstufung auf einer Farbskala und Ihr Normalgewicht sehen.',
    ogTitle: 'BMI Rechner ⚖️ Ihr BMI und Ihr Normalgewicht',
    ogDescription: 'Body-Mass-Index in cm/kg oder ft/lb, WHO- und asiatische Grenzwerte und das Normalgewicht für Ihre Größe.',
  },
  siteName: 'BMI Rechner',
  privacyLink: 'Datenschutz',

  hero: {
    h1Kicker: 'BMI Rechner',
    h1Html: 'Ihr BMI, <em>sofort beim Tippen</em>',
    hook: 'Größe und Gewicht eingeben: Ihr BMI erscheint auf einer Farbskala, dazu das Normalgewicht für Ihre Größe.',
  },

  ui: {
    unitsLabel: 'Einheiten',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Größe',
    weight: 'Gewicht',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Alter und Geschlecht (optional)',
    less: '− Alter und Geschlecht ausblenden',
    age: 'Alter',
    years: 'J.',
    sex: 'Geschlecht',
    sexNone: 'Keine Angabe',
    female: 'Frau',
    male: 'Mann',
    asiaToggle: 'Asiatische Grenzwerte',
    yourBmi: 'Ihr BMI',
    waiting: 'Geben Sie Größe und Gewicht ein, dann erscheint hier Ihr BMI.',
    scaleLabel: 'BMI-Skala',
    rangeTitle: 'Normalgewicht für Ihre Größe',
    toLose: 'Etwa {w} über dem Normalbereich',
    toGain: 'Etwa {w} unter dem Normalbereich',
    inRange: 'Sie liegen im Normalbereich.',
    under18: 'Dieser Rechner gilt für Erwachsene ab 18. Bei Kindern und Jugendlichen wird der BMI mit alters- und geschlechtsabhängigen Perzentilkurven bewertet, die Einstufung oben passt also nicht.',
    senior: 'Ab 65 gilt ein etwas höherer BMI oft als unbedenklich. Was für Sie passt, sagt Ihnen Ihre Ärztin oder Ihr Arzt.',
    sexNote: 'Die BMI-Grenzwerte für Erwachsene sind für Frauen und Männer gleich, auch wenn Frauen bei gleichem BMI meist mehr Körperfett haben.',
    disclaimerTitle: 'Gut zu wissen',
    disclaimer: [
      'Der BMI ist ein grober Richtwert, keine Diagnose und keine ärztliche Beratung.',
      'Er unterscheidet nicht zwischen Muskeln und Fett, daher liegen Sportler oft höher.',
      'Er gilt nicht in der Schwangerschaft, und dieser Rechner ist für Erwachsene ab 18.',
    ],
    decimalHint: 'Dezimalzeichen: „.“ und „,“ funktionieren beide.',
    finish: 'Zusammenfassung ✓',
    needOne: 'Bitte zuerst Größe und Gewicht eingeben.',
    localNote: 'Wird nur auf Ihrem Gerät berechnet. Ihre Eingaben werden weder gesendet noch gespeichert.',
    summaryTitle: 'Ihr BMI im Überblick',
    summaryNote: 'Diese Zusammenfassung gibt es nur auf dieser Seite. Nichts wird gespeichert.',
    sumScale: 'Grenzwerte',
    sumRange: 'Normalgewicht',
    again: 'Neu starten',
    live: 'BMI {bmi}, {cat}',
    shareTitle: 'BMI Rechner',
    shareText: 'BMI und Normalgewicht für die eigene Größe in Sekunden berechnen ⚖️',
  },

  scales: {
    who: {
      name: 'WHO',
      note: 'Einstufung der Weltgesundheitsorganisation für Erwachsene.',
      labels: ['Untergewicht', 'Normalgewicht', 'Übergewicht', 'Adipositas Grad I', 'Adipositas Grad II', 'Adipositas Grad III'],
    },
    alt: {
      name: 'Asien-Pazifik',
      note: 'WHO-Grenzwerte für Asien-Pazifik (2000): Bei vielen Menschen asiatischer Herkunft steigen Gesundheitsrisiken schon bei niedrigerem BMI.',
      labels: ['Untergewicht', 'Normalgewicht', 'Übergewicht (Risiko)', 'Adipositas Grad I', 'Adipositas Grad II'],
    },
  },

  errors: {
    badNum: 'Bitte nur Ziffern eingeben, mit „.“ oder „,“ als Dezimalzeichen.',
    heightRange: 'Bitte die Größe prüfen: Sie sollte zwischen 50 und 272 cm liegen.',
    weightRange: 'Bitte das Gewicht prüfen: Es sollte zwischen 10 und 650 kg liegen.',
    inchRange: 'Zoll bitte unter 12 angeben, ganze Fuß ins erste Feld.',
    ageRange: 'Das Alter bitte als ganze Zahl zwischen 2 und 120 eingeben.',
  },

  og: {
    brand: '⚖️ BMI Rechner',
    kicker: 'Größe · Gewicht · BMI',
    title: 'Wo liegt Ihr BMI auf der Skala?',
    desc: 'Mit dem Normalgewicht für Ihre Größe',
  },

  faq: [
    { q: 'Wie wird der BMI berechnet?', a: 'Gewicht in Kilogramm geteilt durch die Körpergröße in Metern zum Quadrat. Bei 1,70 m und 65 kg sind das 65 ÷ (1,7 × 1,7) ≈ 22,5. Geben Sie Fuß und Pfund ein, rechnet der Rechner automatisch um.' },
    { q: 'Welcher BMI ist bei Erwachsenen normal?', a: 'Die WHO stuft 18,5 bis 24,9 als Normalgewicht ein, 25 bis 29,9 als Übergewicht und ab 30 als Adipositas. Für Menschen asiatischer Herkunft werden oft niedrigere Grenzen empfohlen, die Sie mit dem Schalter „Asiatische Grenzwerte“ einblenden können.' },
    { q: 'Warum ist mein BMI hoch, obwohl ich viel trainiere?', a: 'Der BMI kennt nur Gewicht und Größe und weiß nicht, ob das Gewicht aus Muskeln oder Fett besteht. Kräftige Sportler landen daher oft im Bereich Übergewicht. Taillenumfang oder eine Körperfettmessung sagen mehr.' },
    { q: 'Gilt der Rechner auch für Kinder oder Schwangere?', a: 'Nein. Unter 18 Jahren werden alters- und geschlechtsabhängige Perzentilkurven genutzt, und für die Gewichtszunahme in der Schwangerschaft gibt es eigene Empfehlungen. Fragen Sie dazu Ihre Ärztin, Ihren Arzt oder Ihre Hebamme.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | BMI Rechner',
    description: 'Datenschutzerklärung des BMI Rechners: Größe, Gewicht und Alter bleiben in Ihrem Browser, dazu Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der BMI Rechner (der „Dienst“) respektiert Ihre Privatsphäre und verarbeitet nur die unten beschriebenen, notwendigen Daten.',
    sections: [
      ['1. Erhobene Daten', 'Der Dienst funktioniert ohne Konto und ohne Anmeldung. Größe, Gewicht, Alter und Geschlecht, die Sie eingeben, werden nur in Ihrem Browser berechnet. Sie werden nicht an unseren Server gesendet, nicht gespeichert und in keinen Link geschrieben. Der Dienst merkt sich auf Ihrem Gerät nur die zuletzt genutzten Einheiten (cm/kg oder ft/lb). Wenn Sie die Teilen-Schaltflächen nutzen, werden nur die Seitenadresse und ein kurzer Text ohne Ihre Werte geteilt, und zwar nur mit den Personen, die Sie auswählen.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher Ihres Browsers nutzen, um Sprache und Einheiten zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Sie können dies in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Ihre Einstellungen finden Sie in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) und eigene zusammengefasste Zähler, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, Berechnungen, Bewertungen). Ihre Körperwerte fließen nie in diese Zahlen ein, und nichts davon identifiziert Sie persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 24. Oktober 2026.'],
    ],
    back: '← Zurück zum BMI Rechner',
  },
};
