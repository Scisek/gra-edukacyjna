import { access, readFile } from "node:fs/promises";
import { countries } from "../js/data/countries.js";
import { words } from "../js/data/spelling.js";
import { makeFlagQuestion, makeCapitalQuestion, makeCountryQuestion, geographyExamLevels, geographyLevels } from "../js/modules/geography.js";
import { makeSpellingQuestion, spellingExamLevels, spellingLevels } from "../js/modules/spelling.js";
import { makeMathQuestion, mathExamLevels, mathLevels } from "../js/modules/math.js";
import { subjects } from "../js/registry.js";
import { COLLECTIONS } from "../js/data/breeds.js";
import { roundXp, settleXp, xpToNext } from "../js/xp.js";
import { cities, VOIVODESHIPS } from "../js/data/poland.js";
import { cityPool } from "../js/modules/poland.js";
import { presentLevel } from "../js/audience.js";

const errors = [];
const fail = (message) => errors.push(message);

const letters = "a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ";

function leaks(meaning, word) {
  const source = meaning.toLocaleLowerCase("pl");
  const needle = word.toLocaleLowerCase("pl");
  if (needle.length <= 3) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^${letters}])${escaped}(?:$|[^${letters}])`, "i").test(source);
  }
  return source.includes(needle);
}

const english = ["Washington", "London", "Beijing", "Moscow", "Vienna", "Warsaw", "Prague", "Rome", "Paris", "Istanbul", "Athens", "Lisbon", "Brussels", "Copenhagen", "Stockholm", "Cairo", "Tokyo", "Seoul", "Havana", "Sydney", "Toronto", "Mexico"];

const codes = new Set();
const capitals = new Map();
for (const country of countries) {
  if (codes.has(country.code)) fail(`powtórzony kod ${country.code}`);
  codes.add(country.code);
  if (!country.name || !country.capital) fail(`pusta nazwa ${country.code}`);
  if (![1, 2, 3, 4].includes(country.band)) fail(`zły band ${country.code}`);
  if (!country.continent || !country.fact || !country.area || !country.population) fail(`brak karty kraju ${country.code}`);
  const previous = capitals.get(country.capital);
  if (previous) fail(`ta sama stolica: ${country.capital} (${previous}, ${country.code})`);
  capitals.set(country.capital, country.code);
  for (const word of english) {
    if (country.name.includes(word) || country.capital.includes(word)) fail(`angielska nazwa przy ${country.code}: ${word}`);
  }
  try {
    await access(`assets/flags/${country.code}.svg`);
    const svg = await readFile(`assets/flags/${country.code}.svg`, "utf8");
    if (!svg.includes("<svg")) fail(`zła flaga ${country.code}`);
  } catch {
    fail(`brak flagi ${country.code}`);
  }
}

const ids = new Set();
for (const word of words) {
  if (ids.has(word.id)) fail(`powtórzone słowo ${word.id}`);
  ids.add(word.id);
  if (`${word.before}${word.missing}${word.after}` !== word.word) fail(`${word.id}: luka nie składa słowa`);
  if (!word.options.includes(word.missing)) fail(`${word.id}: brak poprawnej luki`);
  if (new Set(word.options).size !== word.options.length || word.options.length < 2) fail(`${word.id}: złe opcje`);
  if (leaks(word.meaning, word.word)) fail(`${word.id}: znaczenie zawiera słowo`);
  if (!word.hint || !word.meaning) fail(`${word.id}: pusta podpowiedź lub znaczenie`);
}

if (words.length < 250) fail(`za mało słów: ${words.length}`);
for (const level of [...spellingLevels(), ...spellingExamLevels()]) {
  const pool = words.filter((word) => (level.mix ? word.band <= level.band : word.band === level.band) && word.rank <= level.rank);
  if (pool.length < level.questions) fail(`za mała pula ortografii ${level.id}: ${pool.length}`);
}

function checkQuestion(question, level) {
  if (!question.options.some((option) => option.id === question.correctId)) fail(`brak poprawnej opcji: ${question.review}`);
  if (new Set(question.options.map((option) => option.id)).size !== question.options.length) fail(`powtórzone opcje: ${question.review}`);
  if (question.options.length !== level.options) fail(`zła liczba opcji (${question.options.length}) dla ${question.review}`);
}

for (const level of [...geographyLevels(), ...geographyExamLevels()]) {
  const pool = countries.filter(level.where);
  if (pool.length < Math.max(level.questions, level.options)) fail(`za mała pula geografii ${level.id}: ${pool.length}`);
  for (const make of [makeFlagQuestion, makeCapitalQuestion, makeCountryQuestion]) {
    const used = new Set();
    for (let index = 0; index < Math.min(3, level.questions); index += 1) checkQuestion(make(level, used), level);
  }
}

for (const level of spellingLevels()) {
  const used = new Set();
  for (let index = 0; index < level.questions; index += 1) checkQuestion(makeSpellingQuestion(level, used), level);
}

const signs = { dodawanie: "+", odejmowanie: "−", mnozenie: "×", dzielenie: "÷" };
for (const kind of Object.keys(signs)) {
  for (const level of mathLevels(kind)) {
    const used = new Set();
    for (let index = 0; index < 12; index += 1) {
      const question = makeMathQuestion(kind, level, used);
      checkQuestion(question, level);
      const match = question.figure.text.match(/^(\d+) (.+) (\d+)$/);
      if (!match || match[2] !== signs[kind]) fail(`zły zapis działania: ${question.figure.text}`);
      const a = Number(match[1]);
      const b = Number(match[3]);
      const result = Number(question.correctId);
      if (kind === "dodawanie" && (a + b !== result || result > level.max || result < 0)) fail(`złe dodawanie ${question.figure.text}`);
      if (kind === "odejmowanie" && (a - b !== result || result < 0 || a > level.max)) fail(`złe odejmowanie ${question.figure.text}`);
      if (kind === "mnozenie" && a * b !== result) fail(`złe mnożenie ${question.figure.text}`);
      if (kind === "dzielenie" && (b === 0 || a % b !== 0 || a / b !== result)) fail(`złe dzielenie ${question.figure.text}`);
      if (kind === "mnozenie" && !level.big && (a > level.tableMax || b > level.tableMax)) fail(`mnożenie poza tabliczką ${question.figure.text}`);
      if (kind === "mnozenie" && level.big && (a < level.bigMin || a > level.bigMax)) fail(`mnożenie mistrz ${question.figure.text}`);
    }
  }
}
if (mathExamLevels().length !== 12) fail("egzamin matematyki nie ma 12 podpoziomów");

if (cities.length < 150) fail(`za mało miast: ${cities.length}`);
const easyCities = cityPool({ tier: 1, step: 1 }).map((city) => city.name).sort();
const expectedEasy = ["Gdańsk", "Kraków", "Łódź", "Poznań", "Szczecin", "Warszawa", "Wrocław"].sort();
if (easyCities.join("|") !== expectedEasy.join("|")) fail(`łatwe miasta: ${easyCities.join(", ")}`);
if (VOIVODESHIPS.length !== 16) fail("zła liczba województw");
const kuj = VOIVODESHIPS.find((item) => item.id === "kujawsko-pomorskie");
const lub = VOIVODESHIPS.find((item) => item.id === "lubuskie");
if (kuj.seat !== "Bydgoszcz" || kuj.assembly !== "Toruń") fail("stolice kujawsko-pomorskie");
if (lub.seat !== "Gorzów Wielkopolski" || lub.assembly !== "Zielona Góra") fail("stolice lubuskie");
for (let n = 1; n < 12; n += 1) {
  if (xpToNext(n + 1) <= xpToNext(n)) fail(`XP nie rośnie: ${n}`);
}
const over = { playerLevel: 4, xp: 200, avatar: "kot", breeds: { kot: [] } };
settleXp(over);
if (over.playerLevel < 5 || over.xp >= xpToNext(over.playerLevel)) fail(`nadmiar XP nie awansuje: poziom ${over.playerLevel}, ${over.xp}`);
const adultLevel = presentLevel({ audience: "dorosly" }, { tier: 1, step: 1, band: 1, min: 0, max: 10, options: 3, questions: 5 }, "matematyka");
for (let i = 0; i < 20; i += 1) {
  const question = makeMathQuestion("dodawanie", adultLevel, new Set());
  const result = Number(question.correctId);
  if (result < 30) fail(`dorosły dodaje za mało: ${question.figure.text}`);
}
const kidBlocked = presentLevel({ test: true, audience: "dorosly" }, { tier: 1, detail: "dziecko" }, "matematyka");
if (kidBlocked.detail !== "dziecko") fail("Rodzic nie powinien dostawać trudniejszej matematyki");

const easyXp = roundXp({ tier: 1, step: 1 }, 2);
const hardXp = roundXp({ tier: 4, step: 1 }, 2);
if (hardXp < easyXp * 8 || hardXp > easyXp * 12) fail(`mnożnik XP ${hardXp}/${easyXp}`);
for (const collection of Object.values(COLLECTIONS)) {
  if (collection.breeds.length < 8 || collection.breeds.length > 12 || collection.badges.length !== 4) fail(`kolekcja ${collection.id}`);
  for (const breed of collection.breeds) {
    if (!breed.origin || !breed.character || !breed.fact || !breed.size) fail(`niepełna rasa ${breed.id}`);
    try {
      await access(`assets/photos/${collection.id}-${breed.id}.webp`);
    } catch {
      fail(`brak rysunku ${collection.id}-${breed.id}`);
    }
  }
}

const subjectIds = new Set();
for (const subject of subjects) {
  if (subjectIds.has(subject.id)) fail(`powtórzony przedmiot ${subject.id}`);
  subjectIds.add(subject.id);
  if (subject.status === "ready" && !subject.modules?.some((module) => module.status !== "soon")) {
    fail(`${subject.id} nie ma żadnego modułu`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK kraje=${countries.length} słowa=${words.length} przedmioty=${subjects.length}`);
