import { cities, voiById, VOIVODESHIPS } from "../data/poland.js";
import { recallWeight, weightedPick } from "../util.js";

const GROUPS = ["", "Łatwy", "Średni", "Trudny", "Mistrz"];

const MIN_POP = {
  1: [380000, 180000, 100000, 80000],
  2: [55000, 40000, 30000, 22000],
  3: [18000, 14000, 10000, 0],
  4: [0, 0, 0, 0],
};

function pool(level) {
  const step = Math.min(4, Math.max(1, level.step || 1)) - 1;
  const tier = level.tier || 1;
  if (level.adult) {
    if (tier <= 1) return cities.filter((city) => city.pop >= 180000);
    if (tier === 2) return cities.filter((city) => city.pop >= 80000);
    if (tier === 3) return cities.filter((city) => city.pop >= 20000);
    return cities.filter((city) => city.pop < 120000);
  }
  const min = MIN_POP[tier][step];
  return cities.filter((city) => city.pop >= min);
}

function usePin(level) {
  return (level.tier || 1) >= 3;
}

function radiusKm(level) {
  const tier = level.tier || 1;
  const step = level.step || 1;
  if (level.adult) {
    if (tier <= 2) return 90;
    if (tier === 3) return 60;
    return 26;
  }
  if (tier >= 4) return step >= 3 ? 22 : 32;
  return 48;
}

export function cityPool(level) {
  return pool(level);
}

function takeCity(level, used, memory) {
  let bag = pool(level).filter((city) => !used.has(city.id));
  if (bag.length < 4) bag = pool(level);
  return weightedPick(bag, (city) => recallWeight(memory?.[`pl:${city.id}`]));
}

function cityByName(name) {
  return cities.find((city) => city.name === name) || null;
}

function mapQuestion(level, used, memory, place, prompt, note, key) {
  used.add(place.id);
  const voi = voiById(place.voi);
  const pin = usePin(level);
  return {
    key,
    prompt,
    figure: {
      type: "pl-map",
      tap: true,
      mode: pin ? "pin" : "region",
      text: place.name,
      lat: place.lat,
      lon: place.lon,
      radiusKm: radiusKm(level),
    },
    options: VOIVODESHIPS.map((item) => ({ id: item.id, label: item.title })),
    correctId: place.voi,
    correctLabel: voi.title,
    note,
    review: `${place.name} → ${voi.title}`,
    cityId: place.id,
    pin: pin ? { lat: place.lat, lon: place.lon, radiusKm: radiusKm(level) } : null,
  };
}

function questionPlace(level, used, memory) {
  const city = takeCity(level, used, memory);
  const prompt = usePin(level) ? "Stuknij, gdzie leży to miasto" : "Gdzie leży to miasto?";
  return mapQuestion(level, used, memory, city, prompt, city.fact, `pl:${city.id}`);
}

function capitalTasks() {
  const tasks = [];
  for (const voi of VOIVODESHIPS) {
    const seat = cityByName(voi.seat);
    const assembly = cityByName(voi.assembly);
    if (!seat) continue;
    if (voi.seat === voi.assembly) {
      tasks.push({
        id: voi.id,
        place: seat,
        prompt: `Gdzie leży stolica województwa ${voi.name}?`,
        note: `${voi.seat} jest stolicą województwa ${voi.name}. ${seat.fact}`,
      });
    } else if (assembly) {
      tasks.push({
        id: `${voi.id}-woj`,
        place: seat,
        prompt: `Gdzie urzęduje wojewoda województwa ${voi.name}?`,
        note: `Wojewoda urzęduje w ${voi.seat}, a sejmik zbiera się w ${voi.assembly}.`,
      });
      tasks.push({
        id: `${voi.id}-sejm`,
        place: assembly,
        prompt: `Gdzie zbiera się sejmik województwa ${voi.name}?`,
        note: `Sejmik zbiera się w ${voi.assembly}, a wojewoda urzęduje w ${voi.seat}.`,
      });
    }
  }
  return tasks;
}

const CAPITALS = capitalTasks();

function questionCapital(level, used, memory) {
  let bag = CAPITALS.filter((task) => !used.has(task.id));
  if (!bag.length) bag = CAPITALS;
  const dual = bag.filter((task) => task.id.includes("-"));
  if ((level.tier || 1) >= 3 && dual.length && Math.random() < 0.65) bag = dual;
  const task = weightedPick(bag, (item) => recallWeight(memory?.[`plcap:${item.id}`]));
  const prompt = usePin(level) ? task.prompt.replace("Gdzie", "Stuknij, gdzie") : task.prompt;
  return mapQuestion(level, used, memory, task.place, prompt, task.note, `plcap:${task.id}`);
}

export function makePolandVoiQuestion(level, used, memory) {
  return questionPlace(level, used, memory);
}

export function makePolandCapitalQuestion(level, used, memory) {
  return questionCapital(level, used, memory);
}

export function makePolandCityQuestion(level, used, memory) {
  return questionPlace(level, used, memory);
}

export function makePolandMixQuestion(level, used, memory) {
  return Math.random() < 0.45 ? questionCapital(level, used, memory) : questionPlace(level, used, memory);
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
  return steps((tier) => (tier === 1 ? "Największe miasta, stuknij województwo" : tier === 2 ? "Coraz mniejsze miasta" : "Stuknij przybliżone miejsce"));
}

export function polandCapitalLevels() {
  return steps((tier) => (tier < 3 ? "Stolice na mapie" : "Dokładniej, także dwie stolice"));
}

export function polandCityLevels() {
  return steps((tier) => (tier <= 2 ? "Miasta od największych" : "Mniejsze miasta, bliżej punktu"));
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
