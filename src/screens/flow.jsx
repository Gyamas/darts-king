import { useState, useEffect } from "react";
import { CATS, GAMES, medleySeq, roundLimitOf } from "../constants.js";
import { roboRtText, roboSpec01, roboSpecMpr, roboStatText } from "../engine/robo.js";
import { t } from "../i18n.js";
import { PX_01, PX_CR, RATING_MODE, STATS_MODE, flightOf, fmt01, fmtCr, fmtRt, pxClass, pxRtFrom, statsFor } from "../profiles.js";
import { ProfileEditor, ProfilePicker } from "./players.jsx";
import { UI } from "../sound.js";
import { C, FONT_BODY, FONT_DISPLAY } from "../theme.js";
import { DartBoard } from "../ui/board.jsx";
import { Avatar, Btn, CatIcon, FlowNav, OptionChips, PLAYER_COLORS, Stepper } from "../ui/kit.jsx";


export function OptionModal({ kind, accent, outRule, setOutRule, inRule, setInRule, sepaBull, setSepaBull, onClose }) {
  const row = (label, content) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: C.creamDim, margin: "0 0 6px 2px", fontFamily: FONT_DISPLAY, letterSpacing: "0.15em" }}>{label}</div>
      {content}
    </div>
  );
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(8,9,12,0.85)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: "0.15em", color: C.cream }}>OPTION SETTINGS</div>
          <Btn onClick={onClose} style={{ padding: "4px 12px", fontSize: 13, color: C.creamDim }}>
            ✕
          </Btn>
        </div>
        {kind === "01" &&
          row(
            t("flow.option.in"),
            <OptionChips
              accent={accent}
              value={inRule}
              onChange={setInRule}
              options={[
                ["open", t("flow.option.open"), t("flow.option.inOpenSub")],
                ["double", t("flow.option.double"), t("flow.option.inDoubleSub")],
              ]}
            />
          )}
        {kind === "01" &&
          row(
            t("flow.option.out"),
            <OptionChips
              accent={accent}
              value={outRule}
              onChange={setOutRule}
              options={[
                ["open", t("flow.option.open"), t("flow.option.outOpenSub")],
                ["double", t("flow.option.double"), t("flow.option.outDoubleSub")],
                ["master", t("flow.option.master"), t("flow.option.masterSub")],
              ]}
            />
          )}
        {kind !== "cricket" &&
          row(
            "BULL",
            <OptionChips
              accent={accent}
              value={sepaBull}
              onChange={setSepaBull}
              options={[
                [false, "50 / 50", t("flow.option.bull5050Sub")],
                [true, "25 / 50", t("flow.option.bull2550Sub")],
              ]}
            />
          )}
        <button
          onClick={onClose}
          style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: accent, color: "#fff", fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, letterSpacing: "0.15em", marginTop: 4 }}
        >
          OK
        </button>
      </div>
    </div>
  );
}


