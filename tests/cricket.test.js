import { describe, it, expect } from "vitest";
import { newGame, applyDart } from "../src/engine/game.js";
import { CRICKET_NUMS } from "../src/constants.js";

const cfg = (over = {}) => ({ type: "cricket", names: ["A", "B"], mode: "soft", outRule: "open", inRule: "open", sepaBull: true, ...over });
const closeAll = (g, t) => { CRICKET_NUMS.forEach((n) => { g.marks[t][n] = 3; }); return g; };

describe("クリケット: マークとオーバーフロー得点", () => {
  it("T20でクローズ、以降のヒットは相手未クローズなら得点", () => {
    let g = newGame(cfg());
    g = applyDart(g, 20, 3); // 3マークでクローズ
    expect(g.marks[0][20]).toBe(3);
    expect(g.scores[0]).toBe(0); // オーバーフローなし
    g = applyDart(g, 20, 2); // +2本ぶん得点
    expect(g.scores[0]).toBe(40);
    expect(g.turnMarks).toBe(5); // 盤面3 + 得点オーバーフロー2
  });
  it("クローズ跨ぎのオーバーフロー: 2マーク保持+T20(3本) → 盤面3本+2本ぶん得点", () => {
    let g = newGame(cfg());
    g.marks[0][20] = 2;
    g = applyDart(g, 20, 3);
    expect(g.marks[0][20]).toBe(3);
    expect(g.scores[0]).toBe(40); // 2+3=5本 → 盤面3本、2本が得点(20×2)
  });
  it("デッドナンバー: 相手もクローズ済みなら得点なし・マークもオーバーフロー分は数えない", () => {
    let g = newGame(cfg());
    g.marks[0][20] = 3;
    g.marks[1][20] = 3;
    g = applyDart(g, 20, 3);
    expect(g.scores[0]).toBe(0);
    expect(g.turnMarks).toBe(0);
  });
  it("ブルは1投最大2マーク(D-BULL=2)、オーバーフローは25点換算", () => {
    let g = newGame(cfg());
    g = applyDart(g, "B", 2); // 2マーク
    expect(g.marks[0].B).toBe(2);
    g = applyDart(g, "B", 2); // 3到達+1オーバーフロー
    expect(g.marks[0].B).toBe(3);
    expect(g.scores[0]).toBe(25);
  });
  it("クリケットナンバー外(14以下)はマークも得点も付かない", () => {
    let g = newGame(cfg());
    g = applyDart(g, 14, 3);
    expect(g.scores[0]).toBe(0);
    expect(g.turnMarks).toBe(0);
    expect(Object.values(g.marks[0]).every((v) => v === 0)).toBe(true);
  });
});

describe("クリケット: 勝利条件", () => {
  it("全クローズ+スコア同点以上で勝ち", () => {
    let g = newGame(cfg());
    CRICKET_NUMS.filter((n) => n !== 15).forEach((n) => { g.marks[0][n] = 3; });
    g.scores[0] = 100;
    g.scores[1] = 100; // 同点はOK(>=)
    g = applyDart(g, 15, 3);
    expect(g.finished).toBe(true);
    expect(g.winners).toEqual([0]);
  });
  it("全クローズしてもスコアが相手未満なら継続", () => {
    let g = newGame(cfg());
    CRICKET_NUMS.filter((n) => n !== 15).forEach((n) => { g.marks[0][n] = 3; });
    g.scores[0] = 0;
    g.scores[1] = 100;
    g = applyDart(g, 15, 3);
    expect(g.finished).toBe(false);
  });
  it("最後の1本をオーバーフロー付きで閉じ、逆転勝ちできる", () => {
    let g = newGame(cfg());
    closeAll(g, 0);
    g.marks[0][20] = 2; // 20だけ残り1本
    g.scores[0] = 90;
    g.scores[1] = 100;
    g = applyDart(g, 20, 3); // 2+3=5本: クローズ+2本得点(+40) → 130 >= 100
    expect(g.scores[0]).toBe(130);
    expect(g.finished).toBe(true);
    expect(g.winners).toEqual([0]);
  });
});

describe("クリケット: チーム戦", () => {
  it("スコア・マークはチームスロット(0/1)に集約され、3人目の入力はTEAM Aに乗る", () => {
    let g = newGame(cfg({ names: ["A1", "B1", "A2", "B2"], teamCricket: true }));
    expect(g.scores.length).toBe(2);
    expect(g.marks.length).toBe(2);
    g.current = 2; // 3人目 = TEAM A
    g = applyDart(g, 20, 3);
    expect(g.marks[0][20]).toBe(3);
    g.current = 3; // 4人目 = TEAM B
    g = applyDart(g, 19, 3);
    expect(g.marks[1][19]).toBe(3);
  });
  it("チームの勝利判定もチームスロットで行われる", () => {
    let g = newGame(cfg({ names: ["A1", "B1", "A2", "B2"], teamCricket: true }));
    closeAll(g, 0);
    g.marks[0][15] = 2;
    g.scores[0] = 50;
    g.scores[1] = 40;
    g.current = 2; // TEAM Aの2人目が決める
    g = applyDart(g, 15, 1);
    expect(g.finished).toBe(true);
    expect(g.winners).toEqual([0]); // 勝者はチームスロット
  });
});
