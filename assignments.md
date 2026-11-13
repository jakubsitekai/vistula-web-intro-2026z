# Zadania, rubryki i przykładowa struktura plików

## Zasady wspólne
- Jedno repozytorium studenta zawierające niezależne katalogi zad1, zad2, zad3, zad4. Każdy katalog ma własny index.html i działa jako osobna wersja CV.
- Można używać fikcyjnych danych do CV; prawdziwe dane osobowe nie są potrzebne.
- Każda kolejna wersja rozwija poprzednią. Gotowe działające strony należy udostępnić na GitHub Pages.
- Zgłoszenie przez PR zawiera link do repozytorium, zad4 i docelową ocenę. Zalecany GitHub login zgodny z Team Project: `vistula-team-project-123456` lub `vistula-team-project-123456-abc`; numer indeksu może być częścią publicznego loginu. Nie jest wymagane nazwisko. Jeśli ktoś nie chce upubliczniać identyfikatora, może powiązać konto prywatnie.
- Do oceny 3,0 nie wymaga się obrony. Na 4,0 i 5,0 wymagana jest indywidualna, szczegółowa obrona wiedzy i pracy: pytania z teorii i praktyki, analiza kodu, rozwiązywanie problemów oraz zmiany na żywo. Prowadzący dostosowuje liczbę i zakres pytań do oceny; nie obowiązuje limit jednej ani dwóch zmian.
- Standardowy termin oddania pakietu 1–4: koniec L4; można oddać wcześniej.

## Zadanie 1 — CV HTML
Plik zad1/index.html. Wymagane: poprawny dokument HTML5, h1, opis, co najmniej trzy sekcje (np. edukacja, doświadczenie, umiejętności), lista ul/ol, link a, sensowne znaczniki nagłówków i section/main. Wersja działa bez CSS i JavaScript.

## Zadanie 2 — CSS
Katalog zad2 z index.html i style.css. Wymagane: osobny arkusz, czytelny układ, własna typografia i kolory, układ oparty o Flexbox lub Grid, rozwiązanie działające na mobilnych ekranach, sensowny kontrast.

## Zadanie 3 — JavaScript
Katalog zad3 z index.html, style.css i script.js. Wymagane: co najmniej dwa działania po stronie klienta reagujące na użytkownika, np. przycisk motywu, rozwijanie sekcji, filtrowanie umiejętności, pokazanie/ukrycie dodatkowych szczegółów. Obsługa zdarzeń przez addEventListener; bez błędów JS w konsoli.

## Zadanie 4 — JSON + fetch + DOM
Katalog zad4 z index.html, style.css, script.js, cv.json. Wymagane:
1. Dane opisujące przynajmniej trzy sekcje CV znajdują się w cv.json, a nie w HTML.
2. JavaScript wywołuje fetch('./cv.json'), przetwarza JSON i generuje elementy DOM.
3. Zmiana cv.json skutkuje zmianą treści strony bez ręcznej edycji HTML.
4. Widoczny jest stan ładowania i komunikat w przypadku błędu sieci.
5. Strona jest uruchamiana przez GitHub Pages (otwieranie pliku jako file:// nie jest zalecane).
6. Nie używaj innerHTML dla niezweryfikowanego tekstu; bezpieczniejsze są createElement i textContent.
W katalogu examples/ znajduje się przykładowy format JSON; student może go rozbudować.

## Ścieżka na 4,0 A — kurs
Ukończ zaakceptowany kurs z zakresu technologii webowych. Preferowane: IBM HTML/CSS/JS, University of Michigan JavaScript/PHP, SkillUp Spring (dla osób znających Javę). Dokumentacja: certyfikat, osiągnięcia na platformie, zrzuty pokazujące ukończone moduły/ćwiczenia; bez konieczności publicznego publikowania dokumentacji z danymi osobowymi. Możliwa jest równoważna bezpłatna ścieżka MDN/freeCodeCamp i dokumentacja wykonanych ćwiczeń. Dokumentacja ukończenia kursu nie zastępuje indywidualnej obrony CV i wiedzy zdobytej na kursie.

## Ścieżka na 4,0 B — projekt
Rozbuduj zad4 o formularz edycji pól CV, walidację (co najmniej dwa warunki), zapis zmienionych danych w localStorage i przywracanie przy kolejnym otwarciu strony. Przedstaw działające rozwiązanie i obroń je indywidualnie: wyjaśnij kod, odpowiedz na pytania teoretyczne i wykonaj polecone przez prowadzącego modyfikacje oraz debugowanie. Zakres weryfikacji nie ogranicza się do jednej zmiany. Oczekiwana wiedza: DOM, zdarzenia, JSON, fetch, localStorage, walidacja, rola serwera.

## Ścieżka na 5,0 — Biblioteka
**Warunek wstępny:** wykonanie całej ścieżki na ocenę 4,0 — zarówno CV 1–4, jak i kursu/równoważnej nauki **albo** rozszerzonego projektu CV — z zaliczeniem indywidualnej obrony. Dopiero dodatkowo należy wykonać aplikację Biblioteka i obronić ją indywidualnie.

Frontend HTML/CSS/JS na GitHub Pages. Backend preferowany: Supabase Data API oraz PostgreSQL; alternatywnie równoważny REST backend w PHP, Javie albo Node.js po uzgodnieniu.
Model:
- authors: id, name
- books: id, title, publication_year, author_id (klucz obcy do authors)
Wymagane:
- CRUD autorów i książek przez formularze
- widok listy z nazwiskiem autora przy każdej książce
- filtrowanie/wyszukiwanie oraz walidacja danych
- async/await, obsługa loading i błędów API
- poprawny związek 1:N i integralność referencyjna
- uwierzytelnianie i polityki RLS to **zalecenia, nie wymagania na ocenę**; w ćwiczeniu używamy wyłącznie fikcyjnych danych i odrębnej bazy demonstracyjnej
- **nie udostępniaj** kluczy secret ani service_role w przeglądarce; do frontendu można stosować publiczny klucz publishable/anon; publiczny zapis pozwala obcym zmieniać rekordy
- README z opisem architektury i uruchomienia; działające demo
- pełne wymagania oceny 4,0 (kurs **lub** rozszerzenie CV, z obroną), a ponadto obrona Biblioteki
Na obronie: prezentacja, wyjaśnienie przepływu HTTP/REST i relacji SQL, dwie drobne zmiany, np. nowe pole books.genre oraz filtr po autorze.

## Przykłady pytań na obronie
- Jak działa fetch i co oznacza asynchroniczność?
- Co robi textContent? Jak działa DOM?
- Jakie statusy HTTP zwraca API przy błędzie?
- Czym jest żądanie GET, POST, PATCH i DELETE?
- Na czym polega klucz obcy i relacja jeden-do-wielu?
- Czym różni się klucz publishable od secret w Supabase?
- Jak usunąć błąd w wywołaniu REST i jak sprawdzić odpowiedź serwera?
- (Pytanie dodatkowe, nieobowiązkowe) Czym jest RLS i jakie ryzyko niesie nieograniczony publiczny zapis?

## Co jest oceniane
3,0: kompletność zadań, działające linki i podstawowe kryteria funkcjonalne.
4,0 A: potwierdzona realizacja zaakceptowanej ścieżki nauki oraz indywidualna obrona CV i wiedzy.
4,0 B: działające rozszerzenie oraz pełna indywidualna obrona z pytaniami i modyfikacjami.
5,0: wszystkie wymagania oceny 4,0 oraz działająca aplikacja, baza danych, REST, jakość implementacji i pełna indywidualna obrona: analiza architektury, teorii, kodu i modyfikacje według poleceń.
