import { el, plural } from "./dom.js";
import { avatarById, AVATARS } from "./avatars.js";
import {
  app,
  closeModal,
  go,
  nextQuestion,
  openModal,
  pickAnswer,
  startRound,
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
  storageWorks,
  totalStars,
} from "./storage.js";
import { findModule, findSubject, subjects } from "./registry.js";
import { resultHeadline, unlockedIndex } from "./progress.js";
import {
  allIslandsComplete,
  FINAL_TREASURE,
  ISLANDS,
  mapTotal,
  PIECES,
  piecesOf,
} from "./rewards.js";
import { topMisses } from "./review.js";
import { countryById } from "./data/countries.js";
import { areaText, peopleText, sizeText } from "./geo-info.js";

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
  else if (route.name === "subject" || route.name === "maps") go("home");
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
  return el("header", { class: "topbar" }, [
    el("div", { class: "topbar__inner" }, [brandButton(), switcher()]),
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
    const pieces = mapTotal(profile);
    const maxPieces = ISLANDS.length * PIECES;
    return el("article", { class: current ? "profile-card is-current" : "profile-card" }, [
      el("button", {
        type: "button",
        class: "profile-card__play",
        onClick: () => switchTo(profile.id),
      }, [
        avatarImg(profile.avatar, "avatar avatar-lg"),
        el("span", { class: "profile-card__name", text: profile.name }),
        el("span", { class: "profile-card__meta", text: current ? "Teraz gra" : "Kliknij, aby grać" }),
        el("span", { class: "profile-card__meta", text: `★ ${totalStars(profile)} · mapa ${pieces}/${maxPieces}` }),
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
    el("p", { class: "lede", text: "Każde dziecko ma własne gwiazdki, poziomy i mapę skarbów. Wyniki zostają w tej przeglądarce. Profil Rodzic tylko podgląda grę." }),
    hasPlayers ? profileCards() : el("img", { class: "hero-art", src: "assets/art/wyprawa.svg", alt: "" }),
    parentCard(),
    el("button", {
      type: "button",
      class: "btn btn-primary btn-block",
      onClick: () => {
      app.formError = "";
      app.draft = { name: "", avatar: "" };
      go("create");
    },
    }, "Nowy gracz"),
  ]);
}

function viewCreate() {
  const draft = app.draft || { name: "", avatar: "" };
  const form = el("form", {
    class: "stack",
    onSubmit: (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const selected = form.querySelector(".avatar-pick.is-selected");
      app.draft = { name: input.value, avatar: selected?.dataset.avatar || "" };
      const error = nameError(input.value);
      if (error || !selected) {
        app.formError = error || "Wybierz obrazek.";
        go("create");
        return;
      }
      app.formError = "";
      app.draft = { name: "", avatar: "" };
      createProfile(cleanName(input.value), selected.dataset.avatar);
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
    el("div", { class: "subject-grid" }, subjects.map((subject) => {
      const soon = subject.status === "soon";
      const pieces = piecesOf(profile, subject.id);
      const modules = (subject.modules || []).filter((module) => module.status !== "soon").length;
      const body = [
        el("span", { class: "tile__art" }, [el("img", { src: subject.art, alt: "" })]),
        el("span", { class: "tile__body" }, [
          el("span", { class: "tile__title", text: subject.title }),
          el("span", { class: "tile__blurb", text: subject.blurb }),
          soon
            ? el("span", { class: "badge", text: "wkrótce" })
            : el("span", { class: "tile__meta", text: `${modules} ${plural(modules, "moduł", "moduły", "modułów")} · mapa ${pieces}/${PIECES}` }),
        ]),
      ];
      if (soon) return el("div", { class: "tile is-soon", "aria-disabled": "true" }, body);
      return el("button", {
        type: "button",
        class: "tile",
        onClick: () => go("subject", { subjectId: subject.id }),
      }, body);
    })),
    el("button", {
      type: "button",
      class: "btn btn-ghost btn-block map-link",
      onClick: () => go("maps"),
    }, `Mapy i skarby · ${mapTotal(profile)}/${ISLANDS.length * PIECES}`),
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
        el("span", { class: "tile__meta", text: `Otwarte poziomy: ${open} z ${module.levels.length}` }),
      ]);
    })),
  ]);
}

