import { words } from "../data/spelling.js";
import { pick, shuffle } from "../util.js";

export function makeSpellingQuestion(level, used) {
  const source = words.filter((word) => word.band === level.band);
  const fresh = source.filter((word) => !used.has(word.id));
  const word = pick(fresh.length ? fresh : source);
  used.add(word.id);
  const wrongs = shuffle(word.wrong).slice(0, Math.max(1, level.options - 1));
  const options = shuffle([word.correct, ...wrongs]).map((label) => ({ id: label, label }));
  return {
    key: `spell:${word.id}`,
    prompt: "Które słowo oznacza:",
    figure: { type: "meaning", text: word.meaning },
    options,
    correctId: word.correct,
    correctLabel: word.correct,
    note: word.hint,
    review: `${word.meaning} → ${word.correct}`,
  };
}

export function spellingLevels() {
  return [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 2, seconds: 0, detail: "ó czy u · 8 pytań · 2 odpowiedzi" },
    { id: "sredni", title: "Średni", band: 2, questions: 8, options: 3, seconds: 0, detail: "rz czy ż · 8 pytań · 3 odpowiedzi" },
    { id: "trudny", title: "Trudny", band: 3, questions: 8, options: 3, seconds: 0, detail: "ch czy h · 8 pytań · 3 odpowiedzi" },
    { id: "mistrz", title: "Mistrz", band: 4, questions: 10, options: 3, seconds: 25, detail: "Mieszane zasady · 10 pytań · 25 s" },
  ];
}
