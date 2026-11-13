# W3 — JavaScript, zdarzenia, DOM, formularze i pamięć przeglądarki

**Czas:** 2,5 godziny dydaktycznej. **Laboratorium:** L3 — interaktywne CV oraz przygotowanie do L4.

## 1. JavaScript i rola przeglądarki

HTML tworzy strukturę dokumentu, CSS ustala jego prezentację, a JavaScript umożliwia wykonywanie logiki: reagowanie na użytkownika, modyfikowanie dokumentu, przetwarzanie danych i komunikację z API. Kod JavaScript może działać także poza przeglądarką, np. w Node.js, ale interfejsy takie jak document i DOM są charakterystyczne dla środowiska przeglądarki.

Język JavaScript określa składnię, typy, obiekty wbudowane i sposób wykonywania kodu. Środowisko przeglądarki dostarcza dodatkowo Web APIs, np. DOM, fetch, localStorage, timers czy History API. Nie należy mylić języka ze środowiskiem wykonawczym.

Dodawanie pliku JS:

~~~html
<script src="./script.js" defer></script>
~~~

Atrybut defer umożliwia pobranie skryptu równolegle do parsowania HTML i uruchomienie go po utworzeniu dokumentu, przed zdarzeniem DOMContentLoaded. Dla klasycznych skryptów bez defer umieszczenie ich w head może oznaczać wykonywanie przed powstaniem elementów DOM. Moduły script type=module są domyślnie odroczone i mają własne zasady importów.

## 2. Zmienne, wartości i typy

JavaScript jest językiem dynamicznie typowanym. Wartość ma typ, a zmienna może w czasie działania przechowywać różne typy wartości.

~~~javascript
const name = "Alex";
let years = 2;
let isStudent = true;
const skills = ["HTML", "CSS", "JS"];
const profile = { name: "Alex", years: 2 };
let missing = null;
let unknown;
~~~

Najważniejsze typy prymitywne: string, number, boolean, undefined, null, bigint, symbol. Tablice i zwykłe obiekty mają typ object (funkcje mają typeof "function"). W praktyce w laboratorium dominują string, number, boolean, array i object.

- const zabrania ponownego przypisania zmiennej, ale **nie zamraża** zawartości obiektu lub tablicy.
- let pozwala na ponowne przypisanie.
- var jest starszym sposobem deklaracji i ma inne zasady zakresu; w nowych ćwiczeniach używaj const i let.

~~~javascript
const person = { name: "Alex" };
person.name = "Sam";    // dozwolona zmiana właściwości
// person = {};         // niedozwolone ponowne przypisanie const
~~~

## 3. Porównania, konwersje i wartości truthy/falsy

JavaScript może automatycznie konwertować wartości. Dlatego zalecane są operatory ścisłej równości === i nierówności !==.

~~~javascript
"5" == 5;   // true - konwersja typów
"5" === 5;  // false - różne typy
0 === false; // false
~~~

Falsy to m.in. false, 0, pusty string, null, undefined i NaN. Pusta tablica [] i pusty obiekt {} są truthy. Błąd „pusta tablica jest false” pojawia się często, gdy student przenosi nawyki z innych języków.

~~~javascript
const title = userTitle ?? "Nie podano"; // tylko null lub undefined
const shown = label || "Domyślnie";       // także pusty string, 0, false
~~~

Różnica pomiędzy ?? a || ma znaczenie, gdy wartość 0 lub pusty string jest prawidłową wartością w aplikacji.

## 4. Warunki, pętle i funkcje

~~~javascript
function classify(years) {
  if (years < 1) return "Początkujący";
  if (years < 3) return "Średniozaawansowany";
  return "Zaawansowany";
}

const result = classify(2);
console.log(result);
~~~

Funkcja pozwala wydzielić powtarzalną logikę. Może przyjmować parametry i zwracać wynik przez return. Funkcje strzałkowe mają krótszą składnię, ale różnią się m.in. obsługą this.

~~~javascript
const upper = text => text.toUpperCase();
for (const skill of ["HTML", "CSS", "JS"]) {
  console.log(upper(skill));
}
~~~

Pętle for, for...of i while wykonują powtarzalny kod. Dla pracy z listami często wygodniejsze są metody tablic map, filter i find.

## 5. Tablice i obiekty — model danych CV

Dane CV mogą być reprezentowane jako obiekt zawierający tablice:

~~~javascript
const cv = {
  name: "Alex",
  skills: ["HTML", "CSS", "JavaScript"],
  education: [
    { school: "Vistula", years: "2024–2027" }
  ]
};

console.log(cv.education[0].school);
~~~

Wybrane operacje:
- map transformuje elementy i zwraca nową tablicę;
- filter zwraca elementy spełniające warunek;
- find szuka pierwszego pasującego elementu;
- some sprawdza, czy istnieje pasujący element;
- push dodaje element do tablicy (modyfikuje ją).

~~~javascript
const skills = ["HTML", "CSS", "JavaScript", "Git"];
const matching = skills.filter(skill =>
  skill.toLowerCase().includes("js")
);
console.log(matching); // []
~~~

