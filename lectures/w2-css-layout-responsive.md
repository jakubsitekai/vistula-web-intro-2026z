# W2 — CSS, układ strony, responsywność i dostępność

**Czas:** 2,5 godziny dydaktycznej. **Laboratorium:** L2 — CV z osobnym arkuszem stylów.

## 1. Po co istnieje CSS?

HTML opisuje strukturę i semantykę, CSS (Cascading Style Sheets) opisuje prezentację dokumentu: kolory, typografię, odstępy, układ, zachowanie na różnych ekranach i proste animacje. Rozdzielenie warstwy struktury od warstwy prezentacji pozwala zmienić wygląd całej witryny bez przepisywania treści.

CSS nie jest prostym zbiorem poleceń wykonywanych po kolei. Przeglądarka musi wyznaczyć, które deklaracje dotyczą elementu, rozstrzygnąć konflikty, wyliczyć wartości właściwości, wykonać layout i namalować wynik. Dlatego dwa pozornie podobne selektory mogą mieć inne działanie.

Trzy sposoby dołączania CSS:
- osobny plik przez element link w head — preferowany w zadaniu L2;
- blok style wewnątrz HTML — czasem przydatny dla demonstracji;
- atrybut style w elemencie — do ograniczonego użycia, utrudnia konserwację.

~~~html
<link rel="stylesheet" href="./style.css">
~~~

W zadaniu CV trzymaj style w style.css. Umożliwia to kontrolę wersji i łatwe odnajdywanie zasad.

## 2. Reguły, selektory i deklaracje

~~~css
.card {
  background: #f5f8fc;
  color: #1c2940;
  padding: 20px;
  border-radius: 12px;
}
~~~

Selektor .card wskazuje elementy z klasą card. W nawiasach klamrowych znajdują się deklaracje: nazwa właściwości i wartość. Właściwości mogą być dziedziczone (np. color) albo niedziedziczone (np. margin). Dlatego ustawienie koloru tekstu na body często wpływa na potomków, ale margines body nie staje się automatycznie marginesem każdego elementu.

Najczęstsze selektory:
- p — wszystkie elementy p;
- .skill — elementy z klasą skill;
- #header — element o ID header;
- main section — sekcje wewnątrz main;
- ul > li — bezpośrednie dzieci li listy ul;
- a:hover — link po najechaniu;
- button:focus-visible — przycisk z widocznym focusem klawiatury;
- input[required] — pole z atrybutem required;
- .card, .panel — grupa selektorów.

Nie używaj ID do stylowania każdego małego elementu tylko dlatego, że daje „silniejszy” selektor. Dobrze nazwane klasy są łatwiejsze w rozwijaniu.

## 3. Kaskada, specyficzność i kolejność

Skąd bierze się nazwa Cascading? Wiele reguł może jednocześnie dotyczyć tego samego elementu. Przeglądarka rozstrzyga ich priorytety na podstawie pochodzenia, ważności deklaracji, warstw kaskady, specyficzności oraz kolejności definicji. Nie wystarcza stwierdzenie „ostatnia reguła zawsze wygrywa”.

Uproszczone porównanie specyficzności:
- selektor typu p: mała specyficzność;
- klasa .note, atrybut lub pseudoklasa: większa;
- ID #intro: jeszcze większa;
- style inline: zwykle silniejsze niż typowe reguły z arkusza.

~~~css
p { color: navy; }
.important { color: teal; }
#featured { color: maroon; }
~~~

Jeśli akapit ma jednocześnie klasę important i ID featured, deklaracja dla ID przeważy w zwykłej sytuacji mimo kolejności. Reguła !important zmienia porządek priorytetu; nie używaj jej jako podstawowego sposobu naprawiania konfliktów. Nowoczesny CSS pozwala także stosować @layer, by jawnie uporządkować grupy reguł.

Praktyczne narzędzie: w DevTools/Elements → Computed sprawdzisz wartość końcową właściwości, a w Styles zobaczysz przekreślone reguły, które przegrały kaskadę.

## 4. Box model — skąd bierze się szerokość?

Każdy element ma obszar treści, padding, border i margin. Standardowo width dotyczy samej treści; finalnie element zajmuje więcej miejsca, jeśli dodasz padding i border.

~~~css
* { box-sizing: border-box; }

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #aab6c7;
  margin: 12px;
}
~~~

Przy border-box szerokość 300 px uwzględnia padding i border; margines pozostaje poza nią. To wygodny standard dla layoutów. Z kolei wysokość elementu może zależeć od zawartości, fontu i łamania linii, dlatego unikaj sztywnego height bez rzeczywistej potrzeby.