function viewLevels() {
  const subject = findSubject(app.route.subjectId);
  const module = findModule(subject, app.route.moduleId);
  const profile = activeProfile();
  if (!subject || !module || module.status === "soon" || !profile) return viewHome();
  const unlocked = unlockedIndex(profile, subject.id, module.id);
  return screen([
    back(subject.title, () => go("subject", { subjectId: subject.id })),
    el("h1", { text: module.title }),
    el("p", { class: "lede", text: module.blurb }),
    el("p", { class: "hint", text: isTestProfile(profile)
      ? "Tryb testowy: wszystkie poziomy są otwarte, a wynik się nie zapisuje."
      : "Dwie gwiazdki odblokowują kolejny poziom i dokładają fragment mapy." }),
    el("div", { class: "level-list" }, module.levels.map((level, index) => {
      const locked = index > unlocked;
      const testing = isTestProfile(profile);
      const best = testing ? null : profile.best[`${subject.id}/${module.id}/${level.id}`];
      const previous = module.levels[index - 1];
      return el("article", { class: locked ? "level is-locked" : "level" }, [
        el("div", {}, [
          el("h2", { text: level.title }),
          el("p", { text: level.detail }),
          testing
            ? el("p", { class: "tile__meta", text: "Bez zapisu" })
            : best
              ? el("p", { class: "tile__meta", text: `Najlepiej: ${best.correct}/${best.total}` })
              : el("p", { class: "tile__meta", text: "Jeszcze bez wyniku" }),
          testing ? null : best ? stars(best.stars) : stars(0),
          !locked && best ? el("p", { class: "hint", text: "Możesz grać ten poziom ponownie." }) : null,
          locked ? el("p", { class: "hint", text: `Zdobyj 2 gwiazdki na poziomie ${previous.title}.` }) : null,
        ]),
        el("button", {
          type: "button",
          class: "btn btn-primary",
          disabled: locked,
          onClick: () => startRound(subject.id, module.id, index),
        }, locked ? "Zablokowany" : best ? "Zagraj ponownie" : "Graj"),
      ]);
    })),
  ]);
}

function figureBlock(figure) {
  if (!figure) return null;
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
  const quizClass = "quiz";
  const question = round.questions[round.index];
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
    figureBlock(question.figure),
    country && hintLevel >= 1 ? el("p", { class: "hint-line", text: `Kontynent: ${country.continent}` }) : null,
    el("div", { class: odd ? "choices is-odd" : "choices" }, visibleOptions.map((option) => {
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
  const { stars: earned, total, improved, justUnlocked, reward, test } = round.result;
  const subject = findSubject(round.subjectId);
  const module = findModule(subject, round.moduleId);
  const nextIndex = round.levelIndex + 1;
  const hasNext = nextIndex < module.levels.length && unlockedIndex(profile, subject.id, module.id) >= nextIndex;
  let rewardText = "Dwie gwiazdki odsłaniają fragment mapy.";
  if (test) rewardText = "Tryb testowy — ten wynik nie jest zapisywany.";
  else if (reward.granted && reward.complete) rewardText = `Wyspa odkryta. Skarb: ${ISLANDS.find((island) => island.id === subject.id)?.treasure || "skarb"}.`;
  else if (reward.granted) rewardText = `Zdobywasz fragment mapy. Masz ${reward.have} z ${PIECES}.`;
  else if (earned >= 2) rewardText = "Ta wyspa jest już odkryta.";
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
      el("button", { type: "button", class: "btn btn-ghost btn-block", onClick: () => go("maps") }, "Mapy i skarby"),
      el("button", {
        type: "button",
        class: "btn btn-quiet btn-block",
        onClick: () => go("levels", { subjectId: subject.id, moduleId: module.id }),
      }, "Wróć do poziomów"),
    ]),
  ], "screen--narrow");
}

