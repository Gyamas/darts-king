import { describe, it, expect } from "vitest";
import { newGame, applyDart, endTurn, checkoutReady } from "../src/engine/game.js";

const cfg = (over = {}) => ({ type: "501", names: ["A"], mode: "hard", outRule: "double", inRule: "open", sepaBull: true, ...over });
const setScore = (g, s) => { g.scores[0] = s; g.turnStart = s; return g; };

describe("01: バスト規則", () => {
  it("オーバー(残りマイナス)でターン開始点に戻る(ターン内の得点も巻き戻し)", () => {
    let g = setScore(newGame(cfg()), 50);
    g = applyDart(g, 20, 1); // 50→30
    expect(g.scores[0]).toBe(30);
    g = applyDart(g, 20, 3); // 30-60 → バスト
    expect(g.bust).toBe(true);
    expect(g.scores[0]).toBe(50); // turnStartに戻る
  });
  it("ダブルアウト: 残り1になる投はバスト", () => {
    let g = setScore(newGame(cfg()), 3);
    g = applyDart(g, 2, 1); // next=1
    expect(g.bust).toBe(true);
    expect(g.scores[0]).toBe(3);
  });
  it("ダブルアウト: ちょうど0でもシングルで上がるとバスト", () => {
    let g = setScore(newGame(cfg()), 20);
    g = applyDart(g, 20, 1);
    expect(g.bust).toBe(true);
    expect(g.finished).toBe(false);
    expect(g.scores[0]).toBe(20);
  });
  it("オープンアウト: 残り1は継続でき、シングルで上がれる", () => {
    let g = setScore(newGame(cfg({ outRule: "open" })), 3);
    g = applyDart(g, 2, 1); // 残り1(バストしない)
    expect(g.bust).toBe(false);
    expect(g.scores[0]).toBe(1);
    g = applyDart(g, 1, 1);
    expect(g.finished).toBe(true);
    expect(g.winners).toEqual([0]);
  });
});

describe("01: アウトルール別の上がり判定", () => {
  it("ダブルアウト: D20で40から上がり", () => {
    let g = setScore(newGame(cfg()), 40);
    g = applyDart(g, 20, 2);
    expect(g.finished).toBe(true);
    expect(g.pstats[0].coHit).toBe(1);
  });
  it("マスターアウト: T19で57から上がり", () => {
    let g = setScore(newGame(cfg({ outRule: "master" })), 57);
    g = applyDart(g, 19, 3);
    expect(g.finished).toBe(true);
  });
  it("マスターアウト: セパブル時はアウターブル(25)でも上がれる", () => {
    let g = setScore(newGame(cfg({ outRule: "master" })), 25);
    g = applyDart(g, "B", 1);
    expect(g.finished).toBe(true);
  });
  it("マスターアウト: シングルちょうど0はバスト", () => {
    let g = setScore(newGame(cfg({ outRule: "master" })), 20);
    g = applyDart(g, 20, 1);
    expect(g.bust).toBe(true);
  });
});

describe("01: ブル仕様(セパブル/ファットブル)", () => {
  it("ファットブル(セパOFF): シングルブルでも50点でダブル扱い → 50から上がり", () => {
    let g = setScore(newGame(cfg({ sepaBull: false })), 50);
    g = applyDart(g, "B", 1);
    expect(g.finished).toBe(true);
  });
  it("セパブル: シングルブルは25点・ダブル扱いでない → 50から25残り、25ちょうどはバスト", () => {
    let g = setScore(newGame(cfg()), 50);
    g = applyDart(g, "B", 1); // 25残り
    expect(g.scores[0]).toBe(25);
    g = applyDart(g, "B", 1); // 0だがダブルでない → バスト
    expect(g.bust).toBe(true);
    expect(g.scores[0]).toBe(50);
  });
  it("セパブル: D-BULLで50から上がり", () => {
    let g = setScore(newGame(cfg()), 50);
    g = applyDart(g, "B", 2);
    expect(g.finished).toBe(true);
  });
});

describe("01: ダブルイン", () => {
  it("ダブルに入れるまで無得点(投数は記録される)", () => {
    let g = newGame(cfg({ inRule: "double" }));
    g = applyDart(g, 20, 1);
    expect(g.scores[0]).toBe(501);
    expect(g.darts.length).toBe(1);
    g = applyDart(g, 20, 3);
    expect(g.scores[0]).toBe(501);
    g = applyDart(g, 20, 2); // オープン+得点
    expect(g.opened[0]).toBe(true);
    expect(g.scores[0]).toBe(461);
  });
  it("ファットブルはダブル扱いなのでブルインできる", () => {
    let g = newGame(cfg({ inRule: "double", sepaBull: false }));
    g = applyDart(g, "B", 1);
    expect(g.opened[0]).toBe(true);
    expect(g.scores[0]).toBe(451);
  });
  it("オープン状態はターンをまたいで維持される", () => {
    let g = newGame(cfg({ inRule: "double", names: ["A", "B"] }));
    g = applyDart(g, 20, 2);
    g = applyDart(g, 0, 1);
    g = applyDart(g, 0, 1);
    g = endTurn(g); // Bの手番へ
    expect(g.current).toBe(1);
    expect(g.opened[0]).toBe(true);
    expect(g.opened[1]).toBe(false);
  });
});

describe("checkoutReadyの境界値", () => {
  it("オープンアウトは常にfalse", () => {
    expect(checkoutReady(40, "open", false)).toBe(false);
    expect(checkoutReady(50, "open", false)).toBe(false);
  });
  it("ダブル: 偶数2-40と50のみtrue", () => {
    expect(checkoutReady(2, "double", false)).toBe(true);
    expect(checkoutReady(40, "double", false)).toBe(true);
    expect(checkoutReady(50, "double", false)).toBe(true);
    expect(checkoutReady(41, "double", false)).toBe(false);
    expect(checkoutReady(42, "double", false)).toBe(false); // 40超の偶数は不可
    expect(checkoutReady(3, "double", false)).toBe(false);
  });
  it("マスター: 3の倍数(3-60)と、セパブル時のみ25も可", () => {
    expect(checkoutReady(57, "master", false)).toBe(true);
    expect(checkoutReady(60, "master", false)).toBe(true);
    expect(checkoutReady(61, "master", false)).toBe(false);
    expect(checkoutReady(25, "master", false)).toBe(true); // セパブル: アウターブル
    expect(checkoutReady(25, "master", true)).toBe(false); // ファットブル時は25で止まれない
  });
});
