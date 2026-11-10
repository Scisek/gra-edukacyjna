/* Kolekcje przypisane do obrazka profilu.
   Poziom N odsłania kartę N. Po szesnastu kolekcja jest pełna, a XP rośnie dalej.
   Ilustracje to oryginalne naklejki gry. */

function item(id, name, origin, size, character, fact) {
  return { id, name, origin, size, character, fact };
}

export function rarityOf(index, total) {
  const t = index / Math.max(1, total - 1);
  if (t < 0.25) return "common";
  if (t < 0.55) return "rare";
  if (t < 0.8) return "epic";
  return "legend";
}

export const COLLECTIONS = {
  kot: {
    id: "kot",
    title: "Koty",
    menu: "Kolekcja kotów",
    labels: { origin: "Pochodzenie", size: "Wielkość", character: "Charakter" },
    badges: ["Właściciel kota", "Trener kotów", "Behawiorysta kotów", "Profesor kociej nauki"],
    breeds: [
      item("europejski", "Kot europejski krótkowłosy", "Europa", "średni", "zrównoważony i samodzielny", "Wygląda jak zwykły kot z podwórka, ale jest uznaną rasą o mocnej budowie i zdrowiu."),
      item("brytyjski", "Kot brytyjski krótkowłosy", "Wielka Brytania", "średni lub duży", "spokojny i cierpliwy", "Ma okrągłą buzię i bardzo gęste futro."),
      item("perski", "Kot perski", "Persja, czyli dzisiejszy Iran; rasę rozwijano też w Europie", "duży", "łagodny i cichy", "Długie futro trzeba czesać. Współczesne koty tej rasy mają płaski nosek."),
      item("syjamski", "Kot syjamski", "Tajlandia, dawniej Syjam", "średni", "gadatliwy i przywiązany", "Ciało jest jasne, a uszy, łapy i ogon ciemniejsze. Oczy ma niebieskie."),
      item("ragdoll", "Ragdoll", "Kalifornia w USA", "duży", "miękki, gdy się go podniesie", "Nazwa znaczy „szmaciana lalka”: wiele tych kotów wiotczeje na rękach."),
      item("maine", "Maine coon", "stan Maine w USA", "bardzo duży", "przyjacielski", "To jedna z największych ras. Na uszach ma pędzelki włosów."),
      item("norweski", "Kot norweski leśny", "Norwegia", "duży", "niezależny, ale lubi swoich ludzi", "Grube futro prawie nie przemaka, więc dobrze znosi deszcz i śnieg."),
      item("syberyjski", "Kot syberyjski", "Rosja, Syberia", "duży", "przyjazny i odważny", "Ma trzywarstwowe, wodoodporne futro, które chroni go przed syberyjskim mrozem."),
      item("bengalski", "Kot bengalski", "Stany Zjednoczone", "średni", "ruchliwy", "Ma cętki jak mały lampart. Rasę ułożono, krzyżując kota domowego z dzikim kotem bengalskim."),
      item("szkocki", "Kot szkocki zwisłouchy", "Szkocja", "średni", "spokojny i łagodny", "Wszystkie te koty pochodzą od kotki Susie znalezionej w Szkocji w 1961 roku. Uszy zagina im mutacja, która osłabia też chrząstki, dlatego hodowla budzi spory."),
      item("rosyjski", "Kot rosyjski niebieski", "Rosja, okolice Archangielska", "średni", "nieśmiały wobec obcych, czuły dla swoich", "Ma srebrzystoniebieskie, bardzo gęste futro i zielone oczy."),
      item("sfinks", "Sfinks", "Kanada", "średni", "ciepły w obyciu i ciekawski", "Prawie nie ma futra. Rasa powstała w Kanadzie w latach 60. XX wieku."),
      item("rys", "Ryś euroazjatycki", "lasy Europy i Azji, także polskie góry i puszcze", "największy dziki kot Polski", "samotny i skryty", "Ma pędzelki na uszach i krótki ogon. Szerokie łapy działają jak rakiety śnieżne."),
      item("gepard", "Gepard", "sawanny Afryki, nieliczne w Iranie", "smukły, do około 65 kg", "najszybszy sprinter", "To najszybsze zwierzę lądowe: na krótkim odcinku biegnie ponad 100 km/h. Nie umie ryczeć, za to mruczy."),
      item("tygrys", "Tygrys", "lasy i bagna Azji", "największy kot świata", "samotny łowca", "Każdy tygrys ma inny wzór pasów. W przeciwieństwie do większości kotów lubi pływać."),
      item("lew", "Lew", "sawanny Afryki, mała grupa w Indiach", "drugi co do wielkości kot", "żyje w stadzie", "To jedyny kot, który żyje w dużych rodzinnych stadach. Ryk lwa słychać z odległości kilku kilometrów."),
    ],
  },
  pies: {
    id: "pies",
    title: "Psy",
    menu: "Kolekcja psów",
    labels: { origin: "Pochodzenie", size: "Wielkość", character: "Charakter" },
    badges: ["Właściciel psa", "Trener psów", "Behawiorysta psów", "Profesor psiej nauki"],
    breeds: [
      item("labrador", "Labrador retriever", "Nowa Fundlandia w Kanadzie", "duży", "przyjazny i chętny do pracy", "Dawniej pomagał rybakom. Do dziś chętnie wchodzi do wody."),
      item("golden", "Golden retriever", "Szkocja", "duży", "łagodny i cierpliwy", "Złote futro i spokojne usposobienie. Często towarzyszy ludziom w domu."),
      item("owczarek", "Owczarek niemiecki", "Niemcy", "duży", "odważny i lojalny", "Pracuje przy stadzie, w ratownictwie i jako pomocnik człowieka."),
      item("jamnik", "Jamnik", "Niemcy", "mały, z długim tułowiem", "odważny", "Krótkie łapki pomagały mu wchodzić do nor."),
      item("beagle", "Beagle", "Anglia", "średni", "wesoły i ciekawski", "Ma świetny węch i lubi iść za zapachem."),
      item("bordercollie", "Border collie", "pogranicze Szkocji i Anglii", "średni", "bardzo bystry i pracowity", "Pasie owce, wpatrując się w nie. Uchodzi za jedną z najinteligentniejszych ras psów."),
      item("mops", "Mops", "Chiny", "mały", "przylepny i wesoły", "Płaski pyszczek sprawia, że łatwo się przegrzewa. W upał potrzebuje cienia."),
      item("buldog", "Buldog francuski", "Francja", "mały i krępy", "wesoły i przytulaśny", "Ma uszy jak nietoperz. Przez ciężką głowę i krótki pysk słabo pływa i źle znosi upał."),
      item("husky", "Husky syberyjski", "Syberia", "średni lub duży", "energiczny", "To pies zaprzęgowy. Gruba sierść chroni go na mrozie."),
      item("dalmatynczyk", "Dalmatyńczyk", "Dalmacja w Chorwacji", "duży", "energiczny", "Szczenięta rodzą się całe białe. Cętki pojawiają się dopiero po kilku tygodniach."),
      item("podhalanski", "Owczarek podhalański", "Podhale i Tatry, Polska", "duży", "czujny obrońca stada", "Biała sierść pomagała pasterzom w nocy odróżnić własnego psa od wilka."),
      item("shiba", "Shiba inu", "Japonia", "mały lub średni", "odważny i samodzielny", "Wygląda trochę jak lisek. Bywa głośny, gdy jest niezadowolony."),
      item("lis", "Lis rudy", "Europa, Azja, Ameryka Północna, także cała Polska", "mały", "sprytny i ostrożny", "Słyszy mysz pod śniegiem i skacze na nią z góry, wbijając się pyskiem w zaspę."),
      item("szakal", "Szakal złocisty", "południowa Azja i Bałkany, od niedawna także Polska", "mniejszy od wilka", "płochliwy wszystkożerca", "Od kilku lat pojawia się w Polsce. To jeden z nowych dzikich mieszkańców naszego kraju."),
      item("likaon", "Likaon", "sawanny Afryki", "średni", "poluje w zgranej grupie", "Każdy likaon ma inny wzór łat. Polują razem i dzielą się zdobyczą, także z chorymi członkami stada."),
      item("wilk", "Wilk szary", "Europa, Azja i Ameryka Północna, także Polska", "największy dziki pies", "żyje w rodzinnej watasze", "To przodek wszystkich psów domowych. W Polsce jest pod ochroną."),
    ],
  },
  dino: {
    id: "dino",
    title: "Dinozaury",
    menu: "Kolekcja dinozaurów",
    labels: { origin: "Gdzie żył", size: "Wielkość", character: "Jadł" },
    badges: ["Młody paleontolog", "Odkrywca skamieniałości", "Badacz mezozoiku", "Profesor dinozaurów"],
    breeds: [
      item("triceratops", "Triceratops", "Ameryka Północna, koniec kredy", "około 9 m długości", "rośliny", "Trzy rogi i szeroka kostna tarcza z tyłu głowy."),
      item("stegozaur", "Stegozaur", "Ameryka Północna, późna jura", "około 9 m długości", "rośliny", "Na grzbiecie miał kostne płyty, a na ogonie kolce."),
      item("brachiozaur", "Brachiozaur", "Ameryka Północna, późna jura", "bardzo wysoki, ponad 12 m w kłębie", "liście z wysokich drzew", "Przednie nogi były dłuższe niż tylne, więc szyja szła w górę."),
      item("diplodok", "Diplodok", "Ameryka Północna, późna jura", "ponad 25 m długości", "rośliny", "Szyja i ogon były wyjątkowo długie. Ogon mógł działać jak bicz."),
      item("ankylozaur", "Ankylozaur", "Ameryka Północna, koniec kredy", "około 6–8 m długości", "rośliny", "Ciało pokrywał pancerz, a ogon kończył się kostną buławą."),
      item("parazaurolof", "Parazaurolof", "Ameryka Północna, późna kreda", "około 9 m długości", "rośliny", "Długi grzebień był pustą rurą. Mógł w nią trąbić jak w puzon."),
      item("welociraptor", "Welociraptor", "Mongolia, koniec kredy", "około 2 m długości", "mięso", "Był wielkości dużego indyka, nie jak w filmach. Miał pióra."),
      item("pachycefalozaur", "Pachycefalozaur", "Ameryka Północna, koniec kredy", "około 4,5 m długości", "głównie rośliny", "Kostna kopuła na głowie była gruba na ponad 20 cm."),
      item("iguanodon", "Iguanodon", "Europa, wczesna kreda", "około 10 m długości", "rośliny", "To jeden z pierwszych opisanych dinozaurów. Uczeni najpierw umieścili jego kolec z kciuka na nosie."),
      item("allozaur", "Allozaur", "Ameryka Północna i Portugalia, późna jura", "około 9 m długości", "mięso", "Polował nawet na stegozaury. Znaleziono kręg allozaura przebity kolcem z ogona stegozaura."),
      item("karnotaur", "Karnotaur", "Argentyna, późna kreda", "około 8 m długości", "mięso", "Nad oczami miał dwa rogi jak byk, a przednie łapki jeszcze krótsze niż tyranozaur."),
      item("terizinozaur", "Terizinozaur", "Mongolia, późna kreda", "około 10 m długości", "rośliny", "Miał pazury dłuższe niż pół metra. Służyły raczej do przyciągania gałęzi niż do walki."),
      item("argentynozaur", "Argentynozaur", "Argentyna, późna kreda", "około 30–35 m długości", "rośliny", "To jedno z największych zwierząt, jakie kiedykolwiek chodziły po lądzie. Ważył tyle, co kilkanaście słoni."),
      item("spinozaur", "Spinozaur", "północna Afryka, kreda", "najdłuższy znany drapieżny dinozaur, ponad 14 m", "głównie ryby", "Miał żagiel na grzbiecie i długi pysk. Dużo czasu spędzał przy wodzie."),
      item("gigantozaur", "Gigantozaur", "Argentyna, kreda", "około 12–13 m długości", "mięso", "Był wielki jak tyranozaur, ale żył miliony lat wcześniej i na innym kontynencie."),
      item("tyranozaur", "Tyranozaur", "Ameryka Północna, koniec kredy", "około 12 m długości", "mięso", "Miał ogromną czaszkę i bardzo krótkie przednie łapy."),
    ],
  },
  komputer: {
    id: "komputer",
    title: "Komputery",
    menu: "Kolekcja komputerów",
    labels: { origin: "Epoka", size: "Rola", character: "Jak działa" },
    badges: ["Młody informatyk", "Serwisant", "Inżynier sprzętu", "Architekt komputerów"],
    breeds: [
      item("klawiatura", "Klawiatura", "od maszyn do pisania z XIX wieku", "wpisywanie liter i poleceń", "każdy klawisz zamyka obwód", "Układ QWERTY wymyślono ponad 150 lat temu dla maszyn do pisania."),
      item("mysz", "Mysz komputerowa", "wynaleziona w latach 60. XX wieku", "wskazywanie na ekranie", "czujnik śledzi ruch ręki", "Pierwsza mysz Douglasa Engelbarta była drewnianym pudełkiem z dwoma kółkami."),
      item("dyskietka", "Dyskietka 3,5 cala", "lata 80. i 90. XX wieku", "mieściła zwykle 1,44 MB", "przenosiła pliki między komputerami", "W środku jest miękki krążek magnetyczny. Tyle danych co na niej zajmuje dziś jedno zdjęcie."),
      item("crt", "Monitor CRT", "od lat 70. do początku XXI wieku", "pokazywanie obrazu", "strumień elektronów świeci na ekranie", "Rysował obraz linia po linii wiele razy na sekundę. Był ciężki i głęboki jak skrzynia."),
      item("cpu8088", "Procesor Intel 8088", "rok 1979, serce IBM PC z 1981 roku", "liczył dużo wolniej niż dzisiejszy telefon", "wykonywał program krok po kroku", "W pierwszym IBM PC taktowano go około 4,77 MHz. Dziś procesory są tysiące razy szybsze."),
      item("hdd", "Dysk twardy HDD", "od lat 50. XX wieku, w domach od lat 80.", "dużo miejsca na pliki", "kręci magnetycznymi talerzami", "Głowica unosi się nad talerzem i czyta dane. Są ruchome części, więc dysk jest wolniejszy od SSD."),
      item("cd", "Płyta CD", "od 1982 roku", "muzyka, gry i programy", "laser czyta maleńkie wgłębienia", "Mieści około 700 MB. Ścieżka danych to spirala dłuższa niż 5 kilometrów."),
      item("ram", "Pamięć RAM", "w każdym komputerze od początku", "miejsce na bieżącą pracę", "szybka, ale ulotna", "Trzyma otwarte programy. Po wyłączeniu prądu ta zawartość znika."),
      item("plyta", "Płyta główna", "od pierwszych komputerów osobistych", "łączy części w jedną całość", "po ścieżkach płyną sygnały", "Wpina się w nią procesor, pamięć i karty. Bez niej części nie mogą rozmawiać."),
      item("pendrive", "Pendrive", "od około 2000 roku", "przenośny magazyn plików", "pamięć flash i złącze USB", "Jest mniejszy od kciuka, a mieści tysiące razy więcej niż dyskietka."),
      item("zasilacz", "Zasilacz komputerowy", "w każdym komputerze stacjonarnym", "dostarcza prąd częściom", "zamienia prąd z gniazdka na niskie napięcia", "Z gniazdka płynie 230 woltów, a części komputera potrzebują 12, 5 i 3,3 wolta."),
      item("ssd", "Dysk SSD M.2", "upowszechnił się w XXI wieku", "szybki magazyn plików", "pamięć flash, bez talerzy", "Nie ma ruchomych części, więc system włącza się dużo szybciej niż ze starego dysku."),
      item("cpu", "Procesor wielordzeniowy", "od około 2005 roku w domowych komputerach", "kilka rdzeni w jednej kości", "liczy wiele zadań naraz", "Każdy rdzeń może prowadzić osobny wątek pracy. W jednej kości są miliardy tranzystorów."),
      item("chlodzenie", "Chłodzenie wodne", "popularne w XXI wieku w mocnych komputerach", "odprowadza ciepło", "pompa przepycha ciecz do chłodnicy", "Ciecz odbiera ciepło dużo lepiej niż powietrze, więc procesor może pracować szybciej i ciszej."),
      item("gpu", "Karta graficzna", "osobne układy od lat 80., dzisiejsze GPU są ogromne", "rysuje obraz i liczy równolegle", "tysiące małych rdzeni", "Powstała do gier i obrazu. Dziś pomaga też w uczeniu maszyn, bo liczy ogromną liczbę prostych działań naraz."),
      item("kwantowy", "Komputer kwantowy", "XXI wiek, w laboratoriach", "specjalne, bardzo trudne obliczenia", "kubity mogą być w wielu stanach naraz", "Wiele takich maszyn trzeba schłodzić prawie do zera absolutnego, zimniej niż w kosmosie."),
    ],
  },
  gory: {
    id: "gory",
    title: "Szczyty",
    menu: "Kolekcja szczytów",
    labels: { origin: "Gdzie stoi", size: "Wysokość", character: "Jaki jest" },
    badges: ["Turysta", "Górołaz", "Zdobywca szczytów", "Himalaista"],
    breeds: [
      item("gubalowka", "Gubałówka", "nad Zakopanem, Pogórze Gubałowskie", "około 1126 m n.p.m.", "łagodny grzbiet z widokiem na Tatry", "To popularny spacerowy szczyt. Widać z niego Giewont i Zakopane."),
      item("sniezka", "Śnieżka", "Karkonosze, granica Polski i Czech", "1603 m n.p.m.", "najwyższy szczyt Karkonoszy", "Na wierzchołku wieje bardzo mocno. Stoi tam obserwatorium."),
      item("babiagora", "Babia Góra", "Beskid Żywiecki, granica Polski i Słowacji", "1725 m n.p.m.", "najwyższy szczyt Beskidów Zachodnich", "Nazywa się ją Królową Beskidów i matką niepogód, bo pogoda zmienia się tam bardzo szybko."),
      item("giewont", "Giewont", "Tatry Zachodnie, nad Zakopanem", "1894 m n.p.m.", "skalisty, z krzyżem na szczycie", "Z Zakopanego wygląda jak śpiący rycerz. Żelazny krzyż stoi tam od 1901 roku."),
      item("rysy", "Rysy", "Tatry Wysokie, granica Polski i Słowacji", "2499 m n.p.m. po polskiej stronie", "najwyższy szczyt Polski", "Polski wierzchołek ma 2499 m. Główny, słowacki, jest trochę wyższy: 2503 m."),
      item("gerlach", "Gerlach", "Tatry Wysokie, Słowacja", "2655 m n.p.m.", "najwyższy szczyt Tatr i Karpat", "Leży w słowackiej części Tatr. Wejście wymaga doświadczenia i często przewodnika."),
      item("matterhorn", "Matterhorn", "Alpy, granica Szwajcarii i Włoch", "4478 m n.p.m.", "ostra skalna piramida", "To jedna z najsłynniejszych gór świata. Pierwszy raz zdobyto ją w 1865 roku."),
      item("montblanc", "Mont Blanc", "Alpy, granica Francji i Włoch", "około 4806 m n.p.m.", "najwyższy szczyt Alp", "Wysokość lekko się zmienia, bo na szczycie leży śnieg i lód. To dach Europy Zachodniej."),
      item("elbrus", "Elbrus", "Kaukaz, Rosja", "5642 m n.p.m.", "uśpiony wulkan z dwoma wierzchołkami", "Często uważa się go za najwyższą górę Europy. Zachodni wierzchołek jest wyższy od wschodniego."),
      item("kilimandzaro", "Kilimandżaro", "Tanzania, Afryka", "5895 m n.p.m.", "najwyższa góra Afryki", "To uśpiony wulkan. Na dole jest sawanna, a na szczycie lód."),
      item("denali", "Denali", "Alaska, USA", "6190 m n.p.m.", "najwyższa góra Ameryki Północnej", "Od podnóża do szczytu ma ponad 5 km, więcej niż Everest. W USA oficjalnie znów nazywa się Mount McKinley, ale na Alasce mówi się Denali."),
      item("aconcagua", "Aconcagua", "Andy, Argentyna", "6961 m n.p.m.", "najwyższy szczyt obu Ameryk", "To najwyższa góra poza Azją. Jeden z jej lodowców nazywa się Lodowcem Polaków na cześć polskiej wyprawy z 1934 roku."),
      item("nangaparbat", "Nanga Parbat", "Himalaje, Pakistan", "8126 m n.p.m.", "olbrzymi i groźny", "Nazwa znaczy „Naga Góra”. Ściana Rupal wznosi się na około 4,5 km i należy do najwyższych ścian świata."),
      item("kanczendzonga", "Kanczendżonga", "Himalaje, granica Nepalu i Indii", "8586 m n.p.m.", "trzeci co do wysokości szczyt Ziemi", "Nazwa znaczy „Pięć skarbów wielkiego śniegu”. Pierwsi zimą weszli na nią Polacy: Jerzy Kukuczka i Krzysztof Wielicki w 1986 roku."),
      item("k2", "K2", "Karakorum, granica Pakistanu i Chin", "8611 m n.p.m.", "drugi co do wysokości szczyt Ziemi", "Jest niższy od Everestu, ale uchodzi za trudniejszy do wejścia."),
      item("everest", "Mount Everest", "Himalaje, granica Nepalu i Chin", "około 8849 m n.p.m.", "najwyższy szczyt Ziemi", "Pomiar z 2020 roku podał 8848,86 m. Na szczycie jest bardzo mało tlenu."),
    ],
  },
  niedzwiedz: {
    id: "niedzwiedz",
    title: "Niedźwiedzie",
    menu: "Kolekcja niedźwiedzi",
    labels: { origin: "Gdzie żyje", size: "Wielkość", character: "Jakie jest" },
    badges: ["Opiekun niedźwiedzia", "Tropiciel", "Badacz niedźwiedzi", "Profesor niedźwiedzi"],
    breeds: [
      item("brunatny", "Niedźwiedź brunatny", "Europa, Azja i Ameryka Północna", "duży, w Polsce bardzo rzadki", "ostrożny wszystkożerca", "W Polsce żyje głównie w Bieszczadach i w Tatrach. Zimą zapada w sen."),
      item("polarny", "Niedźwiedź polarny", "Arktyka", "jeden z największych niedźwiedzi", "poluje na foki", "Futro jest przezroczyste, a skóra czarna. Dobrze pływa w lodowatej wodzie."),
      item("panda", "Panda wielka", "góry w środkowych Chinach", "duża i krępa", "je prawie sam bambus", "Należy do niedźwiedzi. Zjada wiele kilogramów bambusa dziennie."),
      item("czarny", "Niedźwiedź czarny", "Ameryka Północna", "mniejszy od brunatnego", "wspina się na drzewa", "Baribal bywa czarny, ale zdarzają się też brązowe osobniki. Często mieszka w lasach."),
      item("grizzly", "Grizzly", "Ameryka Północna", "duży", "silny i czujny", "To odmiana niedźwiedzia brunatnego. Garb na karku to mięśnie, które pomagają mu kopać."),
      item("himalajski", "Niedźwiedź himalajski", "Azja, od Iranu po Japonię", "średni", "nocny, z białą łatą na piersi", "Biała plama na piersi przypomina półksiężyc. Wiele czasu spędza na drzewach."),
      item("okularowy", "Niedźwiedź andyjski", "Andy w Ameryce Południowej", "średni", "płochliwy roślinożerca", "Jasne obwódki wokół oczu wyglądają jak okulary. To jedyny niedźwiedź Ameryki Południowej."),
      item("malajski", "Niedźwiedź malajski", "lasy południowo-wschodniej Azji", "najmniejszy niedźwiedź", "zjada miód i owady", "Ma bardzo długi język, którym wyciąga miód i owady z dziupli."),
      item("wargacz", "Niedźwiedź wargacz", "Indie i okolice", "średni", "lubi termity", "Długi pysk i wargi pomagają mu wysysać termity z kopców."),
      item("syryjski", "Niedźwiedź syryjski", "Bliski Wschód i Kaukaz", "mniejszy od innych brunatnych", "jasnofutry", "Takim niedźwiedziem był Wojtek, żołnierz Armii Andersa, który nosił skrzynki z amunicją we Włoszech."),
      item("kermode", "Niedźwiedź kermode (duch)", "wybrzeże Kolumbii Brytyjskiej w Kanadzie", "średni", "rybak", "To biała odmiana baribala, a nie niedźwiedź polarny. Ryby słabiej go widzą, więc łatwiej je łowi."),
      item("marsykanski", "Niedźwiedź marsykański", "Apeniny we Włoszech", "średni", "spokojny i skryty", "To bardzo rzadka odmiana brunatnego. Na wolności żyje ich tylko około 50–60."),
      item("gobijski", "Niedźwiedź gobijski (mazaalai)", "pustynia Gobi w Mongolii", "mały jak na brunatnego", "żyje na pustyni", "To jeden z najrzadszych niedźwiedzi świata. Zostało ich mniej niż sto."),
      item("qinling", "Panda z Qinling", "góry Qinling w Chinach", "trochę mniejsza od zwykłej pandy", "je bambus", "Zamiast czarno-białego futra ma brązowo-białe. Jest bardzo rzadka."),
      item("kodiak", "Niedźwiedź kodiak", "wyspy Kodiak na Alasce", "jeden z największych niedźwiedzi", "potężny rybak", "Duży samiec stojący na tylnych łapach może mieć prawie 3 metry."),
      item("jaskiniowy", "Niedźwiedź jaskiniowy", "Europa w epoce lodowcowej", "większy od brunatnego", "głównie roślinożerny", "Wymarł ponad 20 tysięcy lat temu. Jego kości znaleziono w Jaskini Niedźwiedziej w Kletnie."),
    ],
  },
  genealog: {
    id: "genealog",
    title: "Genealogia",
    menu: "Kolekcja genealoga",
    labels: { origin: "Skąd to znamy", size: "Co zawiera", character: "Po co to rodzinie" },
    badges: ["Młody genealog", "Badacz metryk", "Historyk rodziny", "Mistrz drzewa rodowego"],
    breeds: [
      item("fotografia", "Stara fotografia", "rodzinne albumy, od XIX wieku", "twarze, stroje i miejsca przodków", "pokazuje, jak wyglądali", "Dawniej do zdjęcia trzeba było długo siedzieć bez ruchu i wyglądać poważnie, dlatego na starych portretach rzadko ktoś się uśmiecha."),
      item("urodzenie", "Akt urodzenia", "urzędy stanu cywilnego, w wielu regionach od XIX wieku", "imię, datę, miejsce i rodziców", "oficjalny początek życiorysu", "W zaborach wprowadzano go w różnym czasie. Obok ksiąg kościelnych to podstawowe źródło genealogiczne."),
      item("chrzest", "Metryka chrztu", "księgi parafialne, przez wieki", "imię dziecka, rodziców i chrzestnych oraz datę", "dawny ślad urodzenia", "Zanim powstały urzędy stanu cywilnego, chrzest w parafii był często jedynym zapisem, że ktoś się urodził."),
      item("slub", "Metryka ślubu", "księgi parafialne i późniejsze akty cywilne", "małżonków, świadków i datę", "łączy dwie rodziny", "Z takiego wpisu widać, jak nazywali się rodzice panny i pana młodego."),
      item("zgon", "Akt zgonu", "parafia albo urząd", "datę i miejsce śmierci, czasem małżonka i rodziców", "domyka życiorys", "Pomaga ustalić, jak długo ktoś żył i gdzie go pochowano."),
      item("nagrobek", "Nagrobek", "cmentarze", "imiona, nazwiska i daty", "pokazuje, gdzie spoczywają przodkowie", "Napis na nagrobku może podać datę urodzenia, której brakuje w innych dokumentach."),
      item("ksiega", "Księga parafialna", "kancelaria parafii", "chrzty, śluby albo zgony z wielu lat", "jedno miejsce, wiele pokoleń", "W wielu parafiach księgi zaczynają się w XVIII lub XIX wieku, a czasem wcześniej. Trzeba je czytać ostrożnie, bo pismo bywa trudne."),
      item("paszport", "Stary paszport", "urzędy państwowe", "zdjęcie, rysopis i stemple", "pokazuje podróże przodka", "Stemple w paszporcie zdradzają, kiedy i dokąd ktoś wyjeżdżał."),
      item("list", "List emigranta", "rodzinne szuflady i archiwa", "wieści zza oceanu", "łączy rozdzielone rodziny", "Około 1900 roku z ziem polskich wyjechały za ocean setki tysięcy ludzi. Ich listy bywają jedynym śladem nowego życia."),
      item("meldunek", "Księga meldunkowa", "urzędy miast i gmin", "kto mieszkał pod adresem, od kiedy i skąd przybył", "pokazuje przeprowadzki rodziny", "Dzięki niej można sprawdzić, w którym domu mieszkali pradziadkowie."),
      item("spis", "Spis ludności", "państwo, w wybranym roku", "kto mieszkał w domu: imiona, wiek, zawód", "rodzina w jednym dniu", "To nie jest metryka jednej osoby, tylko zdjęcie całego gospodarstwa. Widać na nim dzieci, rodziców i czasem służbę."),
      item("mapa", "Mapa katastralna", "urzędy ziemskie, od XIX wieku", "działki, domy i drogi we wsi", "pokazuje ziemię przodków", "Na takiej mapie można znaleźć dom i pole, które należały do rodziny ponad 150 lat temu."),
      item("herb", "Herb rodowy", "szlachta, od średniowiecza", "znak rodu na tarczy", "łączy ród wspólnym znakiem", "W Polsce ten sam herb nosiło często wiele niespokrewnionych rodzin, nawet kilkaset."),
      item("dna", "Test DNA", "laboratoria, XXI wiek", "zapis genów", "pomaga znaleźć krewnych", "Połowę DNA dostajemy od mamy, a połowę od taty. Test może odnaleźć nawet dalekich kuzynów."),
      item("wywod", "Wywód przodków", "sposób zapisu używany przez genealogów", "numerowana lista przodków", "porządek w pokoleniach", "Osoba ma numer 1, ojciec 2, matka 3, dziadkowie 4–7. Numer ojca to zawsze dwa razy numer dziecka."),
      item("drzewo", "Pełne drzewo rodu", "rysunek rodziny", "osoby połączone liniami pokrewieństwa", "cała familia na jednym obrazku", "Może rosnąć w górę, ku przodkom, albo w dół, ku dzieciom. Linie pokazują, kto jest czyim rodzicem."),
    ],
  },
  kwiat: {
    id: "kwiat",
    title: "Kwiaty",
    menu: "Kolekcja kwiatów",
    labels: { origin: "Gdzie rośnie", size: "Wielkość", character: "Jaki jest" },
    badges: ["Ogrodnik", "Florysta", "Botanik", "Mistrz kwiatów"],
    breeds: [
      item("stokrotka", "Stokrotka", "łąki i trawniki Europy, także cała Polska", "mała", "skromna i pospolita", "Rośnie na trawnikach i łąkach. Dzieci często plotą z niej wianki."),
      item("tulipan", "Tulipan", "pochodzi z Azji Środkowej, słynie z Holandii", "średni", "wiosenny", "Cebulka przez zimę śpi w ziemi, a na wiosnę wypuszcza kwiat."),
      item("roza", "Róża", "ogrody całego świata; dzikie róże rosną też w Polsce", "średnia lub duża", "pachnąca", "Kolce chronią kwiat przed zjedzeniem. Zapach róż znano już w starożytności."),
      item("slonecznik", "Słonecznik", "pochodzi z Ameryki Północnej, uprawiany też w Polsce", "duży", "słoneczny", "Kwiatostan obraca się za słońcem. Z nasion robi się olej i smaczne pestki."),
      item("mak", "Mak polny", "pola i pobocza Europy, także Polska", "średni", "delikatny", "Płatki są cienkie jak bibułka i szybko opadają."),
      item("pelargonia", "Pelargonia", "pochodzi z południowej Afryki, popularna na polskich balkonach", "średnia", "balkonna", "Często stoi w doniczkach na balkonach. Liście mają czasem ciemniejszy pasek jak podkowę."),
      item("begonia", "Begonia koralowa", "tropikalne lasy Brazylii", "średnia", "nakrapiana", "Na liściach ma srebrne kropki, a spód liścia jest często czerwony."),
      item("fiolet", "Fiołek afrykański", "góry Tanzanii i Kenii", "mały", "aksamitny", "Liście są miękkie i owłosione. Lubi jasne miejsce, ale nie palące słońce."),
      item("skrzydlokwiat", "Skrzydłokwiat", "tropikalne lasy Ameryki", "średni", "o białym „skrzydle”", "Biały liść wokół kwiatostanu wygląda jak skrzydło albo żagiel. Dobrze rośnie w domu."),
      item("pothos", "Epipremnum (pothos)", "wyspy Oceanii i Azja Południowo-Wschodnia", "pnące", "łatwe w uprawie", "To jedna z najłatwiejszych roślin doniczkowych. Pnącza mogą mieć wiele metrów."),
      item("fikus", "Fikus lirnolistny", "lasy tropikalnej Afryki Zachodniej", "duży", "o liściach jak skrzypce", "Wielkie liście mają kształt skrzypiec albo gitary. W naturze bywa ogromnym drzewem."),
      item("monstera", "Monstera", "tropikalne lasy Ameryki Środkowej", "duża", "o dziurawych liściach", "Dziury i wcięcia w liściach pomagają przetrwać wiatrom i ulewom w dżungli."),
      item("kaladium", "Kaladium", "tropikalna Ameryka Południowa", "średnie", "o kolorowych liściach", "Najładniejsze są liście, nie kwiaty: różowe, białe i zielone jak malowane."),
      item("alokazja", "Alokazja", "tropikalna Azja", "średnia lub duża", "o liściach jak strzały", "Grube białe nerwy na ciemnym liściu wyglądają jak narysowane kredą."),
      item("storczyk", "Storczyk falenopsis", "tropikalna Azja i Oceania", "średni", "elegancki", "Kwiaty przypominają ćmy w locie, stąd nazwa falenopsis. Może kwitnąć wiele tygodni."),
      item("strelicja", "Strelicja (rajski ptak)", "południowa Afryka", "duża", "jak tropikalny ptak", "Pomarańczowy i niebieski kwiat wygląda jak głowa rajskiego ptaka."),
    ],
  },
  owoc: {
    id: "owoc",
    title: "Owoce",
    menu: "Kolekcja owoców",
    labels: { origin: "Skąd jest", size: "Wielkość", character: "Jaki jest" },
    badges: ["Sadownik", "Smakosz", "Znawca owoców", "Mistrz owoców"],
    breeds: [
      item("jablko", "Jabłko", "sady umiarkowanego świata, także cała Polska", "średnie", "chrupiące, słodko-kwaśne", "W Polsce rośnie setki odmian. Pestki siedzą w pięciu przegródkach, które na przekroju tworzą gwiazdkę."),
      item("gruszka", "Gruszka", "sady Europy i Azji, także Polska", "średnia", "słodka i soczysta", "Dojrzewa od środka. Najsmaczniejsza jest wtedy, gdy szyjka trochę zmięknie."),
      item("sliwka", "Śliwka", "sady Europy i Azji, także Polska", "średnia", "słodko-kwaśna", "Siny nalot na skórce to naturalny wosk, który chroni owoc. Z węgierek robi się powidła."),
      item("truskawka", "Truskawka", "uprawiana w całej Polsce; przodkowie z Ameryk", "mała", "słodka i pachnąca", "To owoc pozorny: prawdziwe owoce to te małe żółte „pestki” na powierzchni."),
      item("wisnia", "Wiśnia", "sady Europy, także Polska", "mała", "kwaskowata", "Jest kwaśniejsza od czereśni. Z wiśni robi się kompot i sok."),
      item("malina", "Malina", "lasy i ogrody Europy, także Polska", "mała", "słodka i aromatyczna", "Owoc składa się z wielu malutkich kuleczek. Łatwo schodzi z dna, bo w środku jest pusty."),
      item("borowka", "Borówka", "pochodzi z Ameryki Północnej, uprawiana też w Polsce", "mała", "słodka, ciemnoniebieska", "Siny nalot to naturalny wosk. Sok mocno barwi język i palce."),
      item("pomarancza", "Pomarańcza", "uprawiana w ciepłych krajach, na przykład w Hiszpanii i Włoszech", "średnia", "słodka i soczysta", "Skórka pachnie olejkami. Owoc jest pełen witaminy C, która pomaga nie chorować."),
      item("banan", "Banan", "uprawiany w tropikach, na przykład w Ameryce Środkowej i Azji", "średni", "słodki i miękki", "Rośnie na wielkiej roślinie, która wygląda jak drzewo, ale jest olbrzymim ziołem. Kiście zwisają w dół."),
      item("kiwi", "Kiwi", "pochodzi z Chin, uprawiane też w Nowej Zelandii i we Włoszech", "małe", "kwaskowato-słodkie", "Pod brązową skórką kryje się zielony środek z wianuszkiem czarnych pestek."),
      item("ananas", "Ananas", "pochodzi z Ameryki Południowej, uprawiany w tropikach", "duży", "słodko-kwaśny", "Owoc składa się z wielu zrośniętych jagód. Koronę liści na górze można czasem ukorzenić."),
      item("mango", "Mango", "pochodzi z Indii i Azji Południowo-Wschodniej", "duże", "słodkie i aromatyczne", "Ma wielką, spłaszczoną pestkę. Dojrzałe mango pachnie nawet przez skórkę."),
      item("granat", "Granat", "pochodzi z Bliskiego Wschodu i okolic Morza Śródziemnego", "średni", "kwaskowato-słodki", "W środku ukryte są setki soczystych ziarenek, jak czerwone klejnoty."),
      item("liczi", "Liczi", "pochodzi z południowych Chin", "małe", "słodkie i delikatne", "Pod czerwoną, szorstką skórką jest przezroczysty, soczysty miąższ i jedno brązowe nasiono."),
      item("marakuja", "Marakuja", "pochodzi z Ameryki Południowej", "średnia", "kwaskowata i pachnąca", "W pomarańczowym miąższu pływają liczne pestki, które też się jada. Kwiat tej rośliny jest bardzo ozdobny."),
      item("pitaja", "Pitaja (smoczy owoc)", "pochodzi z Ameryki Środkowej, uprawiana też w Azji", "duża", "łagodnie słodka", "Rośnie na kaktusie. Różowa skórka ma zielone łuski, a w białym miąższu widać mnóstwo drobnych czarnych pestek."),
    ],
  },
};

export function collectionById(id) {
  return COLLECTIONS[id] || COLLECTIONS.kot;
}

export function collectionMenu(collection) {
  return collection?.menu || "Moja kolekcja";
}

export function breedById(collectionId, breedId) {
  return collectionById(collectionId).breeds.find((breed) => breed.id === breedId) || null;
}

export function artFor(collectionId, breedId) {
  return `assets/photos/${collectionId}-${breedId}.webp`;
}
