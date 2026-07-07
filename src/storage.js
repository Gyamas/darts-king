// window.storage 互換アダプタ。
// - claude.ai アーティファクト環境: 本物の window.storage が存在するため何もしない
// - Capacitorネイティブ(iOS/Android): @capacitor/preferences に永続化
//   (WKWebViewのlocalStorageはOSのストレージ逼迫時に消されることがあるため必須)
// - それ以外のWeb(Vite/PWA): 従来どおり localStorage に永続化
const PREFIX = "darts-scorer:";

function localStorageAdapter() {
  return {
    async get(key) {
      const value = localStorage.getItem(PREFIX + key);
      if (value == null) throw new Error(`key not found: ${key}`);
      return { key, value, shared: false };
    },
    async set(key, value) {
      localStorage.setItem(PREFIX + key, String(value));
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
      }
      return { keys, prefix, shared: false };
    },
  };
}

function preferencesAdapter(Preferences) {
  return {
    async get(key) {
      const { value } = await Preferences.get({ key: PREFIX + key });
      if (value == null) throw new Error(`key not found: ${key}`);
      return { key, value, shared: false };
    },
    async set(key, value) {
      await Preferences.set({ key: PREFIX + key, value: String(value) });
      return { key, value, shared: false };
    },
    async delete(key) {
      await Preferences.remove({ key: PREFIX + key });
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const { keys } = await Preferences.keys();
      const hits = keys
        .filter((k) => k.startsWith(PREFIX + prefix))
        .map((k) => k.slice(PREFIX.length));
      return { keys: hits, prefix, shared: false };
    },
  };
}

// 旧localStorageのデータ(アップデート前のWebView保存分)をPreferencesへ一度だけ移行する。
// Preferences側に同名キーが既にある場合はPreferencesを優先。
async function migrateFromLocalStorage(Preferences) {
  try {
    if (localStorage.getItem(PREFIX + "__migrated__")) return;
    const { keys: existing } = await Preferences.keys();
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      if (k === PREFIX + "__migrated__") continue;
      if (existing.includes(k)) continue;
      const v = localStorage.getItem(k);
      if (v != null) await Preferences.set({ key: k, value: v });
    }
    localStorage.setItem(PREFIX + "__migrated__", "1");
  } catch {
    // localStorageが使えない環境でも致命的ではないので握りつぶす
  }
}

if (typeof window !== "undefined" && !window.storage) {
  const isNative = !!(
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === "function" &&
    window.Capacitor.isNativePlatform()
  );

  if (!isNative) {
    window.storage = localStorageAdapter();
  } else {
    // Preferencesの読み込みは非同期なので、初期化完了を待つラッパーを
    // 同期的に window.storage へ設定しておく(アプリ起動直後の呼び出しにも安全)。
    const ready = import("@capacitor/preferences").then(async ({ Preferences }) => {
      await migrateFromLocalStorage(Preferences);
      return preferencesAdapter(Preferences);
    });
    const wrap =
      (method) =>
      async (...args) =>
        (await ready)[method](...args);
    window.storage = {
      get: wrap("get"),
      set: wrap("set"),
      delete: wrap("delete"),
      list: wrap("list"),
    };
  }
}
