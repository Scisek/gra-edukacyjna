import { numericOptions, randInt } from "../util.js";

const OPS = {
  dodawanie: { sign: "+", title: "Dodawanie" },
  odejmowanie: { sign: "−", title: "Odejmowanie" },
  mnozenie: { sign: "×", title: "Mnożenie" },
  dzielenie: { sign: "÷", title: "Dzielenie" },
};

function pair(band, kind) {
  if (kind === "dodawanie") {
    if (band === 1) {
      const a = randInt(0, 9);
      const b = randInt(0, 10 - a);
      return [a, b, a + b, 14];
    }
    if (band === 2) {
      const sum = randInt(11, 20);
      const a = randInt(1, sum - 1);
      return [a, sum - a, sum, 30];
    }
    if (band === 3) {
      const sum = randInt(40, 100);
      const a = randInt(11, sum - 11);
      return [a, sum - a, sum, sum + 25];
    }
    const sum = randInt(120, 1000);
    const a = randInt(15, sum - 15);
    return [a, sum - a, sum, sum + 120];
  }
  if (kind === "odejmowanie") {
    const max = band === 1 ? 10 : band === 2 ? 20 : band === 3 ? 100 : 1000;
    const min = band === 1 ? 1 : band === 2 ? 11 : band === 3 ? 20 : 100;
    const a = randInt(min, max);
    const b = randInt(0, a);
    return [a, b, a - b, Math.max(max, a)];
  }
  if (kind === "mnozenie") {
    let a;
    let b;
    if (band === 1) {
      a = Math.random() < 0.08 ? 0 : randInt(1, 5);
      b = randInt(1, 5);
    } else if (band === 2) {
      a = randInt(1, 10);
      b = randInt(1, 10);
    } else if (band === 3) {
      a = randInt(2, 12);
      b = randInt(2, 12);
    } else {
      a = randInt(10, 30);
      b = randInt(2, 9);
    }
    return [a, b, a * b, a * b + (band >= 3 ? 40 : 15)];
  }
  let divisor;
  let quotient;
  if (band === 1) {
    divisor = randInt(1, 5);
    quotient = randInt(1, 5);
  } else if (band === 2) {
    divisor = randInt(1, 10);
    quotient = randInt(1, 10);
  } else if (band === 3) {
    divisor = randInt(2, 12);
    quotient = randInt(2, 12);
  } else {
    divisor = randInt(2, 12);
    quotient = randInt(10, 80);
  }
  return [divisor * quotient, divisor, quotient, quotient + (band >= 3 ? 20 : 8)];
}

export function makeMathQuestion(kind, level, used) {
  const op = OPS[kind];
  let built = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const [a, b, result, ceiling] = pair(level.band, kind);
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

export function mathLevels(kind) {
  const details = {
    dodawanie: [
      "Wyniki do 10 · 8 pytań · 3 odpowiedzi",
      "Wyniki do 20 · 8 pytań · 4 odpowiedzi",
      "Wyniki do 100 · 8 pytań · 4 odpowiedzi",
      "Wyniki do 1000 · 10 pytań · 25 s",
    ],
    odejmowanie: [
      "W zakresie do 10 · 8 pytań · 3 odpowiedzi",
      "W zakresie do 20 · 8 pytań · 4 odpowiedzi",
      "W zakresie do 100 · 8 pytań · 4 odpowiedzi",
      "W zakresie do 1000 · 10 pytań · 25 s",
    ],
    mnozenie: [
      "Tabliczka do 5×5 · 8 pytań · 3 odpowiedzi",
      "Tabliczka do 10×10 · 8 pytań · 4 odpowiedzi",
      "Liczby do 12×12 · 8 pytań · 4 odpowiedzi",
      "Większe iloczyny · 10 pytań · 30 s",
    ],
    dzielenie: [
      "Dzielenie z tabliczki do 5 · 8 pytań · 3 odpowiedzi",
      "Dzielenie z tabliczki do 10 · 8 pytań · 4 odpowiedzi",
      "Wynik bez reszty, liczby do 12 · 8 pytań · 4 odpowiedzi",
      "Większe dzielenia bez reszty · 10 pytań · 30 s",
    ],
  };
  const seconds = kind === "mnozenie" || kind === "dzielenie" ? 30 : 25;
  const text = details[kind];
  return [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 3, seconds: 0, detail: text[0] },
    { id: "sredni", title: "Średni", band: 2, questions: 8, options: 4, seconds: 0, detail: text[1] },
    { id: "trudny", title: "Trudny", band: 3, questions: 8, options: 4, seconds: 0, detail: text[2] },
    { id: "mistrz", title: "Mistrz", band: 4, questions: 10, options: 4, seconds, detail: text[3] },
  ];
}
