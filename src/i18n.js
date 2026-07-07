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
  },
  en: {},
};

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
