/* Ice Fishing — ja (穴釣りゲーム)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=RocknRoll+One&display=swap",
    "display": "'RocknRoll One', 'Fredoka'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "auto-phrase",
    "hyphens": "manual"
  },
  "meta": {
    "title": "穴釣りゲーム｜氷上のワカサギ釣り",
    "description": "穴釣りゲーム：凍った湖の穴に糸をたらし、アタリが来たら糸が切れないように巻き上げよう。60秒で何点釣れるかな？スマホ・PCですぐ遊べます。",
    "ogTitle": "穴釣りゲーム 🎣 60秒で何匹釣れる？",
    "ogDescription": "氷の穴に糸をたらしてアタリを待ち、そっと巻き上げよう。強く引きすぎると糸が切れます。"
  },
  "siteName": "穴釣りゲーム",
  "privacyLink": "プライバシーポリシー",
  "start": {
    "badge": "🎣 凍った湖に、小さな穴ひとつ",
    "h1Kicker": "穴釣りゲーム",
    "h1Html": "糸をたらして<br><em>釣り上げよう</em>",
    "hook": "氷の下で何かが泳いでいます。針をちょうどいい深さまで下ろし、ググッとアタリが来たら、糸が切れる前にやさしく巻き上げましょう。",
    "how": {
      "lower": "長押しで針を下ろす",
      "reel": "アタリが来たら長押しで巻く",
      "red": "赤いゾーンで指をはなす"
    },
    "start": "釣りをはじめる →",
    "facts": "1回60秒・スマホ／PC・自己ベストに挑戦"
  },
  "play": {
    "score": "スコア",
    "time": "残り",
    "secUnit": "秒",
    "pause": "一時停止",
    "paused": "一時停止中",
    "resume": "釣りを続ける",
    "hint": "氷の下を長押しすると糸が下りるよ",
    "fieldAria": "凍った湖：好きな深さを長押しで針を下ろし、アタリが来たら長押しで巻き上げます",
    "bite": "アタリ！",
    "catchPop": "{fish} +{n}",
    "snap": "糸が切れた！",
    "escape": "逃げられた…",
    "timeUp": "時間切れ！"
  },
  "fish": {
    "minnow": "ワカサギ",
    "perch": "フナ",
    "trout": "ニジマス",
    "pike": "イトウ",
    "golden": "金の魚",
    "boot": "古い長靴"
  },
  "result": {
    "over": "今回の釣果",
    "unit": "点",
    "newBest": "自己ベスト更新！",
    "best": "自己ベスト：{n}点",
    "caught": "釣れた魚",
    "snapped": "切れた糸",
    "bestCatch": "今日の大物：{fish}",
    "noCatch": "今回はボウズでした",
    "tierLabel": "あなたの釣り人レベル",
    "tiers": [
      "🧊 手がかじかむ新人",
      "🪝 穴あけ見習い",
      "🐟 じっと待てる釣り人",
      "🎣 氷上の常連",
      "⭐ 魚と話せる名人",
      "🏆 氷の湖の伝説"
    ],
    "top": "上位 {n}%",
    "beat": "釣り人の {pct}% より高得点",
    "beatAll": "これまでの全員より高得点",
    "others": "ほかの {n} 件の記録と比較",
    "comparing": "ほかの釣り人と比べています…",
    "shareTitle": "穴釣りゲーム",
    "shareText": "穴釣りゲーム60秒で{n}点釣れた 🎣 {tier}。あなたは何点？",
    "retry": "もう一度釣る"
  },
  "og": {
    "brand": "🎣 穴釣りゲーム",
    "defaultKicker": "無料の穴釣りゲーム",
    "defaultTitle": "60秒で何匹釣れる？",
    "defaultDesc": "糸をたらす・アタリ・切らずに巻く"
  },
  "faq": [
    {
      "q": "糸はどうやって下ろすの？",
      "a": "氷の下の水中をどこでも長押しすると、針がその深さへ動き、指をはなすとそこで止まります。PCなら ↓・↑ キーでもOK。魚によって好きな深さが違うので、いろいろ試してみてください。"
    },
    {
      "q": "巻き上げはどうやるの？",
      "a": "アタリが来たら長押しで糸を巻きます。巻くと右側のテンションバーが上がります。バーが赤いゾーンに入ったら少し指をはなして糸をゆるめ、また長押し。バーが満タンになると糸が切れ、ゆるめすぎると魚が外れます。"
    },
    {
      "q": "魚によって点数が違うのはなぜ？",
      "a": "大きくて深いところにいる魚ほど引きが強く、点数も高くなります。たまに現れる金の魚が最高点。古い長靴などのゴミは簡単に上がりますが0点です。自己ベストはこのブラウザに保存されます。"
    },
    {
      "q": "別のタブに移るとどうなる？",
      "a": "ページを離れたりスマホの画面を消したりすると自動で一時停止し、時間も止まります。「釣りを続ける」（または P キー）で続きから遊べます。"
    }
  ],
  "privacy": {
    "title": "プライバシーポリシー | 穴釣りゲーム",
    "description": "穴釣りゲームのプライバシーポリシー：匿名スコア、Cookie、広告、統計について。",
    "h1": "プライバシーポリシー",
    "introHtml": "穴釣りゲーム（以下「本サービス」）は、利用者のプライバシーを尊重し、以下に記載する最小限の情報のみを取り扱います。",
    "sections": [
      [
        "1. 収集する情報",
        "本サービスは会員登録やログインなしで利用できます。1回のゲームが終わると、スコアだけを、名前や個人を特定する情報なしの匿名の集計としてサーバーに送ります。利用中、以下の情報が自動的に収集されることがあります。"
      ],
      [
        "2. Cookie などの技術",
        "本サービスは、言語や自己ベストの記憶、広告の表示、利用状況の把握のために Cookie やブラウザのローカルストレージを使うことがあります。ブラウザの設定で拒否・削除できますが、その場合一部の機能が正しく動かないことがあります。"
      ],
      [
        "3. 広告（Google AdSense）",
        "本サービスは Google AdSense による広告を表示します。Google とそのパートナーは Cookie を使い、本サイトやほかのサイトへの過去のアクセスに基づいて広告を表示することがあります。詳しくは <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 広告設定</a>をご覧ください。"
      ],
      [
        "4. 統計",
        "サービス改善のため、Google Analytics（GA4）と、言語ごとの1日の合計だけを残す独自の集計（ページ閲覧数、開始・終了したゲーム数、星評価）を使うことがあります。いずれも個人を特定するものではありません。"
      ],
      [
        "5. お問い合わせ",
        "本ポリシーについてご質問があれば、サイト運営者までお問い合わせください。"
      ],
      [
        "6. 施行日",
        "本ポリシーは2026年11月10日から施行します。"
      ]
    ],
    "back": "← 穴釣りゲームに戻る"
  }
};
