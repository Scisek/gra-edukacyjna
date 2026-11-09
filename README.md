# Skarby wiedzy

Spokojna gra edukacyjna dla dzieci, po polsku. Działa w przeglądarce na telefonie, tablecie i komputerze. Nie ma serwera ani instalacji: kilkoro dzieci na jednym urządzeniu ma osobne profile, a wyniki zostają w tej przeglądarce.

## Jak grać

1. Wybierz gracza albo załóż nowy: imię i obrazek.
2. Na ekranie głównym wybierz przedmiot.
3. Wybierz moduł i poziom.
4. Odpowiadaj na pytania. Od razu widać, czy odpowiedź jest dobra, i jak brzmi poprawna.
5. Runda z co najmniej dwiema gwiazdkami odsłania fragment mapy i odblokowuje kolejny poziom.

Przy dwóch profilach na górze jest przycisk **Graj jako …** — jedno stuknięcie przełącza dziecko. **Zmień gracza** otwiera listę profili, postępy i nowego gracza.

Gwiazdki za rundę:

- 3 gwiazdki — co najmniej 85% poprawnych odpowiedzi
- 2 gwiazdki — co najmniej 70%
- 1 gwiazdka — co najmniej 50%

Dwie gwiazdki odblokowują następny poziom w tym module.

### Geografia

Trzy moduły: flagi (kraj po fladze), stolice (stolica kraju) oraz państwa (kraj po stolicy).

- **Łatwy** — znane kraje, 3 odpowiedzi
- **Średni** — więcej krajów Europy i świata, 4 odpowiedzi
- **Trudny** — szerszy zestaw z całego świata, 4 odpowiedzi
- **Mistrz** — podobne flagi obok siebie i limit czasu

Przy stolicach, o które łatwo się pomylić (Ankara, Ottawa, Canberra, Brasília, Wellington, Pretoria, Dodoma, Abudża, Astana, Berno, Amsterdam, Rabat i kilka innych), po odpowiedzi pojawia się krótka notatka.

### Język polski

Moduł **Ortografia**:

- **Łatwy** — ó czy u
- **Średni** — rz czy ż
- **Trudny** — ch czy h
- **Mistrz** — słowa, w których zasady się mieszają, z limitem czasu

Pytanie podaje znaczenie, a dziecko wybiera poprawny zapis.

### Matematyka

Dodawanie, odejmowanie, mnożenie i dzielenie. Pytania są losowane.

- **Łatwy** — dodawanie i odejmowanie do 10, tabliczka do 5×5
- **Średni** — do 20 i tabliczka do 10×10
- **Trudny** — do 100 oraz mnożenie i dzielenie do 12
- **Mistrz** — do 1000, większe iloczyny i dzielenia bez reszty, z limitem czasu

Odejmowanie nie schodzi poniżej zera. Dzielenie zawsze wychodzi bez reszty.

## Profile

Każdy gracz ma własne gwiazdki, odblokowane poziomy, mapę i listę „Warto powtórzyć” (kraje, słowa i działania, które najczęściej się mylą).

**Wyczyść postępy** na karcie gracza kasuje wyniki, ale zostawia imię i obrazek. **Usuń gracza** zabiera profil z tego urządzenia.

Zapis jest w `localStorage` tej przeglądarki. Inna przeglądarka, inne urządzenie albo wyczyszczenie danych strony zaczyna od zera.

## Mapy i skarby

Są trzy wyspy: geografii, słów i liczb. Każda ma 6 fragmentów. Fragment spada za rundę z co najmniej dwiema gwiazdkami w przedmiocie tej wyspy. Pełna wyspa odsłania swój skarb. Trzy skarby odsłaniają koronę wiedzy.

Ekran **Mapy i skarby** jest na stronie głównej.

## Uruchomienie na komputerze

Moduły JavaScript nie działają z adresu `file://`. Z katalogu gry:

```bash
python3 -m http.server
```

Potem otwórz `http://localhost:8000/`.

## GitHub Pages

W repozytorium: **Settings → Pages → Build and deployment → Deploy from a branch**.

- Branch: `main`
- Folder: `/ (root)`

Po minucie lub dwóch gra jest pod adresem `https://scisek.github.io/gra-edukacyjna/`. Ścieżki w plikach są względne, więc działają w tym podkatalogu. Plik `.nojekyll` jest po to, żeby Pages nie przepuszczał strony przez Jekylla.

## Jak dodać moduł

Przedmioty i moduły są w `js/registry.js`. Moduł to zwykły obiekt: `id`, `title`, `blurb`, `levels` i funkcja `makeQuestion(level, used)`.

Poziom opisuje `id`, `title`, `band`, `questions`, `options`, `seconds` (0 wyłącza czas) i `detail` (krótki opis na karcie).

`makeQuestion` zwraca pytanie:

