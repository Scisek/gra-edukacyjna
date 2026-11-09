import { DIRECTIONS, cities, neighborsOf, voiById, VOIVODESHIPS, zoneOf } from "../data/poland.js";
import { pick, recallWeight, shuffle, weightedPick } from "../util.js";

const GROUPS = ["", "Łatwy", "Średni", "Trudny", "Mistrz"];

function pool(level) {
  const minBand = level.adult ? Math.min(3, Math.max(2, level.tier - 1)) : 1;
  const maxBand = level.adult ? 3 : level.band;
  return cities.filter((city) => city.band >= minBand && city.band <= maxBand);
}

function takeCity(level, used, memory) {
  let bag = pool(level).filter((city) => !used.has(city.id));
  if (bag.length < 4) bag = pool(level);
  return weightedPick(bag, (city) => recallWeight(memory?.[`pl:${city.id}`]));
}

function voiOptions(answer, count) {
  const near = shuffle(neighborsOf(answer.voi));
  const rest = shuffle(VOIVODESHIPS.filter((item) => item.id !== answer.voi && !near.includes(item)));
  return [voiById(answer.voi), ...near, ...rest].slice(0, count);
}

function cityOptions(answer, count, sameVoi) {
  const source = cities.filter((city) => city.id !== answer.id && (sameVoi ? city.voi === answer.voi : city.voi !== answer.voi));
  return shuffle([answer, ...shuffle(source).slice(0, count - 1)]);
}

function asVoi(voi) {
  return { id: voi.id, label: voi.title };
}

function asCity(city) {
  return { id: city.id, label: city.name };
}

function questionVoi(level, used, memory) {
  const city = takeCity(level, used, memory);
  used.add(city.id);
  const options = voiOptions(city, level.options).map(asVoi);
  return {
    key: `pl:${city.id}`,
    prompt: "W którym województwie leży to miasto?",
    figure: { type: "title", text: city.name },
    options: shuffle(options),
    correctId: city.voi,
    correctLabel: voiById(city.voi).title,
    note: city.fact,
    review: `${city.name} → ${voiById(city.voi).title}`,
    cityId: city.id,
  };
}

function questionMap(level, used, memory) {
  const city = takeCity(level, used, memory);
  used.add(city.id);
  return {
    key: `pl:${city.id}`,
    prompt: "Stuknij województwo tego miasta",
    figure: { type: "pl-map", tap: true, text: city.name },
    options: VOIVODESHIPS.map(asVoi),
    correctId: city.voi,
    correctLabel: voiById(city.voi).title,
    note: city.fact,
    review: `${city.name} → ${voiById(city.voi).title}`,
    cityId: city.id,
  };
}

function questionCity(level, used, memory) {
  const city = takeCity(level, used, memory);
  used.add(city.id);
  const voi = voiById(city.voi);
  const options = cityOptions(city, level.options, false).map(asCity);
  return {
    key: `pl:${city.id}`,
    prompt: `Które miasto leży w województwie ${voi.name}?`,
    figure: { type: "title", text: voi.title },
    options: shuffle(options),
    correctId: city.id,
    correctLabel: city.name,
    note: city.fact,
    review: `${voi.title} → ${city.name}`,
    cityId: city.id,
  };
}

function questionDirection(level, used, memory) {
  let city = null;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const next = takeCity(level, used, memory);
    if (DIRECTIONS.includes(zoneOf(next))) {
      city = next;
      break;
    }
  }
  if (!city) city = takeCity(level, used, memory);
  used.add(city.id);
  let zone = zoneOf(city);
  if (!DIRECTIONS.includes(zone)) {
    const voi = voiById(city.voi);
    const dy = city.lat - voi.lat;
    const dx = city.lon - voi.lon;
    zone = Math.abs(dy) >= Math.abs(dx) ? (dy >= 0 ? "północ" : "południe") : (dx >= 0 ? "wschód" : "zachód");
  }
  const options = DIRECTIONS.map((label) => ({ id: label, label }));
  return {
    key: `pl:${city.id}`,
    prompt: `Gdzie w województwie ${voiById(city.voi).name} leży to miasto?`,
    figure: { type: "title", text: city.name },
    options: shuffle(options),
    correctId: zone,
    correctLabel: zone,
    note: `${city.fact} To ${zone} województwa.`,
    review: `${city.name} → ${zone}`,
    cityId: city.id,
  };
}

