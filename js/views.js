import { el, plural } from "./dom.js";
import {
  app,
  closeModal,
  go,
  nextQuestion,
  openModal,
  pickAnswer,
  pickMapPoint,
  startRound,
  startTraining,
  switchTo,
  useHint,
} from "./actions.js";
import {
  activeProfile,
  cleanName,
  createProfile,
  deleteProfile,
  isTestProfile,
  nameError,
  PARENT_ID,
  profiles,
  resetMemory,
  resetProfile,
  setAvatar,
  storageWorks,
  totalStars,
} from "./storage.js";
import { findModule, findSubject, subjects } from "./registry.js";
import { isAdult, presentLevel } from "./audience.js";
import { canPlayLevel, examTierOpen, resultHeadline, trainingOpen, unlockedIndex } from "./progress.js";
import { AVATARS, avatarById, avatarNeedsChoice, collectionForAvatar } from "./avatars.js";
import { artFor, collectionById, rarityOf } from "./data/breeds.js";
import { creditFor } from "./data/photo-credits.js";
import { badgesOf, earnedBreeds, playerLevelOf, xpInto, xpToNext } from "./xp.js";
import { topMisses } from "./review.js";
import { countryById } from "./data/countries.js";
import { VOIVODESHIPS } from "./data/poland.js";
import { MAP_BOX, project, REGIONS, unproject } from "./data/poland-map.js";
import { areaText, peopleText, sizeText } from "./geo-info.js";

function creditLine(collectionId, breedId) {
  const credit = creditFor(collectionId, breedId);
  if (!credit) return null;
  return el("p", { class: "credit", text: `Zdjęcie: ${credit.author}. ${credit.license}.` });
}

function avatarImg(id, className) {
  const avatar = avatarById(id);
  return el("img", { class: className || "avatar", src: avatar.src, alt: "" });
}

function stars(count) {
  const row = el("span", { class: "stars", "aria-label": `${count} z 3 gwiazdek` });
  for (let index = 0; index < 3; index += 1) {
    const on = index < count;
    row.append(el("img", {
      class: on ? "star is-on" : "star",
      src: on ? "assets/art/gwiazda.svg" : "assets/art/gwiazda-pusta.svg",
      alt: "",
    }));
  }
  return row;
}

function brandButton() {
  return el("button", {
    class: "brand",
    type: "button",
    onClick: () => go(activeProfile() ? "home" : "profiles"),
  }, [
    el("img", { class: "brand__mark", src: "assets/art/znak.svg", alt: "" }),
    el("span", { class: "brand__name", text: "Skarby wiedzy" }),
  ]);
}

function xpBar(profile) {
  const level = playerLevelOf(profile);
  const into = xpInto(profile);
  const need = xpToNext(level);
  const pct = Math.max(0, Math.min(100, Math.round((into / need) * 100)));
  return el("div", { class: "xp" }, [
    el("span", { class: "xp__level", text: `Poziom gracza ${level}` }),
    el("span", { class: "xp__track", "aria-hidden": "true" }, [
      el("span", { class: "xp__fill", style: `width:${pct}%` }),
    ]),
    el("span", { class: "xp__count", text: `${into}/${need} XP` }),
  ]);
}

function goBack() {
  const route = app.route;
  const round = app.round;
  if (route.name === "quiz" || route.name === "results") {
    go("levels", {
      subjectId: round?.subjectId || route.subjectId,
      moduleId: round?.moduleId || route.moduleId,
    });
    return;
  }
  if (route.name === "levels") go("subject", { subjectId: route.subjectId });
  else if (route.name === "subject" || route.name === "collection") go("home");
  else if (route.name === "theme") go("home");
  else if (route.name === "stats" || route.name === "create") go("profiles");
  else go("home");
}

function playerChip(profile) {
  const testing = isTestProfile(profile);
  const onHome = app.route.name === "home";
  return el(onHome ? "button" : "div", {
    type: onHome ? "button" : null,
    class: `chip is-current${testing ? " is-test" : ""}`,
    "aria-label": onHome ? `Zmień gracza, teraz ${profile.name}` : null,
    onClick: onHome ? () => go("profiles") : null,
  }, [
    avatarImg(profile.avatar, "avatar avatar-sm"),
    el("span", { class: "chip__name", text: profile.name }),
    testing ? el("span", { class: "test-flag", text: "test" }) : null,
  ]);
}

function switcher() {
  const current = activeProfile();
  if (!current || app.route.name === "profiles" || app.route.name === "create") return null;
  const inGame = app.route.name !== "home";
  return el("div", { class: "switcher" }, [
    playerChip(current),
    inGame ? el("button", {
      type: "button",
      class: "back-mini",
      "aria-label": "Wróć",
      onClick: goBack,
    }, "←") : null,
  ]);
}

