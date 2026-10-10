/* QRコード作成 — 日本語 (/ja/)
 * エンコーダーは qr-core.js、このファイルはこの言語の表示文言すべて。キー構成は en.js と同じ。
 * プレースホルダー {bytes} {v} {n} {ratio} {value} はそのまま残す。
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@700;800&display=swap',
    display: "'M PLUS 1p'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'auto-phrase',
    hyphens: 'manual',
  },

  meta: {
    title: 'QRコード作成 – 無料でWi-Fi・URLも',
    description: 'URL・テキスト・Wi-Fi・メール・電話番号から無料でQRコード作成。色・誤り訂正・サイズを選んでPNG・SVGで保存。登録不要、ブラウザの中だけで作れます。',
    ogTitle: 'QRコード作成 🔳 無料・登録不要',
    ogDescription: 'URL・Wi-Fi・メール・電話番号のQRコードを数秒で。入力内容はサーバーに送られません。',
  },
  siteName: 'QRコード作成',
  privacyLink: 'プライバシーポリシー',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'QRコード作成',
    h1Html: '入力するだけで<br><em>QRコード</em>完成',
    hook: 'URL、テキスト、Wi-Fi、メール、電話番号を入力するそばからQRコードに。無料・登録不要で、ブラウザの中だけで作ります。',
  },

  ui: {
    typeLabel: 'QRコードに何を入れますか？',
    types: { link: 'URL', text: 'テキスト', wifi: 'Wi-Fi', email: 'メール', phone: '電話' },
    link: { label: 'ウェブサイトのURL', placeholder: 'example.com/menu' },
    text: { label: '入れるテキスト', placeholder: 'メモ、コード、短いメッセージ…' },
    wifi: {
      ssid: 'ネットワーク名（SSID）', ssidPh: 'MyHomeWiFi',
      password: 'パスワード', passwordPh: 'Wi-Fiのパスワード',
      security: '暗号化方式',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP（旧式）', nopass: 'パスワードなし' },
      hidden: 'ステルスSSID',
    },
    email: { to: '宛先メールアドレス', toPh: 'name@example.com', subject: '件名（任意）', subjectPh: 'こんにちは', body: '本文（任意）', bodyPh: 'メッセージを書いてください…' },
    phone: { label: '電話番号', placeholder: '090-1234-5678' },

    previewLabel: 'QRコードのプレビュー',
    previewReady: 'QRコードのプレビュー、バージョン{v}',
    emptyPreview: '入力するとここにQRコードが表示されます',
    info: '{bytes}バイト · バージョン{v} · {n}×{n}セル',
    encodes: '中身: {value}',
    tooLong: '1つのQRコードには長すぎます。短くするか、誤り訂正を低め（L）にしてください。',
    encodeFail: 'QRコードを作れませんでした。内容を変えてみてください。',
    warnContrast: 'コントラストが低めです（{ratio}:1）。読み取りにくい場合があるので、明るい背景に濃い色のコードがおすすめです。',
    warnInverted: '暗い背景に明るいコードです。反転したコードを読めないアプリもあります。',
    warnQuiet: '余白が狭いと読み取りにくくなります。2セル以上（標準は4セル）あけてください。',

    downloadPng: 'PNGで保存',
    downloadSvg: 'SVGで保存',
    copyImage: '画像をコピー',
    savedPng: 'PNGを保存しました。印刷前にスマホで一度読み取ってみてください。',
    savedSvg: 'SVGを保存しました。大きく印刷してもくっきりです。',
    copied: '画像をコピーしました。資料やチャットに貼り付けられます。',
    copyFail: 'ここでは画像をコピーできません。PNGで保存をお使いください。',
    saveFail: '保存できませんでした。もう一度お試しください。',

    options: '🎨 色・サイズ・誤り訂正',
    colors: '色',
    fg: 'コード',
    bg: '背景',
    resetColors: 'リセット',
    ecc: '誤り訂正レベル',
    eccHint: '高いほど汚れやロゴに強くなりますが、コードが細かくなります。普段はMで十分です。',
    size: '画像サイズ',
    margin: '余白（クワイエットゾーン）',
    marginHint: 'コードの周りの空白（セル数）。標準は4セルです。',
    localNote: '🔒 ブラウザの中だけで作成。入力内容はサーバーに送信しません。',
  },

  result: {
    doneTitle: 'QRコードができました ✓',
    doneText: '印刷や共有の前に、スマホのカメラで読み取れるか確かめてください。上の入力欄を変えれば、いつでも新しいコードを作れます。',
    again: '別のQRコードを作る',
    shareTitle: 'QRコード作成 – 無料・ブラウザで完結',
    shareText: 'URL・Wi-Fi・テキストのQRコードが数秒で作れる、ブラウザだけの無料ツール 🔳',
  },

  og: {
    brand: '🔳 QRコード作成',
    kicker: 'URL · Wi-Fi · テキスト · PNG/SVG',
    title: 'QRコードを数秒で作成',
    desc: '無料・登録不要・ブラウザだけで完結',
  },

  faq: [
    { q: '入力した内容はどこかに送られますか？', a: 'いいえ。QRコードはブラウザ内のJavaScriptで計算するので、URLやWi-Fiのパスワード、メッセージがサーバーに届くことはありません。保存もされず、ページを閉じれば消えます。' },
    { q: 'QRコードに有効期限はありますか？', a: 'ありません。中身を模様そのものに書き込む静的QRコードなので、途中に転送用のURLや計測用リンクを挟みません。リンク先やWi-Fiがある限り、印刷したコードはずっと使えます。' },
    { q: 'Wi-FiのQRコードはどう使うのですか？', a: 'ネットワーク名・パスワード・暗号化方式を標準のWIFI:形式で入れます。iPhoneやAndroidの標準カメラで読み取ると接続するか聞かれるので、来客がパスワードを打ち込む必要がありません。' },
    { q: '誤り訂正レベルはどれを選べばいいですか？', a: 'たいていはM（約15%復元）で十分です。ざらざらした素材への印刷、こすれやすい場所、中央にロゴを重ねる場合はQかH。画面に表示する長い内容なら、いちばん小さくなるLを選んでください。' },
    { q: 'PNGとSVGの違いは？', a: 'PNGはウェブサイトやチャット、資料に使う普通の画像です。SVGはベクター形式で、どれだけ拡大してもくっきりしているので、ポスターやチラシ、印刷所への入稿に向いています。' },
  ],

  privacy: {
    title: 'プライバシーポリシー | QRコード作成',
    description: 'QRコード作成のプライバシーポリシー：入力内容はブラウザ内だけ、Cookie・広告・統計について。',
    h1: 'プライバシーポリシー',
    introHtml: 'QRコード作成（以下「本サービス」）は利用者のプライバシーを尊重し、以下に記載する最小限の情報のみを取り扱います。',
    sections: [
      ['1. 取得する情報', '本サービスはアカウント登録やログインなしで利用できます。入力されたURL、テキスト、Wi-Fi情報、メールアドレス、電話番号は利用者のブラウザ内でのみQRコードに変換され、サーバーに送信・保存されることはありません。ただし、利用中に以下の情報が自動的に取得される場合があります。'],
      ['2. Cookie等の技術', '本サービスは、言語設定の保存、広告の表示、利用状況の把握のためにCookieやブラウザのローカルストレージを使用することがあります。ブラウザの設定で拒否・削除できますが、その場合一部の機能が正しく動作しないことがあります。'],
      ['3. 広告（Google AdSense）', '本サービスはGoogle AdSenseによる広告を掲載しています。Googleおよびそのパートナーは、Cookieを使用して本サイトや他サイトへの過去の訪問に基づく広告を配信することがあります。詳細や設定の変更は<a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google広告設定</a>で行えます。'],
      ['4. 統計', '本サービスの改善のため、Google Analytics（GA4）と、言語ごとの1日の合計（ページ閲覧数、作成されたコード数、星評価）のみを記録する独自集計を利用することがあります。QRコードの中身が統計に含まれることはなく、いずれも個人を特定するものではありません。'],
      ['5. お問い合わせ', '本ポリシーに関するお問い合わせは、サイト運営者までご連絡ください。'],
      ['6. 施行日', '本ポリシーは2026年10月11日から施行します。'],
    ],
    back: '← QRコード作成に戻る',
  },
};
