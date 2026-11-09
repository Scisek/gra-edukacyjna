/* Kraje i stolice po polsku.
   band: 1 łatwy, 2 średni, 3 trudny (mistrz korzysta ze wszystkich).
   note pojawia się po odpowiedzi przy stolicach, o które łatwo się pomylić.
   like łączy podobne flagi na poziomie Mistrz. */

function c(code, name, capital, region, band, extra = {}) {
  return {
    id: code,
    code,
    name,
    capital,
    region,
    band,
    like: extra.like || "",
    note: extra.note || "",
  };
}

export const countries = [
  c("pl", "Polska", "Warszawa", "europa", 1, { like: "redwhite" }),
  c("de", "Niemcy", "Berlin", "europa", 1),
  c("fr", "Francja", "Paryż", "europa", 1),
  c("es", "Hiszpania", "Madryt", "europa", 1),
  c("it", "Włochy", "Rzym", "europa", 1, { like: "vert" }),
  c("gb", "Wielka Brytania", "Londyn", "europa", 1),
  c("ua", "Ukraina", "Kijów", "europa", 1),
  c("cz", "Czechy", "Praga", "europa", 1),
  c("sk", "Słowacja", "Bratysława", "europa", 1),
  c("hu", "Węgry", "Budapeszt", "europa", 1),
  c("se", "Szwecja", "Sztokholm", "europa", 1, { like: "nordic" }),
  c("no", "Norwegia", "Oslo", "europa", 1, { like: "nordic" }),
  c("gr", "Grecja", "Ateny", "europa", 1),
  c("at", "Austria", "Wiedeń", "europa", 1),
  c("pt", "Portugalia", "Lizbona", "europa", 1),
  c("tr", "Turcja", "Ankara", "azja", 1, {
    note: "Stolicą Turcji jest Ankara, a nie Stambuł.",
  }),
  c("us", "Stany Zjednoczone", "Waszyngton", "ameryka", 1, {
    note: "Stolicą Stanów Zjednoczonych jest Waszyngton, a nie Nowy Jork.",
  }),
  c("cn", "Chiny", "Pekin", "azja", 1),
  c("jp", "Japonia", "Tokio", "azja", 1),
  c("br", "Brazylia", "Brasília", "ameryka", 1, {
    note: "Stolicą Brazylii jest Brasília, a nie Rio de Janeiro.",
  }),
  c("eg", "Egipt", "Kair", "afryka", 1),
  c("au", "Australia", "Canberra", "oceania", 1, {
    like: "ocean",
    note: "Stolicą Australii jest Canberra, a nie Sydney.",
  }),
  c("ca", "Kanada", "Ottawa", "ameryka", 1, {
    note: "Stolicą Kanady jest Ottawa, a nie Toronto.",
  }),
  c("ru", "Rosja", "Moskwa", "europa", 1),

  c("nl", "Holandia", "Amsterdam", "europa", 2, {
    like: "benelux",
    note: "Stolicą Holandii jest Amsterdam, a nie Haga.",
  }),
  c("be", "Belgia", "Bruksela", "europa", 2, { like: "benelux" }),
  c("ch", "Szwajcaria", "Berno", "europa", 2, {
    note: "Stolicą Szwajcarii jest Berno.",
  }),
  c("dk", "Dania", "Kopenhaga", "europa", 2, { like: "nordic" }),
  c("fi", "Finlandia", "Helsinki", "europa", 2, { like: "nordic" }),
  c("ie", "Irlandia", "Dublin", "europa", 2, { like: "vert" }),
  c("ro", "Rumunia", "Bukareszt", "europa", 2),
  c("bg", "Bułgaria", "Sofia", "europa", 2),
  c("hr", "Chorwacja", "Zagrzeb", "europa", 2),
  c("lt", "Litwa", "Wilno", "europa", 2),
  c("lv", "Łotwa", "Ryga", "europa", 2),
  c("ee", "Estonia", "Tallinn", "europa", 2),
  c("by", "Białoruś", "Mińsk", "europa", 2),
  c("mx", "Meksyk", "Meksyk", "ameryka", 2, {
    note: "Stolica Meksyku nazywa się tak samo jak kraj: Meksyk.",
  }),
  c("ar", "Argentyna", "Buenos Aires", "ameryka", 2),
  c("in", "Indie", "Nowe Delhi", "azja", 2, {
    note: "Stolicą Indii jest Nowe Delhi.",
  }),
  c("kr", "Korea Południowa", "Seul", "azja", 2),
  c("za", "RPA", "Pretoria", "afryka", 2, {
    note: "Pretoria jest stolicą administracyjną RPA. RPA to skrót od Republika Południowej Afryki.",
  }),
  c("ma", "Maroko", "Rabat", "afryka", 2, {
    note: "Stolicą Maroka jest Rabat, a nie Casablanca.",
  }),
  c("nz", "Nowa Zelandia", "Wellington", "oceania", 2, {
    like: "ocean",
    note: "Stolicą Nowej Zelandii jest Wellington, a nie Auckland.",
  }),
  c("th", "Tajlandia", "Bangkok", "azja", 2),
  c("vn", "Wietnam", "Hanoi", "azja", 2),
  c("sa", "Arabia Saudyjska", "Rijad", "azja", 2),
  c("is", "Islandia", "Reykjavík", "europa", 2, { like: "nordic" }),

  c("rs", "Serbia", "Belgrad", "europa", 3),
  c("si", "Słowenia", "Lublana", "europa", 3),
  c("ba", "Bośnia i Hercegowina", "Sarajewo", "europa", 3),
  c("al", "Albania", "Tirana", "europa", 3),
  c("mk", "Macedonia Północna", "Skopje", "europa", 3),
  c("me", "Czarnogóra", "Podgorica", "europa", 3),
  c("md", "Mołdawia", "Kiszyniów", "europa", 3),
  c("cy", "Cypr", "Nikozja", "europa", 3),
  c("mt", "Malta", "Valletta", "europa", 3),
  c("lu", "Luksemburg", "Luksemburg", "europa", 3, {
    like: "benelux",
    note: "Stolica Luksemburga nazywa się tak samo jak kraj.",
  }),
  c("cl", "Chile", "Santiago", "ameryka", 3),
  c("pe", "Peru", "Lima", "ameryka", 3),
  c("co", "Kolumbia", "Bogota", "ameryka", 3),
  c("cu", "Kuba", "Hawana", "ameryka", 3),
  c("ng", "Nigeria", "Abudża", "afryka", 3, {
    note: "Stolicą Nigerii jest Abudża, a nie Lagos.",
  }),
  c("ke", "Kenia", "Nairobi", "afryka", 3),
  c("et", "Etiopia", "Addis Abeba", "afryka", 3),
  c("tz", "Tanzania", "Dodoma", "afryka", 3, {
    note: "Stolicą Tanzanii jest Dodoma.",
  }),
  c("dz", "Algieria", "Algier", "afryka", 3),
  c("tn", "Tunezja", "Tunis", "afryka", 3),
  c("ir", "Iran", "Teheran", "azja", 3),
  c("id", "Indonezja", "Dżakarta", "azja", 3, { like: "redwhite" }),
  c("ph", "Filipiny", "Manila", "azja", 3),
  c("my", "Malezja", "Kuala Lumpur", "azja", 3, {
    note: "Stolicą Malezji jest Kuala Lumpur.",
  }),
  c("kz", "Kazachstan", "Astana", "azja", 3, {
    note: "Stolicą Kazachstanu jest Astana.",
  }),
  c("ae", "Emiraty Arabskie", "Abu Zabi", "azja", 3, {
    note: "Stolicą jest Abu Zabi. Pełna nazwa kraju to Zjednoczone Emiraty Arabskie.",
  }),
  c("sg", "Singapur", "Singapur", "azja", 3, {
    note: "Singapur jest miastem-państwem: kraj i stolica mają tę samą nazwę.",
  }),
  c("mn", "Mongolia", "Ułan Bator", "azja", 3),
  c("af", "Afganistan", "Kabul", "azja", 3),
  c("ge", "Gruzja", "Tbilisi", "azja", 3),
];

export function countryById(id) {
  return countries.find((country) => country.id === id) || null;
}