Wynik to [] ponieważ żaden z napisów nie zawiera ciągłych liter „js”. JavaScript zawiera litery J i S, ale nie obok siebie. To dobry przykład, dlaczego wynik trzeba faktycznie testować, zamiast zakładać, że filtr działa zgodnie z intencją.

Przykładowo wyszukiwanie po „java” zwróci „JavaScript”:

~~~javascript
const matching = skills.filter(skill =>
  skill.toLowerCase().includes("java")
);
~~~

## 6. DOM — Document Object Model

DOM to obiektowa reprezentacja dokumentu. Przeglądarka tworzy drzewo węzłów, a JavaScript może je odczytywać, zmieniać i rozbudowywać. DOM nie jest tym samym co surowy plik HTML: po wykonaniu skryptów może zawierać inne elementy niż źródło dokumentu.

Przykładowy fragment HTML:

~~~html
<h2 id="skills-title">Umiejętności</h2>
<ul id="skills-list"></ul>
~~~

Kod JavaScript dodający elementy:

~~~javascript
const list = document.querySelector("#skills-list");
const skills = ["HTML", "CSS", "JavaScript"];

for (const skill of skills) {
  const li = document.createElement("li");
  li.textContent = skill;
  list.append(li);
}
~~~

**querySelector** znajduje pierwszy pasujący element. **querySelectorAll** zwraca kolekcję pasujących elementów. **createElement** tworzy element DOM. **textContent** ustawia tekst, a append dołącza węzeł do rodzica. Nie ustawiaj innerHTML bez kontroli danych, bo tekst dostarczony z zewnątrz może zostać zinterpretowany jako HTML.

## 7. Zdarzenia i addEventListener

Interaktywność zwykle zaczyna się od zdarzeń: click, input, change, submit, keydown. Obiekt zdarzenia zawiera informacje o zdarzeniu, a metoda preventDefault może powstrzymać domyślną akcję (np. wysłanie formularza).

~~~html
<button id="toggle-theme" type="button">Zmień motyw</button>
~~~

~~~javascript
const button = document.querySelector("#toggle-theme");
button.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
~~~

Nie trzeba przepisywać wszystkich reguł CSS w JS. Skrypt przełącza klasę, a CSS opisuje wygląd:

~~~css
body { background: white; color: #1c2738; }
body.dark { background: #162237; color: #ffffff; }
~~~

Tak rozdzielamy logikę zachowania od prezentacji. Przyciski bez type=button umieszczone w formularzu mogą domyślnie go wysyłać, co jest częstą przyczyną nieoczekiwanego odświeżenia strony.

## 8. Formularze — odczyt i walidacja

~~~html
<form id="filter-form">
  <label for="query">Filtr umiejętności</label>
  <input id="query" name="query" required>
  <button type="submit">Filtruj</button>
</form>
<p id="message" role="status"></p>
~~~

~~~javascript
const form = document.querySelector("#filter-form");
const input = document.querySelector("#query");
const message = document.querySelector("#message");

form.addEventListener("submit", event => {
  event.preventDefault();
  const query = input.value.trim();
  if (query.length < 2) {
    message.textContent = "Wpisz co najmniej dwa znaki.";
    return;
  }
  message.textContent = "Szukasz: " + query;
});
~~~

Formularz może być poprawny składniowo, a nadal zawierać błąd logiki. Trzeba testować granice: pustą wartość, bardzo długie dane, znaki specjalne, spacje. Jeśli dane mają trafić do backendu, walidacja JS pomaga użytkownikowi, ale bezpieczeństwo musi zapewniać serwer.

## 9. Tworzenie fragmentów DOM na podstawie danych

Dobrym wzorcem jest oddzielenie danych od funkcji renderującej. Funkcja nie powinna być na sztywno związana z jednym imieniem ani liczbą sekcji.

~~~javascript
function renderSkills(skills, container) {
  container.replaceChildren();
  for (const skill of skills) {
    const item = document.createElement("li");
    item.textContent = skill;
    container.append(item);
  }
}

const container = document.querySelector("#skills-list");
renderSkills(["HTML", "CSS"], container);
~~~

replaceChildren usuwa stare elementy przed dodaniem nowych. Bez tego każda aktualizacja mogłaby dopisywać duplikaty. Przy pustej tablicy można dodatkowo wyświetlić informację „Brak danych”.

**Renderowanie deklaratywne vs imperatywne:** tutaj ręcznie tworzymy elementy. Frameworki takie jak React stosują inny sposób opisu interfejsu, ale nadal warto rozumieć elementarny DOM i zdarzenia.

## 10. Czym jest stan aplikacji?

Stan to dane określające aktualną sytuację interfejsu, np. aktywny filtr, tryb ciemny, rozwinięte sekcje czy edytowane dane. Elementy interfejsu powinny być spójne z tym stanem. Jeśli filtr i zawartość listy przestają się zgadzać, aplikacja ma błąd zarządzania stanem.

Prosty przykład:

~~~javascript
const state = { darkMode: false, query: "" };
function updateTheme() {
  document.body.classList.toggle("dark", state.darkMode);
}
~~~

W bardziej rozbudowanej aplikacji jeden obiekt stanu może być źródłem informacji dla wielu komponentów. W labie L3 nie ma potrzeby wdrażać frameworka, wystarczy prosta konsekwentna organizacja funkcji.

## 11. localStorage, sessionStorage i cookies

localStorage przechowuje pary klucz–wartość jako stringi w obrębie danego origin i zwykle pozostaje po zamknięciu przeglądarki. sessionStorage jest zasadniczo związane z sesją danej karty/okna. Cookies są przesyłane do serwera zgodnie z ich zasadami i mogą mieć flagi HttpOnly, Secure i SameSite.

Przykład zapisu motywu:

~~~javascript
localStorage.setItem("theme", "dark");
const saved = localStorage.getItem("theme") ?? "light";
~~~

Obiekty trzeba serializować:

~~~javascript
const settings = { darkMode: true, fontSize: 18 };
localStorage.setItem("settings", JSON.stringify(settings));
const restored = JSON.parse(localStorage.getItem("settings") || "{}");
~~~

Nie przechowuj w localStorage prywatnych sekretów ani poufnych tokenów bez analizy ryzyka. LocalStorage jest dostępne dla skryptów działających w tym origin, a aplikacja podatna na XSS może pozwolić napastnikowi odczytać takie dane.

## 12. Błędy JavaScript i debugowanie

Przykładowe problemy:
- null przy document.querySelector oznacza, że selektor nic nie znalazł albo skrypt wykonał się za wcześnie;
- Uncaught TypeError często wskazuje próbę użycia metody na nieodpowiednim typie;
- SyntaxError oznacza błąd składni;
- niepoprawny this albo utrata kontekstu może zmienić wynik pracy funkcji;
- asynchroniczny kod może zakończyć się później niż oczekiwałeś.

Korzystaj z Console i debugger (Sources). Ustaw breakpoint, sprawdź wartości zmiennych i stos wywołań. Console.log pomaga, ale nie zastępuje analizy przepływu programu.

~~~javascript
function countSkills(skills) {
  console.log("Argument:", skills);
  return skills.length;
}
~~~

Co się stanie, jeśli argument będzie undefined? Dlaczego? Jak temu zapobiec? Jednym sposobem może być walidacja parametrów lub wartość domyślna.

## 13. Wprowadzenie do asynchroniczności

JavaScript wykonuje kod na wątku głównym przeglądarki z udziałem kolejki zadań, mikrozadań i Web APIs. Operacja sieciowa jest asynchroniczna: fetch zwraca Promise, a wynik pojawia się później. Nie należy zakładać, że dane są dostępne w chwili wywołania.

~~~javascript
async function example() {
  const response = await fetch("./cv.json");
  const data = await response.json();
  console.log(data);
}
~~~

Słowo await zatrzymuje dalsze wykonywanie danej funkcji asynchronicznej do rozstrzygnięcia Promise, nie blokując całej przeglądarki tak jak synchroniczne, długie obliczenie. Pełny przykład wraz z obsługą błędów znajduje się w W4.

## 14. Samodzielne ćwiczenie W3/L3

1. Utwórz zad3 jako rozwinięcie zad2.
2. Dodaj script.js z defer.
3. Zaimplementuj co najmniej dwie interakcje, np. motyw ciemny i filtrowanie umiejętności.
4. Dla motywu użyj classList, dla filtrowania — tablicy i aktualizacji DOM.
5. Wyświetl komunikat dla pustego wyniku wyszukiwania.
6. Sprawdź, czy po szybkim klikaniu przyciski działają poprawnie.
7. Otwórz Console i upewnij się, że nie ma błędów.

Na ścieżce projektowej na 4,0 można dodatkowo zrobić formularz edycji CV, walidację i zapis do localStorage.

## 15. Pytania do samosprawdzenia

1. Czym JavaScript różni się od DOM API?
2. Co zmienia defer w tagu script?
3. Czym różnią się let i const?
4. Dlaczego pusta tablica jest truthy?
5. Jaka jest różnica między == a ===?
6. Co robi map, a co filter?
7. Dlaczego document.querySelector może zwrócić null?
8. Czym różni się textContent od innerHTML?
9. Jak działa addEventListener?
10. Dlaczego preventDefault jest użyteczne w formularzach?
11. Co się stanie, jeśli funkcja renderująca wielokrotnie dołącza elementy bez usuwania starych?
12. Czym różni się localStorage od sessionStorage?
13. Co robi JSON.stringify i JSON.parse?
14. Co oznacza async/await?
15. Jak postawić breakpoint i znaleźć przyczynę TypeError?
16. Jak wytłumaczysz działanie własnego kodu obsługi motywu?
17. Co zmienisz, jeśli użytkownik chce trzecią interakcję?
18. Jak odróżnić błąd CSS od błędu JavaScript?

## 16. Dokumentacja

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN — Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

Na obronie prowadzący może poprosić o wyjaśnienie, modyfikowanie i debugowanie interakcji. Nie wystarczy pokazać, że przycisk działa: trzeba rozumieć, co robi handler, które dane zmienia i jak powstaje nowa zawartość strony.
