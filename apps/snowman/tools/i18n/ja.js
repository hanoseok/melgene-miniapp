/* 雪だるま作り — 日本語 (/ja/)。キー構造は en.js と同じ。{name} {n} {max} はそのまま残す。
 * editor.namePresets は日本語で考えた雪だるまの名前（各20文字以内）で、英語の翻訳ではない。
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Mochiy+Pop+One&family=Yusei+Magic&display=swap",
    display: "'Mochiy Pop One', 'Nunito'",
    displayWeight: 400,
    script: "'Yusei Magic'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "auto-phrase",
    hyphens: "manual"
  },
  meta: {
    title: "雪だるま作りゲーム｜かわいい雪だるまを作ろう",
    description: "スマホで雪だるま作り。雪玉を重ねて、目・にんじんの鼻・帽子・マフラー・腕を選び、名前をつけたら画像で保存したりリンクでシェアしたりできます。",
    ogTitle: "雪だるま作り ⛄",
    ogDescription: "雪玉を転がして重ねて、自分だけの雪だるまを1分で作ろう。完成したら友だちに送れます。"
  },
  siteName: "雪だるま作り",
  privacyLink: "プライバシーポリシー",
  start: {
    badge: "⛄ 冬季限定",
    h1Kicker: "雪だるま作り",
    h1Html: "ころがして重ねて<br><em>おめかししよう</em>",
    hook: "手袋はいりません。パーツを選んで、降る雪をながめて、できあがった雪だるまを笑顔にしたい人へ贈りましょう。",
    start: "雪だるまを作る →"
  },
  editor: {
    title: "雪だるまを作ろう",
    canvasAria: "冬の景色の中のあなたの雪だるま",
    stepOf: "ステップ {n} / {max}",
    steps: {
      body: "体",
      face: "顔",
      nose: "鼻",
      hat: "帽子",
      scarf: "マフラー",
      arms: "腕",
      extras: "飾り",
      scene: "背景",
      name: "名前"
    },
    labels: {
      body: "雪玉",
      eyes: "目",
      mouth: "口",
      nose: "鼻",
      hat: "帽子",
      scarf: "マフラーの色",
      pattern: "柄",
      arms: "腕",
      extras: "飾り（いくつでも）",
      scene: "背景",
      name: "なまえ（任意）"
    },
    bodies: {
      classic: "定番",
      duo: "二段",
      chubby: "まるまる",
      slim: "スリム"
    },
    eyes: {
      coal: "炭",
      buttons: "ボタン",
      sparkly: "キラキラ",
      sleepy: "ねむい"
    },
    mouths: {
      pebbles: "小石",
      smile: "にっこり",
      grin: "大笑い",
      oh: "わあ！"
    },
    noses: {
      carrot: "にんじん",
      long: "長い鼻",
      berry: "木の実",
      pinecone: "松ぼっくり"
    },
    hats: {
      top: "シルク",
      beanie: "ニット帽",
      santa: "サンタ帽",
      bucket: "バケツ",
      earmuffs: "耳あて",
      none: "なし"
    },
    scarves: {
      red: "赤",
      green: "緑",
      blue: "青",
      yellow: "黄",
      purple: "紫",
      none: "なし"
    },
    patterns: {
      solid: "無地",
      stripes: "ボーダー",
      dots: "水玉"
    },
    arms: {
      twigs: "小枝",
      mittens: "手ぶくろ",
      wave: "手を振る",
      none: "なし"
    },
    extras: {
      broom: "ほうき",
      buttons: "ボタン",
      bird: "小鳥",
      flakes: "きらめき"
    },
    scenes: {
      night: "雪の夜",
      sunny: "晴れ野原",
      village: "村あかり"
    },
    random: "おまかせ",
    back: "← 戻る",
    next: "次へ →",
    done: "雪だるま完成",
    namePlaceholder: "例：ゆきまる",
    ideas: "💡 ヒント",
    counter: "{n}/{max}",
    namePresets: [
      "ゆきまる",
      "ふわり",
      "もちもち君",
      "ゆきんこ",
      "ぽんぽん"
    ]
  },
  card: {
    named: "{name}だよ！"
  },
  result: {
    eyebrowMine: "雪だるまが完成しました！",
    eyebrowFriend: "{name}をあなたのために作った人がいます",
    eyebrowFriendNoName: "あなたのために雪だるまが届きました",
    revealHint: "まだ新雪にうもれています…",
    reveal: "❄️ 雪を払う",
    imageAlt: "冬の景色の中の雪だるま",
    save: "画像を保存",
    saving: "画像を作成中…",
    saved: "保存しました！",
    saveFail: "画像を作れませんでした。スクリーンショットで保存してください。",
    edit: "もっと作る",
    retry: "新しく作る",
    retryFriend: "自分も作ってみる",
    shareTitle: "雪だるま作り",
    shareText: "{name}という雪だるまを作ったよ⛄ 見てね：",
    shareTextNoName: "雪だるまを作ってみたよ⛄ 見てね",
    fileName: "snowman"
  },
  og: {
    brand: "⛄ 雪だるま作り",
    defaultKicker: "雪だるま作り",
    defaultTitle: "転がして、重ねて、雪だるまを着せ替え",
    defaultDesc: "帽子・マフラー・降る雪・保存もシェアも"
  },
  faq: [
    {
      q: "雪だるまはどうやって作りますか？",
      a: "画面下のステップを順に進めます。雪玉、顔、鼻、帽子、マフラー、腕、飾り、背景の順で、選択肢をタップするとすぐに雪だるまが変わります。ステップは好きなときに行き来できます。"
    },
    {
      q: "「おまかせ」ボタンは何をしますか？",
      a: "すべてのパーツをランダムに組み合わせてくれます。気に入るまで何度か押して、あとから気になる部分だけ手で選び直せます。"
    },
    {
      q: "雪だるまを保存したり送ったりするには？",
      a: "「雪だるま完成」をタップします。「画像を保存」で1080×1350のPNGができ、シェアボタンからリンクを送れます。リンクを開いた人は雪を払ってあなたの雪だるまに会え、自分でも作り始められます。"
    },
    {
      q: "作った雪だるまはどこに保存されますか？",
      a: "選んだ内容となまえは、リンクの中と、作っている間のあなたのブラウザにだけ保存されます。サーバーには送られないので、リンクを知っている人なら誰でも見られます。"
    }
  ],
  privacy: {
    title: "プライバシーポリシー | 雪だるま作り",
    description: "雪だるま作りのプライバシーポリシー。雪だるまとなまえの扱い、Cookie、広告、匿名の統計について説明します。",
    h1: "プライバシーポリシー",
    introHtml: "雪だるま作り（以下「本サービス」）は利用者のプライバシーを尊重し、以下に記載する最小限の情報のみを取り扱います。",
    sections: [
      [
        "1. 収集する情報",
        "本サービスはアカウント登録やログインなしで利用できます。作った雪だるまと入力したなまえはサーバーに送信されません。これらはブラウザ内（作っている間は下書きをローカルストレージに保存）と、シェアした場合はURLの中にのみ存在します。ご利用中、以下のとおり一部の情報が自動的に収集されることがあります。"
      ],
      [
        "2. Cookieと類似技術",
        "本サービスは広告の表示や利用状況の把握のためにCookieを使用することがあります。Cookieはブラウザの設定で拒否・削除できますが、その場合一部の機能が正しく動作しないことがあります。"
      ],
      [
        "3. 広告（Google AdSense）",
        "本サービスはGoogle AdSenseによる広告を掲載しています。Googleおよび広告パートナーは、Cookieを使用して本サイトや他のサイトへの過去の訪問情報に基づく広告を配信することがあります。詳細と設定の変更は<a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 広告設定</a>で確認できます。"
      ],
      [
        "4. 統計",
        "サービス改善のため、Google アナリティクス（GA4）と、言語ごとの1日の合計（ページビュー、完成した雪だるまの数、星の評価）だけを記録する独自の集計カウンターを使用することがあります。これらで個人が特定されることはなく、雪だるまのなまえも含まれません。"
      ],
      [
        "5. シェアしたリンクと画像",
        "「シェア」で作られたリンクには雪だるまの内容がURLに符号化されて含まれるため、リンクを持っている人なら誰でも見ることができます。保存する画像はブラウザ内で作成されます。なまえに住所や電話番号などの個人情報は入れないようにしてください。"
      ],
      [
        "6. お問い合わせ",
        "本ポリシーに関するご質問は、サイト運営者までお問い合わせください。"
      ],
      [
        "7. 施行日",
        "本ポリシーは2026年11月9日から適用されます。"
      ]
    ],
    back: "← 雪だるま作りに戻る"
  }
};
