# W4 — JSON, fetch, REST, backend, SQL i Supabase

**Czas:** 2,5 godziny dydaktycznej. **Laboratoria:** L4 — dynamiczne CV, oraz projekt Biblioteka na ocenę 5,0.

## 1. Dlaczego rozdzielamy dane od wyglądu?

W zadaniu pierwszym tekst CV był wpisany bezpośrednio w HTML. Później JavaScript dodawał interakcje. W zadaniu L4 dane trafią do osobnego pliku cv.json, a JavaScript pobierze je i utworzy z nich elementy DOM.

Ten prosty krok pokazuje centralną ideę architektury aplikacji: **dane**, **logika** i **prezentacja** mogą być oddzielnymi warstwami. Zmiana uczelni lub listy umiejętności nie powinna wymagać ręcznego edytowania znaczników HTML. Dla statycznego CV taki podział jest ćwiczeniem; dla większych aplikacji pozwala wiele interfejsów oprzeć o te same dane.

W aplikacji Biblioteka na ocenę 5 dane nie pochodzą już tylko z pliku JSON: są przechowywane w PostgreSQL, a frontend komunikuje się z API Supabase. Mimo zmiany źródła danych mechanizm wyświetlania listy i formularzy pozostaje podobny.

## 2. JSON — format wymiany danych

JSON (JavaScript Object Notation) jest tekstowym formatem reprezentowania wartości. Nie jest kodem JavaScript wykonywanym przez przeglądarkę. Podstawowe typy wartości JSON to: obiekt, tablica, string, liczba, boolean i null. JSON nie przechowuje funkcji, undefined ani komentarzy. Klucze obiektów i wartości tekstowe muszą mieć podwójne cudzysłowy.

Przykładowy plik cv.json:

~~~json
{
  "name": "Alex",
  "headline": "Junior Web Developer",
  "skills": ["HTML", "CSS", "JavaScript"],
  "education": [
    {"school": "Vistula", "years": "2024–2027"}
  ],
  "experience": []
}
~~~

**Poprawny JSON** wymaga prawidłowej składni: przecinek po ostatnim elemencie tablicy lub obiektu jest błędem. Wartości muszą mieć odpowiednie typy. Gdy rok jest liczbą, nie jest równoważny stringowi w każdej operacji; JavaScript może konwertować typy, ale nie powinieneś polegać na przypadkowej konwersji.

JSON.parse zamienia poprawny string JSON na wartość JavaScript, a JSON.stringify tworzy zapis tekstowy. Sama nazwa rozszerzenia .json nie sprawia, że dane są automatycznie dostępne dla skryptu — trzeba je dostarczyć przez serwer lub import zgodny ze środowiskiem.

## 3. fetch — pobieranie danych z serwera

Fetch API pozwala wysyłać żądania HTTP z przeglądarki. Wywołanie fetch() zwraca Promise, czyli obiekt opisujący wynik operacji, który może być dostępny dopiero później.

~~~javascript
async function loadCV() {
  const response = await fetch("./cv.json");
  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }
  return await response.json();
}
~~~

Szczegółowo:
1. fetch("./cv.json") wysyła żądanie do adresu względnego;
2. await czeka na odpowiedź w obrębie funkcji async;
3. response.ok jest true dla statusów z zakresu 200–299;
4. response.json() odczytuje ciało odpowiedzi i parsuje JSON;
5. wynik jest zwykłym obiektem lub tablicą JavaScript.

**Ważny błąd:** fetch sam z siebie nie odrzuca Promise tylko dlatego, że serwer zwrócił HTTP 404 albo 500. Trzeba sprawdzić response.ok lub response.status. Promise może zostać odrzucony z powodu błędu sieci, problemu CORS albo przerwania żądania.

## 4. Obsługa loading, sukcesu i błędu

Interfejs powinien wyjaśniać, co robi. Użytkownik nie może domyślać się, czy dane się ładują, czy aplikacja się zawiesiła.

~~~html
<p id="status" role="status">Ładowanie danych...</p>
<main id="cv"></main>
<script src="./script.js" defer></script>
~~~

