import { numericOptions, randInt, recallWeight, weightedPick } from "../util.js";

const OPS = {
  dodawanie: { sign: "+", title: "Dodawanie" },
  odejmowanie: { sign: "−", title: "Odejmowanie" },
  mnozenie: { sign: "×", title: "Mnożenie" },
  dzielenie: { sign: "÷", title: "Dzielenie" },
};

function pair(level, kind) {
  const ceiling = level.ceiling || (level.max || 20) + 30;
  if (kind === "dodawanie") {
    const lo = level.min ?? 0;
    const hi = level.max ?? 10;
    if (lo <= 0) {
      const a = randInt(0, Math.min(hi, 12));
      const room = Math.max(0, hi - a);
      const b = randInt(0, room);
      return [a, b, a + b, hi + Math.max(12, Math.round(hi * 0.3))];
    }
    const sum = randInt(lo, hi);
    const a = randInt(1, Math.max(1, sum - 1));
    return [a, sum - a, sum, hi + Math.max(20, Math.round(hi * 0.2))];
  }
  if (kind === "odejmowanie") {
    const hi = level.max ?? 10;
    const lo = Math.min(level.min ?? 1, hi);
    const a = randInt(Math.max(lo, 0), hi);
    const b = randInt(0, a);
    return [a, b, a - b, hi + 15];
  }
  if (kind === "mnozenie" && level.bothBig) {
    const a = randInt(level.bigMin ?? 12, level.bigMax ?? 40);
    const b = randInt(level.bigMin ?? 12, level.bigMax ?? 40);
    return [a, b, a * b, a * b + 80];
  }
  if (kind === "dzielenie" && level.bothBig) {
    const divisor = randInt(level.bigMin ?? 12, Math.min(level.bigMax ?? 30, 36));
    const quotient = randInt(11, Math.min(level.bigMax ?? 40, 48));
    return [divisor * quotient, divisor, quotient, quotient + 30];
  }
  if (kind === "mnozenie") {
    if (level.big) {
      const a = randInt(level.bigMin ?? 10, level.bigMax ?? 40);
      const b = randInt(level.tableMin ?? 2, level.tableMax ?? 9);
      return [a, b, a * b, a * b + Math.max(30, b * 5)];
    }
    const lo = level.tableMin ?? 1;
    const hi = level.tableMax ?? 5;
    let a = randInt(lo, hi);
    const b = randInt(lo, hi);
    if (level.allowZero && Math.random() < 0.08) a = 0;
    const product = a * b;
    return [a, b, product, product + (hi >= 10 ? 24 : 10)];
  }
  if (level.big) {
    const quotient = randInt(level.bigMin ?? 10, level.bigMax ?? 40);
    const divisor = randInt(level.tableMin ?? 2, level.tableMax ?? 9);
    return [divisor * quotient, divisor, quotient, quotient + 24];
  }
  const lo = Math.max(1, level.tableMin ?? 1);
  const hi = level.tableMax ?? 5;
  const divisor = randInt(lo, hi);
  const quotient = randInt(lo, hi);
  return [divisor * quotient, divisor, quotient, quotient + (hi >= 10 ? 16 : 8)];
}

function chooseKind(kinds, memory) {
  return weightedPick(kinds, (kind) => recallWeight(memory?.[`math:${kind}`]));
}

export function makeAddSubQuestion(level, used, memory) {
  return makeMathQuestion(chooseKind(["dodawanie", "odejmowanie"], memory), level, used);
}

export function makeMathMixQuestion(level, used, memory) {
  return makeMathQuestion(chooseKind(["dodawanie", "odejmowanie", "mnozenie", "dzielenie"], memory), level, used);
}

export function makeMathQuestion(kind, level, used) {
  const op = OPS[kind];
  let built = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const [a, b, result, ceiling] = pair(level, kind);
    const key = `${kind}:${a}${op.sign}${b}`;
    if (used.has(key) && attempt < 39) continue;
    used.add(key);
    built = { a, b, result, ceiling, key };
    break;
  }
  const options = numericOptions(built.result, level.options, built.ceiling);
  const expression = `${built.a} ${op.sign} ${built.b}`;
  return {
    key: `math:${kind}`,
    prompt: "Ile to jest?",
    figure: { type: "equation", text: expression },
    options,
    correctId: String(built.result),
    correctLabel: String(built.result),
    note: "",
    review: `${expression} = ${built.result}`,
  };
}

