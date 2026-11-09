export function isAdult(profile) {
  return profile?.audience === "dorosly" && profile?.test !== true;
}

function adultMath(level) {
  const tier = level.tier || 1;
  const common = { ...level, adult: true, options: 4, allowZero: false };
  if (tier === 1) {
    return { ...common, min: 30, max: 150, big: true, bothBig: false, bigMin: 12, bigMax: 40, tableMin: 3, tableMax: 9, detail: "Większe liczby · mnożenie dwucyfrowe" };
  }
  if (tier === 2) {
    return { ...common, min: 100, max: 800, big: true, bothBig: false, bigMin: 15, bigMax: 70, tableMin: 4, tableMax: 12, detail: "Do 800 i większe iloczyny" };
  }
  if (tier === 3) {
    return { ...common, min: 300, max: 3000, big: true, bothBig: true, bigMin: 12, bigMax: 36, tableMin: 12, tableMax: 36, detail: "Mnożenie i dzielenie dwucyfrowe" };
  }
  return { ...common, min: 800, max: 9000, big: true, bothBig: true, bigMin: 18, bigMax: 70, tableMin: 12, tableMax: 40, seconds: level.seconds || 30, detail: "Duże liczby na czas" };
}

function adultGeo(level) {
  const tier = level.tier || 1;
  const where = tier <= 1
    ? (country) => country.band >= 3
    : tier === 2
      ? (country) => country.band >= 3
      : (country) => country.band >= 3;
  const detail = ["", "Mniej znane kraje · 4 odpowiedzi", "Podobne flagi i stolice", "Rzadkie państwa", "Trudny świat na czas"][tier] || "Trudniejsze kraje";
  return {
    ...level,
    adult: true,
    band: 4,
    options: 4,
    preferLike: tier >= 2,
    where,
    detail,
    seconds: tier === 4 ? (level.seconds || 20) : 0,
  };
}

export function presentLevel(profile, level, subjectId) {
  if (!level || !isAdult(profile)) return level;
  if (subjectId === "geografia-panstwa") return adultGeo(level);
  if (subjectId === "geografia-polska") {
    return { ...level, adult: true, options: 4, band: Math.max(level.band || 1, 2), detail: "Mniej znane miasta i dokładniejsze miejsce" };
  }
  if (subjectId === "matematyka") return adultMath(level);
  if (subjectId === "polski") {
    return { ...level, adult: true, options: 4, detail: "Trudne słowa, kilka pułapek" };
  }
  return { ...level, adult: true, options: 4 };
}
