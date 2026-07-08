import { describe, it, expect } from "vitest";
import { addAwardTally, applyDart, awardTallyKey, detectAward, mergeAwardTally, newGame } from "../src/engine/game.js";

const cfg = (over = {}) => ({ type: "701", names: ["A", "B"], mode: "soft", outRule: "open", inRule: "open", sepaBull: true, ...over });

describe("アワード通算集計", () => {
  it("対象6種のnameは正しいキーに変換される", () => {
    expect(awardTallyKey("HAT TRICK")).toBe("hatTrick");
    expect(awardTallyKey("TON 80")).toBe("ton80");
    expect(awardTallyKey("THREE IN THE BLACK")).toBe("threeInTheBlack");
    expect(awardTallyKey("THREE IN A BED")).toBe("threeInABed");
    expect(awardTallyKey("WHITE HORSE")).toBe("whiteHorse");
    expect(awardTallyKey("9 MARK")).toBe("nineMark");
  });

  it("HIGH TON/LOW TONなど対象外のnameはnullを返す(集計されない)", () => {
    expect(awardTallyKey("HIGH TON")).toBeNull();
    expect(awardTallyKey("LOW TON")).toBeNull();
    expect(awardTallyKey("TON")).toBeNull();
    expect(awardTallyKey("5 MARK")).toBeNull();
    expect(awardTallyKey("ONE HUNDRED AND EIGHTY")).toBeNull();
  });

  it("addAwardTallyはプレイヤーごとに加算し、対象外nameは素通りする(純関数・引数を変更しない)", () => {
    const t0 = {};
    const t1 = addAwardTally(t0, 0, "HAT TRICK");
    const t2 = addAwardTally(t1, 0, "HAT TRICK");
    const t3 = addAwardTally(t2, 1, "WHITE HORSE");
    const t4 = addAwardTally(t3, 0, "HIGH TON"); // 対象外

    expect(t0).toEqual({}); // 元のオブジェクトは不変
    expect(t2).toEqual({ 0: { hatTrick: 2 } });
    expect(t3).toEqual({ 0: { hatTrick: 2 }, 1: { whiteHorse: 1 } });
    expect(t4).toBe(t3); // 対象外なら同一参照を返す
  });

  it("mergeAwardTallyは既存awardsに加算し、欠損(undefined)は0として扱う(マイグレーション不要)", () => {
    const merged1 = mergeAwardTally(undefined, { hatTrick: 1, ton80: 2 });
    expect(merged1).toEqual({ hatTrick: 1, ton80: 2 });

    const merged2 = mergeAwardTally({ hatTrick: 3 }, { hatTrick: 1, whiteHorse: 1 });
    expect(merged2).toEqual({ hatTrick: 4, whiteHorse: 1 });

    // playerTallyが無い(そのラウンドはアワード無し)場合は既存をそのまま返す
    expect(mergeAwardTally({ hatTrick: 3 }, undefined)).toEqual({ hatTrick: 3 });
  });

  it("ソフト01: HAT TRICK/THREE IN A BED/TON 80/THREE IN THE BLACKがdetectAward→awardTallyKeyで正しく拾える", () => {
    const mk = (darts) => {
      let g = newGame(cfg());
      for (const [n, m] of darts) g = applyDart(g, n, m);
      return detectAward(g);
    };
    expect(awardTallyKey(mk([["B", 1], ["B", 1], ["B", 1]]).name)).toBe("hatTrick");
    expect(awardTallyKey(mk([[20, 3], [20, 3], [20, 3]]).name)).toBe("ton80");
    expect(awardTallyKey(mk([[19, 3], [19, 3], [19, 3]]).name)).toBe("threeInABed");
    expect(awardTallyKey(mk([["B", 2], ["B", 3], ["B", 2]]).name)).toBe("threeInTheBlack");
  });

  it("クリケット: WHITE HORSE/9 MARKがdetectAward→awardTallyKeyで正しく拾える", () => {
    let g = newGame({ type: "cricket", names: ["A", "B"], mode: "soft", sepaBull: true });
    g = applyDart(g, 20, 3);
    g = applyDart(g, 19, 3);
    g = applyDart(g, 18, 3);
    expect(awardTallyKey(detectAward(g).name)).toBe("whiteHorse");

    let g2 = newGame({ type: "cricket", names: ["A", "B"], mode: "soft", sepaBull: true });
    g2 = applyDart(g2, 20, 3);
    g2 = applyDart(g2, 20, 3);
    g2 = applyDart(g2, 20, 3);
    expect(awardTallyKey(detectAward(g2).name)).toBe("nineMark");
  });

  it("複数レグ: レグ1のHAT TRICKはレグ2開始時のタリーリセット後もプロフィールに残る", () => {
    // game.jsxの実装と同じ順序で検証する:
    // 1) レグ1でHAT TRICK発生 → ゲーム内tallyに加算
    // 2) レグ1終了(g.finished) → onFinishedでプロフィールawardsへマージ(g.gidはまだレグ1のまま)
    // 3) レグ2開始でg.gidが変わり、ゲーム内tallyは{}にリセットされる(プロフィール側は無関係)
    // 4) レグ2は無得点のまま終了 → 空タリーのマージでもレグ1の記録は消えない
    let leg1Tally = {};
    leg1Tally = addAwardTally(leg1Tally, 0, "HAT TRICK");

    let profileAwards; // 新規プロフィール相当(旧データ同様awards未定義から開始)
    profileAwards = mergeAwardTally(profileAwards, leg1Tally[0]); // レグ1終了時のonFinished相当
    expect(profileAwards).toEqual({ hatTrick: 1 });

    // レグ2開始: g.gid変更によりゲーム内タリーがリセットされる(プロフィールには影響しない)
    const leg2Tally = {};
    profileAwards = mergeAwardTally(profileAwards, leg2Tally[0]); // レグ2終了時のonFinished相当(アワード無し)
    expect(profileAwards).toEqual({ hatTrick: 1 }); // レグ1の記録が失われていないこと

    // レグ3でさらにWHITE HORSEが発生した場合は加算されること
    let leg3Tally = {};
    leg3Tally = addAwardTally(leg3Tally, 0, "WHITE HORSE");
    profileAwards = mergeAwardTally(profileAwards, leg3Tally[0]);
    expect(profileAwards).toEqual({ hatTrick: 1, whiteHorse: 1 });
  });
});
