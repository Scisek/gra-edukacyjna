import { hardWords } from "../data/spelling-hard.js";
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

function sourceFor(level) {
  if (level.adult) return hardWords;
  if (level.training) return words;
  if (level.mix) {
    return words.filter((word) => word.band <= level.band && word.rank <= (level.rank || 4));
  }
  return words.filter((word) => word.band === level.band && word.rank <= level.rank);
}

function toHardQuestion(word) {
  const options = shuffle(word.choices).map((label) => ({ id: label, label }));
  return {
    key: `spell:${word.id}`,
    prompt: "Który zapis jest poprawny?",
    figure: { type: "meaning", text: word.meaning },
    options,
    correctId: word.word,
    correctLabel: word.word,
    note: word.hint,
    review: `${word.meaning} → ${word.word}`,
  };
}

export function makeSpellingQuestion(level, used, memory) {
  const source = sourceFor(level);
  const word = takeWord(source, used, memory);
  used.add(word.id);
  return level.adult ? toHardQuestion(word) : toQuestion(word);
}

export function makeSpellingMixQuestion(level, used, memory) {
  return makeSpellingQuestion({ ...level, mix: true }, used, memory);
}

const GROUPS = ["", "Łatwy", "Średni", "Trudny", "Mistrz"];
const RULES = ["", "ó czy u", "rz czy ż", "ch czy h", "ą/om oraz ę/en"];

function spellStep(tier, index, extra = {}) {
  return {
    id: `${tier}-${index}`,
    title: `${tier}.${index}`,
    group: GROUPS[tier],
    tier,
    band: extra.band ?? tier,
    rank: extra.rank ?? index,
    questions: extra.questions ?? 5,
    options: 2,
    seconds: 0,
    detail: extra.detail,
    mix: Boolean(extra.mix),
  };
}

export function spellingLevels() {
  return [1, 2, 3, 4].flatMap((tier) => [1, 2, 3, 4].map((index) => spellStep(tier, index, {
    detail: index === 1 ? `${RULES[tier]} · pierwsze słowa` : index === 4 ? `${RULES[tier]} · powtórka` : `${RULES[tier]} · coraz więcej słów`,
  })));
}

export function spellingExamLevels() {
  const mixDetail = ["", "ó oraz u", "do tego rz oraz ż", "do tego ch oraz h", "wszystkie zasady"];
  return [1, 2, 3, 4].flatMap((tier) => [1, 2, 3].map((index) => spellStep(tier, index, {
    rank: index + 1,
    questions: 6,
    mix: true,
    detail: `Egzamin: ${mixDetail[tier]}`,
  })));
}
