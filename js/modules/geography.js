import { countries } from "../data/countries.js";
import { pick, shuffle } from "../util.js";

function poolFor(band) {
  return countries.filter((country) => country.band <= band);
}

function chooseAnswer(source, used) {
  const fresh = source.filter((country) => !used.has(country.id));
  return pick(fresh.length ? fresh : source);
}

function distractors(source, answer, count, preferLike) {
  const others = source.filter((country) => country.id !== answer.id);
  const preferred = preferLike && answer.like
    ? shuffle(others.filter((country) => country.like === answer.like))
    : [];
  const sameRegion = shuffle(others.filter((country) => country.region === answer.region && !preferred.includes(country)));
  const rest = shuffle(others.filter((country) => !preferred.includes(country) && !sameRegion.includes(country)));
  return preferred.concat(sameRegion, rest).slice(0, count);
}

function build(level, used, mode) {
  const source = poolFor(level.band);
  const answer = chooseAnswer(source, used);
  used.add(answer.id);
  const wrongs = distractors(source, answer, level.options - 1, level.band >= 4);
  const asCountry = (country) => ({ id: country.id, label: country.name });
  const asCapital = (country) => ({ id: country.id, label: country.capital });
  if (mode === "flag") {
    const options = shuffle([answer, ...wrongs]).map(asCountry);
    return {
      key: `geo:${answer.id}`,
      prompt: "Jaki to kraj?",
      figure: { type: "image", src: `assets/flags/${answer.code}.svg`, alt: "Flaga do rozpoznania" },
      options,
      correctId: answer.id,
      correctLabel: answer.name,
      note: answer.note,
      review: `Flaga → ${answer.name}`,
    };
  }
  if (mode === "capital") {
    const options = shuffle([answer, ...wrongs]).map(asCapital);
    return {
      key: `geo:${answer.id}`,
      prompt: "Jaka jest stolica?",
      figure: { type: "title", text: answer.name },
      options,
      correctId: answer.id,
      correctLabel: answer.capital,
      note: answer.note,
      review: `${answer.name} → ${answer.capital}`,
    };
  }
  const options = shuffle([answer, ...wrongs]).map(asCountry);
  return {
    key: `geo:${answer.id}`,
    prompt: "Który kraj ma tę stolicę?",
    figure: { type: "title", text: answer.capital },
    options,
    correctId: answer.id,
    correctLabel: answer.name,
    note: answer.note,
    review: `${answer.capital} → ${answer.name}`,
  };
}

export function makeFlagQuestion(level, used) {
  return build(level, used, "flag");
}

export function makeCapitalQuestion(level, used) {
  return build(level, used, "capital");
}

export function makeCountryQuestion(level, used) {
  return build(level, used, "country");
}

export function geographyLevels(secondsOnMaster) {
  return [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 3, seconds: 0, detail: "Znane kraje · 8 pytań · 3 odpowiedzi" },
    { id: "sredni", title: "Średni", band: 2, questions: 8, options: 4, seconds: 0, detail: "Więcej krajów · 8 pytań · 4 odpowiedzi" },
    { id: "trudny", title: "Trudny", band: 3, questions: 10, options: 4, seconds: 0, detail: "Kraje z całego świata · 10 pytań · 4 odpowiedzi" },
    { id: "mistrz", title: "Mistrz", band: 4, questions: 10, options: 4, seconds: secondsOnMaster, detail: `Podobne flagi i kraje · 10 pytań · ${secondsOnMaster} s` },
  ];
}
