import { countryById } from "./data/countries.js";
import { wordById } from "./data/spelling.js";

const MATH_NAMES = {
  dodawanie: "Dodawanie",
  odejmowanie: "Odejmowanie",
  mnozenie: "Mnożenie",
  dzielenie: "Dzielenie",
};

export function describeMiss(key) {
  if (key.startsWith("geo:")) {
    const country = countryById(key.slice(4));
    if (!country) return null;
    return {
      title: country.name,
      detail: country.capital,
      image: `assets/flags/${country.code}.svg`,
    };
  }
  if (key.startsWith("spell:")) {
    const word = wordById(key.slice(6));
    if (!word) return null;
    return { title: word.word, detail: word.meaning };
  }
  if (key.startsWith("math:")) {
    const title = MATH_NAMES[key.slice(5)];
    if (!title) return null;
    return { title, detail: "Warto poćwiczyć to działanie" };
  }
  return null;
}

export function topMisses(profile, limit = 5) {
  return Object.entries(profile.misses || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count, ...describeMiss(key) }))
    .filter((item) => item.title);
}