function header() {
  const profile = activeProfile();
  const showXp = profile && app.route.name !== "quiz" && app.route.name !== "profiles" && app.route.name !== "create";
  return el("header", { class: "topbar" }, [
    el("div", { class: "topbar__inner" }, [brandButton(), switcher()]),
    showXp ? xpBar(profile) : null,
  ]);
}

function screen(children, extra = "") {
  return el("main", { class: `screen ${extra}`.trim() }, children);
}

function back(label, action) {
  return el("button", { type: "button", class: "btn btn-quiet", onClick: action }, label);
}

function storageNote() {
  if (storageWorks()) return null;
  return el("p", { class: "banner is-bad", role: "status", text: "Nie udało się zapisać postępów w tej przeglądarce." });
}

function parentCard() {
  const current = isTestProfile(activeProfile());
  return el("article", { class: current ? "profile-card is-test is-current" : "profile-card is-test" }, [
    el("button", {
      type: "button",
      class: "profile-card__play",
      onClick: () => switchTo(PARENT_ID),
    }, [
      avatarImg("rodzic", "avatar avatar-lg"),
      el("span", { class: "badge", text: "Tryb testowy" }),
      el("span", { class: "profile-card__name", text: "Rodzic" }),
      el("span", { class: "profile-card__meta", text: current ? "Teraz gra" : "Do sprawdzania całej gry" }),
      el("span", { class: "profile-card__meta", text: "Wszystko odblokowane · nic się nie zapisuje" }),
    ]),
  ]);
}

function profileCards() {
  return el("div", { class: "profile-grid" }, profiles().map((profile) => {
    const current = profile.id === activeProfile()?.id;
    const collection = collectionById(collectionForAvatar(profile.avatar));
    const have = earnedBreeds(profile, collection.id).length;
    return el("article", { class: current ? "profile-card is-current" : "profile-card" }, [
      el("button", {
        type: "button",
        class: "profile-card__play",
        onClick: () => switchTo(profile.id),
      }, [
        avatarImg(profile.avatar, "avatar avatar-lg"),
        el("span", { class: "profile-card__name", text: profile.name }),
        el("span", { class: "profile-card__meta", text: current ? "Teraz gra" : "Kliknij, aby grać" }),
        el("span", { class: "profile-card__meta", text: `Poziom ${playerLevelOf(profile)} · ${collection.title} ${have}/${collection.breeds.length}` }),
      ]),
      el("button", {
        type: "button",
        class: "btn btn-quiet",
        onClick: () => go("stats", { profileId: profile.id }),
      }, "Postępy"),
    ]);
  }));
}

function viewProfiles() {
  const hasPlayers = profiles().length > 0;
  return screen([
    el("p", { class: "kicker", text: "Jedno urządzenie, kilka osób" }),
    el("h1", { text: hasPlayers ? "Kto dzisiaj gra?" : "Załóż profil gracza" }),
    el("p", { class: "lede", text: "Każde dziecko ma własne gwiazdki, poziomy i kolekcję ras. Wyniki zostają w tej przeglądarce. Profil Rodzic tylko podgląda grę." }),
    hasPlayers ? profileCards() : el("img", { class: "hero-art", src: "assets/art/wyprawa.svg", alt: "" }),
    parentCard(),
    el("button", {
      type: "button",
      class: "btn btn-primary btn-block",
      onClick: () => {
      app.formError = "";
      app.draft = { name: "", avatar: "", audience: "dziecko" };
      go("create");
    },
    }, "Nowy gracz"),
  ]);
}

