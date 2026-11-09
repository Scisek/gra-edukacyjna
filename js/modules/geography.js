import { countries } from "../data/countries.js";
import { pick, recallWeight, shuffle, weightedPick } from "../util.js";

function poolFor(level) {
  if (level.training) return countries;
  if (level.where) return countries.filter(level.where);
  return countries.filter((country) => country.band <= level.band);
}

function chooseAnswer(source, used, level, memory) {
  let bag = source.filter((country) => !used.has(country.id));
  if (!bag.length) bag = source;
  if (!level.training && level.band >= 4) {
    const rare = bag.filter((country) => country.band >= 3);
    if (rare.length && Math.random() < 0.75) bag = rare;
  } else if (!level.training && level.band === 3 && !level.where) {
    const wider = bag.filter((country) => country.band >= 2);
    if (wider.length && Math.random() < 0.65) bag = wider;
  }
  return weightedPick(bag, (country) => recallWeight(memory?.[`geo:${country.id}`]));
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

function build(level, used, mode, memory) {
  const source = poolFor(level);
  const answer = chooseAnswer(source, used, level, memory);
  used.add(answer.id);
  const wrongs = distractors(source, answer, level.options - 1, level.preferLike || level.band >= 4);
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
      countryId: answer.id,
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
      countryId: answer.id,
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
    countryId: answer.id,
  };
}

export function makeFlagQuestion(level, used, memory) {
  return build(level, used, "flag", memory);
}

export function makeCapitalQuestion(level, used, memory) {
  return build(level, used, "capital", memory);
}

export function makeCountryQuestion(level, used, memory) {
  return build(level, used, "country", memory);
}

export function makeGeoMixQuestion(level, used, memory) {
  const mode = pick(["flag", "capital", "country"]);
  return build(level, used, mode, memory);
}

function europe(country) {
  return country.continent.includes("Europa");
}

function asiaOnly(country) {
  return country.continent.includes("Azja") && !country.continent.includes("Europa");
}

function africa(country) {
  return country.continent === "Afryka";
}

function americas(country) {
  return country.continent.startsWith("Ameryka");
}

function oceania(country) {
  return country.continent === "Oceania";
}

function step(tier, index, group, detail, where, extra = {}) {
  return {
    id: `${tier}-${index}`,
    title: `${tier}.${index}`,
    group,
    tier,
    band: extra.band ?? tier,
    questions: extra.questions ?? 5,
    options: extra.options ?? (tier === 1 ? 3 : 4),
    seconds: extra.seconds ?? 0,
    detail,
    where,
    preferLike: Boolean(extra.preferLike),
  };
}

function sliceBand(bandNo, predicate, part, parts) {
  const ids = countries
    .filter((country) => country.band === bandNo && predicate(country))
    .map((country) => country.id)
    .sort();
  const size = Math.ceil(ids.length / parts);
  const group = new Set(ids.slice((part - 1) * size, part * size));
  return (country) => group.has(country.id);
}

export function geographyLevels() {
  const band = (n) => (country) => country.band === n;
  const upTo = (n) => (country) => country.band <= n;
  return [
    step(1, 1, "Łatwy", "Znana Europa · 5 pytań", sliceBand(1, europe, 1, 2)),
    step(1, 2, "Łatwy", "Reszta znanej Europy · 5 pytań", sliceBand(1, europe, 2, 2)),
    step(1, 3, "Łatwy", "Znane kraje poza Europą · 5 pytań", (c) => band(1)(c) && !europe(c)),
    step(1, 4, "Łatwy", "Powtórka znanych krajów · 5 pytań", band(1)),
    step(2, 1, "Średni", "Europa · 5 pytań", (c) => band(2)(c) && europe(c), { options: 4 }),
    step(2, 2, "Średni", "Azja · 5 pytań", (c) => band(2)(c) && asiaOnly(c), { options: 4 }),
    step(2, 3, "Średni", "Afryka, Ameryki i Oceania · 5 pytań", (c) => band(2)(c) && (africa(c) || americas(c) || oceania(c)), { options: 4 }),
    step(2, 4, "Średni", "Powtórka do średniego · 5 pytań", upTo(2), { options: 4 }),
    step(3, 1, "Trudny", "Europa i Azja · 5 pytań", (c) => band(3)(c) && (europe(c) || asiaOnly(c)), { options: 4 }),
    step(3, 2, "Trudny", "Afryka · 5 pytań", (c) => band(3)(c) && africa(c), { options: 4 }),
    step(3, 3, "Trudny", "Ameryki i Oceania · 5 pytań", (c) => band(3)(c) && (americas(c) || oceania(c)), { options: 4 }),
    step(3, 4, "Trudny", "Prawie cały świat · 5 pytań", upTo(3), { options: 4 }),
    step(4, 1, "Mistrz", "Rzadkie kraje · 5 pytań", band(4), { options: 4 }),
    step(4, 2, "Mistrz", "Podobne flagi i stolice · 5 pytań", upTo(4), { options: 4, preferLike: true }),
    step(4, 3, "Mistrz", "Cały świat · 5 pytań", upTo(4), { options: 4 }),
    step(4, 4, "Mistrz", "Na czas · 5 pytań · 20 s", upTo(4), { options: 4, seconds: 20, preferLike: true }),
  ];
}

export function geographyExamLevels() {
  const upTo = (n) => (country) => country.band <= n;
  const only = (n) => (country) => country.band === n;
  const exam = (tier, index, detail, where, extra = {}) => step(tier, index, ["", "Łatwy", "Średni", "Trudny", "Mistrz"][tier], detail, where, {
    questions: 6,
    options: tier === 1 ? 3 : 4,
    ...extra,
  });
  return [
    exam(1, 1, "Egzamin: znane kraje", only(1)),
    exam(1, 2, "Egzamin: mieszanka łatwych", upTo(1)),
    exam(1, 3, "Egzamin: powtórka łatwych", upTo(1)),
    exam(2, 1, "Egzamin: nowe kraje", only(2), { options: 4 }),
    exam(2, 2, "Egzamin: do średniego", upTo(2), { options: 4 }),
    exam(2, 3, "Egzamin: powtórka średniego", upTo(2), { options: 4 }),
    exam(3, 1, "Egzamin: trudniejsze kraje", only(3), { options: 4 }),
    exam(3, 2, "Egzamin: szeroki świat", upTo(3), { options: 4 }),
    exam(3, 3, "Egzamin: powtórka trudnego", upTo(3), { options: 4 }),
    exam(4, 1, "Egzamin: rzadkie kraje", only(4), { options: 4 }),
    exam(4, 2, "Egzamin: podobne odpowiedzi", upTo(4), { options: 4, preferLike: true }),
    exam(4, 3, "Egzamin mistrza · 20 s", upTo(4), { options: 4, seconds: 20, preferLike: true }),
  ];
}
