import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---- @capacitor/preferences のインメモリモック(ネイティブ分岐のテスト用) ----
const prefStore = new Map();
vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    async get({ key }) { return { value: prefStore.has(key) ? prefStore.get(key) : null }; },
    async set({ key, value }) { prefStore.set(key, value); },
    async remove({ key }) { prefStore.delete(key); },
    async keys() { return { keys: [...prefStore.keys()] }; },
  },
}));

// ---- localStorage のインメモリ実装(node環境用) ----
function makeLocalStorage() {
  const m = new Map();
  return {
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  };
}

async function loadAdapter({ native }) {
  vi.resetModules();
  globalThis.localStorage = makeLocalStorage();
  globalThis.window = native
    ? { Capacitor: { isNativePlatform: () => true } }
    : {};
  await import("../src/storage.js");
  return globalThis.window.storage;
}

beforeEach(() => prefStore.clear());
afterEach(() => {
  delete globalThis.window;
  delete globalThis.localStorage;
});

describe("storage: Web(localStorage)アダプタ", () => {
  it("set/get/deleteの往復と、存在しないキーはthrow", async () => {
    const s = await loadAdapter({ native: false });
    await s.set("profiles", '[{"name":"A"}]');
    const r = await s.get("profiles");
    expect(r.value).toBe('[{"name":"A"}]');
    await s.delete("profiles");
    await expect(s.get("profiles")).rejects.toThrow(/not found/);
  });
  it("listはプレフィックスで絞り込め、他アプリのキーを拾わない", async () => {
    const s = await loadAdapter({ native: false });
    await s.set("stats:1", "a");
    await s.set("stats:2", "b");
    await s.set("settings", "c");
    globalThis.localStorage.setItem("other-app:stats:9", "x"); // 無関係キー
    const r = await s.list("stats:");
    expect(r.keys.sort()).toEqual(["stats:1", "stats:2"]);
    const all = await s.list();
    expect(all.keys.sort()).toEqual(["settings", "stats:1", "stats:2"]);
  });
  it("claude.ai環境(window.storageが既にある)では上書きしない", async () => {
    vi.resetModules();
    const original = { get: () => "original" };
    globalThis.window = { storage: original };
    await import("../src/storage.js");
    expect(globalThis.window.storage).toBe(original);
  });
});

describe("storage: ネイティブ(Preferences)アダプタと旧データ移行", () => {
  it("ネイティブではPreferencesに書き込まれ、localStorageには書かない", async () => {
    const s = await loadAdapter({ native: true });
    await s.set("profiles", "xyz");
    expect(prefStore.get("darts-scorer:profiles")).toBe("xyz");
    expect(globalThis.localStorage.getItem("darts-scorer:profiles")).toBeNull();
    const r = await s.get("profiles");
    expect(r.value).toBe("xyz");
  });
  it("旧localStorageのデータが初回に移行される(既存Preferences優先・二重移行なし)", async () => {
    vi.resetModules();
    globalThis.localStorage = makeLocalStorage();
    // 旧WebView時代のデータ
    globalThis.localStorage.setItem("darts-scorer:profiles", "old-profiles");
    globalThis.localStorage.setItem("darts-scorer:settings", "old-settings");
    globalThis.localStorage.setItem("unrelated", "skip-me");
    // Preferences側に既にあるキーは上書きされない
    prefStore.set("darts-scorer:settings", "new-settings");
    globalThis.window = { Capacitor: { isNativePlatform: () => true } };
    await import("../src/storage.js");
    const s = globalThis.window.storage;

    expect((await s.get("profiles")).value).toBe("old-profiles"); // 移行された
    expect((await s.get("settings")).value).toBe("new-settings"); // Preferences優先
    expect(prefStore.has("unrelated")).toBe(false); // 無関係キーは移行しない
    expect(globalThis.localStorage.getItem("darts-scorer:__migrated__")).toBe("1");

    // 移行済みフラグ後は、localStorageを書き換えても再移行されない
    globalThis.localStorage.setItem("darts-scorer:profiles", "tampered");
    vi.resetModules();
    globalThis.window = { Capacitor: { isNativePlatform: () => true } };
    await import("../src/storage.js");
    expect((await globalThis.window.storage.get("profiles")).value).toBe("old-profiles");
  });
  it("初期化(動的import)完了前の呼び出しでも安全に待機して結果を返す", async () => {
    const s = await loadAdapter({ native: true });
    // loadAdapter直後 = Preferences初期化と競合するタイミングで即呼ぶ
    const [w, r] = await Promise.all([s.set("k", "v"), s.list()]);
    expect(w.value).toBe("v");
    expect(Array.isArray(r.keys)).toBe(true);
  });
});