**Margin vs padding:** margin oddziela element od otoczenia, a padding tworzy przestrzeń między treścią a obramowaniem. Marginesy pionowe w zwykłym przepływie blokowym mogą się „zapadać” (margin collapsing). Flexbox i Grid mają inne reguły; nie należy zakładać, że wszystkie marginesy zachowują się tak samo.

## 5. Jednostki i typografia

Typowe jednostki:
- px — logiczny piksel CSS, niekoniecznie fizyczny piksel urządzenia;
- rem — względem font-size elementu głównego;
- em — względem bieżącego kontekstu rozmiaru pisma;
- % — w relacji do odpowiedniej właściwości/elementu nadrzędnego;
- vw, vh, dvh — jednostki względem viewportu;
- fr — jednostka udziału w dostępnej przestrzeni Grid.

~~~css
html { font-size: 100%; }
body { font-family: system-ui, sans-serif; line-height: 1.6; }
h1 { font-size: clamp(2rem, 4vw, 3.5rem); }
.container { width: min(100% - 2rem, 70rem); margin-inline: auto; }
~~~

Używanie jednostek względnych pozwala czytelniej dostosować interfejs do preferencji powiększenia tekstu. W CV istotniejsze od efektownych gradientów są odpowiednia długość wiersza, kontrast, hierarchia nagłówków i wygodny układ na telefonie.

## 6. Normal flow, display i pozycjonowanie

W standardowym przepływie dokumentu elementy blokowe zwykle układają się jeden pod drugim, a tekst i elementy inline płyną w liniach. display zmienia sposób uczestniczenia w layoutcie.

- display: block — element zajmuje wiersz w typowym układzie blokowym;
- display: inline — wpleciony w tekst;
- display: inline-block — zachowuje się w linii, ale pozwala kontrolować wymiary;
- display: flex — elastyczny układ jednowymiarowy;
- display: grid — układ dwuwymiarowy;
- display: none — element nie jest renderowany w układzie (i zasadniczo nie jest dostępny dla technologii asystujących).

Pozycjonowanie:
- relative — przesunięcie względem zwykłej pozycji, miejsce pozostaje;
- absolute — pozycjonowanie względem odpowiedniego containing block, poza normalnym przepływem;
- fixed — zwykle względem viewportu;
- sticky — zachowuje się jak element w przepływie aż do osiągnięcia granic przewijania.

Przy układzie CV nie zaczynaj od position:absolute. Dla kolumn i sekcji najczęściej właściwe będą Flexbox lub Grid.

## 7. Flexbox: oś główna i poprzeczna

Flexbox jest przeznaczony do układów jednowymiarowych: elementy w wierszu albo kolumnie, z kontrolą wyrównania i rozmieszczenia.

~~~css
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
~~~

- flex-direction określa kierunek osi głównej;
- justify-content wyrównuje wzdłuż osi głównej;
- align-items wyrównuje wzdłuż osi poprzecznej;
- flex-wrap pozwala przenosić elementy;
- gap ustala odstępy między elementami bez kombinowania z marginesami;
- flex-grow i flex-shrink określają zmianę rozmiarów.

Częsty błąd: próba ustawiania justify-content do wyrównania pionowego przy domyślnym flex-direction: row. Przy row oś główna jest pozioma, a poprzeczna pionowa. Zmiana na column zmienia znaczenie obu właściwości.

## 8. CSS Grid: wiersze i kolumny

Grid ułatwia tworzenie układów dwuwymiarowych, np. głównej kolumny CV i bocznego panelu z kompetencjami.

~~~css
.cv-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
  gap: 1.5rem;
}
~~~

Udział 2fr i 1fr nie jest tym samym co dokładnie 66,7% i 33,3% całej szerokości — część przestrzeni zajmuje gap, a ograniczenia minimalnych rozmiarów wpływają na finalny podział.

~~~css
.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: .75rem;
}
~~~

Funkcje repeat, auto-fit i minmax umożliwiają automatyczną liczbę kolumn. W CV można zastosować Grid dla obszarów strony, a Flexbox do pojedynczego wiersza z ikoną i nazwą kompetencji.

## 9. Responsywność: mobile first

Współczesny interfejs powinien działać na szerokich ekranach i wąskich telefonach. Nie oznacza to tworzenia osobnej witryny. W podejściu mobile first definiujesz bazowy układ dla małych ekranów, a potem rozszerzasz go przez media queries.

~~~css
.cv-layout { display: block; }

@media (min-width: 760px) {
  .cv-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
}
~~~

Punkt 760 px jest decyzją projektową, nie uniwersalnym progiem „tablet”. Dobieraj breakpoint wtedy, gdy rzeczywista zawartość zaczyna się nie mieścić. Testuj także powiększenie tekstu, bardzo długie nazwiska i ekran 320 px.

Responsywne obrazy:

~~~css
img {
  display: block;
  max-width: 100%;
  height: auto;
}
~~~

