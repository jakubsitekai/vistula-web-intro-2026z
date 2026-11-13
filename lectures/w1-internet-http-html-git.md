# W1 — Internet, WWW, HTTP, HTML i Git

**Czas:** 2,5 godziny dydaktycznej. **Laboratorium:** L1 — CV w HTML i GitHub Pages.

## 1. Internet i World Wide Web

Internet to globalna sieć połączonych sieci komputerowych korzystających z rodziny protokołów TCP/IP. WWW to jedna z usług internetu: system dokumentów i zasobów identyfikowanych adresami URL, pobieranych zwykle przez HTTP/HTTPS. Innymi usługami internetu są e-mail, SSH czy komunikacja głosowa.

**Klient** inicjuje żądanie (np. przeglądarka), **serwer** odbiera je i odpowiada. Role te nie muszą oznaczać osobnych fizycznych komputerów. Serwer aplikacji może być klientem bazy danych lub zewnętrznego API. WWW nie polega na tym, że „strona mieszka w przeglądarce”: przeglądarka otrzymuje dane, interpretuje HTML i CSS, wykonuje JavaScript i tworzy widok.

**Przykład:** odwiedzenie https://example.org/cv/index.html może uruchomić serię pobrań: główny HTML, arkusze stylów, skrypt, obraz, JSON oraz czcionki. Każdy zasób może mieć własne żądanie i odpowiedź. Część danych może pochodzić z cache albo CDN.

## 2. Droga od domeny do widocznej strony

1. Przeglądarka parsuje URL: schemat, host, port, ścieżka, parametry i fragment.
2. Jeśli trzeba, wyszukuje adres IP hosta przez DNS (z uwzględnieniem cache).
3. Nawiązuje połączenie transportowe i zabezpiecza je TLS w przypadku HTTPS.
4. Wysyła żądanie HTTP do właściwego hosta.
5. Serwer lub CDN zwraca status, nagłówki i opcjonalne body.
6. Przeglądarka parsuje HTML, pobiera zależności, tworzy DOM i oblicza style.
7. JavaScript może później wysłać kolejne żądania (np. o dane CV).

DNS tłumaczy nazwę domenową na informacje o adresowaniu, ale nie pobiera HTML. Jedna domena może wskazywać wiele serwerów, a jeden adres IP obsługiwać wiele witryn. HTTP/3 korzysta z QUIC zamiast TCP; schemat klient–serwer pozostaje podobny.

## 3. Budowa URL

Przykład: https://api.example.org:443/books/17?lang=pl#reviews

- https — schemat;
- api.example.org — nazwa hosta;
- 443 — port, zwykle domyślny dla HTTPS;
- /books/17 — ścieżka do zasobu;
- ?lang=pl — query string, czyli parametr zapytania;
- #reviews — fragment przetwarzany zwykle po stronie klienta i niewysyłany do serwera w żądaniu HTTP.

Adres względny ./cv.json jest rozwiązywany względem bieżącego dokumentu. Absolutna ścieżka /cv.json odnosi się do korzenia domeny. Na GitHub Pages publikującym stronę projektową w podkatalogu to rozróżnienie jest kluczowe: ścieżka /cv.json może prowadzić do błędu 404, a ./cv.json działać poprawnie.

## 4. HTTP w praktyce

HTTP to protokół żądań i odpowiedzi. Przykładowe żądanie:

~~~http
GET /zad4/cv.json HTTP/1.1
Host: student.github.io
Accept: application/json
~~~

Odpowiedź może wyglądać tak:

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"name":"Alex","skills":["HTML","CSS"]}
~~~

Nagłówki przenoszą metadane. Content-Type opisuje typ ciała odpowiedzi, Accept deklaruje preferowany format, Cache-Control wpływa na przechowywanie odpowiedzi w pamięci podręcznej, a Authorization może przenosić dane uwierzytelniające. Body może być JSON-em, HTML-em, obrazem, tekstem albo puste.

**Metody HTTP:** GET pobiera reprezentację; POST zwykle tworzy lub inicjuje operację; PUT zwykle zastępuje zasób; PATCH modyfikuje jego część; DELETE usuwa zasób. GET jest metodą bezpieczną — nie powinien służyć do wywoływania zmiany stanu. GET, PUT i DELETE mają semantykę idempotentną: wielokrotne wykonanie tej samej operacji powinno mieć ten sam zamierzony skutek.

