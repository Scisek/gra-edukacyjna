import { access, readFile } from "node:fs/promises";
import { countries } from "../js/data/countries.js";
import { words } from "../js/data/spelling.js";
import { makeFlagQuestion, makeCapitalQuestion, makeCountryQuestion, geographyLevels } from "../js/modules/geography.js";
import { makeSpellingQuestion, spellingLevels } from "../js/modules/spelling.js";
import { makeMathQuestion, mathLevels } from "../js/modules/math.js";
import { subjects } from "../js/registry.js";
import { ISLANDS, PIECES } from "../js/rewards.js";

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

const bands = [1, 2, 3, 4];
for (const band of bands) {
  const count = words.filter((word) => word.band === band).length;
  const level = spellingLevels().find((item) => item.band === band);
  if (count < level.questions) fail(`za mało słów w band ${band}: ${count}`);
}

function checkQuestion(question, level) {
  if (!question.options.some((option) => option.id === question.correctId)) fail(`brak poprawnej opcji: ${question.review}`);
  if (new Set(question.options.map((option) => option.id)).size !== question.options.length) fail(`powtórzone opcje: ${question.review}`);
  if (question.options.length !== level.options) fail(`zła liczba opcji (${question.options.length}) dla ${question.review}`);
}

for (const level of geographyLevels(20)) {
  for (const make of [makeFlagQuestion, makeCapitalQuestion, makeCountryQuestion]) {
    const used = new Set();
    for (let index = 0; index < level.questions; index += 1) checkQuestion(make(level, used), level);
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
    for (let index = 0; index < 40; index += 1) {
      const question = makeMathQuestion(kind, level, used);
      checkQuestion(question, level);
      const match = question.figure.text.match(/^(\d+) (.+) (\d+)$/);
      if (!match || match[2] !== signs[kind]) fail(`zły zapis działania: ${question.figure.text}`);
      const a = Number(match[1]);
      const b = Number(match[3]);
      const result = Number(question.correctId);
      if (kind === "dodawanie" && a + b !== result) fail(`złe dodawanie ${question.figure.text}`);
      if (kind === "odejmowanie" && (a - b !== result || result < 0)) fail(`złe odejmowanie ${question.figure.text}`);
      if (kind === "mnozenie" && a * b !== result) fail(`złe mnożenie ${question.figure.text}`);
      if (kind === "dzielenie" && (b === 0 || a % b !== 0 || a / b !== result)) fail(`złe dzielenie ${question.figure.text}`);
      if (kind === "dodawanie" && level.band === 1 && result > 10) fail(`dodawanie poza 10: ${question.figure.text}`);
      if (kind === "dodawanie" && level.band === 2 && (result < 11 || result > 20)) fail(`dodawanie poza 20: ${question.figure.text}`);
      if (kind === "dodawanie" && level.band === 3 && result > 100) fail(`dodawanie poza 100: ${question.figure.text}`);
      if (kind === "dodawanie" && level.band === 4 && result > 1000) fail(`dodawanie poza 1000: ${question.figure.text}`);
      if (kind === "odejmowanie" && level.band === 1 && a > 10) fail(`odejmowanie poza 10: ${question.figure.text}`);
      if (kind === "odejmowanie" && level.band === 4 && a > 1000) fail(`odejmowanie poza 1000: ${question.figure.text}`);
      if (kind === "mnozenie" && level.band === 1 && (a > 5 || b > 5)) fail(`mnożenie poza 5: ${question.figure.text}`);
      if (kind === "mnozenie" && level.band === 2 && (a > 10 || b > 10)) fail(`mnożenie poza 10: ${question.figure.text}`);
      if (kind === "mnozenie" && level.band === 4 && (a > 30 || b > 9 || a < 10)) fail(`mnożenie mistrz: ${question.figure.text}`);
      if (kind === "dzielenie" && level.band === 4 && result > 80) fail(`dzielenie mistrz: ${question.figure.text}`);
    }
  }
}

const readyIds = subjects.filter((subject) => subject.status === "ready").map((subject) => subject.id);
for (const island of ISLANDS) {
  if (!readyIds.includes(island.id)) fail(`wyspa bez przedmiotu: ${island.id}`);
}
if (ISLANDS.length !== 3 || PIECES !== 6) fail("nieoczekiwana liczba wysp albo fragmentów");

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
