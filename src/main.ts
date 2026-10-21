import "./style.css";
import { track } from "./analytics";
import { games } from "./games";
import type { Instance, MicroGame } from "./types";
import { onTap } from "./util";

const LIVES = 4;
const BASE_LIMIT_MS = 4000;
const SPEEDUP_EVERY = 4;
const SPEEDUP_RATE = 1.15;
const SITE_URL = "https://yamasinagames.github.io/weekly-games/";
const BEST_KEY = "weekly-games:feed:best";

const $ = (id: string) => document.getElementById(id)!;
const stageEl = $("stage");
const instructionEl = $("instruction");
const timerBar = $("timerBar");
const livesEl = $("lives");
const scoreEl = $("score");
const betweenEl = $("between");
const resultEl = $("result");

let cleared = 0;
let lives = LIVES;
let speed = 1;
let prev: MicroGame | null = null;
let current: Instance | null = null;
let settled = true;
let timeoutId = 0;
let firstTapDone = false;

function loadBest(): number {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}

function saveBest(n: number): void {
  try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
}

function renderHud(): void {
  livesEl.textContent = "❤️".repeat(lives) + "🤍".repeat(LIVES - lives);
  scoreEl.textContent = String(cleared);
}

function pickGame(): MicroGame {
  // ?g=ghost のように指定すると、そのゲームから始まる（Xで新作を告知する用）
  if (!prev) {
    const id = new URLSearchParams(location.search).get("g");
    return games.find((g) => g.id === id) ?? games[0];
  }
  const candidates = games.filter((g) => g !== prev);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function startTimer(): void {
  const limit = BASE_LIMIT_MS / speed;
  timerBar.style.transition = "none";
  timerBar.style.width = "100%";
  void timerBar.offsetWidth;
  timerBar.style.transition = `width ${limit}ms linear`;
  timerBar.style.width = "0%";
  timeoutId = window.setTimeout(() => settle(current?.winOnTimeout ?? false), limit);
}

function stopTimer(): void {
  clearTimeout(timeoutId);
  timerBar.style.width = getComputedStyle(timerBar).width;
  timerBar.style.transition = "none";
}

function runStage(): void {
  const game = pickGame();
  prev = game;
  stageEl.replaceChildren();
  settled = false;
  current = game.mount(stageEl, {
    level: Math.floor(cleared / SPEEDUP_EVERY),
    speed,
    win: () => settle(true),
    lose: () => settle(false),
  });

  instructionEl.textContent = game.instruction;
  instructionEl.classList.remove("show");
  void instructionEl.offsetWidth;
  instructionEl.classList.add("show");

  // 最初のステージだけは、最初のタップまでタイマーを止めておく
  if (firstTapDone) startTimer();
  else {
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
  }
}

function settle(win: boolean): void {
  if (settled) return;
  settled = true;
  stopTimer();

  let spedUp = false;
  if (win) {
    cleared++;
    if (cleared % SPEEDUP_EVERY === 0) {
      speed *= SPEEDUP_RATE;
      spedUp = true;
    }
  } else {
    lives--;
    track(`fail-${prev?.id}`);
    navigator.vibrate?.(80);
  }

  // ミスした場所が一瞬見えるように少し待つ
  setTimeout(() => {
    current?.destroy?.();
    renderHud();
    if (lives === 0) gameOver();
    else showBetween(win, spedUp);
  }, 300);
}

function showBetween(win: boolean, spedUp: boolean): void {
  $("betweenMark").textContent = win ? "⭕️" : "❌";
  $("betweenText").textContent = spedUp ? "スピードアップ！" : "";
  betweenEl.classList.remove("hidden");
  setTimeout(() => {
    betweenEl.classList.add("hidden");
    runStage();
  }, 700 / speed);
}

function gameOver(): void {
  const best = loadBest();
  const isBest = cleared > best;
  if (isBest) saveBest(cleared);
  track("game-over");
  track(`reached-${Math.floor(cleared / 5) * 5}`);

  $("resultScore").textContent = String(cleared);
  $("resultSub").textContent = isBest ? "自己ベスト更新！" : `自己ベスト ${best}`;
  stageEl.replaceChildren();
  resultEl.classList.remove("hidden");
}

function restart(): void {
  track("retry");
  cleared = 0;
  lives = LIVES;
  speed = 1;
  prev = null;
  resultEl.classList.add("hidden");
  renderHud();
  runStage();
}

function share(): void {
  track("share");
  const text = `ショートゲームを${cleared}ステージ突破！\n#週刊ゲーム`;
  const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`;
  window.open(url, "_blank");
}

// capture にしておくと、ゲーム側のタップ判定より先にタイマーが動き出す
document.addEventListener(
  "pointerdown",
  () => {
    firstTapDone = true;
    track("first-tap");
    if (!settled) startTimer();
  },
  { capture: true, once: true },
);

setTimeout(() => {
  if (!firstTapDone) track("no-tap-3s");
}, 3000);

onTap($("shareBtn"), share);
onTap($("retryBtn"), restart);
track("open");
renderHud();
runStage();
