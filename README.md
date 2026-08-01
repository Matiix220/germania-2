# GERMANIA — motoryzacyjny sklep i magazyn

Kompletny prototyp front-endowy sklepu poświęconego niemieckiej motoryzacji. Wersja zawiera odświeżoną identyfikację wizualną GERMANIA, rozbudowane animacje, katalogi zakupowe, magazyn oraz panel administracyjny.

## Uruchomienie

Stronę najlepiej uruchamiać przez lokalny serwer HTTP, a nie przez bezpośrednie otwarcie pliku `index.html`.

### Windows

1. Otwórz folder projektu.
2. Uruchom `start-server.bat`.
3. Otwórz w przeglądarce `http://localhost:8080`.

### macOS / Linux

```bash
chmod +x start-server.sh
./start-server.sh
```

Następnie otwórz `http://localhost:8080`.

## Logo

- logo nagłówka: `assets/images/logo-header.png`,
- logo stopki: `assets/images/logo-footer.png`,
- ikona karty przeglądarki: `assets/images/favicon.png`.

## Panel administracyjny

Adres logowania:

`http://localhost:8080/panel-g7x9k/login.html`

Hasło demonstracyjne:

`Gambling777`

Dodatkowe ukryte wejście znajduje się w stopce. Kliknij 7 razy małą kropkę po jej prawej stronie.

## Najważniejsze funkcje

- rozbudowana, responsywna strona główna z animowanym hero i sekcjami sprzedażowymi,
- osobne katalogi części, akcesoriów, gadżetów i usług,
- wyszukiwarka, filtry, sortowanie, ulubione produkty oraz koszyk,
- przykładowe aktualności i pełne widoki artykułów,
- formularz kontaktowy zapisujący zapytania do skrzynki panelu,
- panel dodawania i usuwania produktów, usług oraz artykułów,
- podgląd tworzonych ofert i publikacji na żywo,
- skrzynka wiadomości z wyszukiwaniem, szkicami odpowiedzi i otwieraniem odpowiedzi w programie pocztowym,
- animacje wejścia, karty 3D, efekty świetlne, pasek postępu przewijania, licznikowe statystyki i interaktywne elementy interfejsu,
- widoki dopasowane do komputerów, tabletów i telefonów.

## Przechowywanie danych

Produkty dodane w panelu, artykuły, wiadomości, koszyk i ulubione są zapisywane w `localStorage`. Sesja panelu jest przechowywana w `sessionStorage`. Dane są więc dostępne tylko w tej samej przeglądarce i na tym samym urządzeniu.

## Ważne przed publikacją

Projekt jest prototypem front-endowym. Ukryty adres panelu i hasło sprawdzane w przeglądarce nie zapewniają bezpieczeństwa produkcyjnego.

Przed uruchomieniem prawdziwego sklepu trzeba podłączyć backend i bazę danych, serwerowe logowanie, bezpieczne sesje, wysyłkę e-mail, system zamówień, płatności, dostawy i stany magazynowe. Należy też uzupełnić prawdziwe dane firmy, zweryfikować dokumenty prawne, wdrożyć HTTPS, kopie zapasowe i ochronę przed nadużyciami.