~~~javascript
const status = document.querySelector("#status");
const container = document.querySelector("#cv");

async function loadCV() {
  try {
    status.textContent = "Ładowanie...";
    const response = await fetch("./cv.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();

    container.replaceChildren();
    const title = document.createElement("h1");
    title.textContent = data.name ?? "Bez imienia";
    container.append(title);

    const list = document.createElement("ul");
    for (const skill of (data.skills ?? [])) {
      const li = document.createElement("li");
      li.textContent = skill;
      list.append(li);
    }
    container.append(list);
    status.textContent = "Dane załadowane.";
  } catch (error) {
    status.textContent = "Nie udało się pobrać CV.";
    console.error(error);
  }
}

loadCV();
~~~

Ten przykład dotyczy tylko fragmentu CV. W zadaniu L4 należy także generować inne sekcje (edukacja, doświadczenie itd.). Własne rozwiązanie powinno być czytelne, rozbite na funkcje i odporne na pustą tablicę czy brak opcjonalnego pola.

## 5. Asynchroniczność, Promise i kolejność wykonania

Operacja sieciowa trwa nieokreślony czas. Funkcja async zwraca Promise także wtedy, gdy w środku jest return ze zwykłą wartością. Kod po await w tej funkcji wykonuje się dopiero po zakończeniu oczekiwania; inne zadania aplikacji mogą działać w tym czasie.

~~~javascript
console.log("A");
fetch("./cv.json").then(() => console.log("C"));
console.log("B");
~~~

Przed pojawieniem się C na pewno zobaczysz A, a potem B, ponieważ callback .then jest uruchamiany asynchronicznie. Nie należy jednak traktować samej kolejności wyświetlania jako dowodu, że plik został poprawnie sparsowany — callback w przykładzie nie weryfikuje statusu.

Promise może zostać **fulfilled** albo **rejected**. try/catch w funkcji async obsługuje błędy przy await, ale nie przechwyci automatycznie niezależnego Promise, którego nie oczekujesz ani nie zwracasz.

Jeśli użytkownik wywoła dwa wyszukania szybko po sobie, wolniejsze starsze żądanie może przyjść jako ostatnie i nadpisać nowszy wynik. Jednym z rozwiązań jest AbortController lub sprawdzanie identyfikatora ostatniego żądania. To temat rozszerzający, przydatny w praktycznych aplikacjach.

## 6. Fetch z innej domeny i CORS

Same Origin Policy ogranicza dostęp skryptów do zasobów innego origin, czyli kombinacji schematu, hosta i portu. Strona hostowana na GitHub Pages i API na domenie supabase.co mają różne originy. Przeglądarka może pozwolić na odczyt odpowiedzi tylko wtedy, gdy serwer udostępnia odpowiednie nagłówki CORS (Cross-Origin Resource Sharing).

Nie wystarczy dopisać nagłówka Access-Control-Allow-Origin po stronie klienta — jego znaczenie wynika z odpowiedzi **serwera**. CORS nie jest mechanizmem autoryzacji użytkownika ani zabezpieczeniem samej bazy danych. Klient spoza przeglądarki może komunikować się z serwerem niezależnie od przeglądarkowych ograniczeń CORS.

Przy niektórych żądaniach przeglądarka wykonuje wcześniejsze żądanie OPTIONS (preflight) z pytaniem, czy określona metoda lub nagłówki są dozwolone. Jeśli preflight się nie powiedzie, główne żądanie może nie zostać wysłane.

W zadaniu CV fetch("./cv.json") kieruje się do tej samej domeny co strona, co upraszcza problem. W zadaniu Biblioteka Supabase standardowo obsługuje komunikację cross-origin, ale nadal trzeba poprawnie skonfigurować API i dostęp.

## 7. REST — zasoby, URI i operacje

REST to styl architektoniczny opisujący komunikację z zasobami przez jednolity interfejs i ograniczenia takie jak bezstanowość. W typowym REST API zasoby identyfikujemy adresami, a operacje wyrażamy metodami HTTP.

Przykłady aplikacji Biblioteka:
- GET /books — lista książek;
- GET /books/17 — konkretna książka;
- POST /books — dodanie książki;
- PATCH /books/17 — zmiana pól;
- DELETE /books/17 — usunięcie.

Projekt REST API nie oznacza po prostu „dowolnego endpointu zwracającego JSON”. Ważne są semantyka metod i statusów, sensowne modelowanie zasobów i bezstanowość żądań. Samo słowo REST bywa nadużywane, więc przy obronie istotne będzie raczej zrozumienie operacji HTTP i danych niż recytowanie definicji.

Przykładowe zapytanie z body:

~~~http
POST /books HTTP/1.1
Content-Type: application/json

{"title":"Przykładowa książka","author_id":3}
~~~

W poprawnie zaprojektowanym API odpowiedzią może być 201 Created. Błąd walidacji może mieć status 400/422, brak uwierzytelnienia 401, brak uprawnień 403. W implementacji trzeba sprawdzić rzeczywistą dokumentację API.

## 8. Backend i trzy warstwy aplikacji

Typowa aplikacja internetowa zawiera:
1. **frontend** — elementy widoczne dla użytkownika, formularze, zdarzenia i renderowanie;
2. **backend/API** — przyjmuje żądania, sprawdza zasady dostępu, przetwarza logikę i komunikuje się z bazą;
3. **baza danych** — zapewnia trwałe przechowywanie i zapytania.

Statyczny plik cv.json nie jest pełnym backendem; jest zasobem serwowanym przez hosting. Użycie Supabase zapewnia gotowe API nad bazą Postgres i usługi backendowe bez konieczności napisania osobnego serwera w Javie, PHP albo Node.js.

To nie znaczy, że frontend staje się backendem. Kod przeglądarki działa na urządzeniu użytkownika i nie może być zaufanym miejscem do przechowywania sekretów administracyjnych.

## 9. SQL, tabele i relacje

W projekcie Biblioteka są dwie tabele: authors i books. Autor może mieć wiele książek, każda książka ma jednego przypisanego autora. To relacja jeden-do-wielu.

~~~sql
create table authors (
  id bigint generated by default as identity primary key,
  name text not null
);

create table books (
  id bigint generated by default as identity primary key,
  title text not null,
  publication_year int,
  author_id bigint not null references authors(id)
);
~~~

Klucz główny identyfikuje rekord. Klucz obcy books.author_id wskazuje istniejącego autora. Baza może wymusić integralność referencyjną: nie da się dodać książki wskazującej nieistniejącego autora, chyba że ograniczenia zmieniono lub wyłączono.

Zapytania SQL:

~~~sql
select * from authors order by name;

select b.title, a.name as author
from books b
join authors a on a.id = b.author_id
order by b.title;

insert into authors (name) values ('Przykładowy Autor');
update books set title = 'Nowy tytuł' where id = 10;
delete from books where id = 10;
~~~

**JOIN** łączy dane według warunku relacji. INNER JOIN zwraca pasujące rekordy, natomiast LEFT JOIN może zachować wiersze z lewej tabeli bez pary w prawej. Jeśli books.author_id jest obowiązkowe i zapewnia integralność, zwykły JOIN wystarczy do wyświetlania książek z autorami.

Uwaga: usunięcie autora z powiązanymi książkami może zostać zablokowane przez klucz obcy. Student musi zdecydować, czy blokować takie usunięcie, najpierw usuwać/przepinać książki albo skonfigurować odpowiednie działanie przy usunięciu. Bezmyślne kaskadowe usuwanie może prowadzić do utraty danych.

## 10. Supabase jako gotowy backend

Supabase udostępnia PostgreSQL i warstwę API, w tym REST zbudowany na zasobach bazy. Z poziomu strony HTML/JS można pobierać i modyfikować rekordy przez API REST lub klienta JavaScript Supabase.

W projekcie demonstracyjnym na 5,0 wymagamy:
- tabel authors i books powiązanych kluczem obcym;
- wyświetlania list oraz wyszukiwania/filtrowania;
- formularzy dodawania, edycji i usuwania rekordów;
- poprawnego wywoływania operacji HTTP/REST;
- obsługi komunikatów ładowania i błędów;
- trwałego przechowywania danych między odświeżeniami.

Wymagania **nie obejmują** implementacji rejestracji użytkowników, pełnego logowania ani obowiązkowych polityk RLS. Można użyć odrębnego, publicznego projektu demonstracyjnego wyłącznie na fikcyjnych danych.

## 11. Czym jest RLS i dlaczego tutaj jest opcjonalne?

RLS (Row Level Security) to mechanizm PostgreSQL ograniczający dostęp do poszczególnych wierszy tabel zgodnie z politykami. Przykład zastosowania: każdy może czytać publiczne książki, ale zalogowany użytkownik może edytować tylko własne rekordy. Supabase Auth służy do identyfikacji użytkowników, a RLS do egzekwowania odpowiednich reguł dostępu na poziomie bazy.

**Na potrzeby tego przedmiotu RLS i Supabase Auth są jedynie materiałem dodatkowym, nie wymaganiem zaliczenia projektu Biblioteka.** Student może na własne ryzyko udostępnić API demonstracyjne z ograniczonymi, fikcyjnymi danymi. Trzeba jednak rozumieć, że publicznie dostępny zapis może pozwolić osobom trzecim na zmianę lub usunięcie rekordów, a więc nie nadaje się do danych produkcyjnych.

Klucze Supabase mają różne role:
- publiczny publishable/anon key może być używany przez frontend zgodnie z przeznaczeniem; **nie jest sekretem administracyjnym**;
- secret/service_role daje uprzywilejowany dostęp i **nigdy nie może być publikowany w HTML, JS ani publicznym repozytorium**.

## 12. Jak wykonać CRUD z przeglądarki?

Przykład ogólnego wywołania POST do API:

~~~javascript
async function createBook(baseUrl, publicKey, book) {
  const response = await fetch(baseUrl + "/rest/v1/books", {
    method: "POST",
    headers: {
      "apikey": publicKey,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(book)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error("HTTP " + response.status + ": " + details);
  }
  return await response.json();
}
~~~

Jest to przykład edukacyjny dla odpowiednio skonfigurowanego publicznego projektu Supabase. W konkretnym projekcie konfiguracja nagłówków/autoryzacji zależy od rodzaju klucza i ustawień API; przy użyciu biblioteki supabase-js część szczegółów obsługuje klient. Do zapisu używaj jedynie publicznego klucza w przeglądarce i tylko uprawnień przewidzianych dla projektu demonstracyjnego. 

Uwaga: właściwość response.ok nie zapewnia prawidłowego zapisu, jeśli API zwraca powodzenie, ale logika aplikacji nie aktualizuje widoku. Po operacji sprawdź także bazę i ponownie pobierz aktualną listę.

## 13. Bezpieczeństwo i jakość aplikacji webowej

Kluczowe ryzyka:
- XSS: niebezpieczne wstawianie niezaufanej treści jako HTML; używaj textContent dla tekstu;
- błędne uprawnienia do bazy i publiczne operacje zapisu;
- sekrety trzymane w frontendzie;
- brak walidacji danych po stronie serwera;
- SQL injection w aplikacjach budujących zapytania ze stringów; korzystaj z parametrów/bezpiecznych bibliotek;
- przypadkowe ujawnienie danych w historii Git;
- niejasne komunikaty błędów i błędne założenia o statusie HTTP.

W prostym ćwiczeniu ważna jest świadomość ryzyka i bezpieczne użycie fikcyjnych danych. Nie wymaga się kompletnego systemu bezpieczeństwa produkcyjnego, ale wymaganie „nie publikuj sekretów administracyjnych” pozostaje bezwzględne.

## 14. Projekt Biblioteka: minimalna architektura

Frontend w GitHub Pages:
- strona główna z listą książek i autorów;
- formularz dodawania książki i autora;
- edycja/usuwanie;
- obsługa błędów i stanów ładowania;
- filtr książek po autorze lub wyszukiwanie tytułu.

Backend Supabase:
- PostgreSQL z authors i books;
- REST API do odczytu i zapisu;
- publiczny klucz zgodnie z konfiguracją testowego projektu;
- opcjonalnie Auth i RLS.

W README projektu wyjaśnij, co przechowuje każda tabela, skąd frontend bierze URL API, jakie metody HTTP są wykorzystywane oraz jak działa relacja autor–książki. Przy obronie możesz zostać poproszony o nową kolumnę genre, walidację roku, dodatkowy filtr, poprawkę usuwania lub wyjaśnienie błędu z Network.

## 15. AI w programowaniu i ocena wiedzy

LLM i agenci mogą pisać kod, proponować strukturę projektu, generować testy i wyszukiwać problemy. Korzystanie z AI jest dozwolone, ale nie zastępuje umiejętności **zrozumienia i modyfikowania** rozwiązania. Model może wygenerować pozornie działający kod z błędem bezpieczeństwa lub nieprawidłowymi założeniami.

Przyjmij praktyczny schemat:
1. Zdefiniuj zachowanie, dane i oczekiwaną strukturę.
2. Wygeneruj lub samodzielnie napisz niewielką funkcję.
3. Uruchom ją i sprawdź w DevTools/Network.
4. Zmień wymaganie i sprawdź, czy umiesz poprawić rozwiązanie.
5. Udokumentuj decyzje i ograniczenia.

Na ocenach 4,0–5,0 pełna indywidualna obrona obejmuje pytania, analizę kodu, debugowanie i modyfikacje według decyzji prowadzącego — nie ogranicza się do jednej czy dwóch zmian.

## 16. Ćwiczenie L4 — dynamiczne CV

1. W zad4 przygotuj plik cv.json z sekcjami danych.
2. W index.html pozostaw puste kontenery, przyciski i element statusu.
3. W script.js utwórz funkcję async pobierającą ./cv.json.
4. Sprawdź response.ok i sparsuj JSON.
5. Zbuduj elementy DOM za pomocą createElement i textContent.
6. Dodaj stan ładowania, sukcesu i błędu.
7. Zmień zawartość cv.json, odśwież stronę i potwierdź, że treść się aktualizuje.
8. Sprawdź Console i Network na opublikowanej stronie GitHub Pages.
9. Dodaj obsługę pustej listy i ewentualnie brakującego pola.
10. Udokumentuj działający link i wyślij zgłoszenie przez PR.

## 17. Pytania do samosprawdzenia

1. Czym JSON różni się od obiektu JavaScript?
2. Co zwraca fetch?
3. Dlaczego należy sprawdzić response.ok?
4. Co robi response.json i co może się wtedy nie udać?
5. Jak działa async/await?
6. Czym jest CORS i kto wysyła właściwe nagłówki?
7. Dlaczego CORS nie zastępuje autoryzacji?
8. Co oznacza GET, POST, PATCH, DELETE w REST?
9. Czym backend różni się od frontendu?
10. Dlaczego GitHub Pages może serwować JSON, ale nie backend Java?
11. Na czym polega relacja 1:N w bazie?
12. Czym jest klucz obcy?
13. Co robi JOIN?
14. Co się stanie, gdy spróbujesz usunąć autora z książkami?
15. Po czym poznasz, że rekord jest naprawdę zapisany?
16. Dlaczego nie wolno publikować service_role/secret?
17. Czym jest RLS? (pytanie dodatkowe, opcjonalne)
18. Jak wykryjesz niepoprawną odpowiedź API w DevTools?
19. Jak zabezpieczysz wstawianie niezaufanego tekstu do DOM?
20. Kiedy użyjesz statusu 201, a kiedy 204?

## 18. Materiały uzupełniające

- [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON)
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [PostgreSQL — SQL](https://www.postgresql.org/docs/current/tutorial-sql.html)
- [Supabase — dokumentacja](https://supabase.com/docs)
- [Supabase — RLS (dodatkowe)](https://supabase.com/docs/guides/database/postgres/row-level-security)

Przedmiot pokazuje proces powstawania aplikacji webowej, a nie uczy całego Spring Boot, PHP, PostgreSQL i bezpieczeństwa produkcyjnego w ciągu jednego semestru. Na wyższe oceny oczekuje się jednak rzeczywistego zrozumienia wykorzystywanych elementów.
