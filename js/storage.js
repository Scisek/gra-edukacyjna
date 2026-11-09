import { AVATARS } from "./avatars.js";

const KEY = "skarb-wiedzy-v1";

function emptyProgress() {
  return {
    best: {},
    unlocked: {},
    misses: {},
    stats: { rounds: 0, correct: 0, answered: 0 },
    rewards: { pieces: {} },
  };
}

function ensure(profile) {
  const blank = emptyProgress();
  profile.best = profile.best && typeof profile.best === "object" ? profile.best : blank.best;
  profile.unlocked = profile.unlocked && typeof profile.unlocked === "object" ? profile.unlocked : blank.unlocked;
  profile.misses = profile.misses && typeof profile.misses === "object" ? profile.misses : blank.misses;
  profile.stats = profile.stats && typeof profile.stats === "object" ? profile.stats : blank.stats;
  profile.stats.rounds ??= 0;
  profile.stats.correct ??= 0;
  profile.stats.answered ??= 0;
  profile.rewards = profile.rewards && typeof profile.rewards === "object" ? profile.rewards : blank.rewards;
  profile.rewards.pieces = profile.rewards.pieces && typeof profile.rewards.pieces === "object"
    ? profile.rewards.pieces
    : {};
  if (!AVATARS.some((item) => item.id === profile.avatar)) profile.avatar = AVATARS[0].id;
  return profile;
}

function blankState() {
  return { version: 1, activeId: null, profiles: [] };
}

let state = blankState();
let storageOk = true;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blankState();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.profiles)) return blankState();
    data.profiles.forEach(ensure);
    return data;
  } catch {
    return blankState();
  }
}

state = read();

export function storageWorks() {
  return storageOk;
}

export function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOk = true;
    return true;
  } catch {
    storageOk = false;
    return false;
  }
}

export function profiles() {
  return state.profiles;
}

export function activeProfile() {
  return state.profiles.find((profile) => profile.id === state.activeId) || null;
}

export function setActive(id) {
  state.activeId = id;
  persist();
}

export function cleanName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 16);
}

export function nameError(value) {
  const name = cleanName(value);
  if (!name) return "Wpisz imię.";
  if (!/^[\p{L}][\p{L}\s'.-]{0,15}$/u.test(name)) return "Użyj liter. Cyfry i znaczki nie są potrzebne.";
  return "";
}

function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createProfile(name, avatar) {
  const profile = ensure({
    id: uid(),
    name: cleanName(name),
    avatar,
    createdAt: Date.now(),
    ...emptyProgress(),
  });
  state.profiles.push(profile);
  state.activeId = profile.id;
  persist();
  return profile;
}

export function deleteProfile(id) {
  state.profiles = state.profiles.filter((profile) => profile.id !== id);
  if (state.activeId === id) state.activeId = state.profiles[0]?.id ?? null;
  persist();
}

export function resetProfile(id) {
  const profile = state.profiles.find((item) => item.id === id);
  if (!profile) return;
  Object.assign(profile, emptyProgress());
  ensure(profile);
  persist();
}

export function recordAnswer(profile, correct) {
  profile.stats.answered += 1;
  if (correct) profile.stats.correct += 1;
}

export function recordMiss(profile, key) {
  if (!key) return;
  profile.misses[key] = (profile.misses[key] || 0) + 1;
}

export function totalStars(profile) {
  return Object.values(profile.best).reduce((sum, item) => sum + (item.stars || 0), 0);
}
