/* Rejestr przedmiotów i modułów.
   Nowy moduł: dodaj plik w js/modules/ (pytania) i js/data/ (dane), potem jedną linijkę importu tutaj.
   Przedmiot „Geografia – państwa” ma id geografia-panstwa. Stare zapisy z id „geografia” są przenoszone przy wczytaniu.
   Moduł gry potrzebuje id, title, blurb, levels i makeQuestion(level, used).
   Poziom: id, title, band, questions, options, seconds, detail.
   makeQuestion zwraca { key, prompt, figure, options, correctId, correctLabel, note, review }.
   figure: { type: "image", src, alt } | { type: "title"|"equation"|"meaning", text }. */

import { makeCapitalQuestion, makeCountryQuestion, makeFlagQuestion, makeGeoMixQuestion, geographyExamLevels, geographyLevels } from "./modules/geography.js";
import { makeSpellingMixQuestion, makeSpellingQuestion, spellingExamLevels, spellingLevels } from "./modules/spelling.js";
import { makeAddSubQuestion, makeMathMixQuestion, makeMathQuestion, mathExamLevels, mathLevels } from "./modules/math.js";
import { makePolandCapitalQuestion, makePolandCityQuestion, makePolandMixQuestion, makePolandVoiQuestion, polandCapitalLevels, polandCityLevels, polandExamLevels, polandVoiLevels } from "./modules/poland.js";

function mathModule(id, title, blurb) {
  return {
    id,
    title,
    blurb,
    status: "ready",
    role: "nauka",
    levels: mathLevels(id),
    makeQuestion: (level, used) => makeMathQuestion(id, level, used),
  };
}

export const subjects = [
  {
    id: "geografia-panstwa",
    title: "Geografia – państwa",
    blurb: "Flagi, kraje i stolice świata",
    art: "assets/art/przedmiot-geografia.svg",
    status: "ready",
    modules: [
      {
        id: "flagi",
        title: "Flagi",
        blurb: "Rozpoznaj kraj po fladze",
        status: "ready",
        role: "nauka",
        levels: geographyLevels(),
        makeQuestion: makeFlagQuestion,
      },
      {
        id: "stolice",
        title: "Stolice",
        blurb: "Wskaż stolicę kraju",
        status: "ready",
        role: "nauka",
        levels: geographyLevels(),
        makeQuestion: makeCapitalQuestion,
      },
      {
        id: "panstwa",
        title: "Państwa",
        blurb: "Wskaż kraj po stolicy",
        status: "ready",
        role: "nauka",
        levels: geographyLevels(),
        makeQuestion: makeCountryQuestion,
      },
      {
        id: "mix",
        title: "Mix",
        blurb: "Egzamin: flaga, stolica albo kraj",
        status: "ready",
        role: "egzamin",
        levels: geographyExamLevels(),
        makeQuestion: makeGeoMixQuestion,
      },
    ],
  },
  {
    id: "geografia-polska",
    title: "Geografia – Polska",
    blurb: "Miasta i województwa",
    art: "assets/art/przedmiot-geografia.svg",
    status: "ready",
    modules: [
      {
        id: "wojewodztwa",
        title: "Województwa",
        blurb: "W którym województwie leży miasto",
        status: "ready",
        role: "nauka",
        levels: polandVoiLevels(),
        makeQuestion: makePolandVoiQuestion,
      },
      {
        id: "stolice",
        title: "Stolice",
        blurb: "Stolice województw, także te podwójne",
        status: "ready",
        role: "nauka",
        levels: polandCapitalLevels(),
        makeQuestion: makePolandCapitalQuestion,
      },
      {
        id: "miasta",
        title: "Miasta",
        blurb: "Które miasto i w której stronie województwa",
        status: "ready",
        role: "nauka",
        levels: polandCityLevels(),
        makeQuestion: makePolandCityQuestion,
      },
      {
        id: "mix",
        title: "Mix",
        blurb: "Egzamin z miast i województw",
        status: "ready",
        role: "egzamin",
        levels: polandExamLevels(),
        makeQuestion: makePolandMixQuestion,
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
        blurb: "Nauka luk: ó/u, rz/ż, ch/h, ą/om, ę/en",
        status: "ready",
        role: "nauka",
        levels: spellingLevels(),
        makeQuestion: makeSpellingQuestion,
      },
      {
        id: "mix",
        title: "Mix",
        blurb: "Egzamin ze wszystkich zasad",
        status: "ready",
        role: "egzamin",
        levels: spellingExamLevels(),
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
        blurb: "Nauka plusa i minusa, bez wyniku mniejszego od zera",
        status: "ready",
        role: "nauka",
        levels: mathLevels("dodawanie-odejmowanie"),
        makeQuestion: makeAddSubQuestion,
      },
      mathModule("mnozenie", "Mnożenie", "Tabliczka mnożenia i większe iloczyny"),
      mathModule("dzielenie", "Dzielenie", "Tylko działania, które wychodzą bez reszty"),
      {
        id: "mix",
        title: "Mix",
        blurb: "Egzamin ze wszystkich działań",
        status: "ready",
        role: "egzamin",
        levels: mathExamLevels(),
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
