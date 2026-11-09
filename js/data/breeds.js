/* Kolekcje przypisane do obrazka profilu.
   Fakty są krótkie, po polsku i oparte na ogólnie przyjętych danych. */

function item(id, name, origin, size, character, fact) {
  return { id, name, origin, size, character, fact };
}

export const COLLECTIONS = {
  kot: {
    id: "kot",
    title: "Koty",
    labels: { origin: "Pochodzenie", size: "Wielkość", character: "Charakter" },
    badges: ["Właściciel kota", "Trener kotów", "Behawiorysta kotów", "Profesor kociej nauki"],
    breeds: [
      item("brytyjski", "Kot brytyjski krótkowłosy", "Wielka Brytania", "średni lub duży", "spokojny i cierpliwy", "Ma okrągłą buzię i bardzo gęste futro."),
      item("perski", "Kot perski", "Persja, czyli dzisiejszy Iran; rasę rozwijano też w Europie", "duży", "łagodny i cichy", "Długie futro trzeba czesać. Współczesne koty tej rasy mają płaski nosek."),
      item("maine", "Maine coon", "stan Maine w USA", "bardzo duży", "przyjacielski", "To jedna z największych ras. Na uszach ma pędzelki włosów."),
      item("syjamski", "Kot syjamski", "Tajlandia, dawniej Syjam", "średni", "gadatliwy i przywiązany", "Ciało jest jasne, a uszy, łapy i ogon ciemniejsze. Oczy ma niebieskie."),
      item("ragdoll", "Ragdoll", "Kalifornia w USA", "duży", "miękki, gdy się go podniesie", "Nazwa znaczy „szmaciana lalka”: wiele tych kotów wiotczeje na rękach."),
      item("norweski", "Kot norweski leśny", "Norwegia", "duży", "niezależny, ale lubi swoich ludzi", "Grube futro prawie nie przemaka, więc dobrze znosi deszcz i śnieg."),
      item("sfinks", "Sfinks", "Kanada", "średni", "ciepły w obyciu i ciekawski", "Prawie nie ma futra. Rasa powstała w Kanadzie w latach 60. XX wieku."),
      item("bengalski", "Kot bengalski", "Stany Zjednoczone", "średni", "ruchliwy", "Ma cętki jak mały lampart. Rasę ułożono, krzyżując kota domowego z dzikim kotem bengalskim."),
    ],
  },
  pies: {
    id: "pies",
    title: "Psy",
    labels: { origin: "Pochodzenie", size: "Wielkość", character: "Charakter" },
    badges: ["Właściciel psa", "Trener psów", "Behawiorysta psów", "Profesor psiej nauki"],
    breeds: [
      item("labrador", "Labrador retriever", "Nowa Fundlandia w Kanadzie", "duży", "przyjazny i chętny do pracy", "Dawniej pomagał rybakom. Do dziś chętnie wchodzi do wody."),
      item("golden", "Golden retriever", "Szkocja", "duży", "łagodny i cierpliwy", "Złote futro i spokojne usposobienie. Często towarzyszy ludziom w domu."),
      item("owczarek", "Owczarek niemiecki", "Niemcy", "duży", "odważny i lojalny", "Pracuje przy stadzie, w ratownictwie i jako pomocnik człowieka."),
      item("beagle", "Beagle", "Anglia", "średni", "wesoły i ciekawski", "Ma świetny węch i lubi iść za zapachem."),
      item("jamnik", "Jamnik", "Niemcy", "mały, z długim tułowiem", "odważny", "Krótkie łapki pomagały mu wchodzić do nor."),
      item("husky", "Husky syberyjski", "Syberia", "średni lub duży", "energiczny", "To pies zaprzęgowy. Gruba sierść chroni go na mrozie."),
      item("mops", "Mops", "Chiny", "mały", "przylepny i wesoły", "Płaski pyszczek sprawia, że łatwo się przegrzewa. W upał potrzebuje cienia."),
      item("shiba", "Shiba inu", "Japonia", "mały lub średni", "odważny i samodzielny", "Wygląda trochę jak lisek. Bywa głośny, gdy jest niezadowolony."),
    ],
  },
  dino: {
    id: "dino",
    title: "Dinozaury",
    labels: { origin: "Gdzie żył", size: "Wielkość", character: "Jadł" },
    badges: ["Młody paleontolog", "Odkrywca skamieniałości", "Badacz mezozoiku", "Profesor dinozaurów"],
    breeds: [
      item("tyranozaur", "Tyranozaur", "Ameryka Północna, koniec kredy", "około 12 m długości", "mięso", "Miał ogromną czaszkę i bardzo krótkie przednie łapy."),
      item("triceratops", "Triceratops", "Ameryka Północna, koniec kredy", "około 9 m długości", "rośliny", "Trzy rogi i szeroka kostna tarcza z tyłu głowy."),
      item("stegozaur", "Stegozaur", "Ameryka Północna, późna jura", "około 9 m długości", "rośliny", "Na grzbiecie miał kostne płyty, a na ogonie kolce."),
      item("brachiozaur", "Brachiozaur", "Ameryka Północna, późna jura", "bardzo wysoki, ponad 12 m w kłębie", "liście z wysokich drzew", "Przednie nogi były dłuższe niż tylne, więc szyja szła w górę."),
      item("welociraptor", "Welociraptor", "Mongolia, koniec kredy", "około 2 m długości", "mięso", "Był wielkości dużego indyka, nie jak w filmach. Miał pióra."),
      item("ankylozaur", "Ankylozaur", "Ameryka Północna, koniec kredy", "około 6–8 m długości", "rośliny", "Ciało pokrywał pancerz, a ogon kończył się kostną buławą."),
      item("spinozaur", "Spinozaur", "północna Afryka, kreda", "najdłuższy znany drapieżny dinozaur, ponad 14 m", "głównie ryby", "Miał żagiel na grzbiecie i długi pysk. Dużo czasu spędzał przy wodzie."),
      item("diplodok", "Diplodok", "Ameryka Północna, późna jura", "ponad 25 m długości", "rośliny", "Szyja i ogon były wyjątkowo długie. Ogon mógł działać jak bicz."),
    ],
  },
  komputer: {
    id: "komputer",
    title: "Komputery",
    labels: { origin: "Epoka", size: "Rola", character: "Jak działa" },
    badges: ["Młody informatyk", "Serwisant", "Inżynier sprzętu", "Architekt komputerów"],
    breeds: [
      item("cpu8088", "Procesor Intel 8088", "rok 1979, serce IBM PC z 1981 roku", "liczył dużo wolniej niż dzisiejszy telefon", "wykonywał program krok po kroku", "W pierwszym IBM PC taktowano go około 4,77 MHz. Dziś procesory są tysiące razy szybsze."),
      item("dyskietka", "Dyskietka 3,5 cala", "lata 80. i 90. XX wieku", "mieściła zwykle 1,44 MB", "przenosiła pliki między komputerami", "W środku jest miękki krążek magnetyczny. Tyle danych co na niej zajmuje dziś jedno zdjęcie."),
      item("hdd", "Dysk twardy HDD", "od lat 50. XX wieku, w domach od lat 80.", "dużo miejsca na pliki", "kręci magnetycznymi talerzami", "Głowica unosi się nad talerzem i czyta dane. Są ruchome części, więc dysk jest wolniejszy od SSD."),
      item("ram", "Pamięć RAM", "w każdym komputerze od początku", "miejsce na bieżącą pracę", "szybka, ale ulotna", "Trzyma otwarte programy. Po wyłączeniu prądu ta zawartość znika."),
      item("plyta", "Płyta główna", "od pierwszych komputerów osobistych", "łączy części w jedną całość", "po ścieżkach płyną sygnały", "Wpina się w nią procesor, pamięć i karty. Bez niej części nie mogą rozmawiać."),
      item("ssd", "Dysk SSD", "upowszechnił się w XXI wieku", "szybki magazyn plików", "pamięć flash, bez talerzy", "Nie ma ruchomych części, więc system włącza się dużo szybciej niż ze starego dysku."),
      item("cpu", "Procesor wielordzeniowy", "od około 2005 roku w domowych komputerach", "kilka rdzeni w jednej kości", "liczy wiele zadań naraz", "Każdy rdzeń może prowadzić osobny wątek pracy. W jednej kości są miliardy tranzystorów."),
      item("gpu", "Karta graficzna", "osobne układy od lat 80., dzisiejsze GPU są ogromne", "rysuje obraz i liczy równolegle", "tysiące małych rdzeni", "Powstała do gier i obrazu. Dziś pomaga też w uczeniu maszyn, bo liczy ogromną liczbę prostych działań naraz."),
    ],
  },
  gory: {
    id: "gory",
    title: "Szczyty",
    labels: { origin: "Gdzie stoi", size: "Wysokość", character: "Jaki jest" },
    badges: ["Turysta", "Górołaz", "Zdobywca szczytów", "Himalaista"],
    breeds: [
      item("gubalowka", "Gubałówka", "nad Zakopanem, Pogórze Gubałowskie", "około 1126 m n.p.m.", "łagodny grzbiet z widokiem na Tatry", "To popularny spacerowy szczyt. Widać z niego Giewont i Zakopane."),
      item("sniezka", "Śnieżka", "Karkonosze, granica Polski i Czech", "1603 m n.p.m.", "najwyższy szczyt Karkonoszy", "Na wierzchołku wieje bardzo mocno. Stoi tam obserwatorium."),
      item("rysy", "Rysy", "Tatry Wysokie, granica Polski i Słowacji", "2499 m n.p.m. po polskiej stronie", "najwyższy szczyt Polski", "Polski wierzchołek ma 2499 m. Główny, słowacki, jest trochę wyższy: 2503 m."),
      item("gerlach", "Gerlach", "Tatry Wysokie, Słowacja", "2655 m n.p.m.", "najwyższy szczyt Tatr i Karpat", "Leży w słowackiej części Tatr. Wejście wymaga doświadczenia i często przewodnika."),
      item("montblanc", "Mont Blanc", "Alpy, granica Francji i Włoch", "około 4806 m n.p.m.", "najwyższy szczyt Alp", "Wysokość lekko się zmienia, bo na szczycie leży śnieg i lód. To dach Europy Zachodniej."),
      item("kilimandzaro", "Kilimandżaro", "Tanzania, Afryka", "5895 m n.p.m.", "najwyższa góra Afryki", "To uśpiony wulkan. Na dole jest sawanna, a na szczycie lód."),
      item("k2", "K2", "Karakorum, granica Pakistanu i Chin", "8611 m n.p.m.", "drugi co do wysokości szczyt Ziemi", "Jest niższy od Everestu, ale uchodzi za trudniejszy do wejścia."),
      item("everest", "Mount Everest", "Himalaje, granica Nepalu i Chin", "około 8849 m n.p.m.", "najwyższy szczyt Ziemi", "Pomiar z 2020 roku podał 8848,86 m. Na szczycie jest bardzo mało tlenu."),
    ],
  },
  genealog: {
    id: "genealog",
    title: "Genealogia",
    labels: { origin: "Skąd to znamy", size: "Co zawiera", character: "Po co to rodzinie" },
    badges: ["Młody genealog", "Badacz metryk", "Historyk rodziny", "Mistrz drzewa rodowego"],
    breeds: [
      item("chrzest", "Metryka chrztu", "księgi parafialne, przez wieki", "imię dziecka, rodziców i chrzestnych oraz datę", "dawny ślad urodzenia", "Zanim powstały urzędy stanu cywilnego, chrzest w parafii był często jedynym zapisem, że ktoś się urodził."),
      item("slub", "Metryka ślubu", "księgi parafialne i późniejsze akty cywilne", "małżonków, świadków i datę", "łączy dwie rodziny", "Z takiego wpisu widać, jak nazywali się rodzice panny i pana młodego."),
      item("urodzenie", "Akt urodzenia", "urzędy stanu cywilnego, w wielu regionach od XIX wieku", "imię, datę, miejsce i rodziców", "oficjalny początek życiorysu", "W zaborach wprowadzano go w różnym czasie. Obok ksiąg kościelnych to podstawowe źródło genealogiczne."),
      item("zgon", "Akt zgonu", "parafia albo urząd", "datę i miejsce śmierci, czasem małżonka i rodziców", "domyka życiorys", "Pomaga ustalić, jak długo ktoś żył i gdzie go pochowano."),
      item("ksiega", "Księga parafialna", "kancelaria parafii", "chrzty, śluby albo zgony z wielu lat", "jedno miejsce, wiele pokoleń", "W wielu parafiach księgi zaczynają się w XVIII lub XIX wieku, a czasem wcześniej. Trzeba je czytać ostrożnie, bo pismo bywa trudne."),
      item("spis", "Spis ludności", "państwo, w wybranym roku", "kto mieszkał w domu: imiona, wiek, zawód", "rodzina w jednym dniu", "To nie jest metryka jednej osoby, tylko zdjęcie całego gospodarstwa. Widać na nim dzieci, rodziców i czasem służbę."),
      item("wywod", "Wywód przodków", "sposób zapisu używany przez genealogów", "numerowana lista przodków", "porządek w pokoleniach", "Osoba ma numer 1, ojciec 2, matka 3, dziadkowie 4–7. Numer ojca to zawsze dwa razy numer dziecka."),
      item("drzewo", "Drzewo genealogiczne", "rysunek rodziny", "osoby połączone liniami pokrewieństwa", "cała familia na jednym obrazku", "Może rosnąć w górę, ku przodkom, albo w dół, ku dzieciom. Linie pokazują, kto jest czyim rodzicem."),
    ],
  },
};

export function collectionById(id) {
  return COLLECTIONS[id] || COLLECTIONS.kot;
}

export function breedById(collectionId, breedId) {
  return collectionById(collectionId).breeds.find((breed) => breed.id === breedId) || null;
}

export function artFor(collectionId, breedId) {
  return `assets/breeds/${collectionId}-${breedId}.svg`;
}