```js
{
  id: "ssaki",
  title: "Ssaki",
  blurb: "Rozpoznaj zwierzę",
  status: "ready",
  levels: [
    { id: "latwy", title: "Łatwy", band: 1, questions: 8, options: 3, seconds: 0, detail: "8 pytań · 3 odpowiedzi" },
  ],
  makeQuestion(level, used) {
    used.add("lis");
    return {
      key: "ssaki:lis",
      prompt: "Kto to jest?",
      figure: { type: "title", text: "Ma rudy ogon." },
      options: [
        { id: "lis", label: "Lis" },
        { id: "sowa", label: "Sowa" },
        { id: "kot", label: "Kot" },
      ],
      correctId: "lis",
      correctLabel: "Lis",
      note: "",
      review: "Ma rudy ogon. → Lis",
    };
  },
}
```

`figure` może być obrazkiem `{ type: "image", src, alt }`, dużym napisem `{ type: "title", text }`, działaniem `{ type: "equation", text }` albo znaczeniem `{ type: "meaning", text }`.

Nowy przedmiot dopisz do tablicy `subjects`. Kafelek „wkrótce” to przedmiot ze `status: "soon"` i bez modułów. Jeśli przedmiot ma dawać fragmenty mapy, dodaj wyspę o **tym samym `id`** w `js/rewards.js`.

Dane geografii: `js/data/countries.js`. Ortografia: `js/data/spelling.js`. Matematyka jest losowana w `js/modules/math.js`.

Sprawdzenie danych:

```bash
node scripts/check-data.mjs
```

## Jak zmienić wygląd

### Kolory, czcionki, rogi, cienie

Wszystko, co składa się na motyw interfejsu, jest w `css/theme.css`: tło, tekst, złoto, turkus, koral, papier pod flagą, cień, promień rogów, fonty i odstępy. Nazwy zmiennych są używane w `css/app.css`. Nie trzeba szukać kolorów po całym arkuszu.

Czcionki (Outfit i Fraunces, licencja SIL OFL) leżą w `assets/fonts/`. Podmiana plików i wpisów w `css/fonts.css` zmienia krój pisma. Polskie znaki są w plikach `latin-ext`.

### Obrazki

Rysunki to osobne pliki SVG. Wystarczy podmienić plik i zostawić nazwę.

| Plik | Co to jest |
| --- | --- |
| `assets/art/znak.svg` | Znak przy tytule |
| `assets/art/favicon.svg` | Ikona karty przeglądarki |
| `assets/art/wyprawa.svg` | Rysunek pustej listy graczy |
| `assets/art/przedmiot-*.svg` | Obrazek kafelka przedmiotu |
| `assets/avatars/*.svg` | Obrazki graczy (lista w `js/avatars.js`) |
| `assets/art/gwiazda.svg` | Pełna gwiazdka |
| `assets/art/gwiazda-pusta.svg` | Pusta gwiazdka |
| `assets/maps/wyspa-geografia.svg` | Mapa wyspy geografii |
| `assets/maps/wyspa-slowa.svg` | Mapa wyspy języka |
| `assets/maps/wyspa-liczby.svg` | Mapa wyspy matematyki |
| `assets/art/skarb-kompas.svg` | Skarb geografii |
| `assets/art/skarb-pioro.svg` | Skarb języka |
| `assets/art/skarb-klejnot.svg` | Skarb matematyki |
| `assets/art/skarb-korona.svg` | Wielki skarb |

Kolory w SVG są wpisane w plikach (nie dziedziczą się z motywu, bo przeglądarka wstawia je jako obrazki). Przy zmianie palety popraw te same odcienie w SVG: tło `#0c1220` / `#142033`, powierzchnia `#1a2436` / `#243044`, złoto `#e0b15a`, turkus `#6ec4b8`, papierowy tekst `#f3efe6`.

### Mapa nagród

Każda wyspa to jeden szeroki rysunek 3:2 (`viewBox="0 0 600 400"`). Gra kroi go na 6 fragmentów: 3 kolumny i 2 rzędy. Siatka jest w `css/app.css` w klasie `.puzzle`, a liczba fragmentów w `PIECES` w `js/rewards.js`. Jeśli zmienisz liczbę kawałków, popraw obie te rzeczy naraz. Nowy rysunek wyspy wstaw w istniejący plik, z tłem wypełniającym cały widok, żeby fragmenty stykały się bez dziur.

## Flagi

Flagi państw pochodzą z projektu [flag-icons](https://github.com/lipis/flag-icons) (Panayiotis Lipiridis) i są na licencji MIT. Treść licencji: `assets/flags/LICENSE`. Pliki leżą w `assets/flags/` jako `kod.svg`, na przykład `pl.svg`.

## Licencje czcionek

Outfit i Fraunces są na licencji SIL Open Font License. Tekst licencji: `assets/fonts/OFL-Outfit.txt` i `assets/fonts/OFL-Fraunces.txt`.