function viewCreate() {
  const draft = app.draft || { name: "", avatar: "", audience: "dziecko" };
  const form = el("form", {
    class: "stack",
    onSubmit: (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const selected = form.querySelector(".avatar-pick.is-selected");
      const audience = form.querySelector(".audience-pick.is-selected")?.dataset.audience || "dziecko";
      app.draft = { name: input.value, avatar: selected?.dataset.avatar || "", audience };
      const error = nameError(input.value);
      if (error || !selected) {
        app.formError = error || "Wybierz obrazek.";
        go("create");
        return;
      }
      app.formError = "";
      app.draft = { name: "", avatar: "", audience: "dziecko" };
      createProfile(cleanName(input.value), selected.dataset.avatar, audience);
      go("home");
    },
  }, [
    el("label", { class: "field", for: "imie" }, [
      el("span", { text: "Jak masz na imię?" }),
      el("input", {
        id: "imie",
        name: "imie",
        maxlength: "16",
        autocomplete: "off",
        enterkeyhint: "done",
        value: draft.name,
        "data-focus": app.formError ? false : "true",
      }),
    ]),
    app.formError ? el("p", { class: "form-error", role: "alert", tabindex: "-1", "data-focus": "true", text: app.formError }) : null,
    el("p", { class: "field-label", text: "Kto gra?" }),
    el("div", { class: "row" }, ["dziecko", "dorosly"].map((id) => el("button", {
      type: "button",
      class: (draft.audience || "dziecko") === id ? "btn btn-primary audience-pick is-selected" : "btn btn-ghost audience-pick",
      "data-audience": id,
      onClick: (event) => {
        form.querySelectorAll(".audience-pick").forEach((button) => {
          button.classList.remove("is-selected", "btn-primary");
          button.classList.add("btn-ghost");
        });
        event.currentTarget.classList.add("is-selected", "btn-primary");
        event.currentTarget.classList.remove("btn-ghost");
        app.draft = { ...app.draft, audience: id, name: form.querySelector("input").value };
      },
    }, id === "dziecko" ? "Dziecko" : "Dorosły"))),
    el("p", { class: "hint", text: "Dorosły zaczyna od trudniejszych pytań. Obrazek wybiera kolekcję nagród." }),
    el("p", { class: "field-label", text: "Wybierz obrazek" }),
    el("div", { class: "avatar-grid" }, AVATARS.map((avatar) => el("button", {
      type: "button",
      class: avatar.id === draft.avatar ? "avatar-pick is-selected" : "avatar-pick",
      "data-avatar": avatar.id,
      "aria-pressed": avatar.id === draft.avatar ? "true" : "false",
      onClick: (event) => {
        form.querySelectorAll(".avatar-pick").forEach((button) => {
          button.classList.remove("is-selected");
          button.setAttribute("aria-pressed", "false");
        });
        event.currentTarget.classList.add("is-selected");
        event.currentTarget.setAttribute("aria-pressed", "true");
        app.draft = { ...app.draft, avatar: avatar.id, name: form.querySelector("input").value };
      },
    }, [
      el("img", { src: avatar.src, alt: "" }),
      el("span", { text: avatar.label }),
      el("small", { text: `Zbiera: ${avatar.collects}` }),
    ]))),
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, "Zaczynamy"),
  ]);
  return screen([
    back("Wróć", () => {
      app.formError = "";
      app.draft = { name: "", avatar: "" };
      go("profiles");
    }),
    el("h1", { text: "Nowy gracz" }),
    el("p", { class: "lede", text: "Imię i obrazek wystarczą. Później można wyczyścić postępy albo usunąć profil." }),
    form,
  ], "screen--narrow");
}

function viewHome() {
  const profile = activeProfile();
  if (!profile) return viewProfiles();
  return screen([
    storageNote(),
    el("p", { class: "kicker", text: "Wybierz, czego dziś się uczysz" }),
    el("h1", { text: `Witaj, ${profile.name}` }),
    isAdult(profile) ? el("p", { class: "hint", text: "Tryb dorosły: od razu trudniejsze pytania." }) : null,
    el("div", { class: "subject-grid" }, subjects.map((subject) => {
      const soon = subject.status === "soon";
      const modules = (subject.modules || []).filter((module) => module.status !== "soon").length;
      const body = [
        el("span", { class: "tile__art" }, [el("img", { src: subject.art, alt: "" })]),
        el("span", { class: "tile__body" }, [
          el("span", { class: "tile__title", text: subject.title }),
          el("span", { class: "tile__blurb", text: subject.blurb }),
          soon
            ? el("span", { class: "badge", text: "wkrótce" })
            : el("span", { class: "tile__meta", text: `${modules} ${plural(modules, "moduł", "moduły", "modułów")}` }),
        ]),
      ];
      if (soon) return el("div", { class: "tile is-soon", "aria-disabled": "true", "data-subject": subject.id }, body);
      return el("button", {
        type: "button",
        class: "tile",
        "data-subject": subject.id,
        onClick: () => go("subject", { subjectId: subject.id }),
      }, body);
    })),
    el("button", {
      type: "button",
      class: "btn btn-primary btn-block map-link",
      onClick: () => go("collection"),
    }, "Kolekcja ras"),
  ]);
}

function viewSubject() {
  const subject = findSubject(app.route.subjectId);
  if (!subject || subject.status === "soon") return viewHome();
  return screen([
    back("Przedmioty", () => go("home")),
    el("h1", { text: subject.title }),
    el("p", { class: "lede", text: subject.blurb }),
    el("div", { class: "module-list" }, subject.modules.map((module) => {
      if (module.status === "soon") {
        return el("div", { class: "module-card is-soon" }, [
          el("h2", { text: module.title }),
          el("p", { text: module.blurb }),
          el("span", { class: "badge", text: "wkrótce" }),
        ]);
      }
      const unlocked = unlockedIndex(activeProfile(), subject.id, module.id);
      const open = Math.min(module.levels.length, unlocked + 1);
      return el("button", {
        type: "button",
        class: "module-card",
        onClick: () => go("levels", { subjectId: subject.id, moduleId: module.id }),
      }, [
        el("h2", { text: module.title }),
        el("p", { text: module.blurb }),
        el("span", { class: module.role === "egzamin" ? "badge badge-exam" : "badge", text: module.role === "egzamin" ? "Egzamin" : "Nauka" }),
        el("span", { class: "tile__meta", text: `Otwarte podpoziomy: ${open} z ${module.levels.length}` }),
      ]);
    })),
  ]);
}