**Statusy HTTP:** 200 — OK, 201 — utworzono, 204 — powodzenie bez treści, 301/308 — przekierowanie, 304 — dane niezmienione względem cache, 400 — błędne żądanie, 401 — brak uwierzytelnienia, 403 — dostęp zabroniony, 404 — brak zasobu, 409 — konflikt, 500 — błąd serwera. Kod 401 nie oznacza automatycznie braku uprawnień, a kod 403 niekoniecznie błędnego hasła.

Przy analizie błędu aplikacji sprawdzaj równolegle **Console** i **Network**. W Network widzisz faktyczny URL, metodę, status, nagłówki i odpowiedź. Komunikat z JavaScript nie mówi wszystkiego o przyczynie problemu.

## 5. HTTPS, TLS i pojęcie bezpieczeństwa

HTTPS oznacza HTTP chroniony przez TLS. Zapewnia poufność i integralność transmisji oraz mechanizmy uwierzytelniania serwera. Nie gwarantuje, że witryna jest rzetelna ani że aplikacja nie ma błędów. Publiczny skrypt JS można przeczytać, podobnie jak wartości dostępne w kodzie przeglądarki.

Nigdy nie umieszczaj prywatnych haseł, tokenów administracyjnych, kluczy service_role ani sekretów w kodzie GitHub Pages. Student może użyć fikcyjnych danych CV, ponieważ rzeczywiste dane osobowe nie są potrzebne do zaliczenia.

## 6. Semantyczny HTML5

HTML opisuje strukturę i znaczenie treści. Nie jest językiem programowania ani zamiennikiem CSS. Przykład pełnego dokumentu:

~~~html
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CV — Alex</title>
</head>
<body>
  <header>
    <h1>Alex — CV</h1>
    <p>Junior Web Developer</p>
  </header>
  <main>
    <section aria-labelledby="education">
      <h2 id="education">Wykształcenie</h2>
      <ul><li>Informatyka — 2024–2027</li></ul>
    </section>
  </main>
  <footer><a href="mailto:example@example.org">Kontakt</a></footer>
</body>
</html>
~~~

Doctype włącza nowoczesny tryb HTML. Atrybut lang określa język. Meta charset wskazuje kodowanie UTF-8. Viewport wspomaga responsywność. Element title wypełnia tytuł zakładki.

Znaczniki main, header, footer, nav i section pomagają opisać strukturę. Elementy h1–h6 organizują nagłówki. Lista ul/ol składa się z elementów li. Odsyłacz a ma atrybut href. Nie używaj nagłówka h3 wyłącznie do uzyskania małej czcionki — hierarchię semantyczną odróżniaj od wyglądu.

### Dostępność jest częścią poprawnego HTML

Przycisk button jest aktywowany klawiaturą i rozpoznawany przez technologie wspomagające. Klikalne div bez dodatkowej obsługi nie ma tych właściwości. Pole formularza powinno mieć czytelną etykietę label powiązaną przez for/id, a istotny obraz tekst alternatywny alt. Kontrast, poprawna kolejność nagłówków i możliwość obsługi klawiaturą zwiększają użyteczność.

## 7. Formularze i walidacja

~~~html
<form>
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Wyślij</button>
</form>
~~~

Atrybut id identyfikuje element w dokumencie; name jest używany jako nazwa pola w przesyłanych danych formularza. Type=email i required włączają podstawową walidację przeglądarki. W rzeczywistej aplikacji serwer musi ponownie zweryfikować dane wejściowe — walidację frontendową można ominąć.

Atrybut alt w img opisuje sens obrazu; dla dekoracyjnego obrazu może być pusty. Link otwierający nową kartę może mieć target=_blank i odpowiednie rel. Elementy semantyczne ułatwiają pisanie testów, a prawidłowe formularze lepiej działają na różnych urządzeniach.

## 8. Git a GitHub

**Git** to rozproszony system kontroli wersji; **GitHub** to platforma współpracy korzystająca z Git. **GitHub Pages** publikuje stronę z plików repozytorium. To trzy odrębne pojęcia.

Najważniejsze:
- repository — historia i pliki projektu;
- working tree — pliki robocze;
- staging area/index — zmiany przygotowane do commita;
- commit — zapis stanu w historii;
- branch — wskaźnik na commit;
- remote — zdalne repozytorium, najczęściej origin;
- pull request — propozycja zmian z gałęzi lub forka, wymagająca osobnego scalenia.

Przykładowy przebieg:

~~~bash
git clone https://github.com/student/cv-web.git
cd cv-web
git status
git add zad1/index.html
git commit -m "Add HTML CV"
git push origin main
~~~

