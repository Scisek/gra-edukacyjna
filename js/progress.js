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

export function tierMastered(profile, subjectId, module, tier) {
  const levels = (module.levels || []).filter((level) => level.tier === tier);
  if (!levels.length) return false;
  return levels.every((level) => {
    const best = profile?.best?.[progressKey(subjectId, module.id, level.id)];
    return best && best.stars >= 2;
  });
}

export function examTierOpen(profile, subject, tier) {
  if (isTestProfile(profile)) return true;
  if ((profile?.legacyExam?.[subject.id] || 0) >= tier) return true;
  return (subject.modules || []).some((module) => (
    module.role === "nauka" && module.levels && tierMastered(profile, subject.id, module, tier)
  ));
}

export function canPlayLevel(profile, subject, module, index) {
  if (!module?.levels?.[index]) return false;
  if (isTestProfile(profile)) return true;
  if (index > unlockedIndex(profile, subject.id, module.id)) return false;
  if (module.role === "egzamin") return examTierOpen(profile, subject, module.levels[index].tier);
  return true;
}

export function trainingOpen(profile, subject, module) {
  if (isTestProfile(profile)) return true;
  const last = module.levels.length - 1;
  if (last < 0) return false;
  const level = module.levels[last];
  const best = profile?.best?.[progressKey(subject.id, module.id, level.id)];
  return Boolean(best);
}

export function praise() {
  const lines = ["Brawo!", "Świetnie!", "Tak jest!", "Pięknie!", "Doskonale!"];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function resultHeadline(stars) {
  return ["Jeszcze raz, dasz radę", "Dobry początek", "Bardzo dobrze", "Wspaniała runda"][stars] || "Koniec rundy";
}
