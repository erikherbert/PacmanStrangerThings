# Pacman by Stranger Things

Ein statisches Canvas-Arcade-Spiel im Pac-Man- und Stranger-Things-Stil. Das Projekt läuft komplett im Browser und braucht kein Backend, keine Datenbank und keinen Build-Schritt.

## Start

Direkt öffnen:

```bash
open index.html
```

Oder lokal per HTTP starten:

```bash
python3 -m http.server 8001
```

Danach im Browser öffnen:

```text
http://127.0.0.1:8001/index.html
```

## Struktur

```text
index.html
files/
  css/styles.css
  js/game.js
  fonts/jersey-10.ttf
  sound/freesound_community-circuit-synthwave-alt-23844.mp3
```

## Features

- Intro mit Character-Auswahl
- Tastatur- und Gamepad-Steuerung
- Canvas-Spielfeld mit zwei unterschiedlichen Level-Layouts
- Demogorgon-Gegner mit Pixelanimation
- Power-Waffeln statt klassischer Power-Pellets
- Top-6-Punkteliste im Browser per `localStorage`
- Kein Name-Input, keine Datenbank, kein PHP

## Steuerung

- Pfeiltasten oder WASD
- Alternativ IJKL, Numpad 2/4/6/8 oder Standard-Gamepad
- Enter, Leertaste oder Gamepad-Button startet im Menü
- Nach Game Over bringt `Play again`, Enter oder Leertaste zurück zur Character-Auswahl

## Credits

Hintergrundsound: Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=23844) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=23844).

Die Schrift `Jersey 10` stammt von Google Fonts.

## Lizenzhinweis

Der Quellcode steht unter MIT-Lizenz. Externe Assets wie Sound und Font unterliegen ihren jeweiligen Ursprungslizenzen. Marken- und Stilreferenzen an Pac-Man oder Stranger Things sind nur als Fan-/Prototyp-Kontext zu verstehen.