Git add nie wysyła plików do GitHuba, a git commit zapisuje stan lokalnie. Dopiero git push przesyła commity do zdalnego repozytorium. Git fetch pobiera informacje i obiekty ze zdalnego repozytorium bez integracji z bieżącą gałęzią, a git pull próbuje dodatkowo zintegrować je przez merge lub rebase, zależnie od ustawień.

Praca z osobną gałęzią:

~~~bash
git switch -c feature/cv-style
git add .
git commit -m "Style CV"
git push -u origin feature/cv-style
~~~

Po otwarciu PR autor repozytorium może obejrzeć diff, skomentować kod, poprosić o zmiany albo scalać. Samo utworzenie PR nie oznacza scalenia. W tym kursie PR zawiera tylko link do rozwiązania i nie musi zostać zmergowany, aby zgłoszenie dotarło do prowadzącego.

Nie wykonuj bezrefleksyjnie git add . przed obejrzeniem git status — możesz przypadkowo dodać sekret lub plik tymczasowy. Używaj .gitignore i świadomych commitów. Opis commitów powinien informować o zmianie, a nie być przypadkowym tekstem.

## 9. GitHub Pages: możliwości i ograniczenia

GitHub Pages serwuje statyczne pliki HTML, CSS, JS, obrazy, JSON i inne zasoby. Nie wykonuje na serwerze PHP, Javy/Spring Boot ani kodu backendowego Node.js. Strona może jednak wysyłać żądania do zewnętrznego serwera lub Supabase.

Przykładowa struktura:
~~~text
cv-web/
  zad1/index.html
  zad2/index.html
  zad2/style.css
  zad3/index.html
  zad3/style.css
  zad3/script.js
  zad4/index.html
  zad4/style.css
  zad4/script.js
  zad4/cv.json
~~~

Po włączeniu Pages strona może być dostępna jako https://LOGIN.github.io/cv-web/zad4/. Gdy nie działa, sprawdź ścieżkę, wielkość liter, ustawienia publikacji, błędy 404 oraz zakładkę Network.

## 10. DevTools i diagnostyka

- Elements — aktualne drzewo DOM i style;
- Console — logi, błędy JavaScript, ręczne eksperymenty;
- Network — żądania HTTP i odpowiedzi;
- Application/Storage — localStorage, cookies i inne mechanizmy;
- Performance — analiza czasu ładowania i wykonania.

Ważne: DOM może się zmienić w wyniku działania JavaScript, więc zakładka Elements nie musi być identyczna z pierwotnym kodem HTML.

## 11. Samodzielne ćwiczenie W1/L1

1. Utwórz publiczne repozytorium z fikcyjnym CV.
2. Przygotuj poprawny zad1/index.html z co najmniej trzema sekcjami, listą i linkiem.
3. Włącz GitHub Pages i sprawdź adres strony.
4. W Network odszukaj GET dokumentu HTML i jego status.
5. Zrób drugi commit i obejrzyj porównanie zmian w historii Git.
6. Znajdź w Elements element h1 i wyjaśnij, po co użyłeś tego znacznika.

**Warunek sukcesu:** link do działającej strony HTML i historia sensownych zmian.

## 12. Pytania do samosprawdzenia

1. Internet a WWW — czym się różnią?
2. Do czego służy DNS? Czy DNS pobiera HTML?
3. Z jakich części składa się URL i czym jest fragment?
4. Czym HTTPS różni się od HTTP?
5. Jakie są role klienta i serwera?
6. Co robią metody GET, POST, PATCH i DELETE?
7. Jaka jest różnica między 401 a 403?
8. Czym różni się HTML od CSS i JavaScript?
9. Dlaczego semantyczne elementy HTML pomagają użytkownikom?
10. Co robią git add, git commit i git push?
11. Czym jest branch i pull request?
12. Czy PR można ocenić bez mergowania?
13. Dlaczego GitHub Pages nie uruchomi backendu PHP?
14. Dlaczego ./cv.json może działać, a /cv.json nie?
15. Dlaczego sekret w pliku JS nie jest sekretem?

## 13. Źródła uzupełniające

- [MDN: How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [MDN: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [Pro Git — bezpłatna książka](https://git-scm.com/book/en/v2)
- [GitHub Pages — dokumentacja](https://docs.github.com/en/pages)

Na ocenę wyższą niż 3,0 sam przeczytany tekst nie wystarcza. Trzeba potrafić wyjaśnić działanie kodu CV, wskazać odpowiednie fragmenty i modyfikować je podczas indywidualnej obrony.
