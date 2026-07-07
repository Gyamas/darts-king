// 軽量i18n基盤。node環境(テスト)でも動くようwindow/navigatorには依存しない。
// 言語設定の読み込み・永続化(settingsキー"lang"の読み書き、navigator.languageからの初期値判定)は
// 呼び出し側(App.jsx)の責務とする。

export const DICTS = {
  ja: {
    "settings.language": "言語",

    "home.subtitle": "練習・対戦・レーティング",
    "home.modeHard": "🎯 ハードダーツ",
    "home.modeSoft": "🕹 ソフトダーツ",
    "home.descSoft": "Rt・{pct}%スタッツ ・ メドレーマッチ ・ アワード演出 ・ プロ試験練習",
    "home.descHard": "501ダブルアウト ・ AVG&アウト提案 ・ レグ戦マッチ ・ 180コール",
    "home.gameCategory": "ゲームカテゴリ",
    "home.comingSoon": "準備中",
    "home.matchTileHard": "マッチ(01連戦)",
    "home.playerDataDesc": "登録プレイヤーの成績・Rt・スタッツを見る",

    "flow.option.in": "IN ー 始め方",
    "flow.option.out": "OUT ー 上がり方",
    "flow.option.open": "オープン",
    "flow.option.inOpenSub": "1投目から得点",
    "flow.option.double": "ダブル",
    "flow.option.inDoubleSub": "ダブルで開始",
    "flow.option.outOpenSub": "なんでもOK",
    "flow.option.outDoubleSub": "D・D-ブルのみ",
    "flow.option.master": "マスター",
    "flow.option.masterSub": "D・T・ブル",
    "flow.option.bull5050Sub": "どこでも50点",
    "flow.option.bull2550Sub": "セパレートブル",

    "flow.statLabel.atc": "BEST(最少投数)",
    "flow.gameOn.tapToSkip": "タップでスキップ",
    "flow.stat.atcThrows": "{n}投",

    "flow.cork.turnSuffix": "の番",
    "flow.cork.instructions": "ブルを狙って1本投げて、刺さった位置をボードでタップ",
    "flow.cork.orderDecided": "センターに近い順に投げ順が決まりました!",
    "flow.cork.distanceFromCenter": "中心から{mm}mm",
    "flow.startInOrder": "この順番でスタート →",
    "flow.cork.redo": "↻ やり直し",
    "flow.cancel": "キャンセル",
    "flow.cork.undoOne": "↩ 1本戻す",

    "flow.defaultPlayerName": "プレイヤー {n}",
    "flow.defaultPlayerNameBase": "プレイヤー",

    "flow.desc.zeroOne": "持ち点をちょうど0にするゲーム。一番早く0にしたプレイヤーの勝利。",
    "flow.desc.cricket": "15〜20とブルを狙う陣取りゲーム。全エリア獲得後、スコアが高い方の勝利。",
    "flow.desc.matchHard": "01のみを連戦するレグ制マッチ。先に過半数のレグを取った方が勝者。先攻はレグごとに交代します。",
    "flow.desc.matchSoft": "01とクリケットを交互に戦うレグ制メドレー。最終レグはその場でゲームを選ぶCHOICE。先攻はレグごとに交代します。",
    "flow.desc.robo": "実力校正済みのロボと1vs1。ロボは正規分布の着弾シミュレーションで投げるので、調子の波もリアル。",
    "flow.desc.practiceCountup": "8ラウンドの合計点をひたすら積み上げる。スコアリングの基礎体力づくり。",
    "flow.desc.practiceShoot": "当てた点数×開いたエリア数が得点。一度開けたナンバーは無効。後半ほど高倍率(最大×21)——JAPANプロ試験種目(基準5500点)。",
    "flow.desc.practiceCrcu": "ターゲット(20→19→…→15→ブル×2)に刺さった点数を加算、MPRも計測。JAPANプロ試験種目。",
    "flow.desc.practiceHalfit": "15→16→ダブル→17→18→トリプル→19→20→ブルの順に狙う。1本も当たらないとスコア半減!",
    "flow.desc.practiceAtc": "1→2→…→20→ブルを順に当てて完走。ダブルで2つ、トリプルで3つ進む。最少投数を目指せ。",
    "flow.desc.practiceBob": "持ち点27でD1→D20→D-BULLを各3投。当てれば加点、3投全部外すとその点数を減点、0を切ったら即終了。ダブル練習の王様。",
    "flow.desc.practiceP121": "残り121から9投以内のチェックアウトに挑戦。成功で+1、失敗で-1。全10挑戦の最高到達点を記録。",
    "flow.desc.fallback": "8ラウンドの合計点をひたすら積み上げるゲーム。",

    "flow.unlimitedRounds": "ラウンド無制限",
    "flow.selectGame": "ゲームを選択してください",
    "flow.selectPracticeMenu": "練習メニューを選択してください",

    "flow.practice.crcuLabel": "CRカウントアップ",
    "flow.practice.countupHardSub": "スコアリング基礎",
    "flow.practice.atcSub": "1→20→ブル",
    "flow.practice.bobSub": "ダブル練習",
    "flow.practice.p121Sub": "チェックアウト挑戦",
    "flow.practice.countupSoftSub": "ブル練習の定番",
    "flow.practice.crcuSub": "クリカン ・ プロ試験種目",
    "flow.practice.halfitSub": "外すと半減",
    "flow.practice.shootSub": "陣取り ・ プロ試験種目",

    "flow.robo.selectLevel": "ロボのレベルを選択してください",
    "flow.match.selectLegs": "レグ数を選択してください",
    "flow.match.legsToWin": "{n}レグ先取",
    "flow.match.legGameHard": "レグのゲーム(全レグ共通 ・ スティール標準は501)",
    "flow.match.legGameSoft": "01レグのゲーム",
    "flow.match.formatDescHard": "スティール標準のレグ形式: 全レグ同じ01を連戦し、先にレグ数を取った方の勝ち",
    "flow.match.formatDescSoft": "CHOICEレグは開始時に01かクリケットをその場で選べます",

    "flow.selectPlayerCount": "プレイヤー数を選んでください",
    "flow.match.introPre": "マッチは ",
    "flow.match.introPost": " の2人対戦です(先攻はレグごとに交代)",
    "flow.robo.introPost": " との1vs1対戦です。あなたのプレイヤーを設定してください",
    "flow.robo.formatHard": "レグ戦",
    "flow.robo.formatSoft": "メドレー",
    "flow.robo.formatNote": "({format}: 先攻はレグごとに交代)",

    "flow.team.orderNote": "入力順 = 投げ順。1・3人目がTEAM A、2・4人目がTEAM B",
    "flow.pickButton": "選ぶ",
    "flow.pickHint": "「{pick}」で登録プレイヤーを設定すると、スタッツとレーティング(Rt)が自動で記録されます",

    "flow.teamBadge": " ・ 2vs2 チーム戦",
    "flow.ruleFixed.atc": "ルール固定: シングル=1つ / ダブル=2つ / トリプル=3つ進む",
    "flow.ruleFixed.bob": "ルール固定: 各ダブルに3投 ・ 全外しで減点 ・ 0未満で即終了",
    "flow.ruleFixed.p121": "ルール固定: ダブルアウト ・ 1挑戦=9投 ・ 成功+1 / 失敗-1 ・ 全10挑戦",
    "flow.ruleFixed.crcu": "ルール固定: 8ラウンド ・ ターゲット順 20→…→15→ブル×2 ・ 刺さった点数を加算(T20=60)",
    "flow.ruleFixed.shoot": "ルール固定: 8R ・ 得点=刺さった点数×開いたエリア数 ・ 全21エリア開拓でブル復活(×21)",
    "flow.ruleFixed.halfit": "ルール固定: 開始40点 ・ 9ラウンド ・ 全外しで半減(切り上げ)",

    "flow.shuffle.resultDecided": "投げ順が決まりました!",
    "flow.shuffle.retry": "🔀 もう一度",

    "game.atc.finished": "完走!",
    "game.atc.nextTarget": "次のターゲット ・ {next}/20{plus}",
    "game.bob.bust": "BUST ・ 脱落",
    "game.bob.finished": "完走! 🏁",
    "game.aimPrefix": "狙い: ",
    "game.marksUnit": "マーク",
    "game.shoot.bullChallenge": "BULLチャレンジ ×21",
    "game.shoot.progress": "{opened}/21エリア ・ 次×{next}",
    "game.p121.status": "TARGET {target} ・ 挑戦{cur}/{total} ・ ターン{turn}/3",
    "game.checkout.noFinish": "ノーフィニッシュ(この残りでは1ターンで上がれません)",
    "game.quit": "← 終了",
    "game.dartOrdinal": "{n}投目",
    "game.undo": "↩ 戻す",
    "game.doubleInWait": "ダブルイン待ち ー ダブルに入れるまで得点しません",
    "game.result.soloFinish": "おつかれさまでした 🎯",
    "game.result.draw": "引き分けです",
    "game.result.winnerSuffix": "の勝利です 🎯",
    "game.shoot.areasOpened": "{n}/21エリア開拓",
    "game.statsRecorded": "登録プレイヤーの累計スタッツ・Rtに反映済み",
    "game.match.rematchSameLeg": "同じレグを再戦",
    "game.match.toResult": "マッチ結果へ 🏆",
    "game.match.nextLeg": "次のレグへ(LEG {n})",
    "game.playAgain": "もう一度",
    "game.match.abort": "マッチ中断",
    "game.goHome": "ホームへ",
    "game.robo.throwing": "🤖 ROBO Lv.{lv} スローイング…",
    "game.nextPlayer": "次のプレイヤーへ →",
    "game.halveWarning": "外すと半減!",
    "game.shoot.bullChallengeBanner": "🎯 BULLチャレンジ!",
    "game.shoot.bullRevived": "ブル復活 ・ 毎投 ",
    "game.shoot.remainingAreas": "残り{n}エリア ・ 開けた所は無効",
    "game.input.board": "🎯 ボード入力",
    "game.input.keypad": "🔢 テンキー入力",
    "game.input.missOutside": "MISS(ボード外)",

    "players.detail.dlConv": "DARTSLIVE換算: Rt {rt}({flight} FLIGHT)",
    "players.detail.pxConv": "PHOENIX換算: Rt {rt}({cls})",
    "players.gamesWins": "{games}試合 {wins}勝",
    "players.winRateSuffix": " ・ 勝率{pct}%",
    "players.detail.hardSub": "CO {co} ・ 180×{t180} ・ {games}試合",
    "players.detail.softSub": "MPR {mpr} ・ {games}試合",
    "players.notPlayed": "未プレイ",
    "players.detail.avgHint": "アベレージはハードモードで01をプレイすると表示されます",
    "players.detail.rtHint": "Rtは01またはクリケットを3ラウンド以上プレイすると表示されます(目安値)",
    "players.detail.avgSub": "3ダーツ平均 ・ {r}R",
    "players.detail.first9Sub": "最初の9投の平均",
    "players.detail.coSuccess": "{hit}/{att} 成功",
    "players.detail.coHint": "D/Mアウトで計測",
    "players.detail.ppdSub": "PPD(100%スタッツ)",
    "players.detail.pprSub": "PPR(80%スタッツ)",
    "players.detail.totalRounds": "累計ラウンド",
    "players.detail.rtFrom01Sub": "01由来のRt",
    "players.detail.tonBreakdown": "内訳 100+:{a} 140+:{b}",
    "players.detail.oneEighty": "ワンエイティ",
    "players.detail.highCheckout": "最高チェックアウト",
    "players.detail.mprHard": "MPR(100%)",
    "players.detail.mprPx": "MPR(100%スタッツ)",
    "players.detail.mprDl": "MPR(80%スタッツ)",
    "players.detail.first3RMpr": "最初の3R平均MPR",
    "players.detail.rtFromCrSub": "クリケット由来のRt",
    "players.detail.personalBest": "自己ベスト",
    "players.detail.totalRoundsWithN": "累計{n}ラウンド",
    "players.detail.atcThrows": "{n}投",
    "players.detail.atcSub": "完走の最少投数",
    "players.detail.highScore": "ハイスコア",
    "players.detail.bestReach": "最高到達点",
    "players.detail.crcuBestMarks": "クリカン最高マーク",
    "players.edit": "✎ 編集",
    "players.delete": "🗑 削除",
    "players.deleteConfirm": "スタッツごと完全に削除します。よろしいですか?",
    "players.deleteConfirmButton": "削除する",
    "players.viewToggle.hardSub": "AVG ・ チェックアウト率",
    "players.viewToggle.soft": "🟦 ソフトダーツ",
    "players.viewToggle.softSub": "Rt ・ {pct}%スタッツ",
    "players.hardStatsNote": "ハードダーツの成績はソフトとは別に記録されます(レーティングではなく3ダーツアベレージで表示)",
    "players.empty.title": "登録プレイヤーがまだいません。",
    "players.empty.hint": "登録して対戦すると、スタッツとRtがここに貯まっていきます。",
    "players.addNew": "＋ 新規プレイヤーを登録",
    "players.editor.namePlaceholder": "プレイヤー名",
    "players.editor.emojiTab": "絵文字",
    "players.editor.photoTab": "写真",
    "players.editor.choosePhoto": "📷 写真を選ぶ(自動で正方形に切り抜き)",
    "players.editor.save": "保存",
    "players.picker.emptyHint": "登録するとスタッツとRtが記録されます。",
    "players.picker.alreadyUsed": "(選択済み)",
    "players.picker.deleteConfirm": "スタッツごと削除します。よろしいですか?",
    "players.picker.delete": "削除",
    "players.picker.deleteCancel": "やめる",

    "match.zeroOneSub": "ゼロワン",
    "match.cricketSub": "クリケット",
    "match.choice.selectGame": "最終レグのゲームを選んでください",
    "match.choice.firstThrowPre": "(このレグの先攻: ",
    "match.choice.firstThrowPost": ")",
    "match.victory": "マッチ勝利! 🏆",

    "ui.ratingMode.dl": "DARTSLIVE方式",
    "ui.ratingMode.dlSub": "Rt 1〜18 ・ フライト",
    "ui.ratingMode.px": "PHOENIX方式",
    "ui.ratingMode.pxSub": "Rt 1〜30 ・ クラス",
    "ui.ratingMode.hint": "換算方式の表示切替です。記録データは共通なのでいつでも変更できます",

    "award.whiteHorse.sub": "3種類のトリプル!",
    "award.threeInTheBlack.sub": "インナーブル3連!",
    "award.hatTrick.sub": "ブル3連発!",
    "award.nineMark.sub": "パーフェクトラウンド!",
    "award.niceMark.sub": "ナイスマーク!",
    "award.oneEighty.sub": "180!!",
    "award.points.sub": "{total}点!",
    "award.ton80.sub": "パーフェクト 180点!",
    "award.threeInABed.sub": "T{num}を3連!",

    "robo.rtText.avg": "AVG {avg} 相当",
    "robo.rtText.px": "PX Rt {rt}({cls})相当",
    "robo.rtText.dl": "Rt {rt} 相当",
  },
  en: {},
};

export const LANGS = [
  ["ja", "日本語"],
  ["en", "English"],
];

let lang = "ja";
const listeners = new Set();

export function getLang() {
  return lang;
}

export function setLang(l) {
  lang = l;
  listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key, params) {
  const dict = DICTS[lang] || DICTS.ja;
  const str = dict[key] != null ? dict[key] : DICTS.ja[key];
  if (params == null) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in params ? params[k] : `{${k}}`));
}