function puzzle(src, opened) {
  const cells = [];
  for (let index = 0; index < PIECES; index += 1) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const open = index < opened;
    const cell = el("div", {
      class: open ? "puzzle__cell is-open" : "puzzle__cell is-locked",
      style: `--col:${col};--row:${row}`,
    });
    if (open) cell.append(el("img", { src, alt: "" }));
    else cell.append(el("span", { class: "puzzle__lock", text: String(index + 1) }));
    cells.push(cell);
  }
  return el("div", { class: "puzzle", "aria-hidden": "true" }, [
    el("img", { class: "puzzle__base", src, alt: "" }),
    ...cells,
  ]);
}

function viewMaps() {
  const profile = activeProfile();
  if (!profile) return viewProfiles();
  const done = allIslandsComplete(profile);
  return screen([
    back("Przedmioty", () => go("home")),
    el("h1", { text: "Mapy i skarby" }),
    el("p", { class: "lede", text: isTestProfile(profile)
      ? "Podgląd pełnych map. W trybie testowym nic nie dopisujemy do zapisu."
      : "Za rundę z co najmniej dwiema gwiazdkami odkrywasz jeden fragment wyspy tego przedmiotu." }),
    el("div", { class: "map-list" }, ISLANDS.map((island) => {
      const have = piecesOf(profile, island.id);
      const complete = have >= PIECES;
      return el("article", { class: "map-card" }, [
        el("h2", { text: island.title }),
        el("p", { text: island.text }),
        puzzle(island.map, have),
        el("p", { class: "tile__meta", text: complete ? "Wyspa odkryta" : `Fragmenty: ${have} z ${PIECES}` }),
        complete
          ? el("figure", { class: "treasure" }, [
            el("img", { src: island.treasureArt, alt: "" }),
            el("figcaption", { text: island.treasure }),
          ])
          : null,
      ]);
    })),
    el("article", { class: done ? "final-card" : "final-card is-locked" }, [
      el("img", { src: FINAL_TREASURE.art, alt: "" }),
      el("h2", { text: FINAL_TREASURE.title }),
      el("p", { text: done ? "Trzy wyspy odkryte. Korona wiedzy jest twoja." : FINAL_TREASURE.text }),
    ]),
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
      el("p", {}, [el("strong", { text: `${mapTotal(profile)}/${ISLANDS.length * PIECES}` }), " mapy"]),
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
      el("p", { class: "hint", text: "Postępy to gwiazdki, poziomy i mapy. Pamięć odpowiedzi to tylko to, które pytania wracają częściej." }),
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
    ? `Znikną gwiazdki, poziomy i mapa gracza ${profile.name}. Pamięć pytań zostaje, więc trudniejsze słowa i kraje nadal będą wracać.`
    : kind === "memory"
      ? `Gra ${profile.name} znowu pokaże wszystkie pytania tak samo często. Gwiazdki, poziomy i mapa zostają.`
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

export function renderApp() {
  const route = app.route.name;
  let main = viewHome();
  if (route === "profiles") main = viewProfiles();
  else if (route === "create") main = viewCreate();
  else if (route === "home") main = viewHome();
  else if (route === "subject") main = viewSubject();
  else if (route === "levels") main = viewLevels();
  else if (route === "quiz") main = viewQuiz();
  else if (route === "results") main = viewResults();
  else if (route === "maps") main = viewMaps();
  else if (route === "stats") main = viewStats();
  const shell = el("div", { class: "shell" }, [header(), main]);
  const dialog = modal();
  if (dialog) shell.append(dialog);
  return shell;
}
