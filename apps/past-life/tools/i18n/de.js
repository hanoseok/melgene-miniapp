/* Früheres-Leben-Test — Deutsch (/de/)
 * Same 16 archetype ids and question/choice order as data.js (scoring weights live only there).
 * Reader is addressed as "du"; German quotes „…“. Korean roles get a one-clause explanation with German hooks
 * („Dae Jang Geum – Das Juwel im Palast“, „Fortsetzung folgt“, „Undercover Boss“, Deutsche Bahn punctuality joke).
 * Keys ending in Html are raw HTML; privacy.sections bodies are HTML too. No spoilers in meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Früheres-Leben-Test: Wer war ich früher?',
    description: 'Kostenloser Früheres-Leben-Test: 12 Fragen zu deinem Alltag, 2 Minuten – finde heraus, wer du in deinem früheren Leben warst. Ohne App, ohne Anmeldung.',
    ogTitle: 'Früheres-Leben-Test – Wer warst du in deinem früheren Leben?',
    ogDescription: 'Kostenloser Früheres-Leben-Test: 12 Fragen, 2 Minuten, 16 mögliche frühere Leben. Wer warst du?',
  },
  siteName: 'Früheres-Leben-Test',
  landing: {
    badge: '🔮 Mehr Spaß als dein Horoskop',
    h1Kicker: 'Früheres-Leben-Test',
    h1Html: 'Wer warst du im<br><em>früheren Leben</em>?',
    hookHtml: 'Zwölf Fragen. Zwei Minuten.<br>Dann triffst du dein vergessenes Ich.',
    metaTime: '⏱️ 2 Minuten',
    metaResults: '📜 16 frühere Leben',
    start: 'Zeig mir, wer ich war →',
    backAria: 'Vorherige Frage',
    loading: 'Wir entstauben deine Erinnerungen…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Wie funktioniert der Früheres-Leben-Test?', a: 'Jede deiner 12 Antworten verteilt Punkte auf ein paar mögliche frühere Leben. Das Leben mit den meisten Punkten ist dein Ergebnis. Alle Sprachversionen rechnen exakt gleich.' },
    { q: 'Stimmt das Ergebnis wirklich?', a: 'Der Test ist zum Spaß gedacht, nicht als Wahrsagerei – ein augenzwinkernder Spiegel deiner Alltagsgewohnheiten. Trotzdem finden sich viele in ihrem Ergebnis verblüffend gut wieder.' },
    { q: 'Kann ich ein anderes Ergebnis bekommen?', a: 'Ja. Dein Ergebnis hängt nur von deinen Antworten ab. Wenn du anders antwortest, landest du vielleicht in einem ganz anderen früheren Leben.' },
    { q: 'Werden meine Antworten gespeichert?', a: 'Nein. Deine Antworten werden direkt in deinem Browser ausgewertet und weder gesendet noch gespeichert. Eine Anmeldung brauchst du nicht.' },
  ],
  privacyLink: 'Datenschutzerklärung',
  result: {
    title: 'Früheres-Leben-Test: {name}',
    shareText: 'Mein früheres Leben: {name} {emoji} – „{tagline}“. Und wer warst du?',
    ctaStrong: 'Jemand hat sein früheres Leben mit dir geteilt',
    ctaSub: 'Neugierig, wer du warst? Dauert nur 2 Minuten.',
    eyebrow: 'In deinem früheren Leben warst du',
    adviceLabel: 'Tipp für dieses Leben –',
    good: 'Seelenverwandt',
    bad: 'Erzfeind',
    retry: 'Test noch mal machen',
  },
  og: {
    eyebrow: 'In deinem früheren Leben warst du',
    brand: '🔮 Früheres-Leben-Test',
    defaultTitle: 'Früheres-Leben-Test',
    defaultDesc: '12 Fragen, 2 Minuten. Wer warst du in deinem früheren Leben?',
  },
  privacy: {
    description: 'Datenschutzerklärung für den Früheres-Leben-Test – wie wir Cookies, Werbung und Analyse-Tools einsetzen.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der Früheres-Leben-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die Informationen, die unbedingt nötig sind – wie im Folgenden beschrieben.',
    sections: [
      ['1. Welche Daten wir erheben', 'Du kannst den Dienst ohne Registrierung oder Login nutzen. Deine Antworten im Test werden ausschließlich in deinem Browser verarbeitet und niemals auf unseren Servern gespeichert. Bei der Nutzung des Dienstes können jedoch einige Informationen automatisch erfasst werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um dir Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites zu zeigen. Mehr dazu erfährst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>, wo du personalisierte Werbung auch anpassen kannst.'],
      ['4. Analyse (Google Analytics)', 'Der Dienst kann Google Analytics (GA4) verwenden, um Besucherzahlen und Zugriffsquellen zu verstehen und den Dienst zu verbessern. Diese Daten werden nur statistisch ausgewertet und lassen keine Rückschlüsse auf deine Person zu.'],
      ['5. Kontakt', 'Wenn du Fragen zu dieser Datenschutzerklärung hast, wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Datenschutzerklärung gilt ab dem 1. Januar 2026.'],
    ],
    back: '← Zurück zum Früheres-Leben-Test',
  },

  types: {
    sura: {
      name: 'Chefköchin der koreanischen Königsküche',
      tagline: 'Eine Prise Salz entschied über die Laune des Königs',
      story: 'In der Königsküche der koreanischen Joseon-Dynastie – ja, genau die aus dem K-Drama „Dae Jang Geum – Das Juwel im Palast“ – entschied sich an deinen Fingerspitzen, wie der König an diesem Tag gelaunt war. Wichtiger als „zu salzig oder zu fad?“ war die Frage „Für wen ist dieses Essen eigentlich?“, und du wusstest die Antwort immer als Erste. Dutzende Küchenhelferinnen hattest du im Griff, alles lief wie ein Uhrwerk – aber in dein Rezeptbuch durfte nie jemand schauen. Perfektionismus pur: Jeden Tag die beste Tafel des Palastes aufzutischen, war dein ganzer Stolz.',
      traits: ['Essen und Stimmung – beides muss perfekt sein', 'Lässt lieber Ergebnisse sprechen als Tratsch', 'Für deine Leute öffnest du die ganze Speisekammer'],
      advice: 'Du darfst ruhig mal zu kräftig würzen. Das verzeiht dir jeder.',
    },
    celadon: {
      name: 'Seladon-Meistertöpfer aus Goryeo',
      tagline: 'Tausend Vasen gebrannt, die meisten aus Prinzip zertrümmert',
      story: 'Nächtelang hast du am Brennofen gewacht, fest entschlossen, die legendäre jadegrüne Glasur der koreanischen Goryeo-Dynastie nachzuschaffen – eine Farbe, so begehrt, dass chinesische Gesandte davon nach Hause schrieben. War der Farbton auch nur ein bisschen daneben, griffst du ohne zu zögern zum Hammer, während deine Lehrlinge auf Zehenspitzen um Maßstäbe herumschlichen, die sie nie ganz verstanden. Für dich war eine Seladon-Vase kein Geschirr, sondern ein Stück Himmel. Deine Fehlversuche waren viel zahlreicher als deine fertigen Werke – doch in Erinnerung geblieben sind die Meisterstücke.',
      traits: ['Ansprüche: hoch. Viel zu hoch.', 'Langsam, aber dafür richtig', 'Leise, aber extrem stur'],
      advice: 'Versuch Nummer 99 darf auch mal der letzte sein. Schön ist er trotzdem.',
    },
    hwarang: {
      name: 'Hwarang-Ritter aus Silla',
      tagline: 'Aussehen und Können auf Olympia-Niveau – schon im 6. Jahrhundert',
      story: 'Spitze im Schwertkampf und in den Wissenschaften – und obendrein wahnsinnig beliebt. Du warst das Ass der Hwarang, der „Blumenritter“, einer Elite-Jugend im alten koreanischen Königreich Silla. Selbst wenn du durch Berge und Täler zogst, um Körper und Geist zu stählen, jubelte dir irgendwo eine Schar heimlicher Fans zu. Ehre war dir wichtiger als das Leben, und unfair zu gewinnen fandest du peinlicher als zu verlieren. Ob auf dem Schlachtfeld oder auf dem Marktplatz: Dein Name war immer Stadtgespräch.',
      traits: ['Landet überall ganz von selbst im Mittelpunkt', 'Ehre und Prinzipien sind dir heilig', 'Sobald es ums Gewinnen geht, ändert sich dein Blick'],
      advice: 'Zusammen Spaß haben zahlt sich genauso aus wie Gewinnen.',
    },
    viking: {
      name: 'Steuermann der Wikinger',
      tagline: 'Was auf keiner Karte stand, reizte dich erst recht',
      story: 'Wenn du dein Langschiff in den Nebel der Nordsee gesteuert hast, hieß „gefährlich“ für dich einfach „klingt nach Spaß“. Für den Nervenkitzel, eine Küste zu entdecken, die noch auf keiner Karte stand, war ein Sturm oder zwei ein fairer Preis. Sesshaft werden? Niemals – Fernweh war bei dir Dauerzustand, und die nächste Fahrt reizte dich immer mehr. Deine Crew wurde manchmal nervös, folgte dir aber trotzdem. Schließlich bist du jedes Mal lebend zurückgekommen.',
      traits: ['Bei allem Neuen leuchten deine Augen', 'In der Krise seltsam gelassen', 'Zu lange an einem Ort macht dich unruhig'],
      advice: 'Manchmal darfst du auch einfach den Anker werfen und genießen, wo du bist.',
    },
    pharaoh_cat: {
      name: 'Die Katze des Pharaos',
      tagline: 'Als Gottheit verehrt, den ganzen Tag verschlafen',
      story: 'In den Palästen des alten Ägypten warst du eine Katze, die wie eine Gottheit verehrt wurde. Hast du irgendetwas Besonderes getan? Nein. Du hast dich einfach ins beste Sonnenfleckchen gesetzt und zugesehen, wie die Menschen dich ganz von allein anbeteten. Aber sobald du auch nur leicht genervt geschaut hast, geriet der ganze Palast in Panik – nur redet darüber niemand gern. Du schienst rein gar nichts zu tun, und doch hattest du allein durch deine Anwesenheit alles im Griff.',
      traits: ['Beobachtet elegant, bewegt sich minimal', 'Dreht mit einem Blick die Stimmung im Raum', 'Ein Genie darin, sich vor Pflichten zu drücken'],
      advice: 'Auch Götter werden mehr verehrt, wenn sie sich ab und zu selbst blicken lassen.',
    },
    renaissance: {
      name: 'Lehrling eines Renaissance-Malers',
      tagline: 'Beim Farbenanrühren als heimliches Talent aufgeflogen',
      story: 'In einer Florentiner Werkstatt hast du im Schatten eines großen Meisters Pigmente zerrieben und Pinsel ausgewaschen. Doch eines Tages, als der Meister außer Haus war, hast du eine Ecke des Hintergrunds ausgemalt – und ausgerechnet die wurde zur natürlichsten Stelle des ganzen Bildes. Dein Können hast du still aufgebaut, von niemandem bemerkt, aber stetig. In deiner Pinselspitze steckte ein Traum: eines Tages ein Gemälde mit deinem eigenen Namen.',
      traits: ['Ein ungewöhnlich scharfes Auge fürs Detail', 'Leise brillant, ganz ohne Tamtam', 'Zu viel Geschmack, um „passt schon“ gelten zu lassen'],
      advice: 'Dein Können ist so weit. Zeit, deine Bilder selbst zu signieren.',
    },
    jeongi: {
      name: 'Star-Erzähler im alten Seoul',
      tagline: 'Sagte „Fortsetzung folgt“ schon 200 Jahre vor Netflix',
      story: 'Auf den Märkten des alten Seoul ließen die Leute alles stehen und liegen, sobald du auftauchtest. Du warst ein Jeongisu – ein Berufserzähler, der der Menge beliebte Romane vorlas. Dein Markenzeichen: genau an der spannendsten Stelle abbrechen, „Fortsetzung folgt“, und warten, bis die Münzen regneten. Ehrlich gesagt war die Hälfte der Geschichte spontan erfunden, aber so überzeugend, dass es nie jemand merkte. In deinen Händen wurde selbst der Tratsch aus der Nachbarschaft zum Epos.',
      traits: ['Ein Talent dafür, jede Geschichte auszuschmücken', 'Perfektes Timing und Gespür für die Stimmung', 'Weiß genau, wie man die Leute zusammentrommelt'],
      advice: 'Manchmal darfst du auch einfach verraten, wie es ausgeht.',
    },
    silkroad: {
      name: 'Karawanenhändler auf der Seidenstraße',
      tagline: 'Mit jeder Grenze kamen neue Freunde dazu',
      story: 'Mit Seide und Gewürzen im Gepäck hast du Wüsten und verschneite Gebirgspässe überquert, und fremde Sprachen waren nie ein Problem: ein paar Gesten, ein Grinsen, und der Deal stand. In jeder Oasenstadt wartete jemand, der dich mit offenen Armen empfing – und genau dieses Netzwerk war dein größtes Kapital. Du hast unterwegs nicht nur Waren hinterlassen, sondern vor allem Freundschaften: ein geborener Weltenbummler und das ultimative Kontaktwunder.',
      traits: ['Findet überall im Nu Freunde', 'Handelt clever, ohne die Herzlichkeit zu verlieren', 'Kommt in fremden Kulturen blitzschnell an'],
      advice: 'Manchmal darfst du ein Geschenk auch einfach annehmen, ganz ohne Feilschen.',
    },
    monk_scribe: {
      name: 'Klosterschreiber im Mittelalter',
      tagline: 'Bei Kerzenlicht abgeschrieben, ohne einen einzigen Tippfehler',
      story: 'In einem mittelalterlichen Kloster in Europa war es deine Aufgabe, den ganzen Tag heilige Schriften auf Pergament abzuschreiben. Völlig vertieft, ohne je zur Seite zu schauen – und trotzdem hast du heimlich alberne kleine Zeichnungen an den Rand gekritzelt. Wo andere nur endlose Wiederholung sahen, fandest du deinen eigenen Rhythmus und deine Ruhe. (Wirklich wahr: Echte mittelalterliche Handschriften sind voller Randkritzeleien, etwa Ritter im Kampf gegen Riesenschnecken.)',
      traits: ['Einmal im Tunnel, verschwindet die Welt', 'Außen still, innen urkomisch', 'Kann nicht mal einen winzigen Fehler durchgehen lassen'],
      advice: 'Klapp das Buch zu und schnapp frische Luft. Die Welt geht schon nicht unter.',
    },
    pirate_cook: {
      name: 'Smutje auf einem Piratenschiff',
      tagline: 'Nie ein Schwert gezogen und trotzdem das Schiff regiert',
      story: 'Du hast kein einziges Mal gekämpft, und trotzdem war dein Wort an Bord Gesetz: Selbst wenn ihnen das Abendessen nicht schmeckte, traute sich nicht mal der raueste Pirat, zu meckern. Unter lauter harten Seebären warst du die eine sanfte Seele, und an schlechten Tagen schlichen sie sich in die Kombüse, um sich ein bisschen Trost abzuholen. Rau, aber herzlich und besser im Kümmern als alle anderen: die wahre Macht hinter dem Kapitän.',
      traits: ['Zeigt Liebe durch Taten – vor allem durchs Füttern', 'Passt auch in raue Runden bestens rein', 'Überraschend weichherzig und fürsorglich'],
      advice: 'Hör auf, dich immer nur um alle anderen zu kümmern. Lass dich auch mal umsorgen.',
    },
    amhaeng: {
      name: 'Geheiminspektor des Königs von Joseon',
      tagline: 'Versteckte das Abzeichen des Königs unter Bettlerlumpen',
      story: 'Du bist in Lumpen über die Märkte geschlurft, doch im Ärmel trugst du das Mapae – das königliche Pferdeabzeichen, das dich als Geheiminspektor des Königs auswies, ausgesandt, um korrupte Beamte zu entlarven. Drei Sätze von einem krummen Amtmann, und du hast die Lüge gerochen; im entscheidenden Moment hast du dich zu erkennen gegeben und den Spieß umgedreht. Quasi „Undercover Boss“, nur im Auftrag des Königs. Die Wahrheit zu sehen, während alle anderen auf den Schein hereinfielen? Das war dein Kick. Nur mit deinem Gerechtigkeitssinn bewaffnet, zogst du als verdeckter Problemlöser durch ganz Joseon.',
      traits: ['Entlarvt Lügen mit unheimlicher Treffsicherheit', 'Schaut hinter die Fassade auf das Echte', 'Wenn du im Recht bist, ziehst du es durch'],
      advice: 'Nicht jeder hat etwas zu verbergen. Manchmal darfst du einfach vertrauen.',
    },
    gladiator: {
      name: 'Römischer Gladiator',
      tagline: 'Superstar im Kolosseum, heimlich ein totaler Angsthase',
      story: 'Sobald du das Kolosseum betreten hast, skandierte die Menge deinen Namen. Hinter diesem charismatischen Gesicht steckte jemand, dem jedes einzelne Mal die Knie schlotterten – aber das hat nie jemand gemerkt. „Nur noch dieser eine Kampf, dann setz ich mich zur Ruhe und mach ’ne kleine Taverne auf“, hast du dir gesagt … und dann doch wieder zum Schwert gegriffen. Mit weichen Knien, aber trotzdem immer rein in die Arena: ein Star mit ganz schön überraschendem Charme.',
      traits: ['Versteckt Nervosität wie ein Profi', 'Deine Präsenz explodiert, sobald du auf der Bühne stehst', 'Hegt heimlich kleine, bescheidene Träume'],
      advice: 'Wenn du zugibst, dass du Angst hast, respektiert dich deshalb niemand weniger.',
    },
    teahouse: {
      name: 'Teehausbesitzer der Qing-Dynastie',
      tagline: 'Konnte dir deine Sorgen an der Nasenspitze ansehen',
      story: 'In einer Seitengasse im China der Qing-Zeit war dein Teehaus nie leer. Berühmter als dein Tee war deine Intuition: Kaum hatte sich ein Gast hingesetzt, wusstest du schon ziemlich genau, wie sein Tag gelaufen war. Gerüchte, Herzensgespräche, Lebensratschläge – alles begann in diesem kleinen Teehaus. Du hast nie gedrängt; du hast einfach eine Tasse eingeschenkt, und irgendwie ging es den Leuten schon besser.',
      traits: ['Liest die Stimmung im Raum in Sekunden', 'Ruhig und gelassen, egal was passiert', 'Bei dir schütten die Leute ganz von selbst ihr Herz aus'],
      advice: 'Lass die Sorgen der anderen mal beiseite und erzähl von deinen.',
    },
    ninja_mailman: {
      name: 'Ninja der Edo-Zeit (eigentlich Briefträger)',
      tagline: 'Lautlos wie ein Schatten, pünktlicher als die Deutsche Bahn',
      story: 'Du warst ein echter, hart ausgebildeter Ninja – aber deine eigentliche Mission war es, heimlich Briefe zuzustellen. Dein ganzes Talent fürs Springen über Dächer und Klettern an Mauern floss in eine einzige Sache: präzise liefern und niemals, wirklich niemals zu spät kommen. Kein einziger Brief ging je verloren. Alle stellten sich spektakuläre Missionen vor, doch du lebtest jeden Tag mit dem bescheidenen Stolz der pünktlichen Zustellung. Am Ende warst ausgerechnet du der zuverlässigste Mensch weit und breit.',
      traits: ['Erledigt jeden Job präzise und perfekt', 'Verdient sich Respekt durch Beständigkeit, nicht durch Show', 'Hat einen verschmitzten, überraschenden Humor'],
      advice: 'Versteck dein Können nicht länger. Gib ruhig ein bisschen damit an.',
    },
    atlantis: {
      name: 'Leuchtturmwärter von Atlantis',
      tagline: 'Ließ das Licht brennen, während die Stadt versank',
      story: 'In der sagenhaften Stadt Atlantis, in jener Nacht, als die Wellen immer höher stiegen, hast du das Leuchtfeuer am Brennen gehalten. Mitten im Schrecken einer versinkenden Stadt warst du der eine Mensch, der ruhig blieb und seinen Posten hielt. Deinetwegen schafften es die letzten Schiffe sicher aus dem Hafen. Nicht spektakulär – aber genau die Art von Mensch, die irgendwer, irgendwo unbedingt braucht.',
      traits: ['Je größer die Krise, desto ruhiger wirst du', 'Hat die stille Kraft, die Stellung zu halten', 'Denkt viel tiefer, als man ahnt'],
      advice: 'Du darfst dich auch mal an das Licht eines anderen anlehnen.',
    },
    balhae: {
      name: 'Berittener Bogenschütze aus Balhae',
      tagline: 'Traf immer ins Schwarze – selbst im vollen Galopp',
      story: 'Durch die eisigen Winde des Nordens bist du geprescht, über die Weiten von Balhae – einem alten Königreich im fernen Nordosten, in der heutigen Mandschurei –, und dein Bogen hat nie gezittert. Unzählige Male hast du für diesen einen Moment trainiert: vom Pferd in vollem Galopp mitten ins Ziel zu treffen. Deiner Einheit warst du treu bis zum Letzten, du bist immer vorneweg geritten, und deine Kameraden folgten dir ohne Zögern. Tempo und Präzision zugleich: eine seltene Kombination.',
      traits: ['Bleibt treffsicher, auch wenn alles schnell geht', 'Deiner Truppe gegenüber absolut loyal', 'Hast du ein Ziel, gehst du direkt drauf los'],
      advice: 'Manchmal darfst du auch einfach losreiten – ganz ohne Zielscheibe.',
    },
  },

  questions: [
    {
      q: 'Du triffst dich mit Freunden. Was machst du meistens?',
      choices: [
        'Ich lege erst mal fest, was gegessen wird. Das Essen macht die Stimmung.',
        'Ich sitze in einer Ecke und beobachte still, was passiert.',
        'Ich werde ganz automatisch zur Stimmungskanone.',
        'Ich halte Ausschau nach neuen Orten und neuen Gesichtern.',
      ],
    },
    {
      q: 'Plötzlich geht etwas schief. Wie reagierst du?',
      choices: [
        'Ich gähne erst mal. Irgendwer wird’s schon richten.',
        'Ich bohre still für mich nach, bis ich die Ursache finde.',
        'Ich mache daraus eine urkomische Geschichte für später.',
      ],
    },
    {
      q: 'Wie planst du eine Reise?',
      choices: [
        'Ich hake so viele Länder ab wie menschenmöglich.',
        'Mein Ziel: mich mit Einheimischen anfreunden.',
        'Die ganze Route richtet sich nach dem Essen.',
      ],
    },
    {
      q: 'Jemand aus deinem Freundeskreis wurde unfair behandelt. Was tust du?',
      choices: [
        'Ich sage: „Okay, sammeln wir erst mal Beweise.“',
        'Ich lege sofort los und schaue mir die Sache direkt an.',
        'Ich koche erst mal Tee und höre in Ruhe zu.',
        'Ich helfe still im Hintergrund.',
      ],
    },
    {
      q: 'Die Deadline rückt näher, und du hast null Ideen. Was tust du?',
      choices: [
        'Licht aus, ins Leere starren – und plötzlich macht es Klick.',
        'Ich haue schnell ein paar Entwürfe raus und nehme den besten.',
        'Erst wenn alle Unterlagen und Quellen perfekt beisammen sind, fange ich an.',
      ],
    },
    {
      q: 'Wie kaufst du ein?',
      choices: [
        'Ich schaue immer wieder, bis ich genau das Richtige finde.',
        'Sofort kaufen. Bereuen kann ich später.',
      ],
    },
    {
      q: 'Deine Rolle im Gruppenprojekt?',
      choices: [
        'Ich gebe die Richtung vor und ziehe alle mit.',
        'Ich erledige still meinen Teil – und zwar perfekt.',
        'Ich kümmere mich um die Details und den letzten Schliff.',
      ],
    },
    {
      q: 'Was würdest du auf Social Media posten?',
      choices: [
        'Ein richtig gutes Foto von mir.',
        'Geschichten über faszinierende Menschen, die ich auf Reisen getroffen habe.',
        'Einen Satz aus dem Buch, das ich heute gelesen habe.',
        'Ein Foto von dem Gericht, das ich gerade gekocht habe.',
      ],
    },
    {
      q: 'Jemand bittet dich um Rat. Was machst du?',
      choices: [
        'Ich sortiere erst mal die Fakten.',
        'Ich rege mich gleich mit auf.',
        'Ich höre still zu und tröste.',
      ],
    },
    {
      q: 'Wie lernst du am liebsten etwas Neues?',
      choices: [
        'Schritt für Schritt nach Anleitung, ohne Fehler.',
        'Erst still beobachten und mir alles selbst erschließen.',
        'Direkt reinspringen und ein Gefühl dafür bekommen.',
      ],
    },
    {
      q: 'Du bist zu spät für eine Verabredung. Was tust du?',
      choices: [
        'Zu spät bin ich eh – also schlendere ich rein und such mir erst mal einen Platz.',
        'Ich berechne die Route so genau, dass ich perfekt getimt ankomme.',
        'Ich komme zu spät, aber mit großem Auftritt.',
        'Ich probiere bei der Gelegenheit gleich eine ganz neue Route aus.',
      ],
    },
    {
      q: 'Fass deinen Tag in einem Satz zusammen:',
      choices: [
        'Allen lästigen Aufgaben ausgewichen. Perfekter Tag.',
        'In etwas Kleinem ein bisschen Schönheit entdeckt.',
        'Du glaubst nicht, was mir heute passiert ist.',
      ],
    },
  ],
};