function capitalTasks() {
  const tasks = [];
  for (const voi of VOIVODESHIPS) {
    if (voi.seat === voi.assembly) {
      tasks.push({
        id: voi.id,
        voi,
        answer: voi.seat,
        prompt: `Jaka jest stolica województwa ${voi.name}?`,
        note: `${voi.seat} jest stolicą województwa ${voi.name}.`,
      });
    } else {
      tasks.push({
        id: `${voi.id}-woj`,
        voi,
        answer: voi.seat,
        prompt: `Gdzie urzęduje wojewoda województwa ${voi.name}?`,
        note: `Wojewoda urzęduje w ${voi.seat}, a sejmik zbiera się w ${voi.assembly}. To województwo ma dwie stolice.`,
      });
      tasks.push({
        id: `${voi.id}-sejm`,
        voi,
        answer: voi.assembly,
        prompt: `Gdzie zbiera się sejmik województwa ${voi.name}?`,
        note: `Sejmik zbiera się w ${voi.assembly}, a wojewoda urzęduje w ${voi.seat}. To województwo ma dwie stolice.`,
      });
    }
  }
  return tasks;
}

const CAPITALS = capitalTasks();

function questionCapital(level, used, memory) {
  let bag = CAPITALS.filter((task) => !used.has(task.id));
  if (!bag.length) bag = CAPITALS;
  const hard = bag.filter((task) => task.voi.seat !== task.voi.assembly);
  if ((level.adult || level.tier >= 3) && hard.length && Math.random() < 0.7) bag = hard;
  else if (level.tier === 1) bag = bag.filter((task) => task.voi.seat === task.voi.assembly).concat(bag).slice(0, bag.length);
  const task = weightedPick(bag, (item) => recallWeight(memory?.[`plcap:${item.id}`]));
  used.add(task.id);
  const names = new Set([task.answer]);
  const distract = shuffle(cities.filter((city) => city.band <= 2 && city.name !== task.answer));
  for (const city of distract) {
    if (names.size >= level.options) break;
    names.add(city.name);
  }
  return {
    key: `plcap:${task.id}`,
    prompt: task.prompt,
    figure: { type: "title", text: task.voi.title },
    options: shuffle([...names].slice(0, level.options)).map((name) => ({ id: name, label: name })),
    correctId: task.answer,
    correctLabel: task.answer,
    note: task.note,
    review: `${task.voi.title} → ${task.answer}`,
  };
}

function build(mode, level, used, memory) {
  if (mode === "map") return questionMap(level, used, memory);
  if (mode === "capital") return questionCapital(level, used, memory);
  if (mode === "city") return questionCity(level, used, memory);
  if (mode === "direction") return questionDirection(level, used, memory);
  return questionVoi(level, used, memory);
}

export function makePolandVoiQuestion(level, used, memory) {
  const mode = level.tier >= 3 || level.step % 2 === 0 ? "map" : "voi";
  return build(level.adult && level.tier >= 2 ? "map" : mode, level, used, memory);
}

export function makePolandCapitalQuestion(level, used, memory) {
  return build("capital", level, used, memory);
}

export function makePolandCityQuestion(level, used, memory) {
  const mode = level.tier >= 2 || level.adult ? (level.step % 2 === 0 ? "direction" : "city") : "city";
  return build(mode, level, used, memory);
}

export function makePolandMixQuestion(level, used, memory) {
  const modes = level.adult || level.tier >= 3
    ? ["map", "direction", "capital", "city"]
    : ["voi", "capital", "city", "map"];
  return build(pick(modes), level, used, memory);
}

function steps(detailFor) {
  const rows = [];
  for (let tier = 1; tier <= 4; tier += 1) {
    const count = tier === 4 ? 4 : 4;
    for (let step = 1; step <= count; step += 1) {
      rows.push({
        id: `${tier}-${step}`,
        title: `${tier}.${step}`,
        group: GROUPS[tier],
        tier,
        step,
        band: tier === 4 ? 3 : tier,
        questions: 5,
        options: tier === 1 ? 3 : 4,
        seconds: tier === 4 && step === 4 ? 25 : 0,
        detail: detailFor(tier, step),
      });
    }
  }
  return rows;
}

export function polandVoiLevels() {
  return steps((tier) => (tier === 1 ? "Znane miasta i ich województwa" : tier === 2 ? "Więcej miast, też na mapie" : tier === 3 ? "Mapa Polski" : "Trudniejsze miasta na mapie"));
}

export function polandCapitalLevels() {
  return steps((tier) => (tier < 3 ? "Stolice województw" : "Także województwa z dwiema stolicami"));
}

export function polandCityLevels() {
  return steps((tier) => (tier === 1 ? "Które miasto leży w województwie" : "Strony województwa: północ, południe, wschód, zachód"));
}

export function polandExamLevels() {
  return [1, 2, 3, 4].flatMap((tier) => [1, 2, 3].map((step) => ({
    id: `${tier}-${step}`,
    title: `${tier}.${step}`,
    group: GROUPS[tier],
    tier,
    step,
    band: tier === 4 ? 3 : tier,
    questions: 6,
    options: tier === 1 ? 3 : 4,
    seconds: tier === 4 && step === 3 ? 25 : 0,
    detail: `Egzamin: ${GROUPS[tier].toLowerCase()}`,
  })));
}