const GROUPS = ["", "Łatwy", "Średni", "Trudny", "Mistrz"];

function pack(kind, tier, step, fields) {
  return {
    id: `${tier}-${step}`,
    title: `${tier}.${step}`,
    group: GROUPS[tier],
    tier,
    step,
    band: tier,
    kind,
    questions: fields.questions ?? 5,
    options: fields.options ?? (tier === 1 ? 3 : 4),
    seconds: fields.seconds ?? 0,
    detail: fields.detail,
    min: fields.min,
    max: fields.max,
    tableMin: fields.tableMin,
    tableMax: fields.tableMax,
    big: Boolean(fields.big),
    bigMin: fields.bigMin,
    bigMax: fields.bigMax,
    allowZero: Boolean(fields.allowZero),
  };
}

const ADD = [
  [1, 1, { min: 0, max: 5, options: 3, detail: "Sumy do 5 · 5 pytań" }],
  [1, 2, { min: 0, max: 8, options: 3, detail: "Sumy do 8 · 5 pytań" }],
  [1, 3, { min: 0, max: 10, options: 3, detail: "Sumy do 10 · 5 pytań" }],
  [1, 4, { min: 0, max: 10, options: 3, detail: "Powtórka do 10 · 5 pytań" }],
  [2, 1, { min: 11, max: 15, detail: "Sumy od 11 do 15" }],
  [2, 2, { min: 11, max: 20, detail: "Sumy do 20" }],
  [2, 3, { min: 6, max: 20, detail: "Mieszane do 20" }],
  [2, 4, { min: 11, max: 20, detail: "Powtórka do 20" }],
  [3, 1, { min: 20, max: 50, detail: "Sumy do 50" }],
  [3, 2, { min: 30, max: 100, detail: "Sumy do 100" }],
  [3, 3, { min: 40, max: 200, detail: "Sumy do 200" }],
  [3, 4, { min: 20, max: 200, detail: "Powtórka większych sum" }],
  [4, 1, { min: 100, max: 400, detail: "Sumy do 400" }],
  [4, 2, { min: 200, max: 700, detail: "Sumy do 700" }],
  [4, 3, { min: 300, max: 1000, detail: "Sumy do 1000" }],
  [4, 4, { min: 100, max: 1000, seconds: 25, detail: "Na czas, do 1000" }],
];

const SUB = [
  [1, 1, { min: 1, max: 5, options: 3, detail: "Odejmowanie do 5" }],
  [1, 2, { min: 1, max: 8, options: 3, detail: "Odejmowanie do 8" }],
  [1, 3, { min: 1, max: 10, options: 3, detail: "Odejmowanie do 10" }],
  [1, 4, { min: 0, max: 10, options: 3, detail: "Powtórka do 10" }],
  [2, 1, { min: 11, max: 15, detail: "Odejmowanie od liczb do 15" }],
  [2, 2, { min: 11, max: 20, detail: "Odejmowanie do 20" }],
  [2, 3, { min: 8, max: 20, detail: "Mieszane do 20" }],
  [2, 4, { min: 11, max: 20, detail: "Powtórka do 20" }],
  [3, 1, { min: 20, max: 50, detail: "Odejmowanie do 50" }],
  [3, 2, { min: 30, max: 100, detail: "Odejmowanie do 100" }],
  [3, 3, { min: 40, max: 200, detail: "Odejmowanie do 200" }],
  [3, 4, { min: 20, max: 200, detail: "Powtórka do 200" }],
  [4, 1, { min: 100, max: 400, detail: "Odejmowanie do 400" }],
  [4, 2, { min: 200, max: 700, detail: "Odejmowanie do 700" }],
  [4, 3, { min: 300, max: 1000, detail: "Odejmowanie do 1000" }],
  [4, 4, { min: 100, max: 1000, seconds: 25, detail: "Na czas, do 1000" }],
];

