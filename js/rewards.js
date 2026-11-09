import { isTestProfile } from "./storage.js";

/* Wspólne nagrody profilu.
   PIECES to liczba fragmentów jednej wyspy.
   Siatka w CSS (.puzzle) jest 3 × 2, więc przy zmianie liczby
   fragmentów trzeba też poprawić css/app.css. */

export const PIECES = 6;

export const ISLANDS = [
  {
    id: "geografia",
    title: "Wyspa geografii",
    text: "Dobre rundy z flag i stolic odsłaniają kolejne kawałki.",
    map: "assets/maps/wyspa-geografia.svg",
    treasureArt: "assets/art/skarb-kompas.svg",
    treasure: "Kompas podróżnika",
  },
  {
    id: "polski",
    title: "Wyspa słów",
    text: "Ortografia dokłada fragmenty wyspy języka.",
    map: "assets/maps/wyspa-slowa.svg",
    treasureArt: "assets/art/skarb-pioro.svg",
    treasure: "Złote pióro",
  },
  {
    id: "matematyka",
    title: "Wyspa liczb",
    text: "Działania matematyczne odkrywają wyspę liczb.",
    map: "assets/maps/wyspa-liczby.svg",
    treasureArt: "assets/art/skarb-klejnot.svg",
    treasure: "Klejnot liczb",
  },
];

export const FINAL_TREASURE = {
  title: "Korona wiedzy",
  art: "assets/art/skarb-korona.svg",
  text: "Odkryj wszystkie trzy wyspy, a wielki skarb się otworzy.",
};

export function piecesOf(profile, islandId) {
  if (isTestProfile(profile)) return PIECES;
  return profile?.rewards?.pieces?.[islandId] ?? 0;
}

export function mapTotal(profile) {
  return ISLANDS.reduce((sum, island) => sum + piecesOf(profile, island.id), 0);
}

export function islandComplete(profile, islandId) {
  return piecesOf(profile, islandId) >= PIECES;
}

export function allIslandsComplete(profile) {
  return ISLANDS.every((island) => islandComplete(profile, island.id));
}

export function grantPiece(profile, islandId) {
  const have = piecesOf(profile, islandId);
  if (have >= PIECES) return { granted: false, complete: true, have };
  profile.rewards.pieces[islandId] = have + 1;
  return { granted: true, complete: have + 1 >= PIECES, have: have + 1 };
}
