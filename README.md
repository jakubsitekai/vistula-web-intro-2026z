# Vistula — Wprowadzenie do technologii internetowych (2026/2027)

Publiczny serwis kursu, **niezależny od aplikacji quizowej**. Repozytorium nie jest celem automatycznego deployu z prywatnego `claude-glm`.

Strona WWW (po włączeniu GitHub Pages): https://jakubsitekai.github.io/vistula-web-intro-2026z/

## Materiały
- [Strona kursu](index.html)
- [Sylabus](syllabus.md)
- [Zadania i zasady ocen](assignments.md)
- [Rozbudowane wykłady W1–W4 w przeglądarce](lectures/index.html)
- [Deklaracja docelowej oceny — Google Forms](https://forms.gle/VSh1FJd9ow4FC8fL9)
- [Sonda preferowanej ścieżki nauki](https://github.com/jakubsitekai/vistula-web-intro-2026z/issues/1)
- [Przykładowe dane CV](examples/cv.json)

## Oddawanie prac przez Pull Request
**Coursera na 4,0:** student może oddać samo potwierdzenie ukończenia kursu, bez CV: certyfikat lub screenshoty w swoim repozytorium GitHub i link do tych plików w PR.

Studenci umieszczają swoje CV we **własnym** repozytorium. Następnie wykonują fork tego repo, tworzą plik `submissions/TWOJ_LOGIN.md` z linkami według [szablonu](submissions/_TEMPLATE.md) i otwierają PR do `main`.

**Otwarcie PR = zgłoszenie. Nie musisz go mergować.** Prowadzący sprawdza [listę PR](https://github.com/jakubsitekai/vistula-web-intro-2026z/pulls). Wystawienie oceny odbywa się poza GitHubem.

[Instrukcja oddawania krok po kroku](submissions/README.md).

## Uruchomienie GitHub Pages
W repozytorium wybierz **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. Strona jest czystym HTML/CSS i nie wymaga kompilacji.

## Wymagania
- **3,0:** CV w HTML, CSS, JS i DOM/fetch/JSON; bez obrony. Po potwierdzeniu przyjęcia kompletu zaliczone są wykład i laboratorium; dalsza obecność nie jest wymagana, chyba że prowadzący wyjątkowo wezwie na konkretne zajęcia.
- **4,0:** ukończenie zaakceptowanego kursu Coursera i potwierdzenie (certyfikat lub screenshoty) na GitHubie = 4,0 **bez egzaminu, obrony i obowiązku CV**. Alternatywnie: CV 1–4 + rozszerzony projekt i obrona albo CV 1–4 + materiały W1–W4 i egzamin.
- **5,0:** CV 1–4, zaliczenie jednej ścieżki na 4,0 oraz aplikacja Biblioteka (REST, CRUD, Supabase) z pełną obroną.

Supabase Auth i RLS nie są wymagane w demonstracyjnej aplikacji na 5,0. W publicznym frontendzie nie wolno umieszczać kluczy `service_role` ani `secret`.