function viewLevels() {
  const subject = findSubject(app.route.subjectId);
  const module = findModule(subject, app.route.moduleId);
  const profile = activeProfile();
  if (!subject || !module || module.status === "soon" || !profile) return viewHome();
  const exam = module.role === "egzamin";
  const groups = [];
  for (const level of module.levels) {
    const last = groups[groups.length - 1];
    if (!last || last.tier !== level.tier) groups.push({ tier: level.tier, title: level.group, levels: [level] });
    else last.levels.push(level);
  }
  return screen([
    back(subject.title, () => go("subject", { subjectId: subject.id })),
    el("p", { class: exam ? "kicker kicker-exam" : "kicker", text: exam ? "Egzamin" : "Nauka" }),
    el("h1", { text: module.title }),
    el("p", { class: "lede", text: module.blurb }),
    el("p", { class: "hint", text: isTestProfile(profile)
      ? "Tryb testowy: wszystko jest otwarte, a wynik się nie zapisuje."
      : exam
        ? "Egzamin otwiera się po nauce tego poziomu. Dwie gwiazdki na całym poziomie dają odznakę. XP dostajesz tak samo jak w nauce."
        : "Dwie gwiazdki otwierają kolejny podpoziom. Każda runda dodaje XP. Nowa rasa czeka, gdy pasek się zapełni." }),
    ...groups.map((group) => {
      const gate = exam && !examTierOpen(profile, subject, group.tier);
      return el("section", { class: "level-group" }, [
        el("h2", { class: "level-group__title" }, [
          group.title,
          gate ? el("span", { class: "badge", text: "po nauce" }) : null,
        ]),
        el("div", { class: "level-tiles" }, group.levels.map((level) => {
          const index = module.levels.indexOf(level);
          const open = canPlayLevel(profile, subject, module, index);
          const shown = presentLevel(profile, level, subject.id);
          const best = isTestProfile(profile) ? null : profile.best[`${subject.id}/${module.id}/${level.id}`];
          return el("button", {
            type: "button",
            class: open ? "level-tile" : "level-tile is-locked",
            disabled: !open,
            onClick: () => startRound(subject.id, module.id, index),
          }, [
            el("span", { class: "level-tile__id", text: level.title }),
            best ? stars(best.stars) : stars(0),
            el("span", { class: "level-tile__detail", text: open ? (best ? "Zagraj ponownie" : String(shown.detail || "").split("·")[0]) : "Zablokowany" }),
          ]);
        })),
      ]);
    }),
    trainingOpen(profile, subject, module) ? el("button", {
      type: "button",
      class: "btn btn-ghost btn-block",
      onClick: () => startTraining(subject.id, module.id),
    }, "Trening · powtórka pomyłek") : el("p", { class: "hint", text: "Trening odblokuje się po pierwszej rundzie ostatniego podpoziomu." }),
  ]);
}

const MAP_LABEL = {
  "zachodniopomorskie": [78, 92],
  "pomorskie": [186, 78],
  "warminsko-mazurskie": [276, 82],
  "podlaskie": [338, 140],
  "lubuskie": [68, 176],
  "wielkopolskie": [148, 172],
  "kujawsko-pomorskie": [208, 156],
  "mazowieckie": [278, 164],
  "lubelskie": [338, 214],
  "dolnoslaskie": [66, 262],
  "opolskie": [138, 264],
  "lodzkie": [200, 248],
  "slaskie": [142, 338],
  "swietokrzyskie": [202, 322],
  "malopolskie": [190, 392],
  "podkarpackie": [286, 360],
};

