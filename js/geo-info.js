import { countryById } from "./data/countries.js";

const poland = countryById("pl");

export function peopleText(count) {
  if (count < 10000) return `około ${count.toLocaleString("pl-PL")}`;
  if (count < 1000000) return `około ${Math.round(count / 1000).toLocaleString("pl-PL")} tys.`;
  if (count < 1000000000) {
    const millions = count / 1000000;
    const text = millions >= 100
      ? String(Math.round(millions))
      : millions.toFixed(1).replace(".", ",").replace(",0", "");
    return `około ${text} mln`;
  }
  const billions = (count / 1000000000).toFixed(2).replace(".", ",").replace(/0$/, "").replace(/,$/, "");
  return `około ${billions} mld`;
}

export function areaText(area) {
  if (area < 1) return `${String(area).replace(".", ",")} km²`;
  return `${Math.round(area).toLocaleString("pl-PL")} km²`;
}

function niceTimes(value) {
  if (value < 1.35) return "";
  if (value < 1.75) return "półtora raza";
  if (value < 100) return `${Math.round(value)} razy`;
  return `${Math.round(value / 10) * 10} razy`;
}

export function sizeText(country) {
  if (country.id === "pl") return "to Polska — inne kraje porównujemy właśnie do niej";
  const ratio = country.area / poland.area;
  if (ratio >= 0.9 && ratio <= 1.1) return "mniej więcej tyle, co Polska";
  if (ratio > 1) {
    const times = niceTimes(ratio);
    if (!times) return "trochę większy niż Polska";
    return `około ${times} tyle, co Polska`;
  }
  const times = niceTimes(1 / ratio);
  if (!times) return "trochę mniejszy niż Polska";
  return `około ${times} mniejszy niż Polska`;
}
