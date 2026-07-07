import { describe, it, expect } from "vitest";
import { BOARD_ORDER, dartLabel, dartValue, segmentPoint, pointToSegment, segAim, isCricketTarget } from "../src/engine/board.js";

describe("盤面: 座標→セグメント変換の整合性", () => {
  it("segmentPoint(代表座標)は必ず同じセグメントに逆変換される(全ナンバー×全倍率×反復)", () => {
    // segmentPointはジッター入りなので、範囲設計が判定リングに収まっていることを反復で保証
    for (let rep = 0; rep < 10; rep++) {
      for (const num of BOARD_ORDER) {
        for (const mult of [1, 2, 3]) {
          const pt = segmentPoint(num, mult);
          const seg = pointToSegment(pt.x, pt.y);
          expect(seg, `num=${num} mult=${mult}`).toEqual({ num, mult });
        }
      }
      expect(pointToSegment(...Object.values(segmentPoint("B", 1)))).toEqual({ num: "B", mult: 1 });
      expect(pointToSegment(...Object.values(segmentPoint("B", 2)))).toEqual({ num: "B", mult: 2 });
    }
  });
  it("segAim(狙い中心)も全セグメントで一致する", () => {
    for (const num of BOARD_ORDER) {
      for (const mult of [1, 2, 3]) {
        const pt = segAim(num, mult);
        expect(pointToSegment(pt.x, pt.y), `num=${num} mult=${mult}`).toEqual({ num, mult });
      }
    }
    expect(pointToSegment(200, 200)).toEqual({ num: "B", mult: 2 });
  });
  it("リング境界: インナー/アウターブル・ダブル外周・盤外", () => {
    expect(pointToSegment(200, 183)).toEqual({ num: "B", mult: 2 }); // r=17(インナーブル内側判定)
    expect(pointToSegment(200, 166)).toEqual({ num: "B", mult: 1 }); // r=34
    expect(pointToSegment(200, 30)).toEqual({ num: 20, mult: 2 });   // r=170(真上=20のダブル)
    expect(pointToSegment(200, 29)).toEqual({ num: 0, mult: 1 });    // r=171 → MISS
  });
  it("MISSのsegmentPointはnull(刺さらない)", () => {
    expect(segmentPoint(0, 1)).toBeNull();
  });
});

describe("盤面: ダーツの値とラベル", () => {
  it("通常セグメントの値とラベル", () => {
    expect(dartValue(20, 3, false)).toBe(60);
    expect(dartLabel(20, 3, false)).toBe("T20");
    expect(dartLabel(16, 2, false)).toBe("D16");
    expect(dartLabel(5, 1, false)).toBe("5");
    expect(dartValue(0, 1, false)).toBe(0);
    expect(dartLabel(0, 1, false)).toBe("MISS");
  });
  it("ブル: セパ時は25/50、ファットブル時は常に50でラベルもBULL統一", () => {
    expect(dartValue("B", 1, false)).toBe(25);
    expect(dartValue("B", 2, false)).toBe(50);
    expect(dartLabel("B", 2, false)).toBe("D-BULL");
    expect(dartValue("B", 1, true)).toBe(50);
    expect(dartLabel("B", 1, true)).toBe("BULL");
    expect(dartLabel("B", 2, true)).toBe("BULL");
  });
  it("クリケットターゲット判定は15-20とブルのみ", () => {
    expect(isCricketTarget(15)).toBe(true);
    expect(isCricketTarget(20)).toBe(true);
    expect(isCricketTarget("B")).toBe(true);
    expect(isCricketTarget(14)).toBe(false);
    expect(isCricketTarget(21)).toBe(false);
  });
});