const MUL = [
  [1, 1, { tableMin: 1, tableMax: 2, options: 3, detail: "Tabliczka 1–2" }],
  [1, 2, { tableMin: 1, tableMax: 3, options: 3, detail: "Tabliczka 1–3" }],
  [1, 3, { tableMin: 1, tableMax: 5, options: 3, detail: "Tabliczka do 5×5" }],
  [1, 4, { tableMin: 0, tableMax: 5, allowZero: true, options: 3, detail: "Powtórka do 5, także 0" }],
  [2, 1, { tableMin: 2, tableMax: 6, detail: "Tabliczka do 6" }],
  [2, 2, { tableMin: 2, tableMax: 8, detail: "Tabliczka do 8" }],
  [2, 3, { tableMin: 1, tableMax: 10, detail: "Tabliczka do 10×10" }],
  [2, 4, { tableMin: 1, tableMax: 10, detail: "Powtórka do 10" }],
  [3, 1, { tableMin: 2, tableMax: 12, detail: "Tabliczka do 12" }],
  [3, 2, { tableMin: 3, tableMax: 12, detail: "Trudniejsze do 12×12" }],
  [3, 3, { tableMin: 6, tableMax: 12, detail: "Większe czynniki do 12" }],
  [3, 4, { tableMin: 2, tableMax: 12, detail: "Powtórka do 12" }],
  [4, 1, { big: true, bigMin: 10, bigMax: 20, tableMin: 2, tableMax: 5, detail: "Dziesiątki razy mała liczba" }],
  [4, 2, { big: true, bigMin: 10, bigMax: 30, tableMin: 2, tableMax: 6, detail: "Większe iloczyny" }],
  [4, 3, { big: true, bigMin: 10, bigMax: 50, tableMin: 2, tableMax: 9, detail: "Do 50 razy jednocyfrowa" }],
  [4, 4, { big: true, bigMin: 12, bigMax: 40, tableMin: 3, tableMax: 9, seconds: 30, detail: "Na czas, większe iloczyny" }],
];

const DIV = MUL.map(([tier, step, fields]) => [tier, step, {
  ...fields,
  allowZero: false,
  tableMin: Math.max(1, fields.tableMin || 1),
  detail: fields.detail.replace("Tabliczka", "Dzielenie").replace("iloczyny", "dzielenia").replace("razy", "÷"),
}]);

const EXAM = [
  [1, 1, { min: 0, max: 8, tableMin: 1, tableMax: 3, options: 3, detail: "Egzamin: małe liczby" }],
  [1, 2, { min: 0, max: 10, tableMin: 1, tableMax: 5, options: 3, detail: "Egzamin: do 10 i tabliczka do 5" }],
  [1, 3, { min: 0, max: 10, tableMin: 1, tableMax: 5, options: 3, detail: "Egzamin: powtórka łatwych" }],
  [2, 1, { min: 11, max: 20, tableMin: 2, tableMax: 8, detail: "Egzamin: do 20" }],
  [2, 2, { min: 8, max: 20, tableMin: 1, tableMax: 10, detail: "Egzamin: tabliczka do 10" }],
  [2, 3, { min: 11, max: 20, tableMin: 1, tableMax: 10, detail: "Egzamin: powtórka średniego" }],
  [3, 1, { min: 20, max: 80, tableMin: 2, tableMax: 12, detail: "Egzamin: większe liczby" }],
  [3, 2, { min: 30, max: 150, tableMin: 3, tableMax: 12, detail: "Egzamin: do 12×12" }],
  [3, 3, { min: 20, max: 200, tableMin: 2, tableMax: 12, detail: "Egzamin: powtórka trudnego" }],
  [4, 1, { min: 100, max: 400, big: true, bigMin: 10, bigMax: 20, tableMin: 2, tableMax: 6, detail: "Egzamin: duże liczby" }],
  [4, 2, { min: 200, max: 800, big: true, bigMin: 10, bigMax: 40, tableMin: 2, tableMax: 9, detail: "Egzamin: szeroki zakres" }],
  [4, 3, { min: 100, max: 1000, big: true, bigMin: 12, bigMax: 50, tableMin: 2, tableMax: 9, seconds: 30, detail: "Egzamin mistrza · 30 s" }],
];

const LADDERS = {
  dodawanie: ADD,
  odejmowanie: SUB,
  mnozenie: MUL,
  dzielenie: DIV,
  "dodawanie-odejmowanie": ADD,
};

export function mathLevels(kind) {
  const rows = LADDERS[kind] || ADD;
  return rows.map(([tier, step, fields]) => pack(kind, tier, step, fields));
}

export function mathExamLevels() {
  return EXAM.map(([tier, step, fields]) => pack("mix", tier, step, { ...fields, questions: 6 }));
}
