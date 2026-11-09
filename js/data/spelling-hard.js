/* Trudne słowa dla profilu dorosłego.
   Każde ma więcej niż jedną pułapkę ortograficzną.
   choices: dokładnie 4 różne zapisy, w tym jeden poprawny. */

function h(id, word, meaning, choices, hint) {
  if (!choices.includes(word) || new Set(choices).size !== 4) {
    throw new Error(`Złe warianty: ${id}`);
  }
  return { id, word, meaning, choices, hint, hard: true };
}

export const hardWords = [
  h("zolnierz", "żołnierz", "osoba służąca w wojsku", ["żołnierz", "żolnierz", "zołnierz", "zolnierz"], "Są tu trzy pułapki: ż, ó oraz rz."),
  h("chrzaszcz", "chrząszcz", "owad o twardych pokrywach skrzydeł", ["chrząszcz", "chrzonszcz", "chząszcz", "hrząszcz"], "W jednym słowie są ch, rz i ą."),
  h("chrabaszcz", "chrabąszcz", "duży owad, szkodnik drzew", ["chrabąszcz", "chrabonszcz", "hrabąszcz", "chrząbaszcz"], "Pułapki: ch oraz ą."),
  h("wedrowka", "wędrówka", "dłuższa droga z miejsca na miejsce", ["wędrówka", "wendrówka", "wędruwka", "wendruwka"], "Są tu ę oraz ó."),
  h("ksiezyc", "księżyc", "naturalny satelita Ziemi", ["księżyc", "ksienżyc", "księzyc", "księżyć"], "Poprawnie przez ę oraz ż."),
  h("ciezarowka", "ciężarówka", "duży samochód do przewozu towarów", ["ciężarówka", "cięzarówka", "cieżarówka", "ciężaruwka"], "Są tu ę, ż oraz ó."),
  h("pozolkly", "pożółkły", "taki, który stał się żółty ze starości", ["pożółkły", "pożulkły", "pożólkły", "półżółkły"], "Ż i ó stoją blisko siebie."),
  h("ksiaze", "książę", "syn króla albo tytuł władcy", ["książę", "książe", "ksionże", "ksiąrze"], "ą i ę są w jednym słowie."),
  h("piecdziesiat", "pięćdziesiąt", "liczba 50", ["pięćdziesiąt", "pięćdziesiont", "pieńcdziesiąt", "piencdziesiąt"], "ę, spółgłoska dz oraz ą."),
  h("szescdziesiat", "sześćdziesiąt", "liczba 60", ["sześćdziesiąt", "sześćdziesiont", "sześdziesiąt", "szescdziesiąt"], "Kilka pułapek naraz: sz, ę i ą."),
  h("marznac", "marznąć", "stygnąć poniżej zera", ["marznąć", "marzonąć", "mażnąć", "marznonć"], "rz oraz ą."),
  h("wciaz", "wciąż", "bez przerwy, ciągle", ["wciąż", "wcionż", "wcąż", "vciąż"], "ą i ż."),
  h("zachod", "zachód", "strona, po której słońce zachodzi", ["zachód", "zachud", "zahód", "zachót"], "ch oraz ó."),
  h("wschod", "wschód", "strona, z której słońce wstaje", ["wschód", "wschud", "wsód", "wshód"], "ch oraz ó."),
  h("zolw", "żółw", "zwierzę z twardą skorupą na grzbiecie", ["żółw", "żuw", "zółw", "żułw"], "ż oraz ó."),
  h("gzegzolka", "gżegżółka", "ptak, który podrzuca jaja do cudzych gniazd", ["gżegżółka", "gżegżulka", "grzegżółka", "gzegżółka"], "Dwa razy ż i raz ó."),
  h("przyjezdzac", "przyjeżdżać", "docierać dokądś pojazdem, wiele razy", ["przyjeżdżać", "przyjeżdzać", "przyjezdżać", "przyjeżdząć"], "Jest tu rz oraz dwa razy ż."),
  h("rozroznac", "rozróżniać", "widzieć różnicę między rzeczami", ["rozróżniać", "rozrużniać", "rozróżniacz", "rużróżniać"], "ó, ż oraz rz."),
  h("ksiazka", "książka", "zbiór zszytych kartek z tekstem", ["książka", "ksionżka", "ksiąszka", "książką"], "ą oraz ż. Końcówka to a, nie ą."),
  h("proznia", "próżnia", "przestrzeń, w której nie ma powietrza", ["próżnia", "prużnia", "próznia", "próźnia"], "ó oraz ż."),
  h("pchla", "pchła", "mały owad, który skacze", ["pchła", "pchla", "płcha", "phła"], "ch, nie h na początku."),
  h("druzyna", "drużyna", "grupa osób grających razem", ["drużyna", "dróżyna", "durzyna", "drurzyna"], "ż, bo jest pokrewne do: drugi."),
  h("podroz", "podróż", "wyprawa w dalekie miejsce", ["podróż", "podruż", "pódróż", "podróz"], "ż, bo jest pokrewne do: droga."),
  h("zrodlo", "źródło", "miejsce, z którego wypływa woda", ["źródło", "zródło", "źrudło", "żródło"], "ź, rz oraz ó."),
  h("wziecie", "wzięcie", "czynność chwycenia czegoś do ręki", ["wzięcie", "wziencie", "wzienie", "wzięncie"], "W środku jest ę, nie en."),
  h("scisnac", "ścisnąć", "mocno zacisnąć dłonią", ["ścisnąć", "ścisnonć", "scisnąć", "ścysnąć"], "ś oraz ą."),
  h("mosiadz", "mosiądz", "stop miedzi i cynku, żółtawy metal", ["mosiądz", "mosiondz", "mosiąć", "mosiąds"], "ą oraz dz na końcu."),
  h("jezdziec", "jeździec", "osoba jadąca konno", ["jeździec", "jeżdziec", "jezdiec", "jeździeć"], "ź oraz dz, nie ż."),
  h("lyzwa", "łyżwa", "but z metalowym ostrzem na lód", ["łyżwa", "łyrzwa", "lyżwa", "łóżwa"], "ż, nie rz."),
  h("rozczarowac", "rozczarować", "sprawić komuś zawód", ["rozczarować", "rosczarować", "rozczaruwać", "różczarować"], "cz oraz ó."),
  h("wszechswiat", "wszechświat", "gwiazdy, galaktyki i cała przestrzeń", ["wszechświat", "fszechświat", "wszehświat", "wszechsviat"], "ch oraz ś."),
  h("piecdziesiaty", "pięćdziesiąty", "mający numer 50 w kolejce", ["pięćdziesiąty", "pięćdziesionty", "pieńćdziesiąty", "piecdziesiąty"], "ę, dz oraz ą."),
];
