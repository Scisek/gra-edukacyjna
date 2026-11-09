import { words } from "../data/spelling.js";
import { recallWeight, shuffle, weightedPick } from "../util.js";

function toQuestion(word) {
  const options = shuffle(word.options).map((label) => ({ id: label, label }));
  return {
    key: `spell:${word.id}`,
    prompt: "Uzupełnij lukę",
    figure: {
      type: "gap",
      before: word.before,
      after: word.after,
      missing: word.missing,
      meaning: word.meaning,
    },
    options,
    correctId: word.missing,
    correctLabel: word.missing,
    note: word.hint,
    review: `${word.meaning} → ${word.word}`,
  };
}

function takeWord(source, used, memory) {
  const fresh = source.filter((word) => !used.has(word.id));
  const bag = fresh.length ? fresh : source;
  return weightedPick(bag, (word) => recallWeight(memory?.[`spell:${word.id}`]));
}

export function makeSpellingQuestion(level, used, memory) {
  const source = words.filter((word) => word.band === level.band);
  const word = takeWord(source, used, memory);
  used.add(word.id);
  return toQuestion(word);
}

export function makeSpellingMixQuestion(level, used, memory) {
  const source = words.filter((word) => word.band <= level.band);
  const word = takeWord(source, used, memory);
  used.add(word.id);
  return toQuestion(word);
}

export function spellingLevels() {
  return [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 2, seconds: 0, detail: "ó czy u · 8 luk" },
    { id: "sredni", title: "Średni", band: 2, questions: 8, options: 2, seconds: 0, detail: "rz czy ż · 8 luk" },
    { id: "trudny", title: "Trudny", band: 3, questions: 8, options: 2, seconds: 0, detail: "ch czy h · 8 luk" },
    { id: "mistrz", title: "Mistrz", band: 4, questions: 10, options: 2, seconds: 0, detail: "ą/om oraz ę/en · 10 luk" },
  ];
}

export function spellingMixLevels() {
  return [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 2, seconds: 0, detail: "Na początek ó oraz u" },
    { id: "sredni", title: "Średni", band: 2, questions: 8, options: 2, seconds: 0, detail: "ó/u oraz rz/ż" },
    { id: "trudny", title: "Trudny", band: 3, questions: 8, options: 2, seconds: 0, detail: "Do tego ch oraz h" },
    { id: "mistrz", title: "Mistrz", band: 4, questions: 10, options: 2, seconds: 0, detail: "Wszystkie zasady, także ą i ę" },
  ];
}
