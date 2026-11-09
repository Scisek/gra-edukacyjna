/* Ortografia dla szkoły podstawowej.
   band 1: ó/u, band 2: rz/ż, band 3: ch/h, band 4: słowa mieszane.
   W znaczeniu nie ma poprawnego zapisu, żeby nie podpowiadać odpowiedzi.
   Podpowiedź (hint) pokazujemy dopiero po odpowiedzi. */

function w(id, correct, wrong, meaning, band, hint) {
  return { id, correct, wrong, meaning, band, hint };
}

export const words = [
  w("krol", "król", ["krul"], "władca kraju", 1, "Król piszemy przez ó. To słowo warto zapamiętać."),
  w("gora", "góra", ["gura"], "wysokie wzniesienie", 1, "Górę piszemy przez ó."),
  w("roza", "róża", ["ruża"], "kwiat o kolcach", 1, "Różę piszemy przez ó."),
  w("stol", "stół", ["stul"], "mebel, przy którym się je", 1, "Piszemy ó, bo w wyrazie pokrewnym słychać o: stół – stoły."),
  w("sol", "sól", ["sul"], "biała przyprawa do zupy", 1, "Piszemy ó, bo w wyrazie pokrewnym słychać o: sól – solić."),
  w("mroz", "mróz", ["mruz"], "bardzo mocny chłód zimą", 1, "Piszemy ó, bo w wyrazie pokrewnym słychać o: mróz – mrozić."),
  w("woz", "wóz", ["wuz"], "dawny pojazd na kołach", 1, "Piszemy ó, bo w wyrazie pokrewnym słychać o: wóz – wozy."),
  w("kura", "kura", ["kóra"], "ptak, który znosi jajka", 1, "Kurę piszemy przez u."),
  w("but", "but", ["bót"], "obuwie na jedną stopę", 1, "But piszemy przez u."),
  w("mur", "mur", ["mór"], "ściana z cegieł", 1, "Mur piszemy przez u."),
  w("kubek", "kubek", ["kóbek"], "naczynie do picia", 1, "Kubek piszemy przez u."),
  w("duzy", "duży", ["dóży"], "mający spore rozmiary", 1, "Duży piszemy przez u."),
  w("ul", "ul", ["ól"], "domek pszczół", 1, "Ul piszemy przez u."),
  w("buk", "buk", ["bók"], "drzewo o gładkiej, szarej korze", 1, "Buk piszemy przez u."),
  w("cukier", "cukier", ["cókier"], "słodka sypka przyprawa do herbaty", 1, "Cukier piszemy przez u."),
  w("rura", "rura", ["róra"], "długi kanał, którym leci woda", 1, "Rurę piszemy przez u."),

  w("rzeka", "rzeka", ["żyka", "żeka"], "duży naturalny ciek wody", 2, "Na początku słowa piszemy rz: rzeka."),
  w("morze", "morze", ["może", "moze"], "wielka słona woda", 2, "Piszemy rz: morze. Słowo „może” znaczy co innego."),
  w("drzewo", "drzewo", ["dżewo", "drzevo"], "duża roślina z pniem i gałęziami", 2, "Po spółgłosce piszemy rz: drzewo."),
  w("brzeg", "brzeg", ["bżeg", "brzek"], "miejsce, gdzie woda spotyka ląd", 2, "Po spółgłosce piszemy rz: brzeg."),
  w("grzyb", "grzyb", ["gżib", "grzib"], "leśny owocnik z kapeluszem", 2, "Po spółgłosce piszemy rz: grzyb."),
  w("krzeslo", "krzesło", ["kzesło", "krzeslo"], "mebel do siedzenia z oparciem", 2, "Po spółgłosce piszemy rz: krzesło."),
  w("orzech", "orzech", ["ożech", "orzeh"], "twardy owoc w skorupce", 2, "Piszemy rz: orzech."),
  w("zaba", "żaba", ["rzaba", "zaba"], "zielone zwierzę, które skacze i kumka", 2, "Żabę zapamiętujemy z ż."),
  w("lyzka", "łyżka", ["łyrzka", "lyzka"], "sztuciec do zupy", 2, "Łyżkę zapamiętujemy z ż."),
  w("jez", "jeż", ["jerz", "jez"], "małe zwierzę pokryte kolcami", 2, "Jeża zapamiętujemy z ż."),
  w("plaza", "plaża", ["plarza", "plaza"], "piaszczysty pas nad wodą", 2, "Plażę zapamiętujemy z ż."),
  w("wieza", "wieża", ["wierza", "wieza"], "wysoka budowla, na przykład na zamku", 2, "Wieżę zapamiętujemy z ż."),
  w("ksiazka", "książka", ["ksiarzka", "ksiazka"], "zbiór zszytych kartek z tekstem", 2, "Książkę zapamiętujemy z ż."),
  w("wazka", "ważka", ["warzka", "wazka"], "owad o dwóch parach długich skrzydeł", 2, "Ważkę zapamiętujemy z ż."),
  w("druzyna", "drużyna", ["drurzyna", "druzyna"], "grupa osób grających razem", 2, "Piszemy ż, bo w rodzinie tego słowa jest g: drugi – drużyna."),
  w("uwazaj", "uważaj", ["uwarzaj", "uwazaj"], "bądź ostrożny", 2, "Piszemy ż, bo w rodzinie tego słowa jest g: uwaga – uważaj."),

  w("chleb", "chleb", ["hleb", "chlep"], "wypiek z mąki, krojony na kromki", 3, "W tym polskim słowie piszemy ch: chleb."),
  w("choinka", "choinka", ["hoinka", "choynka"], "ozdobione drzewko na święta", 3, "Piszemy ch: choinka."),
  w("chmura", "chmura", ["hmura", "czmura"], "biały lub szary obłok na niebie", 3, "Piszemy ch: chmura."),
  w("dach", "dach", ["dah", "dax"], "górne przykrycie budynku", 3, "Piszemy ch: dach."),
  w("ucho", "ucho", ["uho", "uchó"], "narząd słuchu z boku głowy", 3, "Piszemy ch: ucho."),
  w("mucha", "mucha", ["muha", "muxa"], "mały latający owad", 3, "Piszemy ch: mucha."),
  w("chlopiec", "chłopiec", ["hłopiec", "chlopiec"], "dziecko płci męskiej", 3, "Piszemy ch: chłopiec."),
  w("chomik", "chomik", ["homik", "chommik"], "małe zwierzątko trzymane czasem w klatce", 3, "Piszemy ch: chomik."),
  w("kuchnia", "kuchnia", ["kuhnia", "kuchna"], "pomieszczenie, w którym gotujemy", 3, "Piszemy ch: kuchnia."),
  w("schody", "schody", ["shody", "schodi"], "stopnie prowadzące na piętro", 3, "Piszemy ch: schody."),
  w("herbata", "herbata", ["cherbata", "erbata"], "ciepły napój zaparzany z liści", 3, "To słowo przyszło z innego języka — piszemy h: herbata."),
  w("halas", "hałas", ["chałas", "halas"], "głośne, nieprzyjemne dźwięki", 3, "Piszemy h: hałas."),
  w("historia", "historia", ["chistoria", "hystoria"], "opowieść o dawnych wydarzeniach", 3, "Piszemy h: historia."),
  w("hotel", "hotel", ["chotel", "hótel"], "budynek, w którym nocują goście", 3, "Piszemy h: hotel."),
  w("bohater", "bohater", ["bochater", "bohatr"], "osoba, która robi coś odważnego", 3, "Piszemy h: bohater."),
  w("helikopter", "helikopter", ["chelikopter", "helikoptr"], "maszyna, która lata dzięki wirnikowi", 3, "Piszemy h: helikopter."),

  w("burza", "burza", ["bórza", "burża"], "gwałtowna ulewa z piorunami", 4, "Burzę piszemy przez u oraz rz."),
  w("zolw", "żółw", ["żułw", "zółw"], "zwierzę noszące własną skorupę", 4, "Żółwia piszemy przez ż oraz ó."),
  w("tchurz", "tchórz", ["tchurz", "tchórż"], "leśne zwierzę podobne do łasicy", 4, "Tchórza piszemy przez ó oraz rz."),
  w("brzuch", "brzuch", ["bżuch", "brzuh"], "część ciała poniżej klatki piersiowej", 4, "Brzuch piszemy przez rz oraz ch."),
  w("chrzaszcz", "chrząszcz", ["hrząszcz", "chżąszcz"], "owad w twardym pancerzu", 4, "Chrząszcza piszemy przez ch oraz rz."),
  w("zarowka", "żarówka", ["zarówka", "żarufka"], "szklana bańka, która daje światło", 4, "Żarówkę piszemy przez ż oraz ó."),
  w("jaskolka", "jaskółka", ["jaskułka", "jaskulka"], "ptak lepzący gniazdo z błota", 4, "Jaskółkę piszemy przez ó."),
  w("olowek", "ołówek", ["olówek", "ółówek"], "cienki patyczek do rysowania", 4, "Ołówek piszemy przez ó."),
  w("bobr", "bóbr", ["bubr", "bobr"], "zwierzę, które buduje tamy z gałęzi", 4, "Piszemy ó, bo w wyrazie pokrewnym słychać o: bóbr – bobra."),
  w("zrodlo", "źródło", ["zródło", "zrudło"], "miejsce, z którego wypływa woda", 4, "Źródło piszemy przez ź oraz ó."),
  w("pozno", "późno", ["póżno", "puzno"], "o czasie, gdy robi się już noc", 4, "Późno piszemy przez ó oraz ź."),
  w("przyjaciel", "przyjaciel", ["przyjciel", "przjaciel"], "ktoś bliski i zaufany", 4, "Przyjaciela piszemy przez rz."),
  w("orzel", "orzeł", ["ożel", "orzel"], "duży ptak drapieżny", 4, "Orła piszemy przez rz."),
  w("ogrod", "ogród", ["ogrud", "ógród"], "kwiaty i grządki przy domu", 4, "Piszemy ó, bo w wyrazie pokrewnym słychać o: ogród – ogrody."),
  w("pokoj", "pokój", ["pokuj", "pókuj"], "osobna izba do spania albo zabawy", 4, "Piszemy ó, bo w wyrazie pokrewnym słychać o: pokój – pokoje."),
  w("skora", "skóra", ["skura", "skora"], "okrycie ciała człowieka albo zwierzęcia", 4, "Skórę piszemy przez ó."),
  w("mrowka", "mrówka", ["mrufka", "mrowka"], "mały pracowity owad", 4, "Piszemy ó, bo w wyrazie pokrewnym słychać o: mrówka – mrowisko."),
  w("pudelko", "pudełko", ["pódełko", "pudelko"], "kartonowe opakowanie", 4, "Pudełko piszemy przez u."),
  w("lustro", "lustro", ["lóstro", "lustró"], "tafla, w której widać odbicie", 4, "Lustro piszemy przez u."),
  w("duch", "duch", ["dóch", "duh"], "bajkowa postać, która straszy", 4, "Ducha piszemy przez u oraz ch."),
  w("podroz", "podróż", ["podrórz", "podruż"], "wyprawa w dalekie miejsce", 4, "Podróż: ż, bo droga – podróż, a w środku jest ó."),
];

export function wordById(id) {
  return words.find((word) => word.id === id) || null;
}
