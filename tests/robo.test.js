import { describe, it, expect } from "vitest";
import { newGame } from "../src/engine/game.js";
import { roboAim, roboThrow, ROBO_SIGMA01, ROBO_SIGMA_CR, ROBO_SIGMA_BULL } from "../src/engine/robo.js";
import { segAim, pointToSegment } from "../src/engine/board.js";

const cfg01 = (over = {}) => ({ type: "501", names: ["ROBO", "P"], mode: "hard", outRule: "double", inRule: "open", sepaBull: true, robo: { lv: 5, idx: 0 }, ...over });

describe("ROBO: 精度パラメータの健全性", () => {
  it("シグマはレベルが上がるほど単調に小さくなる(=上手くなる)", () => {
    for (const arr of [ROBO_SIGMA01, ROBO_SIGMA_CR, ROBO_SIGMA_BULL]) {
      expect(arr.length).toBe(10);
      for (let lv = 2; lv <= 9; lv++) {
        expect(arr[lv], `lv${lv}`).toBeLessThan(arr[lv - 1]);
      }
    }
  });
});

describe("ROBO: 狙いの選択(01)", () => {
  const aimAt = (g) => roboAim(g);
  it("ダブルアウト: 上がり目はダブルを狙う(40→D20, 32→D16, 50→BULL)", () => {
    let g = newGame(cfg01());
    g.scores[0] = 40;
    expect(aimAt(g)).toEqual(segAim(20, 2));
    g.scores[0] = 32;
    expect(aimAt(g)).toEqual(segAim(16, 2));
    g.scores[0] = 50;
    expect(aimAt(g)).toEqual(segAim("B", 2));
  });
  it("残りが多いときはT20を削る(セパブル)/ブル直行(ファットブル)", () => {
    let g = newGame(cfg01());
    g.scores[0] = 301;
    expect(aimAt(g)).toEqual(segAim(20, 3));
    let gf = newGame(cfg01({ sepaBull: false }));
    gf.scores[0] = 301;
    expect(aimAt(gf)).toEqual(segAim("B", 2));
  });
  it("奇数の中間残りはダブルに落とせる数字を狙う(例: 33→S1で32残し等の有効数字)", () => {
    let g = newGame(cfg01());
    g.scores[0] = 33;
    const aim = aimAt(g);
    const seg = pointToSegment(aim.x, aim.y);
    // 狙いはシングルで、当たれば残りが2-40の偶数(=次でダブルアウト可)になること
    expect(seg.mult).toBe(1);
    const next = 33 - seg.num;
    expect(next).toBeGreaterThanOrEqual(2);
    expect(next % 2).toBe(0);
    expect(next).toBeLessThanOrEqual(40);
  });
  it("ダブルイン未オープン時はD20を狙う", () => {
    let g = newGame(cfg01({ inRule: "double" }));
    expect(aimAt(g)).toEqual(segAim(20, 2));
  });
});

describe("ROBO: 投擲シミュレーションの不変条件", () => {
  it("結果は常に有効なセグメント(MISS含む)で、着弾点は盤面viewBox内", () => {
    const g = newGame(cfg01());
    g.scores[0] = 301;
    for (let i = 0; i < 300; i++) {
      const t = roboThrow(g);
      const validNum = t.num === 0 || t.num === "B" || (t.num >= 1 && t.num <= 20);
      expect(validNum).toBe(true);
      expect(t.mult).toBeGreaterThanOrEqual(1);
      expect(t.mult).toBeLessThanOrEqual(3);
      const r = Math.hypot(t.pt.x - 200, t.pt.y - 200);
      expect(r).toBeLessThanOrEqual(192.001);
      // 着弾点とセグメントが矛盾しないこと(スタッツのヒートマップ整合性)
      expect(pointToSegment(t.pt.x, t.pt.y)).toEqual({ num: t.num, mult: t.mult });
    }
  });
  it("高レベルほど狙いに近く着弾する(Lv9の平均誤差 < Lv1)", () => {
    const mkG = (lv) => {
      const g = newGame(cfg01({ robo: { lv, idx: 0 } }));
      g.scores[0] = 301; // 狙いはT20固定
      return g;
    };
    const aim = segAim(20, 3);
    const avgMiss = (lv, n = 400) => {
      const g = mkG(lv);
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const t = roboThrow(g);
        sum += Math.hypot(t.pt.x - aim.x, t.pt.y - aim.y);
      }
      return sum / n;
    };
    // σ68.6 vs σ11.9 なので統計的ゆらぎでは逆転し得ない
    expect(avgMiss(9)).toBeLessThan(avgMiss(1));
  });
});
