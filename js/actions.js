import { findModule, findSubject } from "./registry.js";
import {
  activeProfile,
  isTestProfile,
  persist,
  recordAnswer,
  recordMemory,
  recordMiss,
  setActive,
} from "./storage.js";
import { presentLevel } from "./audience.js";
import { canPlayLevel, moduleKey, praise, progressKey, starsFor, trainingOpen, unlockedIndex } from "./progress.js";
import { addXp, maybeAwardBadges, roundXp } from "./xp.js";

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
  if (!canPlayLevel(profile, subject, module, levelIndex)) {
    go("levels", { subjectId, moduleId });
    return;
  }
  const level = presentLevel(profile, module.levels[levelIndex], subject.id);
  const used = new Set();
  const questions = [];
  for (let index = 0; index < level.questions; index += 1) {
    questions.push(module.makeQuestion(level, used, profile.memory));
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
    hintCount: 0,
    hintLevels: {},
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
  if (!ok) round.review.push(question.review);
  if (!isTestProfile(profile)) {
    recordAnswer(profile, ok);
    recordMemory(profile, question.key, ok);
    if (!ok) recordMiss(profile, question.key);
    persist();
  }
  redraw();
}

export function startTraining(subjectId, moduleId) {
  const subject = findSubject(subjectId);
  const module = findModule(subject, moduleId);
  const profile = activeProfile();
  if (!subject || !module || !profile || !trainingOpen(profile, subject, module)) {
    go("levels", { subjectId, moduleId });
    return;
  }
  const level = {
    id: "trening",
    title: "Trening",
    group: "Trening",
    tier: 3,
    step: 2,
    band: 4,
    rank: 4,
    questions: 6,
    options: subjectId === "polski" ? 2 : 4,
    seconds: 0,
    training: true,
    mix: module.role === "egzamin",
    min: 20,
    max: 100,
    tableMin: 2,
    tableMax: 12,
  };
  const shaped = presentLevel(profile, level, subjectId);
  const used = new Set();
  const questions = [];
  for (let index = 0; index < shaped.questions; index += 1) {
    questions.push(module.makeQuestion(shaped, used, profile.memory));
  }
  app.round = {
    subjectId,
    moduleId,
    levelIndex: module.levels.length,
    level: shaped,
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
    hintCount: 0,
    hintLevels: {},
  };
  go("quiz");
}

export function pickAnswer(id) {
  lockAnswer(id, false);
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function pickMapPoint(lat, lon) {
  const question = currentQuestion();
  if (!question?.pin || app.round?.locked) return;
  const km = distanceKm(lat, lon, question.pin.lat, question.pin.lon);
  question.distanceKm = Math.round(km);
  question.tap = { lat, lon };
  lockAnswer(km <= question.pin.radiusKm ? question.correctId : "miss", false);
}

export function useHint() {
  const round = app.round;
  const question = currentQuestion();
  if (!round || !question || round.locked || !question.countryId) return;
  const level = round.hintLevels[round.index] || 0;
  if (level >= 2) return;
  round.hintLevels[round.index] = level + 1;
  round.hintCount += 1;
  if (level + 1 === 2) {
    const hidden = new Set(question.hiddenIds || []);
    const wrongs = question.options.filter((option) => option.id !== question.correctId && !hidden.has(option.id));
    if (wrongs.length > 1) {
      const victim = wrongs[Math.floor(Math.random() * wrongs.length)];
      question.hiddenIds = [...hidden, victim.id];
    }
  }
  redraw();
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
  const stars = starsFor(round.correct, total, round.hintCount || 0);
  const subject = findSubject(round.subjectId);
  const module = findModule(subject, round.moduleId);
  const level = round.level || module.levels[round.levelIndex];
  const testing = isTestProfile(profile);
  let improved = false;
  let justUnlocked = false;
  let saved = false;
  let xp = { amount: roundXp(level, stars), level: 1, breeds: [], into: 0, need: 1, leveled: false };
  let badges = [];
  if (!testing) {
    const key = progressKey(round.subjectId, round.moduleId, level.id);
    const prev = profile.best[key];
    improved = !prev || stars > prev.stars || (stars === prev.stars && round.correct > prev.correct);
    if (improved && !level.training) profile.best[key] = { correct: round.correct, total, stars };
    if (level.training) {
      const trainKey = progressKey(round.subjectId, round.moduleId, "trening");
      const before = profile.best[trainKey];
      if (!before || stars > before.stars) profile.best[trainKey] = { correct: round.correct, total, stars };
    }
    const mkey = moduleKey(round.subjectId, round.moduleId);
    const unlocked = profile.unlocked[mkey] ?? 0;
    if (!level.training && stars >= 2 && round.levelIndex >= unlocked && round.levelIndex < module.levels.length - 1) {
      profile.unlocked[mkey] = round.levelIndex + 1;
      justUnlocked = true;
    }
    xp = addXp(profile, xp.amount);
    app.revealBreeds = (xp.breeds || []).map((breed) => breed.id);
    badges = maybeAwardBadges(profile, subject, module);
    profile.stats.rounds += 1;
    saved = persist();
  }
  round.result = { stars, total, improved, justUnlocked, saved, test: testing, hints: round.hintCount || 0, xp, badges };
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
