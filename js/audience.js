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
  if (tier <= 1) {
    return {
      ...level,
      adult: true,
      band: 1,
      options: 3,
      preferLike: false,
      where: (country) => country.band === 1,
      detail: "Znane kraje i sąsiedzi · 3 odpowiedzi",
      seconds: 0,
    };
  }
  if (tier === 2) {
    return {
      ...level,
      adult: true,
      band: 2,
      options: 4,
      preferLike: false,
      where: (country) => country.band === 2,
      detail: "Kraje średnio znane · 4 odpowiedzi",
      seconds: 0,
    };
  }
  if (tier === 3) {
    return {
      ...level,
      adult: true,
      band: 3,
      options: 4,
      preferLike: true,
      where: (country) => country.band >= 3,
      detail: "Rzadsze państwa i podobne flagi",
      seconds: 0,
    };
  }
  return {
    ...level,
    adult: true,
    band: 4,
    options: 4,
    preferLike: true,
    where: () => true,
    detail: "Cały świat na czas",
    seconds: level.seconds || 20,
  };
}

export function presentLevel(profile, level, subjectId) {
  if (!level || !isAdult(profile)) return level;
  if (subjectId === "geografia-panstwa") return adultGeo(level);
  if (subjectId === "geografia-polska") {
    const tier = level.tier || 1;
    if (tier <= 1) {
      return { ...level, adult: true, options: 3, band: 1, detail: "Największe miasta, stuknij województwo" };
    }
    if (tier === 2) {
      return { ...level, adult: true, options: 4, band: 2, detail: "Duże miasta, stuknij województwo" };
    }
    return {
      ...level,
      adult: true,
      options: 4,
      band: Math.max(level.band || 1, tier),
      detail: tier === 3 ? "Mniejsze miasta, szeroki promień" : "Małe miasta, dokładniejsze miejsce",
    };
  }
  if (subjectId === "matematyka") return adultMath(level);
  if (subjectId === "polski") {
    return { ...level, adult: true, options: 4, detail: "Trudne słowa, kilka pułapek" };
  }
  return { ...level, adult: true, options: 4 };
}