Bez max-width obraz może wypchnąć kontener poza ekran. Zwracaj uwagę na poziomy scrollbar i elementy, które nie mieszczą się w dostępnej szerokości.

## 10. Dostępność, kontrast, fokus i ruch

Nie usuwaj outline z interaktywnych elementów bez stworzenia widocznego zamiennika. Użytkownik klawiatury musi wiedzieć, który przycisk lub link jest aktywny.

~~~css
a:focus-visible, button:focus-visible {
  outline: 3px solid #e9a132;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto; }
}
~~~

Dla typowego tekstu warto dążyć do współczynnika kontrastu co najmniej 4,5:1 według WCAG AA, a dla dużego tekstu często wystarcza 3:1. Samo rozróżnianie elementów kolorem nie jest wystarczające, jeśli informacja ma charakter funkcjonalny (np. błąd formularza). Dla CV szczególnie ważna jest czytelność i struktura na czytnikach ekranu.

## 11. Pseudoklasy, pseudoelementy i interakcje

Pseudoklasa opisuje stan (np. :hover, :focus-visible, :checked), a pseudoelement część renderowanej reprezentacji (np. ::before, ::after). CSS potrafi reagować na stan i zapewniać przejścia, ale nie zastąpi JavaScript tam, gdzie trzeba dynamicznie przetwarzać dane.

~~~css
a:hover { text-decoration-thickness: 3px; }
.card::before { content: ""; display: block; height: 3px; background: #3867b2; }
~~~

Dekoracyjne ::before nie jest dobrym miejscem na ważne informacje tekstowe, ponieważ takie treści mogą być inaczej interpretowane przez technologie wspomagające.

## 12. Organizacja stylów i ich debugowanie

Nazwy klas wybieraj według funkcji: .cv-header, .skills-list, .experience-card, a nie według chwilowego koloru: .blue-box. Zadbaj o spójną skalę odstępów i kolory w zmiennych CSS:

~~~css
:root {
  --surface: #ffffff;
  --paper: #f5f7fb;
  --ink: #1a2a3d;
  --accent: #2058a2;
  --space: 1rem;
}

body { color: var(--ink); background: var(--paper); }
.card { background: var(--surface); padding: var(--space); }
~~~

Kiedy styl „nie działa”, sprawdź: czy plik style.css został pobrany (Network), czy selektor pasuje do elementu (Elements), czy nie przegrał w kaskadzie (Styles), czy właściwość obowiązuje dla wybranego display oraz czy przeglądarka nie używa starej kopii z cache.

## 13. Praktyczne zadanie W2/L2: stylowanie CV

1. Skopiuj HTML do folderu zad2 i dołącz zewnętrzny style.css.
2. Wprowadź hierarchię nagłówków, typografię i paletę barw.
3. Stwórz panel kompetencji oraz sekcję doświadczenia z Grid/Flexbox.
4. Zrób widok mobilny w jednej kolumnie.
5. Dodaj widoczny focus do odsyłaczy.
6. W DevTools zasymuluj telefon i szeroki monitor.
7. Popraw przynajmniej jeden problem znaleziony na małym ekranie.

**Kryterium sukcesu:** wersja CV jest czytelna na komputerze i telefonie, ma zewnętrzny plik CSS i wykorzystuje przynajmniej jedno z narzędzi Flexbox/Grid.

## 14. Pytania do samosprawdzenia

1. Czym różni się kaskada od dziedziczenia?
2. Jaka jest różnica między klasą i ID w selektorach?
3. W jakim przypadku ważne jest box-sizing: border-box?
4. Po co używa się padding, a po co margin?
5. Co oznacza jednostka rem?
6. Kiedy korzystać z Flexbox, a kiedy z Grid?
7. Jak działają justify-content i align-items w flex-direction: row?
8. Czym jest breakpoint i dlaczego nie ma uniwersalnej wartości?
9. Jak działa media query min-width?
10. Co powoduje display: none?
11. Dlaczego position:absolute nie jest dobrym podstawowym rozwiązaniem układu CV?
12. Co oznacza :focus-visible i kiedy jest aktywny?
13. Jak sprawdzić, dlaczego kolor tekstu ma nieoczekiwaną wartość?
14. Dlaczego sama zmiana koloru nie zawsze wystarcza do komunikatu błędu?
15. Co oznacza prefers-reduced-motion?

## 15. Materiały źródłowe

- [MDN — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [MDN — CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)
- [MDN — Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
- [MDN — Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
- [WCAG — Web Accessibility Initiative](https://www.w3.org/WAI/standards-guidelines/wcag/)

Podczas obrony możesz zostać poproszony o zmianę układu, naprawę zachowania na telefonie, wyjaśnienie priorytetu reguł lub wskazanie, dlaczego określona właściwość nie działa.
