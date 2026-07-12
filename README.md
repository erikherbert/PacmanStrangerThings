# Pac-Man by Stranger Things

A static browser arcade game inspired by Pac-Man gameplay and a Stranger Things visual mood. The project runs entirely in the browser and does not require a backend, database, package manager, or build step.

## Start

Open the HTML file directly:

```bash
open index.html
```

Or serve the project locally over HTTP:

```bash
python3 -m http.server 8001
```

Then open:

```text
http://127.0.0.1:8001/index.html
```

## Structure

```text
index.html
files/
  css/styles.css
  js/game.js
  fonts/jersey-10.ttf
  sound/freesound_community-circuit-synthwave-alt-23844.mp3
```

## Features

- Intro screen with character selection
- Keyboard and gamepad controls
- Canvas-based game board with two different level layouts
- Animated Demogorgon-style enemies
- Power Waffles instead of classic power pellets
- Local Top 6 score list stored in `localStorage`
- No name input, no database, no PHP backend

## Controls

- Arrow keys or WASD
- IJKL, numpad 2/4/6/8, or a standard gamepad also work
- Enter, Space, or the gamepad start button starts the game from the menu
- After Game Over, `Play again`, Enter, or Space returns to character selection

## Credits

Background sound: Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=23844) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=23844).

The `Jersey 10` font is from Google Fonts.

## License Notes

The source code is released under the MIT License. External assets such as the sound and font remain under their original licenses. Pac-Man and Stranger Things references are used only as fan/prototype context.
