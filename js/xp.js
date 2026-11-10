import { artFor, collectionById } from "./data/breeds.js";
import { collectionForAvatar as collectionIdFor } from "./avatars.js";
import { isTestProfile } from "./storage.js";
import { subjects } from "./registry.js";

function activeCollection(profile) {
  const id = collectionIdFor(profile?.avatar);
  return id ? collectionById(id) : null;
}

const TIER_MULT = { 1: 1, 2: 3, 3: 6, 4: 10 };

export function roundXp(level, stars) {
  const tier = level?.tier || level?.band || 1;
  const step = level?.step || 1;
  const mult = TIER_MULT[tier] || 1;
  const sub = 1 + Math.max(0, step - 1) * 0.08;
  const pace = level?.training ? 0.85 : 1;
  const score = 0.5 + Math.max(0, Math.min(3, stars || 0)) * 0.25;
  return Math.max(1, Math.round(10 * mult * sub * pace * score));
}

export function xpToNext(playerLevel) {
  const n = Math.max(1, playerLevel || 1);
  return Math.round(80 * (1.35 ** (n - 1)));
}

export function playerLevelOf(profile) {
  if (isTestProfile(profile)) return 12;
  return profile?.playerLevel || 1;
}

export function xpInto(profile) {
  if (isTestProfile(profile)) return xpToNext(12);
  return profile?.xp || 0;
}

function bag(profile, collectionId) {
  profile.breeds = profile.breeds || {};
  if (!profile.breeds[collectionId]) profile.breeds[collectionId] = [];
  return profile.breeds[collectionId];
}

export function earnedBreeds(profile, collectionId) {
  const all = collectionById(collectionId).breeds;
  if (isTestProfile(profile)) return all.map((breed) => breed.id);
  return profile?.breeds?.[collectionId] || [];
}

export function nextBreed(profile, collectionId) {
  const owned = new Set(earnedBreeds(profile, collectionId));
  return collectionById(collectionId).breeds.find((breed) => !owned.has(breed.id)) || null;
}

function grantBreed(profile) {
  const collection = activeCollection(profile);
  if (!collection) return null;
  const breed = nextBreed(profile, collection.id);
  if (!breed || isTestProfile(profile)) return null;
  bag(profile, collection.id).push(breed.id);
  return { ...breed, collectionId: collection.id, art: artFor(collection.id, breed.id), collectionTitle: collection.title };
}

export function addXp(profile, amount) {
  if (!amount || isTestProfile(profile)) {
    return { amount: 0, level: playerLevelOf(profile), breeds: [], into: xpInto(profile), need: xpToNext(playerLevelOf(profile)), leveled: false };
  }
  profile.playerLevel = profile.playerLevel || 1;
  profile.xp = (profile.xp || 0) + amount;
  const breeds = [];
  let leveled = false;
  let guard = 0;
  while (profile.xp >= xpToNext(profile.playerLevel) && guard < 12) {
    profile.xp -= xpToNext(profile.playerLevel);
    profile.playerLevel += 1;
    leveled = true;
    const breed = grantBreed(profile);
    if (breed) breeds.push(breed);
    guard += 1;
  }
  return {
    amount,
    level: profile.playerLevel,
    breeds,
    into: profile.xp,
    need: xpToNext(profile.playerLevel),
    leveled,
  };
}

export function badgesOf(profile) {
  if (isTestProfile(profile)) {
    const collection = activeCollection(profile);
    return subjects.flatMap((subject) => (subject.modules || [])
      .filter((module) => module.role === "egzamin")
      .flatMap((module) => collection.badges.map((title, index) => ({
        id: `${subject.id}/${module.id}:${index + 1}`,
        subjectId: subject.id,
        moduleId: module.id,
        moduleTitle: `${subject.title} · ${module.title}`,
        tier: index + 1,
        title,
      }))));
  }
  return profile?.badges || [];
}

export function maybeAwardBadges(profile, subject, module) {
  if (!module || module.role !== "egzamin" || isTestProfile(profile)) return [];
  const collection = activeCollection(profile);
  if (!collection) return [];
  profile.badges = profile.badges || [];
  const owned = new Set(profile.badges.map((badge) => badge.id));
  const fresh = [];
  for (let tier = 1; tier <= 4; tier += 1) {
    const id = `${subject.id}/${module.id}:${tier}`;
    if (owned.has(id)) continue;
    const levels = module.levels.filter((level) => level.tier === tier);
    if (!levels.length) continue;
    const done = levels.every((level) => {
      const best = profile.best?.[`${subject.id}/${module.id}/${level.id}`];
      return best && best.stars >= 2;
    });
    if (!done) continue;
    const badge = {
      id,
      subjectId: subject.id,
      moduleId: module.id,
      moduleTitle: `${subject.title} · ${module.title}`,
      tier,
      title: collection.badges[tier - 1],
    };
    profile.badges.push(badge);
    fresh.push(badge);
  }
  return fresh;
}
