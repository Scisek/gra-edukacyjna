import { AVATARS, collectionForAvatar } from "./avatars.js";
import { collectionById } from "./data/breeds.js";
import { subjects } from "./registry.js";

const KEY = "skarb-wiedzy-v1";

export const PARENT_ID = "rodzic";

let sessionTest = false;

export function isTestProfile(profile) {
  return profile?.test === true;
}

export function parentProfile() {
  return {
    id: PARENT_ID,
    name: "Rodzic",
    avatar: "rodzic",
    test: true,
    best: {},
    unlocked: {},
    misses: {},
    stats: { rounds: 0, correct: 0, answered: 0 },
    rewards: { pieces: {} },
    memory: {},
    xp: 0,
    playerLevel: 1,
    breeds: {},
    badges: [],
  };
}

function emptyProgress() {
  return {
    best: {},
    unlocked: {},
    misses: {},
    stats: { rounds: 0, correct: 0, answered: 0 },
    rewards: { pieces: {} },
    xp: 0,
    playerLevel: 1,
    breeds: {},
    badges: [],
    legacyExam: {},
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
  profile.memory = profile.memory && typeof profile.memory === "object" ? profile.memory : {};
  profile.breeds = profile.breeds && typeof profile.breeds === "object" ? profile.breeds : {};
  profile.badges = Array.isArray(profile.badges) ? profile.badges : [];
  profile.legacyExam = profile.legacyExam && typeof profile.legacyExam === "object" ? profile.legacyExam : {};
  profile.playerLevel = Number(profile.playerLevel) || 1;
  profile.xp = Number(profile.xp) || 0;
  if (!profile.avatar) profile.avatar = AVATARS[0].id;
  if ((profile.progressVersion || 0) < 2) migrateProgress(profile);
  if ((profile.progressVersion || 0) < 3) migrateCatalog(profile);
  if (profile.audience !== "dorosly" && profile.audience !== "dziecko") profile.audience = "dziecko";
  return profile;
}

function renamePrefix(bag, from, to) {
  if (!bag || typeof bag !== "object") return;
  for (const key of Object.keys(bag)) {
    if (key === from || key.startsWith(`${from}/`)) {
      const next = `${to}${key.slice(from.length)}`;
      if (bag[next] == null) bag[next] = bag[key];
      delete bag[key];
    }
  }
}

function migrateCatalog(profile) {
  renamePrefix(profile.unlocked, "geografia", "geografia-panstwa");
  renamePrefix(profile.best, "geografia", "geografia-panstwa");
  renamePrefix(profile.legacyExam, "geografia", "geografia-panstwa");
  if (Array.isArray(profile.badges)) {
    for (const badge of profile.badges) {
      if (badge.subjectId === "geografia") {
        badge.subjectId = "geografia-panstwa";
        badge.id = String(badge.id || "").replace(/^geografia/, "geografia-panstwa");
      }
    }
  }
  profile.progressVersion = 3;
}

const OLD_LEVELS = ["latwy", "sredni", "trudny", "mistrz"];

function migrateProgress(profile) {
  profile.unlocked = profile.unlocked || {};
  profile.best = profile.best || {};
  renamePrefix(profile.unlocked, "geografia", "geografia-panstwa");
  renamePrefix(profile.best, "geografia", "geografia-panstwa");
  renamePrefix(profile.legacyExam, "geografia", "geografia-panstwa");
  const pieces = profile.rewards?.pieces || {};
  for (const value of Object.values(pieces)) profile.xp += (Number(value) || 0) * 150;

  const into = "matematyka/dodawanie-odejmowanie";
  let mergedUnlock = profile.unlocked[into] ?? 0;
  for (const id of ["dodawanie", "odejmowanie"]) {
    const key = `matematyka/${id}`;
    if (typeof profile.unlocked[key] === "number") mergedUnlock = Math.max(mergedUnlock, profile.unlocked[key]);
    for (const oldId of OLD_LEVELS) {
      const best = profile.best[`${key}/${oldId}`];
      if (!best) continue;
      const dest = `${into}/${oldId}`;
      const prev = profile.best[dest];
      if (!prev || (best.stars || 0) > (prev.stars || 0)) profile.best[dest] = best;
      delete profile.best[`${key}/${oldId}`];
    }
    delete profile.unlocked[key];
  }
  if (profile.best && Object.keys(profile.best).some((key) => key.startsWith(`${into}/`)) || typeof profile.unlocked[into] === "number") {
    profile.unlocked[into] = mergedUnlock;
  }

  for (const subject of subjects) {
    for (const module of subject.modules || []) {
      if (!module.levels) continue;
      const mkey = `${subject.id}/${module.id}`;
      const hadOld = OLD_LEVELS.some((oldId) => profile.best[`${mkey}/${oldId}`]) || typeof profile.unlocked[mkey] === "number";
      const tierOpen = Math.min(4, (typeof profile.unlocked[mkey] === "number" ? profile.unlocked[mkey] : 0) + 1);
      for (let index = 0; index < OLD_LEVELS.length; index += 1) {
        const key = `${mkey}/${OLD_LEVELS[index]}`;
        const best = profile.best[key];
        if (!best) continue;
        const first = module.levels.find((level) => level.tier === index + 1);
        if (first) {
          const total = first.questions;
          const ratio = best.total ? best.correct / best.total : 0;
          profile.best[`${mkey}/${first.id}`] = {
            correct: Math.round(ratio * total),
            total,
            stars: best.stars || 0,
          };
        }
        delete profile.best[key];
      }
      if (hadOld || typeof profile.unlocked[mkey] !== "number") {
        let newIndex = 0;
        module.levels.forEach((level, index) => {
          if (level.tier <= tierOpen) newIndex = index;
        });
        profile.unlocked[mkey] = newIndex;
      }
      if (module.role === "egzamin") {
        profile.legacyExam[subject.id] = Math.max(profile.legacyExam[subject.id] || 0, tierOpen);
      }
    }
  }
  migrateCatalog(profile);
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
  if (sessionTest) return parentProfile();
  return state.profiles.find((profile) => profile.id === state.activeId) || null;
}

export function setActive(id) {
  if (id === PARENT_ID) {
    sessionTest = true;
    return;
  }
  sessionTest = false;
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

export function setAvatar(id, avatarId) {
  if (id === PARENT_ID) return;
  const profile = state.profiles.find((item) => item.id === id);
  const collectionId = collectionForAvatar(avatarId);
  const collection = collectionId ? collectionById(collectionId) : null;
  if (!profile || !collection || !AVATARS.some((item) => item.id === avatarId)) return;
  const count = Math.min(collection.breeds.length, Math.max(0, (profile.playerLevel || 1) - 1));
  profile.avatar = avatarId;
  profile.breeds = profile.breeds || {};
  profile.breeds[collectionId] = collection.breeds.slice(0, count).map((breed) => breed.id);
  persist();
}

export function createProfile(name, avatar, audience) {
  sessionTest = false;
  const profile = ensure({
    id: uid(),
    name: cleanName(name),
    avatar,
    audience: audience === "dorosly" ? "dorosly" : "dziecko",
    createdAt: Date.now(),
    progressVersion: 3,
    ...emptyProgress(),
  });
  state.profiles.push(profile);
  state.activeId = profile.id;
  persist();
  return profile;
}

export function deleteProfile(id) {
  if (id === PARENT_ID) return;
  state.profiles = state.profiles.filter((profile) => profile.id !== id);
  if (state.activeId === id) state.activeId = state.profiles[0]?.id ?? null;
  persist();
}

export function resetProfile(id) {
  if (id === PARENT_ID) return;
  const profile = state.profiles.find((item) => item.id === id);
  if (!profile) return;
  Object.assign(profile, emptyProgress());
  ensure(profile);
  persist();
}

export function recordAnswer(profile, correct) {
  if (isTestProfile(profile)) return;
  profile.stats.answered += 1;
  if (correct) profile.stats.correct += 1;
}

export function recordMemory(profile, key, correct) {
  if (!key || isTestProfile(profile)) return;
  profile.memory = profile.memory || {};
  const stat = profile.memory[key] || { correct: 0, wrong: 0 };
  if (correct) stat.correct += 1;
  else stat.wrong += 1;
  profile.memory[key] = stat;
}

export function resetMemory(id) {
  if (id === PARENT_ID) return;
  const profile = state.profiles.find((item) => item.id === id);
  if (!profile) return;
  profile.memory = {};
  persist();
}

export function recordMiss(profile, key) {
  if (!key || isTestProfile(profile)) return;
  profile.misses[key] = (profile.misses[key] || 0) + 1;
}

export function totalStars(profile) {
  return Object.values(profile.best).reduce((sum, item) => sum + (item.stars || 0), 0);
}
