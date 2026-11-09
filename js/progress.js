import { isTestProfile } from "./storage.js";

export function starsFor(correct, total, hints = 0) {
  if (!total) return 0;
  const adjusted = Math.max(0, correct - hints * 0.25);
  const ratio = adjusted / total;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

export function progressKey(subjectId, moduleId, levelId) {
  return `${subjectId}/${moduleId}/${levelId}`;
}

export function moduleKey(subjectId, moduleId) {
  return `${subjectId}/${moduleId}`;
}

export function unlockedIndex(profile, subjectId, moduleId) {
  if (isTestProfile(profile)) return Number.MAX_SAFE_INTEGER;
  return profile?.unlocked?.[moduleKey(subjectId, moduleId)] ?? 0;
}

export function praise() {
  const lines = ["Brawo!", "Świetnie!", "Tak jest!", "Pięknie!", "Doskonale!"];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function resultHeadline(stars) {
  return ["Jeszcze raz, dasz radę", "Dobry początek", "Bardzo dobrze", "Wspaniała runda"][stars] || "Koniec rundy";
}
