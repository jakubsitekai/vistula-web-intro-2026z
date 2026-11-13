# Vistula — Wprowadzenie do technologii internetowych (2026/2027)

Publiczny serwis kursu, **niezależny od aplikacji quizowej**. Repozytorium nie jest celem automatycznego deployu z prywatnego `claude-glm`.

Strona WWW (po włączeniu GitHub Pages): https://jakubsitekai.github.io/vistula-web-intro-2026z/

## Materiały
- [Strona kursu](index.html)
- [Sylabus](syllabus.md)
- [Zadania i zasady ocen](assignments.md)
- [Rozbudowane wykłady W1–W4 w przeglądarce](lectures/index.html)
- [Sonda preferowanej ścieżki nauki](https://github.com/jakubsitekai/vistula-web-intro-2026z/issues/1)
- [Przykładowe dane CV](examples/cv.json)

## Oddawanie prac przez Pull Request
Studenci umieszczają swoje CV we **własnym** repozytorium. Następnie wykonują fork tego repo, tworzą plik `submissions/TWOJ_LOGIN.md` z linkami według [szablonu](submissions/_TEMPLATE.md) i otwierają PR do `main`.

**Otwarcie PR = zgłoszenie. Nie musisz go mergować.** Prowadzący sprawdza [listę PR](https://github.com/jakubsitekai/vistula-web-intro-2026z/pulls). Wystawienie oceny odbywa się poza GitHubem.

[Instrukcja oddawania krok po kroku](submissions/README.md).

## Uruchomienie GitHub Pages
W repozytorium wybierz **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. Strona jest czystym HTML/CSS i nie wymaga kompilacji.

## Wymagania
- **3,0:** CV w HTML, CSS, JS i DOM/fetch/JSON; bez obrony. Po potwierdzeniu przyjęcia kompletu zaliczone są wykład i laboratorium; dalsza obecność nie jest wymagana, chyba że prowadzący wyjątkowo wezwie na konkretne zajęcia.
- **4,0:** CV oraz kurs Coursera/równoważny **albo** rozszerzenie CV **albo** rozbudowane materiały W1–W4 i szerszy egzamin; pełna indywidualna obrona.
- **5,0:** spełnienie wymagań na 4,0 oraz Biblioteka (REST, CRUD, Supabase) i pełna obrona.

Supabase Auth i RLS nie są wymagane w demonstracyjnej aplikacji na 5,0. W publicznym frontendzie nie wolno umieszczać kluczy `service_role` ani `secret`.
