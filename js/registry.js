/* Rejestr przedmiotów i modułów.
   Nowy quiz: dopisz obiekt do modules[] albo nowy przedmiot do subjects.
   Moduł gry potrzebuje id, title, blurb, levels i makeQuestion(level, used).
   Poziom: id, title, band, questions, options, seconds, detail.
   makeQuestion zwraca { key, prompt, figure, options, correctId, correctLabel, note, review }.
   figure: { type: "image", src, alt } | { type: "title"|"equation"|"meaning", text }. */

import { makeCapitalQuestion, makeCountryQuestion, makeFlagQuestion, makeGeoMixQuestion, geographyLevels } from "./modules/geography.js";
import { makeSpellingMixQuestion, makeSpellingQuestion, spellingLevels, spellingMixLevels } from "./modules/spelling.js";
import { makeAddSubQuestion, makeMathMixQuestion, makeMathQuestion, mathLevels } from "./modules/math.js";

function mathModule(id, title, blurb) {
  return {
    id,
    title,
    blurb,
    status: "ready",
    levels: mathLevels(id),
    makeQuestion: (level, used) => makeMathQuestion(id, level, used),
  };
}

export const subjects = [
  {
    id: "geografia",
    title: "Geografia",
    blurb: "Flagi, kraje i stolice",
    art: "assets/art/przedmiot-geografia.svg",
    status: "ready",
    modules: [
      {
        id: "flagi",
        title: "Flagi",
        blurb: "Rozpoznaj kraj po fladze",
        status: "ready",
        levels: geographyLevels(20),
        makeQuestion: makeFlagQuestion,
      },
      {
        id: "stolice",
        title: "Stolice",
        blurb: "Wskaż stolicę kraju",
        status: "ready",
        levels: geographyLevels(20),
        makeQuestion: makeCapitalQuestion,
      },
      {
        id: "panstwa",
        title: "Państwa",
        blurb: "Wskaż kraj po stolicy",
        status: "ready",
        levels: geographyLevels(20),
        makeQuestion: makeCountryQuestion,
      },
      {
        id: "mix",
        title: "Mix",
        blurb: "Flaga, stolica albo kraj — jak wypadnie",
        status: "ready",
        levels: geographyLevels(20),
        makeQuestion: makeGeoMixQuestion,
      },
    ],
  },
  {
    id: "polski",
    title: "Język polski",
    blurb: "Poprawny zapis słów",
    art: "assets/art/przedmiot-polski.svg",
    status: "ready",
    modules: [
      {
        id: "ortografia",
        title: "Ortografia",
        blurb: "Uzupełnij lukę: ó/u, rz/ż, ch/h, ą/om, ę/en",
        status: "ready",
        levels: spellingLevels(),
        makeQuestion: makeSpellingQuestion,
      },
      {
        id: "mix",
        title: "Mix",
        blurb: "Wszystkie zasady ortografii po trochu",
        status: "ready",
        levels: spellingMixLevels(),
        makeQuestion: makeSpellingMixQuestion,
      },
      {
        id: "czytanie",
        title: "Czytanie",
        blurb: "Wkrótce pojawią się tu kolejne ćwiczenia",
        status: "soon",
      },
    ],
  },
  {
    id: "matematyka",
    title: "Matematyka",
    blurb: "Dodawanie, odejmowanie, mnożenie i dzielenie",
    art: "assets/art/przedmiot-matematyka.svg",
    status: "ready",
    modules: [
      {
        id: "dodawanie-odejmowanie",
        title: "Dodawanie i odejmowanie",
        blurb: "Plus i minus, bez wyniku mniejszego od zera",
        status: "ready",
        levels: mathLevels("dodawanie-odejmowanie"),
        makeQuestion: makeAddSubQuestion,
      },
      mathModule("mnozenie", "Mnożenie", "Tabliczka mnożenia i większe iloczyny"),
      mathModule("dzielenie", "Dzielenie", "Tylko działania, które wychodzą bez reszty"),
      {
        id: "mix",
        title: "Mix",
        blurb: "Dodawanie, odejmowanie, mnożenie i dzielenie",
        status: "ready",
        levels: mathLevels("mix"),
        makeQuestion: makeMathMixQuestion,
      },
    ],
  },
  {
    id: "przyroda",
    title: "Przyroda",
    blurb: "Zwierzęta i rośliny",
    art: "assets/art/przedmiot-przyroda.svg",
    status: "soon",
  },
  {
    id: "historia",
    title: "Historia",
    blurb: "Dawne czasy",
    art: "assets/art/przedmiot-historia.svg",
    status: "soon",
  },
];

export function findSubject(id) {
  return subjects.find((subject) => subject.id === id) || null;
}

export function findModule(subject, moduleId) {
  return subject?.modules?.find((module) => module.id === moduleId) || null;
}

export function readyModules(subject) {
  return (subject.modules || []).filter((module) => module.status !== "soon");
}