export function GameOnSplash({ g, profiles, accent, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const statOf = (i) => {
    if (g.robo && i === g.robo.idx) {
      // ロボはスペック値を表示
      if (g.kind === "cricket") return roboSpecMpr(g.robo.lv).toFixed(2);
      return roboSpec01(g.robo.lv).toFixed(1);
    }
    const pid = g.profileIds && g.profileIds[i];
    const prof = pid ? profiles.find((p) => p.id === pid) : null;
    if (!prof) return "-";
    if (g.kind === "cricket") return fmtCr(prof);
    if (g.kind === "atc") {
      const b = statsFor(prof).pr;
      return b && b.atcBest ? t("flow.stat.atcThrows", { n: b.atcBest }) : "-";
    }
    if (g.kind === "crcu") {
      const b = statsFor(prof).pr;
      return b && b.crcuBest ? String(b.crcuBest) : "-";
    }
    if (g.kind === "shoot") {
      const b = statsFor(prof).pr;
      return b && b.shootBest ? String(b.shootBest) : "-";
    }
    if (g.kind === "halfit") {
      const b = statsFor(prof).pr;
      return b && b.halfBest ? String(b.halfBest) : "-";
    }
    if (g.kind === "bob") {
      const b = statsFor(prof).pr;
      return b && b.bobBest ? String(b.bobBest) : "-";
    }
    if (g.kind === "p121") {
      const b = statsFor(prof).pr;
      return b && b.p121Best ? String(b.p121Best) : "-";
    }
    if (g.kind === "countup") {
      const cu = statsFor(prof).cu;
      return cu && cu.best ? String(cu.best) : "-";
    }
    return fmt01(prof);
  };
  const statLabel =
    g.kind === "cricket" ? "MPR" : g.kind === "countup" ? "BEST SCORE" : g.kind === "atc" ? t("flow.statLabel.atc") : g.kind === "bob" ? "HIGH SCORE" : g.kind === "p121" ? "BEST TARGET" : g.kind === "crcu" ? "BEST MARKS" : g.kind === "halfit" || g.kind === "shoot" ? "BEST SCORE" : "01 STATS";
  return (
    <div
      onClick={onDone}
      style={{ position: "fixed", inset: 0, zIndex: 70, background: "#0C0E11", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}
    >
      <div className="gameon" style={{ fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 700, letterSpacing: "0.18em", color: C.cream, lineHeight: 1 }}>
        GAME ON
      </div>
      {g.match && (
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: "0.2em", color: CATS.match.accent, marginTop: 10 }}>
          LEG {g.match.legNo} / BEST OF {g.match.total} ・ {g.match.seqLabel}
        </div>
      )}
      <div style={{ fontSize: 11, letterSpacing: "0.45em", color: C.creamDim, marginTop: 8, fontFamily: FONT_DISPLAY }}>STATS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, alignItems: "center", justifyContent: "center" }}>
        {g.players.map((n, i) => [
          i > 0 && (
            <div key={`vs${i}`} style={{ fontFamily: FONT_DISPLAY, color: C.creamDim, fontSize: 14, letterSpacing: "0.1em" }}>
              VS
            </div>
          ),
          <div
            key={i}
            className="shufflerow"
            style={{ animationDelay: `${i * 0.16}s`, minWidth: 150, background: C.surface, borderTop: `3px solid ${PLAYER_COLORS[i % 4]}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Avatar avatar={g.avatars && g.avatars[i]} size={30} />
              <div style={{ fontSize: 14, fontWeight: 700, color: C.cream, maxWidth: 110, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</div>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 700, color: C.cream, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{statOf(i)}</div>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.creamDim, fontFamily: FONT_DISPLAY }}>{statLabel}</div>
          </div>,
        ])}
      </div>
      <div style={{ marginTop: 24, fontSize: 11, color: C.creamDim }}>{t("flow.gameOn.tapToSkip")}</div>
    </div>
  );
}


export function CorkModal({ players, mode, accent, teamLocked, onDone, onClose }) {
  const [marks, setMarks] = useState([]);
  const done = marks.length >= players.length;
  const fakeG = { mode, kind: "cork", marks: [] };
  const handleCork = (p) => {
    UI.cork();
    setMarks((ms) => (ms.length >= players.length ? ms : [...ms, { ...p, player: players[ms.length], color: PLAYER_COLORS[ms.length % 4] }]));
  };
  const order = done ? [...marks].sort((a, b) => a.d - b.d) : null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,9,12,0.92)", zIndex: 55, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 12, overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 440, background: C.surface, border: `1.5px solid ${accent}`, borderRadius: 18, padding: "16px 14px", margin: "auto 0" }}>
        <div style={{ textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: "0.25em", color: accent }}>CORK START</div>
        {!done ? (
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div style={{ fontSize: 15, color: C.cream }}>
              <span style={{ color: PLAYER_COLORS[marks.length % 4], fontWeight: 700 }}>{players[marks.length].name}</span> {t("flow.cork.turnSuffix")}({marks.length + 1}/{players.length})
            </div>
            <div style={{ fontSize: 11.5, color: C.creamDim, marginTop: 3 }}>{t("flow.cork.instructions")}</div>
          </div>
        ) : (
          <div style={{ textAlign: "center", fontSize: 12, color: C.creamDim, marginTop: 4 }}>{t("flow.cork.orderDecided")}</div>
        )}

        <DartBoard g={fakeG} onSegment={() => {}} corkMode={!done} corkMarks={marks} onCork={handleCork} />

        {done ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {order.map((m, i) => (
                <div
                  key={i}
                  className="shufflerow"
                  style={{
                    animationDelay: `${i * 0.18}s`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: i === 0 ? `${accent}22` : C.surface2,
                    border: `1.5px solid ${i === 0 ? accent : "transparent"}`,
                    borderRadius: 12,
                    padding: "8px 12px",
                  }}
                >
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: i === 0 ? accent : C.creamDim, width: 24, textAlign: "center" }}>{i + 1}</div>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: m.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 14, fontWeight: i === 0 ? 700 : 400, color: C.cream }}>
                    {teamLocked ? `[${i % 2 === 0 ? "A" : "B"}] ` : ""}
                    {m.player.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.creamDim, fontVariantNumeric: "tabular-nums" }}>{t("flow.cork.distanceFromCenter", { mm: m.d.toFixed(0) })}</div>
                  {i === 0 && <div style={{ fontSize: 10, fontFamily: FONT_DISPLAY, letterSpacing: "0.12em", color: accent }}>FIRST</div>}
                </div>
              ))}
            </div>
            <button
              onClick={() => onDone(order.map((m) => m.player))}
              style={{ marginTop: 14, width: "100%", padding: "14px 0", borderRadius: 12, border: "none", cursor: "pointer", background: accent, color: "#fff", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: "0.15em" }}
            >
              {t("flow.startInOrder")}
            </button>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Btn
                onClick={() => {
                  UI.tick();
                  setMarks([]);
                }}
                style={{ flex: 1, fontSize: 13 }}
              >
                {t("flow.cork.redo")}
              </Btn>
              <Btn
                onClick={() => {
                  UI.close();
                  onClose();
                }}
                style={{ flex: 1, fontSize: 13, color: C.creamDim }}
              >
                {t("flow.cancel")}
              </Btn>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {marks.length > 0 && (
              <Btn
                onClick={() => {
                  UI.undo();
                  setMarks((ms) => ms.slice(0, -1));
                }}
                style={{ flex: 1, fontSize: 13 }}
              >
                {t("flow.cork.undoOne")}
              </Btn>
            )}
            <Btn
              onClick={() => {
                UI.close();
                onClose();
              }}
              style={{ flex: 1, fontSize: 13, color: C.creamDim }}
            >
              {t("flow.cancel")}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}


export function Flow({ cat, mode, profiles, upsertProfile, deleteProfile, onHome, onStart }) {
  const TH = CATS[cat];
  const [step, setStep] = useState(0);
  const [variant, setVariant] = useState("501");
  const [team, setTeam] = useState(false);
  const [count, setCount] = useState(cat === "robo" || cat === "practice" ? 1 : 2);
  const [names, setNames] = useState(
    cat === "robo" || cat === "practice"
      ? [{ name: t("flow.defaultPlayerName", { n: 1 }), pid: null, avatar: null }]
      : [
          { name: t("flow.defaultPlayerName", { n: 1 }), pid: null, avatar: null },
          { name: t("flow.defaultPlayerName", { n: 2 }), pid: null, avatar: null },
        ]
  );
  const [roboGame, setRoboGame] = useState("501");
  const [pracGame, setPracGame] = useState("countup");
  const [roboLv, setRoboLv] = useState(3);
  const [pickerFor, setPickerFor] = useState(null); // プロフィール選択中のスロット
  const [editing, setEditing] = useState(null); // {profile?, forSlot?}
  const [outRule, setOutRule] = useState(mode === "hard" ? "double" : "open");
  const [inRule, setInRule] = useState("open");
  const [sepaBull, setSepaBull] = useState(mode === "hard");
  const [optOpen, setOptOpen] = useState(false);
  const [shuffled, setShuffled] = useState(null); // シャッフル結果(確認待ち)
  const [corkOpen, setCorkOpen] = useState(false); // コークスタート

  const [legs, setLegs] = useState(3);
  const [zeroOne, setZeroOne] = useState(mode === "hard" ? "501" : "701"); // スティール標準は501連戦
  const type = cat === "01" ? variant : cat === "robo" ? roboGame : cat === "practice" ? pracGame : cat;
  const kind = type === "match" ? "match" : GAMES[type].kind;
  const teamLocked = cat === "cricket" && team;
  const limit = type === "match" ? 0 : roundLimitOf(kind, type, mode, teamLocked);

  const resize = (n) => {
    setCount(n);
    setNames((ns) => Array.from({ length: n }, (_, i) => ns[i] || { name: t("flow.defaultPlayerName", { n: i + 1 }), pid: null, avatar: null }));
  };
  const pickTeam = (t) => {
    setTeam(t);
    if (t) resize(4);
  };
  const setName = (i, v) => setNames((ns) => ns.map((p, j) => (j === i ? { ...p, name: v } : p)));
  const assignProfile = (i, prof) =>
    setNames((ns) => ns.map((p, j) => (j === i ? { name: prof.name, pid: prof.id, avatar: prof.avatar } : p)));
  const clearSlot = (i) => setNames((ns) => ns.map((p, j) => (j === i ? { name: t("flow.defaultPlayerName", { n: i + 1 }), pid: null, avatar: null } : p)));
  const trimP = (p) => ({ ...p, name: p.name.trim() || t("flow.defaultPlayerNameBase") });
  const roboPlayer = () => ({ name: `ROBO Lv.${roboLv}`, pid: null, avatar: { kind: "emoji", emoji: "🤖", color: "#8B5CF6" }, robo: true });
  const fullPlayers = () => (cat === "robo" ? [...names.map(trimP), roboPlayer()] : names.map(trimP));

  const launch = (ps) => {
    UI.startGame();
    onStart({
      type,
      names: ps.map((p) => p.name),
      profileIds: ps.map((p) => p.pid || null),
      avatars: ps.map((p) => p.avatar || null),
      mode,
      outRule,
      inRule,
      sepaBull,
      teamCricket: teamLocked,
      legs: type === "match" ? legs : undefined,
      zeroOne: type === "match" ? zeroOne : undefined,
      robo: cat === "robo" ? { lv: roboLv, idx: ps.findIndex((p) => p.robo) } : undefined,
    });
  };
  const doShuffle = () => {
    UI.shuffle();
    const ns = fullPlayers();
    for (let i = ns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ns[i], ns[j]] = [ns[j], ns[i]];
    }
    setShuffled({ players: ns, key: Date.now() });
  };

  const gameTitle = cat === "01" ? variant : TH.label;
  const desc =
    cat === "01"
      ? t("flow.desc.zeroOne")
      : cat === "cricket"
      ? t("flow.desc.cricket")
      : cat === "match"
      ? mode === "hard"
        ? t("flow.desc.matchHard")
        : t("flow.desc.matchSoft")
      : cat === "robo"
      ? t("flow.desc.robo")
      : cat === "practice"
      ? pracGame === "countup"
        ? t("flow.desc.practiceCountup")
        : pracGame === "shoot"
        ? t("flow.desc.practiceShoot")
        : pracGame === "crcu"
        ? t("flow.desc.practiceCrcu")
        : pracGame === "halfit"
        ? t("flow.desc.practiceHalfit")
        : pracGame === "atc"
        ? t("flow.desc.practiceAtc")
        : pracGame === "bob"
        ? t("flow.desc.practiceBob")
        : t("flow.desc.practiceP121")
      : t("flow.desc.fallback");

  return (
    <div>
      <Stepper
        accent={TH.accent}
        step={step}
        onHome={() => {
          UI.back();
          onHome();
        }}
      />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 48px" }}>
        {step === 0 && (
          <>
            <div style={{ background: `linear-gradient(0deg, ${TH.soft}, ${TH.soft}), ${C.surface}`, border: `1.5px solid ${TH.accent}`, borderRadius: 14, padding: "18px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CatIcon cat={cat} color={TH.accent} />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: "0.08em", color: C.cream }}>{gameTitle}</div>
              </div>
              <div style={{ fontSize: 12.5, color: C.creamDim, marginTop: 10, lineHeight: 1.7 }}>{desc}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: "0.15em", color: TH.accent, marginTop: 10 }}>
                {type === "match" ? `BEST OF ${legs} ・ ${mode === "hard" ? "LEG MATCH" : "MEDLEY"}` : limit > 0 ? `${limit} ROUNDS` : t("flow.unlimitedRounds")}
                {kind === "01" || type === "match" ? ` ・ ${mode === "soft" ? "SOFT" : "STEEL"}` : ""}
              </div>
            </div>

            {cat === "01" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{t("flow.selectGame")}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(mode === "soft" ? ["301", "501", "701", "901", "1101", "1501"] : ["301", "501", "701"]).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        UI.tick();
                        setVariant(v);
                      }}
                      style={{
                        flex: "1 1 30%",
                        padding: "13px 0",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontFamily: FONT_DISPLAY,
                        fontSize: 21,
                        fontWeight: 600,
                        color: variant === v ? "#fff" : C.creamDim,
                        background: variant === v ? TH.accent : C.surface,
                        border: `1.5px solid ${variant === v ? TH.accent : C.line}`,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {cat === "practice" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{t("flow.selectPracticeMenu")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {(mode === "hard"
                    ? [
                        ["countup", "COUNT-UP", t("flow.practice.countupHardSub")],
                        ["atc", "AROUND THE CLOCK", t("flow.practice.atcSub")],
                        ["bob", "BOB'S 27", t("flow.practice.bobSub")],
                        ["p121", "121", t("flow.practice.p121Sub")],
                      ]
                    : [
                        ["countup", "COUNT-UP", t("flow.practice.countupSoftSub")],
                        ["crcu", t("flow.practice.crcuLabel"), t("flow.practice.crcuSub")],
                        ["halfit", "HALF-IT", t("flow.practice.halfitSub")],
                        ["shoot", "SHOOT OUT", t("flow.practice.shootSub")],
                      ]
                  ).map(([v, label, sub]) => (
                    <button
                      key={v}
                      onClick={() => {
                        UI.tick();
                        setPracGame(v);
                      }}
                      style={{
                        padding: "13px 8px 11px",
                        borderRadius: 12,
                        cursor: "pointer",
                        textAlign: "center",
                        color: pracGame === v ? "#fff" : C.creamDim,
                        background: pracGame === v ? TH.accent : C.surface,
                        border: `1.5px solid ${pracGame === v ? TH.accent : C.line}`,
                      }}
                    >
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, letterSpacing: "0.04em", lineHeight: 1.1 }}>{label}</div>
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85, fontFamily: FONT_BODY }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {cat === "robo" && (
              <>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{t("flow.selectGame")}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      ["301", "301"],
                      ["501", "501"],
                      ["701", "701"],
                      ["cricket", "CRICKET"],
                      ["countup", "COUNT-UP"],
                      ["match", "MATCH"],
                    ].map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => {
                          UI.tick();
                          setRoboGame(v);
                        }}
                        style={{
                          flex: "1 1 30%",
                          padding: "11px 0",
                          borderRadius: 10,
                          cursor: "pointer",
                          fontFamily: FONT_DISPLAY,
                          fontSize: 15,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: roboGame === v ? "#fff" : C.creamDim,
                          background: roboGame === v ? TH.accent : C.surface,
                          border: `1.5px solid ${roboGame === v ? TH.accent : C.line}`,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{t("flow.robo.selectLevel")}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 4 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv) => (
                      <button
                        key={lv}
                        onClick={() => {
                          UI.tick();
                          setRoboLv(lv);
                        }}
                        style={{
                          padding: "11px 0",
                          borderRadius: 9,
                          cursor: "pointer",
                          fontFamily: FONT_DISPLAY,
                          fontSize: 16,
                          fontWeight: 700,
                          color: roboLv === lv ? "#fff" : C.creamDim,
                          background: roboLv === lv ? TH.accent : C.surface,
                          border: `1.5px solid ${roboLv === lv ? TH.accent : C.line}`,
                        }}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px" }}>
                    <Avatar avatar={{ kind: "emoji", emoji: "🤖", color: "#8B5CF6" }} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.cream }}>ROBO Lv.{roboLv}</div>
                      <div style={{ fontSize: 10.5, color: C.creamDim, marginTop: 2 }}>
                        {roboRtText(roboLv)} ・ {roboStatText(roboLv)}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, fontFamily: FONT_DISPLAY, letterSpacing: "0.1em", color: TH.accent, fontWeight: 700 }}>
                      {RATING_MODE === "px"
                        ? pxClass(Math.round((pxRtFrom(roboSpec01(roboLv) / 3, PX_01) + pxRtFrom(roboSpecMpr(roboLv), PX_CR)) / 2))
                        : `${flightOf(2 * roboLv)} FLIGHT`}
                    </div>
                  </div>
                </div>
              </>
            )}
            {type === "match" && (
              <>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{t("flow.match.selectLegs")}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[3, 5, 7].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          UI.tick();
                          setLegs(v);
                        }}
                        style={{
                          flex: 1,
                          padding: "12px 0 10px",
                          borderRadius: 10,
                          cursor: "pointer",
                          color: legs === v ? "#fff" : C.creamDim,
                          background: legs === v ? TH.accent : C.surface,
                          border: `1.5px solid ${legs === v ? TH.accent : C.line}`,
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, lineHeight: 1 }}>BEST OF {v}</div>
                        <div style={{ fontSize: 10, marginTop: 3, opacity: 0.85, fontFamily: FONT_BODY }}>{t("flow.match.legsToWin", { n: Math.ceil(v / 2) })}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 13, color: C.creamDim, margin: "0 0 8px 2px" }}>{mode === "hard" ? t("flow.match.legGameHard") : t("flow.match.legGameSoft")}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["301", "501", "701"].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          UI.tick();
                          setZeroOne(v);
                        }}
                        style={{
                          flex: 1,
                          padding: "11px 0",
                          borderRadius: 10,
                          cursor: "pointer",
                          fontFamily: FONT_DISPLAY,
                          fontSize: 18,
                          fontWeight: 600,
                          color: zeroOne === v ? "#fff" : C.creamDim,
                          background: zeroOne === v ? TH.accent : C.surface,
                          border: `1.5px solid ${zeroOne === v ? TH.accent : C.line}`,
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "11px 12px" }}>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.2em", color: C.creamDim, fontFamily: FONT_DISPLAY, marginBottom: 7 }}>{mode === "hard" ? "LEG FORMAT" : "MEDLEY ORDER"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    {medleySeq(legs, zeroOne, mode).map((t, i) => [
                      i > 0 && (
                        <span key={`a${i}`} style={{ color: C.creamDim, fontSize: 11 }}>
                          →
                        </span>
                      ),
                      <span
                        key={i}
                        style={{ fontFamily: FONT_DISPLAY, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: t === "choice" ? "#1A1C20" : C.cream, background: t === "choice" ? C.brass : C.surface2, borderRadius: 7, padding: "4px 9px" }}
                      >
                        {t === "cricket" ? "CRICKET" : t === "choice" ? "CHOICE" : t}
                      </span>,
                    ])}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.creamDim, marginTop: 7, lineHeight: 1.6 }}>{mode === "hard" ? t("flow.match.formatDescHard") : t("flow.match.formatDescSoft")}</div>
                </div>
              </>
            )}
            <FlowNav
              accent={TH.accent}
              onNext={() => {
                UI.nav();
                setStep(1);
              }}
            />
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: C.creamDim }}>{t("flow.selectPlayerCount")}</div>
              {cat === "cricket" && (
                <button
                  onClick={() => {
                    UI.toggle();
                    pickTeam(!team);
                  }}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    fontWeight: 700,
                    color: team ? "#fff" : C.creamDim,
                    background: team ? TH.accent : C.surface,
                    border: `1.5px solid ${team ? TH.accent : C.line}`,
                  }}
                >
                  TEAM FORMAT(2vs2)
                </button>
              )}
            </div>
            {cat === "match" && (
              <div style={{ fontSize: 12, color: C.cream, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 12px", marginBottom: 18 }}>
                {t("flow.match.introPre")}<span style={{ color: TH.accent, fontWeight: 700 }}>1 vs 1</span>{t("flow.match.introPost")}
              </div>
            )}
            {cat === "robo" && (
              <div style={{ fontSize: 12, color: C.cream, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 12px", marginBottom: 18 }}>
                <span style={{ color: TH.accent, fontWeight: 700 }}>ROBO Lv.{roboLv}</span>{t("flow.robo.introPost")}
                {roboGame === "match" && <span>{t("flow.robo.formatNote", { format: mode === "hard" ? t("flow.robo.formatHard") : t("flow.robo.formatSoft") })}</span>}
              </div>
            )}
            <div style={{ display: cat === "match" || cat === "robo" ? "none" : "flex", gap: 6, marginBottom: 18 }}>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  disabled={teamLocked}
                  onClick={() => {
                    UI.tick();
                    resize(n);
                  }}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 10,
                    cursor: teamLocked ? "default" : "pointer",
                    fontFamily: FONT_DISPLAY,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: count === n ? "#fff" : C.creamDim,
                    opacity: teamLocked && count !== n ? 0.35 : 1,
                    background: count === n ? TH.accent : C.surface,
                    border: `1.5px solid ${count === n ? TH.accent : C.line}`,
                  }}
                >
                  {n}P
                </button>
              ))}
            </div>
            {teamLocked && (
              <div style={{ fontSize: 11.5, color: C.creamDim, margin: "0 2px 10px" }}>{t("flow.team.orderNote")}</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {names.map((p, i) => {
                const prof = p.pid ? profiles.find((x) => x.id === p.pid) : null;
                return (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: C.surface, border: `1px solid ${p.pid ? TH.accent + "66" : C.line}`, borderRadius: 12, padding: "8px 10px" }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#fff",
                        background: teamLocked ? (i % 2 === 0 ? TH.accent : C.red) : C.surface2,
                        flexShrink: 0,
                        border: teamLocked ? "none" : `1px solid ${C.line}`,
                      }}
                    >
                      {teamLocked ? (i % 2 === 0 ? "A" : "B") : i + 1}
                    </div>
                    <Avatar avatar={p.avatar} size={34} />
                    {p.pid ? (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: C.creamDim, marginTop: 1 }}>
                            {STATS_MODE === "hard" ? "AVG" : "Rt"} {prof ? fmtRt(prof) : "-"} ・ 01: {prof ? fmt01(prof) : "-"} / CR: {prof ? fmtCr(prof) : "-"}
                          </div>
                        </div>
                        <Btn
                          onClick={() => {
                            UI.tick();
                            clearSlot(i);
                          }}
                          style={{ padding: "5px 10px", fontSize: 12, color: C.creamDim }}
                        >
                          ✕
                        </Btn>
                      </>
                    ) : (
                      <>
                        <input
                          value={p.name}
                          onChange={(e) => setName(i, e.target.value)}
                          maxLength={12}
                          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: C.cream, fontFamily: FONT_BODY, fontSize: 15, outline: "none" }}
                        />
                        <Btn
                          onClick={() => {
                            UI.modal();
                            setPickerFor(i);
                          }}
                          style={{ padding: "5px 11px", fontSize: 12, fontWeight: 700 }}
                        >
                          {t("flow.pickButton")}
                        </Btn>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {cat === "robo" && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(139,92,246,0.10)", border: `1px solid ${TH.accent}66`, borderRadius: 12, padding: "8px 10px", marginTop: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: "#fff", background: C.surface2, flexShrink: 0, border: `1px solid ${C.line}` }}>
                  2
                </div>
                <Avatar avatar={{ kind: "emoji", emoji: "🤖", color: "#8B5CF6" }} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream }}>ROBO Lv.{roboLv}</div>
                  <div style={{ fontSize: 10, color: C.creamDim, marginTop: 1 }}>
                    {roboRtText(roboLv)} ・ {roboStatText(roboLv)}
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: FONT_DISPLAY, letterSpacing: "0.1em", color: TH.accent, fontWeight: 700, padding: "0 4px" }}>CPU</div>
              </div>
            )}
            <div style={{ fontSize: 10.5, color: C.creamDim, margin: "8px 2px 0", lineHeight: 1.6 }}>
              {t("flow.pickHint", { pick: t("flow.pickButton") })}
            </div>

            {pickerFor != null && (
              <ProfilePicker
                profiles={profiles}
                usedIds={names.map((p) => p.pid).filter(Boolean)}
                accent={TH.accent}
                onPick={(prof) => {
                  assignProfile(pickerFor, prof);
                  setPickerFor(null);
                }}
                onCreate={() => setEditing({ forSlot: pickerFor })}
                onEdit={(prof) => setEditing({ profile: prof })}
                onDelete={(id) => {
                  deleteProfile(id);
                  setNames((ns) => ns.map((p, j) => (p.pid === id ? { name: t("flow.defaultPlayerName", { n: j + 1 }), pid: null, avatar: null } : p)));
                }}
                onClose={() => setPickerFor(null)}
              />
            )}
            {editing && (
              <ProfileEditor
                initial={editing.profile || null}
                accent={TH.accent}
                onSave={(prof) => {
                  upsertProfile(prof);
                  if (editing.forSlot != null) assignProfile(editing.forSlot, prof);
                  else setNames((ns) => ns.map((p) => (p.pid === prof.id ? { name: prof.name, pid: prof.id, avatar: prof.avatar } : p)));
                  setEditing(null);
                  setPickerFor(null);
                }}
                onClose={() => setEditing(null)}
              />
            )}
            <FlowNav
              accent={TH.accent}
              onBack={() => {
                UI.back();
                setStep(0);
              }}
              onNext={() => {
                UI.nav();
                setStep(2);
              }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: "0.08em", color: TH.accent }}>{gameTitle}</div>
              <div style={{ fontSize: 12, color: C.creamDim, marginTop: 6, lineHeight: 1.8 }}>
                {limit > 0 ? `${limit} ROUNDS` : t("flow.unlimitedRounds")}
                {kind !== "cricket" && ` ・ BULL ${sepaBull ? "25/50" : "50/50"}`}
                {(kind === "01" || kind === "match") && ` ・ IN ${inRule === "double" ? "DOUBLE" : "OPEN"} ・ OUT ${outRule === "double" ? "DOUBLE" : outRule === "master" ? "MASTER" : "OPEN"}`}
                {teamLocked && t("flow.teamBadge")}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {(cat === "robo" ? fullPlayers() : names).map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.cream, background: C.surface2, borderRadius: 8, padding: "4px 9px 4px 5px" }}>
                    <Avatar avatar={p.avatar} size={20} />
                    {teamLocked ? `${i % 2 === 0 ? "A" : "B"}: ` : ""}
                    {p.name}
                  </div>
                ))}
              </div>
            </div>

            {kind !== "cricket" && kind !== "atc" && kind !== "bob" && kind !== "p121" && kind !== "crcu" && kind !== "halfit" && kind !== "shoot" && (
              <Btn
                onClick={() => {
                  UI.modal();
                  setOptOpen(true);
                }}
                style={{ width: "100%", marginTop: 12, fontFamily: FONT_DISPLAY, letterSpacing: "0.15em" }}
              >
                ⚙ GAME OPTION
              </Btn>
            )}
            {(kind === "atc" || kind === "bob" || kind === "p121" || kind === "crcu" || kind === "halfit" || kind === "shoot") && (
              <div style={{ fontSize: 10.5, color: C.creamDim, marginTop: 12, lineHeight: 1.7, textAlign: "center" }}>
                {kind === "atc"
                  ? t("flow.ruleFixed.atc")
                  : kind === "bob"
                  ? t("flow.ruleFixed.bob")
                  : kind === "p121"
                  ? t("flow.ruleFixed.p121")
                  : kind === "crcu"
                  ? t("flow.ruleFixed.crcu")
                  : kind === "shoot"
                  ? t("flow.ruleFixed.shoot")
                  : t("flow.ruleFixed.halfit")}
              </div>
            )}

            <button
              onClick={() => launch(fullPlayers())}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "17px 0",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: TH.accent,
                color: "#fff",
                fontFamily: FONT_DISPLAY,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              GAME START
            </button>
            {(names.length > 1 || cat === "robo") && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Btn onClick={doShuffle} style={{ flex: 1, fontFamily: FONT_DISPLAY, letterSpacing: "0.06em", fontSize: 13.5 }}>
                  🔀 SHUFFLE START
                </Btn>
                {cat !== "robo" && (
                  <Btn
                    onClick={() => {
                      UI.modal();
                      setCorkOpen(true);
                    }}
                    style={{ flex: 1, fontFamily: FONT_DISPLAY, letterSpacing: "0.06em", fontSize: 13.5 }}
                  >
                    ◎ CORK START
                  </Btn>
                )}
              </div>
            )}
            <FlowNav
              accent={TH.accent}
              onBack={() => {
                UI.back();
                setStep(1);
              }}
            />

            {optOpen && (
              <OptionModal
                kind={kind === "match" ? "01" : kind}
                accent={TH.accent}
                outRule={outRule}
                setOutRule={setOutRule}
                inRule={inRule}
                setInRule={setInRule}
                sepaBull={sepaBull}
                setSepaBull={setSepaBull}
                onClose={() => {
                  UI.close();
                  setOptOpen(false);
                }}
              />
            )}

            {corkOpen && (
              <CorkModal
                players={names.map(trimP)}
                mode={mode}
                accent={TH.accent}
                teamLocked={teamLocked}
                onDone={(ns) => launch(ns)}
                onClose={() => setCorkOpen(false)}
              />
            )}

            {shuffled && (
              <div
                style={{ position: "fixed", inset: 0, background: "rgba(8,9,12,0.88)", zIndex: 55, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
              >
                <div style={{ width: "100%", maxWidth: 420, background: C.surface, border: `1.5px solid ${TH.accent}`, borderRadius: 18, padding: "20px 18px" }}>
                  <div style={{ textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: "0.25em", color: TH.accent }}>SHUFFLE RESULT</div>
                  <div style={{ textAlign: "center", fontSize: 12, color: C.creamDim, marginTop: 4, marginBottom: 14 }}>{t("flow.shuffle.resultDecided")}</div>
                  <div key={shuffled.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {shuffled.players.map((p, i) => (
                      <div
                        key={i}
                        className="shufflerow"
                        style={{
                          animationDelay: `${i * 0.18}s`,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: i === 0 ? `linear-gradient(0deg, ${TH.soft}, ${TH.soft}), ${C.surface}` : C.surface2,
                          border: `1.5px solid ${i === 0 ? TH.accent : "transparent"}`,
                          borderRadius: 12,
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: i === 0 ? TH.accent : C.creamDim, width: 26, textAlign: "center" }}>{i + 1}</div>
                        <Avatar avatar={p.avatar} size={26} />
                        <div style={{ flex: 1, fontSize: 15, fontWeight: i === 0 ? 700 : 400, color: C.cream }}>
                          {teamLocked ? `[${i % 2 === 0 ? "A" : "B"}] ` : ""}
                          {p.name}
                        </div>
                        {i === 0 && <div style={{ fontSize: 11, fontFamily: FONT_DISPLAY, letterSpacing: "0.15em", color: TH.accent }}>FIRST THROW</div>}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => launch(shuffled.players)}
                    style={{ marginTop: 16, width: "100%", padding: "14px 0", borderRadius: 12, border: "none", cursor: "pointer", background: TH.accent, color: "#fff", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: "0.15em" }}
                  >
                    {t("flow.startInOrder")}
                  </button>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Btn onClick={doShuffle} style={{ flex: 1, fontSize: 13 }}>
                      {t("flow.shuffle.retry")}
                    </Btn>
                    <Btn
                      onClick={() => {
                        UI.close();
                        setShuffled(null);
                      }}
                      style={{ flex: 1, fontSize: 13, color: C.creamDim }}
                    >
                      {t("flow.cancel")}
                    </Btn>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