function polandMap(figure, question, round) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${MAP_BOX.width} ${MAP_BOX.height}`);
  svg.setAttribute("class", "pl-map");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Mapa Polski");
  const pin = figure.mode === "pin";
  for (const region of REGIONS) {
    const voi = VOIVODESHIPS.find((item) => item.id === region.id);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", region.d);
    const correct = round?.locked && question?.correctId === region.id && !pin;
    const wrong = round?.locked && !pin && round.picked === region.id && question?.correctId !== region.id;
    path.setAttribute("class", `pl-region${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`);
    if (!pin && figure.tap && !round?.locked) path.addEventListener("click", () => pickAnswer(region.id));
    svg.append(path);
    if (voi) {
      const spot = project(voi.lon, voi.lat);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(spot.x));
      text.setAttribute("y", String(spot.y));
      text.setAttribute("class", "pl-label");
      text.textContent = voi.label;
      svg.append(text);
    }
  }
  if (pin && !round?.locked) {
    svg.addEventListener("click", (event) => {
      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * MAP_BOX.width;
      const y = ((event.clientY - rect.top) / rect.height) * MAP_BOX.height;
      const point = unproject(x, y);
      pickMapPoint(point.lat, point.lon);
    });
  }
  if (round?.locked && question?.pin) {
    const answer = project(question.pin.lon, question.pin.lat);
    const mark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    mark.setAttribute("cx", String(answer.x));
    mark.setAttribute("cy", String(answer.y));
    mark.setAttribute("r", "7");
    mark.setAttribute("class", "pl-dot is-answer");
    svg.append(mark);
    if (question.tap) {
      const tap = project(question.tap.lon, question.tap.lat);
      const guess = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      guess.setAttribute("cx", String(tap.x));
      guess.setAttribute("cy", String(tap.y));
      guess.setAttribute("r", "6");
      guess.setAttribute("class", round.picked === question.correctId ? "pl-dot is-hit" : "pl-dot is-miss");
      svg.append(guess);
    }
  }
  const hint = pin
    ? "Stuknij przybliżone miejsce na mapie."
    : "Stuknij województwo.";
  return el("div", { class: "pl-map-wrap" }, [
    el("p", { class: "title-figure", text: figure.text }),
    svg,
    figure.tap && !round?.locked ? el("p", { class: "hint", text: hint }) : null,
    round?.locked && question?.distanceKm != null
      ? el("p", { class: "hint", text: `Odległość od celu: ${question.distanceKm} km. Cel mieści się w ${question.pin.radiusKm} km.` })
      : null,
  ]);
}

function figureBlock(figure, question, round) {
  if (!figure) return null;
  if (figure.type === "pl-map") return polandMap(figure, question, round);
  if (figure.type === "image") {
    return el("div", { class: "flag-frame" }, [
      el("img", { src: figure.src, alt: figure.alt || "" }),
    ]);
  }
  if (figure.type === "equation") return el("p", { class: "equation", text: figure.text });
  if (figure.type === "gap") {
    return el("div", { class: "gap-card" }, [
      el("p", { class: "gap-meaning", text: figure.meaning }),
      el("p", { class: "gap-word" }, [
        figure.before,
        el("span", { class: figure.missing.length > 1 ? "gap gap-wide" : "gap", text: "\u00a0" }),
        figure.after,
      ]),
    ]);
  }
  if (figure.type === "meaning") return el("p", { class: "meaning", text: figure.text });
  return el("p", { class: "title-figure", text: figure.text });
}

function factCard(country) {
  return el("section", { class: "fact-card" }, [
    el("p", { class: "fact-card__title", text: country.name }),
    el("p", { text: `${country.continent} · ${areaText(country.area)} · ${sizeText(country)}` }),
    el("p", { text: `Ludność: ${peopleText(country.population)}` }),
    el("p", { class: "fact-card__fact", text: country.fact }),
  ]);
}

function viewQuiz() {
  const round = app.round;
  const profile = activeProfile();
  if (!round || !profile) return viewHome();
  const question = round.questions[round.index];
  const quizClass = question?.figure?.type === "pl-map" ? "quiz quiz-map" : "quiz";
  const subject = findSubject(round.subjectId);
  const module = findModule(subject, round.moduleId);
  const hintLevel = round.hintLevels?.[round.index] || 0;
  const country = question.countryId ? countryById(question.countryId) : null;
  const visibleOptions = question.options.filter((option) => !(question.hiddenIds || []).includes(option.id));
  const odd = visibleOptions.length % 2 === 1;
  return screen([
    el("div", { class: "quiz-top" }, [
      el("p", { class: "kicker", text: `${module.title} · ${round.level.title}` }),
      el("p", { class: "quiz-count", text: `Pytanie ${round.index + 1} z ${round.questions.length}` }),
      el("p", { class: "quiz-count", text: `Dobrze: ${round.correct}` }),
    ]),
    round.level.seconds ? el("div", { class: "timer", "data-timer": "true" }, [
      el("span", { "data-timer-label": "true", text: `${round.level.seconds} s` }),
      el("div", { class: "timer__track" }, [
        el("span", { "data-timer-bar": "true" }),
      ]),
    ]) : null,
    el("div", { class: "prompt-row" }, [
      country ? el("button", {
        type: "button",
        class: "hint-mini",
        disabled: round.locked || hintLevel >= 2,
        "aria-label": hintLevel === 0 ? "Podpowiedź" : "Jeszcze podpowiedź",
        onClick: useHint,
      }, "?") : el("span", { class: "hint-mini hint-mini--spacer", "aria-hidden": "true" }),
      el("h1", { class: "prompt", text: question.prompt }),
    ]),
    figureBlock(question.figure, question, round),
    country && hintLevel >= 1 ? el("p", { class: "hint-line", text: `Kontynent: ${country.continent}` }) : null,
    question.figure?.tap ? null : el("div", { class: odd ? "choices is-odd" : "choices" }, visibleOptions.map((option) => {
      const correct = round.locked && option.id === question.correctId;
      const wrong = round.locked && round.picked === option.id && option.id !== question.correctId;
      return el("button", {
        type: "button",
        class: `choice${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`,
        "data-choice": option.id,
        disabled: round.locked,
        onClick: () => pickAnswer(option.id),
      }, [
        el("span", { text: option.label }),
        correct ? el("span", { class: "mark", "aria-hidden": "true", text: "✓" }) : null,
        wrong ? el("span", { class: "mark", "aria-hidden": "true", text: "✕" }) : null,
      ]);
    })),
    round.locked ? el("div", {
      class: round.picked === question.correctId && !round.timedOut ? "banner is-good" : "banner is-bad",
      role: "status",
    }, [
      el("p", {}, [
        el("strong", { text: round.timedOut ? "Czas minął." : round.picked === question.correctId ? round.praise : "Prawie." }),
        document.createTextNode(round.picked === question.correctId && !round.timedOut
          ? ` Poprawnie: ${question.correctLabel}.`
          : ` Poprawna odpowiedź: ${question.correctLabel}.`),
      ]),
      question.note ? el("p", { class: "note", text: question.note }) : null,
      el("button", { type: "button", class: "btn btn-primary btn-block", onClick: nextQuestion }, round.index + 1 >= round.questions.length ? "Zobacz wynik" : "Dalej"),
    ]) : null,
    round.locked && country ? factCard(country) : null,
  ], quizClass);
}

function viewResults() {
  const round = app.round;
  const profile = activeProfile();
  if (!round?.result || !profile) return viewHome();
  const { stars: earned, total, improved, justUnlocked, test, xp, badges } = round.result;
  const subject = findSubject(round.subjectId);
  const module = findModule(subject, round.moduleId);
  const nextIndex = round.levelIndex + 1;
  const hasNext = !round.level.training && nextIndex < module.levels.length && canPlayLevel(profile, subject, module, nextIndex);
  const breedLine = (xp?.breeds || []).map((breed) => breed.name).join(", ");
  const badgeLine = (badges || []).map((badge) => badge.title).join(", ");
  let rewardText = test
    ? "Tryb testowy — ten wynik nie jest zapisywany."
    : `+${xp?.amount || 0} XP. Pasek rośnie tak samo w nauce i w egzaminie.`;
  if (!test && xp?.leveled && breedLine) rewardText = `Poziom gracza ${xp.level}! Nowa rasa: ${breedLine}.`;
  else if (!test && xp?.leveled) rewardText = `Poziom gracza ${xp.level}! W tej kolekcji masz już wszystkie rasy.`;
  if (!test && badgeLine) rewardText = `${rewardText} Odznaka: ${badgeLine}.`;
  return screen([
    el("p", { class: "kicker", text: `${subject.title} · ${module.title} · ${round.level.title}` }),
    el("h1", { text: resultHeadline(earned) }),
    el("div", { class: "result-score" }, [
      stars(earned),
      el("p", { class: "equation equation--result", text: `${round.correct} z ${total}` }),
      !test && improved ? el("p", { class: "hint", text: "Nowy rekord na tym poziomie." }) : null,
      !test && justUnlocked ? el("p", { class: "hint", text: `Odblokowano poziom ${module.levels[nextIndex].title}.` }) : null,
      el("p", { class: "lede", text: rewardText }),
      round.result.hints ? el("p", { class: "hint", text: `Podpowiedzi: ${round.result.hints}. Każda obniża wynik o ćwierć pytania.` }) : null,
    ]),
    round.review.length ? el("section", { class: "review" }, [
      el("h2", { text: "Warto zapamiętać" }),
      el("ul", {}, round.review.map((line) => el("li", { text: line }))),
    ]) : el("p", { class: "hint", text: "Bez pomyłek w tej rundzie." }),
    el("div", { class: "stack" }, [
      el("button", {
        type: "button",
        class: "btn btn-primary btn-block",
        onClick: () => startRound(subject.id, module.id, round.levelIndex),
      }, "Zagraj jeszcze raz"),
      hasNext ? el("button", {
        type: "button",
        class: "btn btn-ghost btn-block",
        onClick: () => startRound(subject.id, module.id, nextIndex),
      }, `Poziom ${module.levels[nextIndex].title}`) : null,
      el("button", { type: "button", class: "btn btn-ghost btn-block", onClick: () => go("collection") }, "Kolekcja"),
      el("button", {
        type: "button",
        class: "btn btn-quiet btn-block",
        onClick: () => go("levels", { subjectId: subject.id, moduleId: module.id }),
      }, "Wróć do poziomów"),
    ]),
  ], "screen--narrow");
}

function viewCollection() {
  const profile = activeProfile();
  if (!profile) return viewProfiles();
  const collection = collectionById(collectionForAvatar(profile.avatar));
  const owned = new Set(earnedBreeds(profile, collection.id));
  const picked = collection.breeds.find((breed) => breed.id === app.breed) || null;
  const badges = badgesOf(profile).filter((badge) => !isTestProfile(profile) || true);
  const subjectName = { geografia: "Geografia", polski: "Język polski", matematyka: "Matematyka" };
  return screen([
    back("Przedmioty", () => {
      app.breed = null;
      go("home");
    }),
    el("h1", { text: `Kolekcja · ${collection.title}` }),
    el("p", { class: "lede", text: isTestProfile(profile)
      ? "Podgląd całej kolekcji. W trybie testowym nic się nie zapisuje."
      : "Gdy pasek XP się zapełni, dostajesz kolejną rasę. Odznaki spadają za cały poziom egzaminu Mix." }),
    el("p", { class: "tile__meta", text: `${owned.size} z ${collection.breeds.length}` }),
    el("div", { class: "breed-grid" }, collection.breeds.map((breed) => {
      const open = owned.has(breed.id);
      return el("button", {
        type: "button",
        class: `breed-card is-${rarityOf(collection.breeds.indexOf(breed), collection.breeds.length)}${open ? "" : " is-locked"}`,
        onClick: () => {
          if (!open) return;
          app.breed = breed.id;
          go("collection");
        },
      }, [
        el("img", { class: "breed-art", src: artFor(collection.id, breed.id), alt: "" }),
        el("span", { text: open ? breed.name : "???" }),
      ]);
    })),
    picked ? el("article", { class: "breed-detail" }, [
      el("img", { class: "breed-art breed-art--lg", src: artFor(collection.id, picked.id), alt: "" }),
      el("h2", { text: picked.name }),
      el("p", { text: `${collection.labels?.origin || "Pochodzenie"}: ${picked.origin}` }),
      el("p", { text: `${collection.labels?.size || "Wielkość"}: ${picked.size}` }),
      el("p", { text: `${collection.labels?.character || "Charakter"}: ${picked.character}` }),
      el("p", { class: "fact-card__fact", text: picked.fact }),
      creditLine(collection.id, picked.id),
    ]) : null,
    el("button", {
      type: "button",
      class: "btn btn-ghost btn-block",
      onClick: () => go("theme", { profileId: profile.id }),
    }, "Zmień obrazek"),
    el("h2", { text: "Odznaki" }),
    badges.length
      ? el("ul", { class: "badge-list" }, badges.map((badge) => el("li", {}, [
        el("strong", { text: badge.title }),
        el("span", { text: `${badge.moduleTitle || subjectName[badge.subjectId] || badge.subjectId} · ${["", "Łatwy", "Średni", "Trudny", "Mistrz"][badge.tier]}` }),
      ])))
      : el("p", { class: "hint", text: "Ukończ wszystkie podpoziomy jednego poziomu w Mix, z dwiema gwiazdkami na każdym." }),
  ]);
}

function viewStats() {
  const profile = profiles().find((item) => item.id === app.route.profileId) || activeProfile();
  if (!profile || isTestProfile(profile)) return viewProfiles();
  const answered = profile.stats.answered || 0;
  const percent = answered ? Math.round((profile.stats.correct / answered) * 100) : 0;
  const misses = topMisses(profile);
  return screen([
    back("Gracze", () => go("profiles")),
    el("div", { class: "who-line" }, [
      avatarImg(profile.avatar, "avatar avatar-lg"),
      el("h1", { text: profile.name }),
    ]),
    el("div", { class: "stat-grid" }, [
      el("p", {}, [el("strong", { text: String(totalStars(profile)) }), " gwiazdek"]),
      el("p", {}, [el("strong", { text: String(profile.stats.rounds || 0) }), " rund"]),
      el("p", {}, [el("strong", { text: answered ? `${percent}%` : "—" }), " trafień"]),
      el("p", {}, [el("strong", { text: String(playerLevelOf(profile)) }), " poziom"]),
    ]),
    el("h2", { text: "Warto powtórzyć" }),
    misses.length
      ? el("ul", { class: "miss-list" }, misses.map((item) => el("li", {}, [
        item.image ? el("img", { src: item.image, alt: "" }) : null,
        el("span", {}, [
          el("strong", { text: item.title }),
          item.detail ? el("small", { text: item.detail }) : null,
        ]),
        el("em", { text: `${item.count}×` }),
      ])))
      : el("p", { class: "hint", text: "Tu pojawią się kraje, słowa i działania, które wracają najczęściej." }),
    el("div", { class: "stack" }, [
      el("p", { class: "hint", text: "Postępy to gwiazdki, poziomy, XP i kolekcja. Pamięć odpowiedzi to tylko to, które pytania wracają częściej." }),
      el("button", {
        type: "button",
        class: "btn btn-ghost btn-block",
        onClick: () => go("theme", { profileId: profile.id }),
      }, "Zmień obrazek"),
      el("button", {
        type: "button",
        class: "btn btn-ghost btn-block",
        onClick: () => openModal("reset", profile.id),
      }, "Wyczyść postępy"),
      el("button", {
        type: "button",
        class: "btn btn-ghost btn-block",
        onClick: () => openModal("memory", profile.id),
      }, "Wyczyść pamięć odpowiedzi"),
      el("button", {
        type: "button",
        class: "btn btn-quiet btn-block",
        onClick: () => openModal("delete", profile.id),
      }, "Usuń gracza"),
    ]),
  ], "screen--narrow");
}

function modal() {
  if (!app.modal) return null;
  const profile = profiles().find((item) => item.id === app.modal.profileId);
  if (!profile) return null;
  const kind = app.modal.type;
  const title = kind === "reset"
    ? "Wyczyścić postępy?"
    : kind === "memory"
      ? "Wyczyścić pamięć odpowiedzi?"
      : "Usunąć gracza?";
  const body = kind === "reset"
    ? `Znikną gwiazdki, poziomy, XP i kolekcja gracza ${profile.name}. Pamięć pytań zostaje, więc trudniejsze słowa i kraje nadal będą wracać.`
    : kind === "memory"
      ? `Gra ${profile.name} znowu pokaże wszystkie pytania tak samo często. Gwiazdki, poziomy i kolekcja zostają.`
      : `Profil ${profile.name} zniknie z tego urządzenia.`;
  const confirm = kind === "delete" ? "Tak, usuń" : "Tak, wyczyść";
  return el("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title" }, [
    el("div", { class: "modal__card" }, [
      el("h2", { id: "modal-title", text: title }),
      el("p", { text: body }),
      el("div", { class: "row" }, [
        el("button", { type: "button", class: "btn btn-ghost", onClick: closeModal }, "Anuluj"),
        el("button", {
          type: "button",
          class: "btn btn-primary",
          "data-focus": "true",
          onClick: () => {
            if (kind === "reset") resetProfile(profile.id);
            else if (kind === "memory") resetMemory(profile.id);
            else deleteProfile(profile.id);
            app.modal = null;
            go(kind === "memory" ? "stats" : "profiles", kind === "memory" ? { profileId: profile.id } : {});
          },
        }, confirm),
      ]),
    ]),
  ]);
}

function viewTheme() {
  const profile = profiles().find((item) => item.id === app.route.profileId) || activeProfile();
  if (!profile || isTestProfile(profile)) return viewProfiles();
  const forced = avatarNeedsChoice(profile.avatar);
  return screen([
    forced ? null : back("Wróć", () => go(app.route.from || "home")),
    el("h1", { text: forced ? "Wybierz nowy obrazek" : "Zmień obrazek" }),
    el("p", { class: "lede", text: forced
      ? `${profile.name}, ten obrazek nie ma już własnej kolekcji. Wybierz nowy. Poziom i XP zostają. Karty kolekcji dopasują się do liczby awansów.`
      : "Nowy obrazek zmienia kolekcję. Poziom i XP zostają. Odkryte karty to tyle, ile masz awansów." }),
    el("div", { class: "avatar-grid" }, AVATARS.map((avatar) => el("button", {
      type: "button",
      class: "avatar-pick",
      onClick: () => {
        setAvatar(profile.id, avatar.id);
        go("home");
      },
    }, [
      el("img", { src: avatar.src, alt: "" }),
      el("span", { text: avatar.label }),
      el("small", { text: avatar.collects }),
    ]))),
  ], "screen--narrow");
}

export function renderApp() {
  const profile = activeProfile();
  if (profile && !isTestProfile(profile) && avatarNeedsChoice(profile.avatar) && app.route.name !== "theme") {
    app.route = { name: "theme", profileId: profile.id, forced: true };
  }
  const route = app.route.name;
  let main = viewHome();
  if (route === "profiles") main = viewProfiles();
  else if (route === "create") main = viewCreate();
  else if (route === "home") main = viewHome();
  else if (route === "subject") main = viewSubject();
  else if (route === "levels") main = viewLevels();
  else if (route === "quiz") main = viewQuiz();
  else if (route === "results") main = viewResults();
  else if (route === "collection") main = viewCollection();
  else if (route === "theme") main = viewTheme();
  else if (route === "stats") main = viewStats();
  const shell = el("div", { class: "shell" }, [header(), main]);
  const dialog = modal();
  if (dialog) shell.append(dialog);
  return shell;
}
