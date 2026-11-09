import { findModule, findSubject } from "./registry.js";
import {
  activeProfile,
  persist,
  recordAnswer,
  recordMiss,
  setActive,
} from "./storage.js";
import { moduleKey, praise, progressKey, starsFor, unlockedIndex } from "./progress.js";
import { grantPiece, piecesOf } from "./rewards.js";
import { PIECES } from "./rewards.js";

export const app = {
  route: { name: "boot" },
  round: null,
  modal: null,
  formError: "",
  draft: { name: "", avatar: "" },
};

let render = () => {};
let timerHandle = 0;

export function setRenderer(fn) {
  render = fn;
}

export function stopTimer() {
  if (timerHandle) cancelAnimationFrame(timerHandle);
  timerHandle = 0;
}

function paintTimer(left, total) {
  const label = document.querySelector("[data-timer-label]");
  const bar = document.querySelector("[data-timer-bar]");
  const wrap = document.querySelector("[data-timer]");
  if (label) label.textContent = `${Math.ceil(left / 1000)} s`;
  if (bar) bar.style.transform = `scaleX(${total ? left / total : 0})`;
  if (wrap) wrap.classList.toggle("is-low", left <= 5000);
}

function armTimer() {
  stopTimer();
  const round = app.round;
  if (!round || round.locked || app.route.name !== "quiz") return;
  const seconds = round.level.seconds || 0;
  if (!seconds) return;
  const total = seconds * 1000;
  const started = performance.now();
  const tick = (now) => {
    if (!app.round || app.round.locked || app.route.name !== "quiz") return;
    const left = Math.max(0, total - (now - started));
    paintTimer(left, total);
    if (left <= 0) {
      timerHandle = 0;
      timeoutAnswer();
      return;
    }
    timerHandle = requestAnimationFrame(tick);
  };
  timerHandle = requestAnimationFrame(tick);
}

export function redraw() {
  render();
}

export function go(name, extra = {}) {
  stopTimer();
  app.route = { name, ...extra };
  app.modal = null;
  render();
  if (name === "quiz") armTimer();
}

export function switchTo(id) {
  setActive(id);
  app.round = null;
  app.modal = null;
  go("home");
}

export function openModal(type, profileId) {
  app.modal = { type, profileId };
  redraw();
}

export function closeModal() {
  app.modal = null;
  redraw();
}

export function startRound(subjectId, moduleId, levelIndex) {
  const subject = findSubject(subjectId);
  const module = findModule(subject, moduleId);
  const profile = activeProfile();
  if (!subject || !module || module.status === "soon" || !profile) {
    go("home");
    return;
  }
  const unlocked = unlockedIndex(profile, subjectId, moduleId);
  if (levelIndex > unlocked) {
    go("levels", { subjectId, moduleId });
    return;
  }
  const level = module.levels[levelIndex];
  const used = new Set();
  const questions = [];
  for (let index = 0; index < level.questions; index += 1) {
    questions.push(module.makeQuestion(level, used));
  }
  app.round = {
    subjectId,
    moduleId,
    levelIndex,
    level,
    questions,
    index: 0,
    correct: 0,
    picked: null,
    locked: false,
    timedOut: false,
    review: [],
    praise: "",
    finished: false,
    result: null,
  };
  go("quiz");
}

function currentQuestion() {
  const round = app.round;
  if (!round) return null;
  return round.questions[round.index] || null;
}

function lockAnswer(selectedId, timedOut) {
  const round = app.round;
  const question = currentQuestion();
  const profile = activeProfile();
  if (!round || !question || !profile || round.locked) return;
  stopTimer();
  round.locked = true;
  round.picked = selectedId;
  round.timedOut = timedOut;
  const ok = !timedOut && selectedId === question.correctId;
  if (ok) round.correct += 1;
  round.praise = ok ? praise() : "";
  recordAnswer(profile, ok);
  if (!ok) {
    recordMiss(profile, question.key);
    round.review.push(question.review);
  }
  persist();
  redraw();
}

export function pickAnswer(id) {
  lockAnswer(id, false);
}

function timeoutAnswer() {
  lockAnswer(null, true);
}

export function nextQuestion() {
  const round = app.round;
  if (!round || !round.locked) return;
  round.index += 1;
  round.locked = false;
  round.picked = null;
  round.timedOut = false;
  round.praise = "";
  if (round.index >= round.questions.length) {
    conclude();
    return;
  }
  go("quiz");
}

function conclude() {
  const round = app.round;
  const profile = activeProfile();
  if (!round || !profile || round.finished) return;
  round.finished = true;
  const total = round.questions.length;
  const stars = starsFor(round.correct, total);
  const subject = findSubject(round.subjectId);
  const module = findModule(subject, round.moduleId);
  const level = module.levels[round.levelIndex];
  const key = progressKey(round.subjectId, round.moduleId, level.id);
  const prev = profile.best[key];
  const improved = !prev || stars > prev.stars || (stars === prev.stars && round.correct > prev.correct);
  if (improved) profile.best[key] = { correct: round.correct, total, stars };
  const mkey = moduleKey(round.subjectId, round.moduleId);
  const unlocked = profile.unlocked[mkey] ?? 0;
  let justUnlocked = false;
  if (stars >= 2 && round.levelIndex >= unlocked && round.levelIndex < module.levels.length - 1) {
    profile.unlocked[mkey] = round.levelIndex + 1;
    justUnlocked = true;
  }
  let reward = {
    granted: false,
    complete: piecesOf(profile, round.subjectId) >= PIECES,
    have: piecesOf(profile, round.subjectId),
  };
  if (stars >= 2) reward = grantPiece(profile, round.subjectId);
  profile.stats.rounds += 1;
  const saved = persist();
  round.result = { stars, total, improved, justUnlocked, reward, saved };
  go("results");
  if (stars >= 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    celebrate(stars);
  }
}

function celebrate(stars) {
  const layer = document.createElement("div");
  layer.className = "confetti";
  layer.setAttribute("aria-hidden", "true");
  const count = stars >= 3 ? 26 : 16;
  for (let index = 0; index < count; index += 1) {
    const bit = document.createElement("i");
    bit.className = "confetti__bit";
    bit.style.left = `${8 + Math.random() * 84}%`;
    bit.style.animationDelay = `${Math.random() * 0.25}s`;
    bit.style.animationDuration = `${1.15 + Math.random() * 0.55}s`;
    bit.style.background = index % 2 === 0 ? "var(--gold)" : "var(--teal)";
    layer.append(bit);
  }
  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 2000);
}

export function focusRoute() {
  const target = document.querySelector(".modal [data-focus]") || document.querySelector("[data-focus]");
  if (target) target.focus({ preventScroll: true });
}
