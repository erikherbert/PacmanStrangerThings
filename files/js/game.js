"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  score: document.getElementById("score"),
  level: document.getElementById("level"),
  lives: document.getElementById("lives"),
  status: document.getElementById("status"),
  startScreen: document.getElementById("start-screen"),
  gameOverScreen: document.getElementById("game-over-screen"),
  characterGrid: document.getElementById("character-grid"),
  startButton: document.getElementById("start-button"),
  restartButton: document.getElementById("restart-button"),
  finalScore: document.getElementById("final-score"),
  topScores: document.getElementById("top-scores"),
  backgroundMusic: document.getElementById("background-music")
};

const TILE = 40;
const COLS = 17;
const ROWS = 23;
const CENTER_EPSILON = 0.018;
const MOVE_EPSILON = 0.0001;
const MAX_MOVE_SEGMENTS = 16;
const SPRITE_TARGET_HEIGHT = 24;
const SPRITE_SCALE = TILE / SPRITE_TARGET_HEIGHT * 1.28;
const TILE_CENTER = TILE / 2;
const WALL_GLOW_WIDTH = TILE * 0.86;
const WALL_OUTER_WIDTH = TILE * 0.54;
const WALL_CORE_WIDTH = TILE * 0.36;
const WALL_HIGHLIGHT_WIDTH = TILE * 0.08;
const DEMOGORGON_SCALE = TILE / 17.5;
const CANVAS_FONT = '"Jersey 10", monospace';
const TOP_SCORE_LIMIT = 6;
const TOP_SCORE_STORAGE_KEY = "pst_top_scores";
const DIRS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 }
};

const characters = [
  { id: "mike", name: "Mike", color: "#6ad0ff", speed: 1.00, power: 1.00 },
  { id: "will", name: "Will", color: "#9fe870", speed: 0.94, power: 1.35 },
  { id: "dustin", name: "Dustin", color: "#ffc857", speed: 0.96, power: 1.18 },
  { id: "lucas", name: "Lucas", color: "#ff8d5b", speed: 1.10, power: 0.92 },
  { id: "elfi", name: "Eleven", color: "#ff7ac8", speed: 1.04, power: 1.28 },
  { id: "max", name: "Max", color: "#ff4d3f", speed: 1.16, power: 0.86 }
];

const spriteArt = {
  mike: {
    palette: {
      o: "#120708",
      s: "#f3b58f",
      h: "#2a1a14",
      e: "#050303",
      m: "#391112",
      b: "#2459bd",
      r: "#f4c8d8",
      p: "#2d3544",
      q: "#cfd8d8"
    },
    rows: [
      "..................",
      ".......oooo.......",
      "......ohhhho......",
      ".....ohhhhhho.....",
      "....ohhhhhhhho....",
      "....ohssssssho....",
      "....ohsseessho....",
      "....ohssssssho....",
      ".....osssmsso.....",
      "......ossssso.....",
      "...oobbbbbbbboo...",
      "..oosbbbrrbbbsoo..",
      "..oosbbbrrbbbsoo..",
      "...oobbbrrbbboo...",
      "....ooppppppoo....",
      "....ooppppppoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "....ooqq..qqoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  },
  will: {
    palette: {
      o: "#120708",
      s: "#efb28d",
      h: "#6a3f22",
      e: "#050303",
      m: "#4b1612",
      g: "#7fb16b",
      t: "#f08a2e",
      p: "#394534",
      q: "#aeb8ba"
    },
    rows: [
      "..................",
      "......oooooo......",
      ".....ohhhhhho.....",
      "....ohhhhhhhho....",
      "...ohhhhhhhhhho...",
      "...ohhssssssho....",
      "...ohsseessho.....",
      "....ohsssssho.....",
      ".....osssmsso.....",
      "......ossssso.....",
      "...ooggggggggoo...",
      "..oosgggttgggsoo..",
      "..oosgggttgggsoo..",
      "...oogggttgggoo...",
      "....ooppppppoo....",
      "....ooppppppoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "....ooqq..qqoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  },
  dustin: {
    palette: {
      o: "#120708",
      s: "#f3b489",
      h: "#6b3f22",
      e: "#050303",
      m: "#4b1612",
      b: "#2d67c7",
      t: "#6fc179",
      p: "#33343b",
      a: "#d71920",
      w: "#f8f4ef",
      u: "#2b5fff",
      q: "#cfd8d8"
    },
    rows: [
      "..................",
      "......ooooooo.....",
      ".....owwwwwwwo....",
      "....owwwaaauuo....",
      "...ohhhhhhhhho....",
      "...ohhssssssho....",
      "...ohsseessho.....",
      "...ohssssssho.....",
      "....osssmsso......",
      ".....ossssso......",
      "...oobbbbbbbboo...",
      "..oosbbbttbbbsoo..",
      "..oosbbbttbbbsoo..",
      "...oobbbttbbboo...",
      "....ooppppppoo....",
      "....ooppppppoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "....ooqq..qqoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  },
  lucas: {
    palette: {
      o: "#0d0605",
      s: "#87512f",
      h: "#14100d",
      e: "#050303",
      m: "#1f0a08",
      c: "#77845b",
      a: "#b9c59a",
      r: "#d93c24",
      t: "#63b35f",
      p: "#303842",
      q: "#aeb8ba"
    },
    rows: [
      "..................",
      "......oooooo......",
      ".....occcacco.....",
      "....ocacccacoo....",
      "....ohhhhhhhho....",
      "....ohssssssho....",
      "....ohsseessho....",
      "....ohssssssho....",
      ".....osssmsso.....",
      "......ossssso.....",
      "...oorrrrrrrroo...",
      "..oosrrrttrrrsoo..",
      "..oosrrrttrrrsoo..",
      "...oorrrttrrroo...",
      "....ooppppppoo....",
      "....ooppppppoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "....ooqq..qqoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  },
  elfi: {
    palette: {
      o: "#120708",
      s: "#f0b592",
      h: "#5c3422",
      e: "#050303",
      m: "#5d181d",
      d: "#f7b3c8",
      w: "#f8ece7",
      p: "#e32757",
      q: "#f8ece7"
    },
    rows: [
      "..................",
      ".......oooo.......",
      "......ohhhho......",
      ".....ohhhhhho.....",
      "....ohssssssho....",
      "....ohsseessho....",
      "....ohssssssho....",
      ".....osssmsso.....",
      "......ossssso.....",
      "...ooddddddddoo...",
      "..oosddwwdddssoo..",
      "..oosddwwdddssoo..",
      "...ooddddddddoo...",
      "...ooddddddddoo...",
      "....ooddddddoo....",
      "....ooww..wwoo....",
      "....ooww..wwoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  },
  max: {
    palette: {
      o: "#120708",
      s: "#f0ae83",
      h: "#e75b1d",
      e: "#050303",
      m: "#5d1814",
      g: "#5bbf69",
      v: "#8b5cd6",
      p: "#304a5a",
      q: "#8fd6dc"
    },
    rows: [
      "..................",
      ".....oooooooo.....",
      "....ohhhhhhhho....",
      "...ohhhhhhhhhho...",
      "...ohhssssssho....",
      "...ohsseessho.....",
      "...ohssssssho.....",
      "....osssmsso......",
      ".....ossssso......",
      "...ooggggggggoo...",
      "..oosgggvvgggsoo..",
      "..oosgggvvgggsoo..",
      "...oogggvvgggoo...",
      "....ooppppppoo....",
      "....ooppppppoo....",
      "....oopp..ppoo....",
      "....oopp..ppoo....",
      "....ooqq..qqoo....",
      "...ooo......ooo...",
      "..................",
      "..................",
      "..................",
      "..................",
      ".................."
    ]
  }
};

const demogorgonSprite = {
  frames: [
    [
      ".........oo.........",
      "........orro........",
      ".......orrrro.......",
      "......orwrrwo.......",
      "...ooooorrrrooooo...",
      "..orrrrorrrrorrrro..",
      ".orrrrwrrrrrrwrrrro.",
      ".orwrrrrrmmmrrrrwro.",
      ".orrrrwmmmmmwrrrrro.",
      "..orrrrwmmmwrrrrro..",
      "...ooorrrrrrrrooo...",
      "..ooorrrwrrwrrrooo..",
      ".oorrrrrrrrrrrrrroo.",
      ".orwrrroo..ooorrwro.",
      ".orrrroo....oorrro..",
      "..ooooggggggggooo...",
      "....ogglggllgggo....",
      "...oggglgglggggo....",
      "...ogglglglglggo....",
      "..oggo.glgl.oggo....",
      "..ogo..gggg..ogo....",
      "...o...oggo...o.....",
      ".......oggo.........",
      "......oo..oo........"
    ],
    [
      ".........oo.........",
      "........orro........",
      ".......orrrro.......",
      "......orwrrwo.......",
      "..ooooorrrrrroooo...",
      ".orrrrorrrrorrrro...",
      "orrrrwrrrrrrwrrrrro.",
      "orwrrrrrmmmrrrrrwro.",
      "orrrrwmmmmmwrrrrro..",
      ".orrrrwmmmwrrrrro...",
      "..ooorrrrrrrrooo....",
      ".ooorrrwrrwrrrooo...",
      "orrrrrrrrrrrrrrrro..",
      "orwrrroo..ooorrwro..",
      ".orrrroo....oorrro..",
      "..ooooggggggggooo...",
      "...ogglggllgggo.....",
      "....oggglgglggggo...",
      "...ogglglglglggo....",
      "...oggo.glgl.oggo...",
      "...ogo..gggg..ogo...",
      "..o....oggo....o....",
      "......oo..oo........",
      ".....oo....oo......."
    ]
  ],
  palettes: {
    normal: {
      o: "#050303",
      r: "#e1161d",
      w: "#f8ece7",
      m: "#050303",
      g: "#22282b",
      l: "#aeb8ba"
    },
    frightened: {
      o: "#09102a",
      r: "#3056ff",
      w: "#f8ece7",
      m: "#050916",
      g: "#1f335c",
      l: "#9fc5ff"
    },
    flash: {
      o: "#170807",
      r: "#f8ece7",
      w: "#ff3b35",
      m: "#120506",
      g: "#7a4f34",
      l: "#f0b592"
    }
  }
};

for (const character of characters) {
  character.sprite = spriteArt[character.id];
}

const baseLayout = [
  "#################",
  "#.......#.......#",
  "#.###.#.#.#.###.#",
  "#o#...#...#...#o#",
  "#.###.#.#.#.###.#",
  "#...............#",
  "#.###.#####.###.#",
  "#.....#...#.....#",
  "#####.#   #.#####",
  "    #.#   #.#    ",
  "#####.# # #.#####",
  "     .  #  .     ",
  "#####.# # #.#####",
  "    #.#   #.#    ",
  "#####.#.#.#.#####",
  "#.......#.......#",
  "#.###.#.#.#.###.#",
  "#o..#.......#..o#",
  "###.#.#####.#.###",
  "#.....#...#.....#",
  "#.#####.#.#####.#",
  "#.......P.......#",
  "#################"
];

const upsideDownLayout = [
  "#################",
  "#o..#.....#..o..#",
  "#.#.#.###.#.#.#.#",
  "#.#...#...#...#.#",
  "#.###.#.#.#.###.#",
  "#.....#.#.#.....#",
  "###.#.#.#.#.#.###",
  "#...#...M...#...#",
  "#.###.#####.###.#",
  "#.#...#...#...#.#",
  "#.#.#.#...#.#.#.#",
  "  ...   #   ...  ",
  "#.#.#.#####.#.#.#",
  "#...#...#...#...#",
  "###.###.#.###.###",
  "#.......#.......#",
  "#.###.#.#.#.###.#",
  "#o..#.......#..o#",
  "###.#.#####.#.###",
  "#...#...#...#...#",
  "#.#.###.#.###.#.#",
  "#.....P...#.....#",
  "#################"
];

let state = {};
let selectedCharacter = characters[0];
let audioCtx = null;
let lastGamepadStart = false;
let lastGamepadMenuDirection = "";
let lastFrameTime = performance.now();
let frameCounter = 0;
const DEBUG_STATE = new URLSearchParams(window.location.search).has("debug");
const DEBUG_START_LEVEL = DEBUG_STATE
  ? Math.max(0, Math.floor(Number(new URLSearchParams(window.location.search).get("level")) || 0))
  : 0;
const DEBUG_GAME_OVER_SCORE = DEBUG_STATE && new URLSearchParams(window.location.search).has("gameover")
  ? Math.max(0, Math.floor(Number(new URLSearchParams(window.location.search).get("score")) || 0))
  : null;
const DEBUG_CLEAR_TOP_SCORES = DEBUG_STATE && new URLSearchParams(window.location.search).has("clearscores");

function getLevelLayout(level) {
  return level > 1 ? upsideDownLayout : baseLayout;
}

function createTileMap(level) {
  const layout = getLevelLayout(level);
  const tiles = [];
  let pellets = 0;
  let playerSpawn = { x: 8, y: 21 };
  let monsterSpawn = { x: 8, y: 9 };

  for (let y = 0; y < ROWS; y += 1) {
    tiles[y] = [];
    for (let x = 0; x < COLS; x += 1) {
      const symbol = layout[y]?.[x] || " ";
      const tile = { wall: symbol === "#", gate: symbol === "-", pellet: false, power: false };
      if (symbol === ".") {
        tile.pellet = true;
        pellets += 1;
      }
      if (symbol === "o") {
        tile.power = true;
        pellets += 1;
      }
      if (symbol === "P") {
        playerSpawn = { x, y };
        tile.pellet = false;
      }
      if (symbol === "M") {
        monsterSpawn = { x, y };
        tile.pellet = false;
      }
      tiles[y][x] = tile;
    }
  }

  return { tiles, pellets, playerSpawn, monsterSpawn };
}

function startLevel(level, score = 0, lives = 3) {
  const map = createTileMap(level);
  state = {
    mode: "playing",
    score,
    level,
    lives,
    map,
    player: makePlayer(map.playerSpawn),
    monsters: makeMonsters(level, map.monsterSpawn),
    desiredDir: DIRS.left,
    powerTimer: 0,
    eatenChain: 0,
    frightFlash: 0,
    levelMessageTimer: 0
  };
  updateUi();
  syncBodyMode();
  return state;
}

function resetGame() {
  startLevel(1);
}

function makePlayer(spawn) {
  return {
    x: spawn.x + 0.5,
    y: spawn.y + 0.5,
    dir: DIRS.left,
    nextDir: DIRS.left,
    radius: TILE * 0.38,
    mouth: 0
  };
}

function makeMonsters(level, spawn) {
  const colors = ["#d71920", "#ff6b35", "#b845ff", "#55d6ff", "#f7f052", "#63e6be"];
  const count = level === 1 ? 4 : 6;
  return Array.from({ length: count }, (_, index) => ({
    x: spawn.x + 0.5 + (index % 3 - 1) * 0.9,
    y: spawn.y + 0.5 + Math.floor(index / 3) * 0.8,
    spawn: { x: spawn.x + 0.5, y: spawn.y + 0.5 },
    dir: [DIRS.left, DIRS.right, DIRS.up, DIRS.down][index % 4],
    color: colors[index],
    speed: (level === 1 ? 2.05 : 2.35) + index * 0.05,
    eaten: false,
    think: 0
  }));
}

function isBlocked(x, y, allowGate = false) {
  const tx = Math.floor((x + COLS) % COLS);
  const ty = Math.floor(y);
  if (ty < 0 || ty >= ROWS) return true;
  const tile = state.map.tiles[ty][tx];
  return tile.wall || (tile.gate && !allowGate);
}

function canMove(entity, dir, allowGate = false) {
  const probeX = entity.x + dir.x * 0.55;
  const probeY = entity.y + dir.y * 0.55;
  return !isBlocked(probeX, probeY, allowGate);
}

function tileCenter(value) {
  return Math.floor(value) + 0.5;
}

function isNearTileCenter(value) {
  return Math.abs(value - tileCenter(value)) < CENTER_EPSILON;
}

function nearCenter(entity) {
  return isNearTileCenter(entity.x) && isNearTileCenter(entity.y);
}

function snapToCenter(entity) {
  entity.x = tileCenter(entity.x);
  entity.y = tileCenter(entity.y);
}

function snapToLane(entity) {
  if (entity.dir.x !== 0) entity.y = tileCenter(entity.y);
  if (entity.dir.y !== 0) entity.x = tileCenter(entity.x);
}

function wrapEntity(entity) {
  while (entity.x <= -0.5) entity.x += COLS;
  while (entity.x >= COLS + 0.5) entity.x -= COLS;
}

function nextCenterCoordinate(value, direction) {
  const center = tileCenter(value);
  if (direction > 0) return value < center - MOVE_EPSILON ? center : center + 1;
  if (direction < 0) return value > center + MOVE_EPSILON ? center : center - 1;
  return value;
}

function distanceToNextCenter(entity) {
  if (entity.dir.x !== 0) {
    return Math.abs(nextCenterCoordinate(entity.x, entity.dir.x) - entity.x);
  }
  if (entity.dir.y !== 0) {
    return Math.abs(nextCenterCoordinate(entity.y, entity.dir.y) - entity.y);
  }
  return 0;
}

function chooseEntityDirection(entity, allowGate) {
  snapToCenter(entity);
  if (entity.nextDir && canMove(entity, entity.nextDir, allowGate)) {
    entity.dir = entity.nextDir;
  }
  return canMove(entity, entity.dir, allowGate);
}

function moveEntity(entity, speed, dt, allowGate = false) {
  let remaining = speed * dt;
  let segments = 0;

  while (remaining > MOVE_EPSILON && segments < MAX_MOVE_SEGMENTS) {
    wrapEntity(entity);

    if (nearCenter(entity)) {
      if (!chooseEntityDirection(entity, allowGate)) return;
    } else {
      snapToLane(entity);
    }

    const distance = distanceToNextCenter(entity);
    if (distance <= MOVE_EPSILON) {
      snapToCenter(entity);
      segments += 1;
      continue;
    }

    const step = Math.min(remaining, distance);
    entity.x += entity.dir.x * step;
    entity.y += entity.dir.y * step;
    remaining -= step;

    if (Math.abs(step - distance) <= MOVE_EPSILON) {
      snapToCenter(entity);
    }

    segments += 1;
  }

  wrapEntity(entity);
}

function update(dt) {
  if (state.mode !== "playing") return;

  state.powerTimer = Math.max(0, state.powerTimer - dt);
  state.levelMessageTimer = Math.max(0, state.levelMessageTimer - dt);
  if (state.powerTimer <= 0) state.eatenChain = 0;

  state.player.nextDir = state.desiredDir;
  const playerSpeed = 3.35 * selectedCharacter.speed + (state.level > 1 ? 0.12 : 0);
  moveEntity(state.player, playerSpeed, dt);
  state.player.mouth += dt * 12;

  eatAtPlayer();
  updateMonsters(dt);
  checkCollisions();

  if (state.map.pellets <= 0) {
    nextLevel();
  }
}

function eatAtPlayer() {
  const tx = Math.floor(state.player.x);
  const ty = Math.floor(state.player.y);
  if (ty < 0 || ty >= ROWS || tx < 0 || tx >= COLS) return;
  const tile = state.map.tiles[ty][tx];
  if (tile.pellet) {
    tile.pellet = false;
    state.map.pellets -= 1;
    state.score += 10;
    beep(680, 0.025, "square", 0.035);
  }
  if (tile.power) {
    tile.power = false;
    state.map.pellets -= 1;
    state.score += 50;
    state.powerTimer = 7.5 * selectedCharacter.power;
    state.eatenChain = 0;
    state.frightFlash = 0;
    beep(180, 0.16, "sawtooth", 0.08);
  }
  updateUi();
}

function updateMonsters(dt) {
  const player = state.player;
  for (const monster of state.monsters) {
    monster.think -= dt;
    const frightened = state.powerTimer > 0 && !monster.eaten;
    const returning = monster.eaten;
    const target = returning ? monster.spawn : player;

    if (nearCenter(monster)) {
      snapToCenter(monster);
      const options = Object.values(DIRS).filter((dir) => canMove(monster, dir, true));
      const reverse = { x: -monster.dir.x, y: -monster.dir.y };
      const filtered = options.length > 1
        ? options.filter((dir) => dir.x !== reverse.x || dir.y !== reverse.y)
        : options;
      monster.dir = chooseMonsterDir(monster, filtered, target, frightened, returning);
    }

    const speedScale = frightened ? 0.66 : returning ? 1.45 : 1;
    moveEntity(monster, monster.speed * speedScale, dt, true);

    if (returning && distance(monster, monster.spawn) < 0.3) {
      monster.eaten = false;
    }
  }
}

function chooseMonsterDir(monster, options, target, frightened, returning) {
  if (options.length === 0) return monster.dir;
  if (!returning && !frightened && Math.random() < 0.18) {
    return options[Math.floor(Math.random() * options.length)];
  }

  let best = options[0];
  let bestScore = frightened ? -Infinity : Infinity;
  for (const dir of options) {
    const candidate = { x: monster.x + dir.x, y: monster.y + dir.y };
    const score = Math.hypot(candidate.x - target.x, candidate.y - target.y);
    if ((frightened && score > bestScore) || (!frightened && score < bestScore)) {
      best = dir;
      bestScore = score;
    }
  }
  return best;
}

function checkCollisions() {
  for (const monster of state.monsters) {
    if (distance(state.player, monster) > 0.62 || monster.eaten) continue;
    if (state.powerTimer > 0) {
      monster.eaten = true;
      monster.dir = { x: -monster.dir.x, y: -monster.dir.y };
      state.eatenChain += 1;
      state.score += 200 * state.eatenChain;
      updateUi();
      beep(360, 0.09, "triangle", 0.08);
    } else {
      loseLife();
      break;
    }
  }
}

function loseLife() {
  state.lives -= 1;
  beep(90, 0.35, "sawtooth", 0.06);
  if (state.lives <= 0) {
    gameOver();
    return;
  }
  const spawn = state.map.playerSpawn;
  state.player = makePlayer(spawn);
  state.monsters = makeMonsters(state.level, state.map.monsterSpawn);
  state.powerTimer = 0;
  state.eatenChain = 0;
  ui.status.textContent = "Life lost. Keep going.";
  updateUi();
}

function nextLevel() {
  state.level += 1;
  const map = createTileMap(state.level);
  state.map = map;
  state.player = makePlayer(map.playerSpawn);
  state.monsters = makeMonsters(state.level, map.monsterSpawn);
  state.powerTimer = 0;
  state.eatenChain = 0;
  state.levelMessageTimer = 3.2;
  ui.status.textContent = "Welcome to the Upside Down. More monsters, more speed.";
  updateUi();
  beep(520, 0.18, "triangle", 0.07);
}

function gameOver() {
  state.mode = "gameover";
  const topScores = recordTopScore(state.score);
  ui.finalScore.textContent = `Score ${state.score}`;
  renderTopScores(topScores);
  ui.gameOverScreen.classList.add("active");
  ui.restartButton.focus();
  ui.status.textContent = `Game over. Final score: ${state.score}.`;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawMonsters();
  drawPlayer();
  drawMessages();
}

function drawMap() {
  ctx.save();
  ctx.fillStyle = state.level > 1 ? "#050006" : "#020102";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMazeWalls();
  drawGate();
  drawPellets();
  ctx.restore();
}

function drawMazeWalls() {
  const wallLayers = [
    { width: WALL_GLOW_WIDTH, color: "rgba(255, 36, 77, 0.18)", shadowBlur: 18, shadowColor: "#ff244d" },
    { width: WALL_OUTER_WIDTH, color: state.level > 1 ? "#ff244d" : "#d71920", shadowBlur: 10, shadowColor: "#ff382f" },
    { width: WALL_CORE_WIDTH, color: state.level > 1 ? "#14051f" : "#070512", shadowBlur: 0, shadowColor: "transparent" },
    { width: WALL_HIGHLIGHT_WIDTH, color: state.level > 1 ? "#ff7ac8" : "#ff665f", shadowBlur: 6, shadowColor: "#ff382f" }
  ];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const layer of wallLayers) {
    strokeWallNetwork(layer);
  }
  drawWallEndCaps();
  ctx.restore();
}

function strokeWallNetwork(layer) {
  ctx.beginPath();
  ctx.lineWidth = layer.width;
  ctx.strokeStyle = layer.color;
  ctx.shadowBlur = layer.shadowBlur;
  ctx.shadowColor = layer.shadowColor;

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!isWallTile(x, y)) continue;
      const cx = x * TILE + TILE_CENTER;
      const cy = y * TILE + TILE_CENTER;
      if (isWallTile(x + 1, y)) {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + TILE, cy);
      }
      if (isWallTile(x, y + 1)) {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + TILE);
      }
    }
  }
  ctx.stroke();
}

function drawWallEndCaps() {
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#ff382f";
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!isWallTile(x, y)) continue;
      const neighborCount = Number(isWallTile(x - 1, y)) +
        Number(isWallTile(x + 1, y)) +
        Number(isWallTile(x, y - 1)) +
        Number(isWallTile(x, y + 1));
      if (neighborCount > 0) continue;
      ctx.fillStyle = state.level > 1 ? "#ff244d" : "#d71920";
      pixelCircle(x * TILE + TILE_CENTER, y * TILE + TILE_CENTER, WALL_OUTER_WIDTH / 2);
      ctx.fillStyle = "#050205";
      pixelCircle(x * TILE + TILE_CENTER, y * TILE + TILE_CENTER, WALL_CORE_WIDTH / 2);
    }
  }
  ctx.restore();
}

function drawGate() {
  ctx.save();
  ctx.lineCap = "round";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#ff7ac8";
  ctx.strokeStyle = "#ff7ac8";
  ctx.lineWidth = 6;
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = state.map?.tiles?.[y]?.[x];
      if (!tile?.gate) continue;
      const py = y * TILE + TILE_CENTER;
      ctx.beginPath();
      ctx.moveTo(x * TILE + 7, py);
      ctx.lineTo((x + 1) * TILE - 7, py);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPellets() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = state.map?.tiles?.[y]?.[x];
      if (!tile) continue;
      const px = x * TILE;
      const py = y * TILE;
      if (tile.power) {
        drawPowerWaffle(px + TILE_CENTER, py + TILE_CENTER);
      } else if (tile.pellet) {
        ctx.fillStyle = "#ffd34a";
        pixelCircle(px + TILE_CENTER, py + TILE_CENTER, 4);
      }
    }
  }
}

function drawPowerWaffle(centerX, centerY) {
  const pixels = [
    ".....yy.....",
    "...yyyyyy...",
    "..yyyyyyyy..",
    ".yyyyyyyyyy.",
    ".yygyyggygy.",
    "yyyygyggyggy",
    "yyyggggggggy",
    ".yygyggyggy.",
    ".yyyyyyyyyy.",
    "..yyyyyyyy..",
    "...yyyyyy...",
    ".....yy....."
  ];
  const palette = {
    y: "#ffe94a",
    g: "#f3ae12"
  };
  const size = 2.4;
  const left = Math.round(centerX - pixels[0].length * size / 2);
  const top = Math.round(centerY - pixels.length * size / 2);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#ffc400";
  for (let y = 0; y < pixels.length; y += 1) {
    for (let x = 0; x < pixels[y].length; x += 1) {
      const color = palette[pixels[y][x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(left + x * size, top + y * size, size, size);
    }
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f4b21b";
  ctx.fillRect(left + 5 * size, top + size, Math.ceil(size), 10 * size);
  ctx.fillRect(left + size, top + 5 * size, 10 * size, Math.ceil(size));

  ctx.fillStyle = "rgba(255, 247, 112, 0.72)";
  ctx.fillRect(left + 3 * size, top + 3 * size, 2 * size, 2 * size);
  ctx.fillRect(left + 7 * size, top + 3 * size, 2 * size, 2 * size);
  ctx.fillRect(left + 3 * size, top + 7 * size, 2 * size, 2 * size);
  ctx.fillRect(left + 7 * size, top + 7 * size, 2 * size, 2 * size);
  ctx.restore();
}

function isWallTile(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  return Boolean(state.map?.tiles?.[y]?.[x]?.wall);
}

function drawPlayer() {
  if (!state.player) return;
  const p = state.player;
  const px = p.x * TILE;
  const py = p.y * TILE;
  const bob = Math.round(Math.sin(p.mouth) * 1.4);
  ctx.save();
  ctx.fillStyle = state.powerTimer > 0 ? "rgba(255, 200, 87, 0.35)" : "rgba(215, 25, 32, 0.22)";
  pixelCircle(px, py + 2, TILE * 0.52);
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(Math.round(px - TILE * 0.38), Math.round(py + TILE * 0.38), TILE * 0.76, 6);
  drawPixelSprite(ctx, selectedCharacter, px, py + bob, SPRITE_SCALE, p.dir.x < 0);
  ctx.restore();
}

function drawMonsters() {
  if (!state.monsters) return;
  for (const monster of state.monsters) {
    const frightened = state.powerTimer > 0 && !monster.eaten;
    const px = monster.x * TILE;
    const py = monster.y * TILE;
    const flash = frightened && state.powerTimer < 2 && Math.floor(performance.now() / 120) % 2 === 0;
    drawDemogorgon(px, py, { eaten: monster.eaten, frightened, flash });
  }
}

function drawDemogorgon(x, y, mode) {
  ctx.save();
  if (mode.eaten) {
    ctx.translate(x, y);
    ctx.fillStyle = "#f8ece7";
    pixelCircle(-7, -4, 3);
    pixelCircle(7, -4, 3);
    ctx.fillStyle = "#050303";
    pixelCircle(-7, -4, 1.2);
    pixelCircle(7, -4, 1.2);
    ctx.restore();
    return;
  }

  const paletteName = mode.flash ? "flash" : mode.frightened ? "frightened" : "normal";
  const now = performance.now();
  const frameIndex = Math.floor(now / 180) % demogorgonSprite.frames.length;
  const bob = Math.round(Math.sin(now / 140 + x * 0.08) * 1.2);
  ctx.shadowBlur = mode.frightened ? 7 : 8;
  ctx.shadowColor = mode.frightened ? "#3056ff" : "#d71920";
  drawPixelRows(ctx, demogorgonSprite.frames[frameIndex], demogorgonSprite.palettes[paletteName], x, y + 2 + bob, DEMOGORGON_SCALE);
  ctx.restore();
}

function drawPixelRows(targetCtx, rows, palette, centerX, centerY, scale) {
  const width = Math.max(...rows.map((row) => row.length));
  const height = rows.length;
  const left = Math.round(centerX - width * scale / 2);
  const top = Math.round(centerY - height * scale / 2);
  targetCtx.save();
  targetCtx.imageSmoothingEnabled = false;
  for (let y = 0; y < height; y += 1) {
    const row = rows[y] || "";
    for (let x = 0; x < width; x += 1) {
      const color = palette[row[x]];
      if (!color) continue;
      targetCtx.fillStyle = color;
      targetCtx.fillRect(left + Math.round(x * scale), top + Math.round(y * scale), Math.ceil(scale), Math.ceil(scale));
    }
  }
  targetCtx.restore();
}

function drawMessages() {
  if (state.levelMessageTimer > 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
    ctx.fillRect(42, canvas.height / 2 - 54, canvas.width - 84, 108);
    ctx.strokeStyle = "#ff382f";
    ctx.strokeRect(48, canvas.height / 2 - 48, canvas.width - 96, 96);
    ctx.fillStyle = "#ff382f";
    ctx.font = `34px ${CANVAS_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("UPSIDE DOWN", canvas.width / 2, canvas.height / 2 - 12);
    ctx.fillStyle = "#ffc857";
    ctx.font = `20px ${CANVAS_FONT}`;
    ctx.fillText("More monsters. More speed.", canvas.width / 2, canvas.height / 2 + 22);
  }
}

function pixelCircle(x, y, r) {
  ctx.beginPath();
  ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
  ctx.fill();
}

function getSpriteBounds(sprite) {
  return {
    width: sprite.rows.reduce((max, row) => Math.max(max, row.length), 0),
    height: sprite.rows.length
  };
}

function drawPixelSprite(targetCtx, character, centerX, centerY, scale, flip = false) {
  const sprite = character.sprite;
  const bounds = getSpriteBounds(sprite);
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  const left = Math.round(centerX - width / 2);
  const top = Math.round(centerY - height / 2);
  targetCtx.save();
  targetCtx.imageSmoothingEnabled = false;
  targetCtx.translate(left + (flip ? width : 0), top);
  if (flip) targetCtx.scale(-1, 1);

  for (let y = 0; y < bounds.height; y += 1) {
    const row = sprite.rows[y] || "";
    for (let x = 0; x < bounds.width; x += 1) {
      const color = sprite.palette[row[x]];
      if (!color) continue;
      targetCtx.fillStyle = color;
      targetCtx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  targetCtx.restore();
}

function renderPortrait(canvas, character) {
  const portraitCtx = canvas.getContext("2d");
  portraitCtx.imageSmoothingEnabled = false;
  portraitCtx.clearRect(0, 0, canvas.width, canvas.height);
  portraitCtx.fillStyle = "#070203";
  portraitCtx.fillRect(0, 0, canvas.width, canvas.height);
  portraitCtx.fillStyle = character.color;
  portraitCtx.globalAlpha = 0.3;
  portraitCtx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);
  portraitCtx.globalAlpha = 1;
  const bounds = getSpriteBounds(character.sprite);
  const portraitScale = Math.min((canvas.width - 10) / bounds.width, (canvas.height - 10) / bounds.height);
  drawPixelSprite(portraitCtx, character, canvas.width / 2, canvas.height / 2 + 1, portraitScale, false);
  portraitCtx.strokeStyle = "#ff382f";
  portraitCtx.lineWidth = 2;
  portraitCtx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
}

function runFrame(dt = 1 / 60) {
  try {
    frameCounter += 1;
    pollGamepad();
    update(dt);
    syncBodyMode();
    draw();
    if (DEBUG_STATE) {
      document.body.dataset.gameFrame = String(frameCounter);
      document.body.dataset.gameMode = state.mode || "";
      if (state.player) {
        document.body.dataset.playerPos = `${state.player.x.toFixed(2)},${state.player.y.toFixed(2)}`;
      }
    }
  } catch (error) {
    console.error(error);
    ui.status.textContent = "Game error: " + String(error.message || error);
  }
}

function syncBodyMode() {
  document.body.classList.toggle("is-playing", state.mode === "playing");
}

function loop(timestamp) {
  const dt = Math.min(Math.max((timestamp - lastFrameTime) / 1000, 0), 0.05) || 1 / 60;
  lastFrameTime = timestamp;
  runFrame(dt);
  window.requestAnimationFrame(loop);
}

function updateUi() {
  ui.score.textContent = String(state.score ?? 0);
  ui.level.textContent = String(state.level ?? 1);
  ui.lives.textContent = String(state.lives ?? 3);
}

function debugSnapshot() {
  return {
    mode: state.mode || "",
    level: state.level ?? 1,
    pellets: state.map?.pellets ?? 0,
    playerSpawn: state.map?.playerSpawn,
    monsterSpawn: state.map?.monsterSpawn,
    player: state.player ? { x: state.player.x, y: state.player.y } : null
  };
}

function installDebugTools() {
  if (!DEBUG_STATE) return;
  window.__pacmanDebug = {
    setLevel(level) {
      const targetLevel = Math.max(1, Math.floor(Number(level) || 1));
      ui.startScreen.classList.remove("active");
      ui.gameOverScreen.classList.remove("active");
      startLevel(targetLevel);
      draw();
      return debugSnapshot();
    },
    snapshot: debugSnapshot
  };
}

function renderCharacters() {
  ui.characterGrid.innerHTML = "";
  for (const character of characters) {
    const button = document.createElement("button");
    button.type = "button";
    button.value = character.id;
    button.className = `character-card${character.id === selectedCharacter.id ? " selected" : ""}`;
    button.setAttribute("aria-label", `Select ${character.name}`);
    button.setAttribute("aria-pressed", String(character.id === selectedCharacter.id));
    const portrait = document.createElement("canvas");
    portrait.className = "portrait";
    portrait.width = 96;
    portrait.height = 96;
    renderPortrait(portrait, character);

    const name = document.createElement("strong");
    name.textContent = character.name;

    button.append(portrait, name);
    button.addEventListener("click", () => {
      selectedCharacter = character;
      updateCharacterSelection();
      beep(460, 0.045, "square", 0.04);
    });
    ui.characterGrid.appendChild(button);
  }
}

function getCharacterGridColumnCount() {
  const columns = window.getComputedStyle(ui.characterGrid).gridTemplateColumns
    .split(" ")
    .filter(Boolean).length;
  return Math.max(1, columns || 3);
}

function moveCharacterSelection(dir, focusSelected = false) {
  const currentIndex = Math.max(0, characters.findIndex((character) => character.id === selectedCharacter.id));
  const columns = getCharacterGridColumnCount();
  let nextIndex = currentIndex;

  if (dir.x < 0) {
    nextIndex = (currentIndex - 1 + characters.length) % characters.length;
  } else if (dir.x > 0) {
    nextIndex = (currentIndex + 1) % characters.length;
  } else if (dir.y < 0) {
    nextIndex = currentIndex - columns;
    if (nextIndex < 0) {
      nextIndex = currentIndex % columns;
      while (nextIndex + columns < characters.length) nextIndex += columns;
    }
  } else if (dir.y > 0) {
    nextIndex = currentIndex + columns;
    if (nextIndex >= characters.length) {
      nextIndex = currentIndex % columns;
    }
  }

  selectedCharacter = characters[nextIndex];
  updateCharacterSelection(focusSelected);
  beep(460, 0.045, "square", 0.04);
}

function updateCharacterSelection(focusSelected = false) {
  let selectedButton = null;
  for (const button of ui.characterGrid.querySelectorAll(".character-card")) {
    const selected = button.value === selectedCharacter.id;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    if (selected) selectedButton = button;
  }
  if (focusSelected && selectedButton) {
    selectedButton.focus({ preventScroll: true });
  }
}

function readTopScores() {
  try {
    const savedScores = JSON.parse(localStorage.getItem(TOP_SCORE_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedScores)) return [];
    return savedScores
      .map((score) => Math.max(0, Math.floor(Number(score) || 0)))
      .filter((score) => Number.isFinite(score))
      .sort((a, b) => b - a)
      .slice(0, TOP_SCORE_LIMIT);
  } catch {
    return [];
  }
}

function saveTopScores(scores) {
  try {
    localStorage.setItem(TOP_SCORE_STORAGE_KEY, JSON.stringify(scores.slice(0, TOP_SCORE_LIMIT)));
    return true;
  } catch {
    return false;
  }
}

function recordTopScore(score) {
  const nextScores = [...readTopScores(), Math.max(0, Math.floor(Number(score) || 0))]
    .sort((a, b) => b - a)
    .slice(0, TOP_SCORE_LIMIT);
  return saveTopScores(nextScores) ? nextScores : [Math.max(0, Math.floor(Number(score) || 0))];
}

function renderTopScores(scores) {
  ui.topScores.innerHTML = "";
  for (const score of scores.slice(0, TOP_SCORE_LIMIT)) {
    const item = document.createElement("li");
    item.textContent = String(score);
    ui.topScores.appendChild(item);
  }
}

function startAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function startBackgroundMusic() {
  if (!ui.backgroundMusic) return;
  ui.backgroundMusic.volume = 0.28;
  ui.backgroundMusic.loop = true;
  const playPromise = ui.backgroundMusic.play();
  if (playPromise) {
    playPromise.catch((error) => {
      console.warn("Background music could not start.", error);
    });
  }
}

function beep(freq, duration, type = "square", volume = 0.04) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function directionForKey(key) {
  const map = {
    ArrowLeft: DIRS.left,
    KeyA: DIRS.left,
    KeyJ: DIRS.left,
    Numpad4: DIRS.left,
    ArrowRight: DIRS.right,
    KeyD: DIRS.right,
    KeyL: DIRS.right,
    Numpad6: DIRS.right,
    ArrowUp: DIRS.up,
    KeyW: DIRS.up,
    KeyI: DIRS.up,
    Numpad8: DIRS.up,
    ArrowDown: DIRS.down,
    KeyS: DIRS.down,
    KeyK: DIRS.down,
    Numpad2: DIRS.down
  };
  return map[key] || null;
}

function handleDirection(key) {
  const dir = directionForKey(key);
  if (dir) {
    state.desiredDir = dir;
    return true;
  }
  return false;
}

function directionId(dir) {
  return dir ? `${dir.x},${dir.y}` : "";
}

function readGamepadDirection(pad) {
  const axisX = pad.axes[0] || 0;
  const axisY = pad.axes[1] || 0;
  const dpadLeft = pad.buttons[14]?.pressed;
  const dpadRight = pad.buttons[15]?.pressed;
  const dpadUp = pad.buttons[12]?.pressed;
  const dpadDown = pad.buttons[13]?.pressed;

  if (dpadLeft || axisX < -0.45) return DIRS.left;
  if (dpadRight || axisX > 0.45) return DIRS.right;
  if (dpadUp || axisY < -0.45) return DIRS.up;
  if (dpadDown || axisY > 0.45) return DIRS.down;
  return null;
}

function startGame() {
  if (state.mode !== "menu") return;
  startAudio();
  startBackgroundMusic();
  ui.startScreen.classList.remove("active");
  ui.gameOverScreen.classList.remove("active");
  resetGame();
  ui.status.textContent = `${selectedCharacter.name} is ready. Collect all dots.`;
}

function returnToCharacterSelect() {
  ui.gameOverScreen.classList.remove("active");
  ui.startScreen.classList.add("active");
  state.mode = "menu";
  syncBodyMode();
  updateCharacterSelection(true);
  ui.status.textContent = "Choose a character for the next round.";
}

function pollGamepad() {
  if (!navigator.getGamepads) return;
  const pads = navigator.getGamepads();
  let pad = null;
  for (let index = 0; index < pads.length; index += 1) {
    if (pads[index]) {
      pad = pads[index];
      break;
    }
  }
  if (!pad) return;

  const startPressed = Boolean(pad.buttons[0]?.pressed || pad.buttons[9]?.pressed);
  if (startPressed && !lastGamepadStart && state.mode === "menu") {
    startGame();
  }
  lastGamepadStart = startPressed;

  const gamepadDir = readGamepadDirection(pad);
  if (state.mode === "menu") {
    const menuDirectionId = directionId(gamepadDir);
    if (gamepadDir && menuDirectionId !== lastGamepadMenuDirection) {
      moveCharacterSelection(gamepadDir, true);
    }
    lastGamepadMenuDirection = menuDirectionId;
    return;
  }

  if (state.mode !== "playing") return;
  if (gamepadDir) state.desiredDir = gamepadDir;
}

document.addEventListener("keydown", (event) => {
  const dir = directionForKey(event.code);
  if (state.mode === "menu" && dir) {
    moveCharacterSelection(dir, true);
    event.preventDefault();
    return;
  }
  if (state.mode === "playing" && handleDirection(event.code)) {
    event.preventDefault();
    return;
  }
  if ((event.code === "Enter" || event.code === "Space" || event.code === "NumpadEnter") && state.mode === "gameover") {
    returnToCharacterSelect();
    event.preventDefault();
    return;
  }
  if ((event.code === "Enter" || event.code === "Space" || event.code === "NumpadEnter") && state.mode === "menu") {
    startGame();
    event.preventDefault();
  }
});

ui.startButton.addEventListener("click", startGame);

ui.restartButton.addEventListener("click", returnToCharacterSelect);

if (DEBUG_CLEAR_TOP_SCORES) {
  try {
    localStorage.removeItem(TOP_SCORE_STORAGE_KEY);
  } catch {
    // Ignore unavailable storage in debug mode.
  }
}

renderCharacters();
resetGame();
if (DEBUG_GAME_OVER_SCORE !== null) {
  ui.startScreen.classList.remove("active");
  ui.gameOverScreen.classList.remove("active");
  state.score = DEBUG_GAME_OVER_SCORE;
  gameOver();
} else if (DEBUG_START_LEVEL > 1) {
  ui.startScreen.classList.remove("active");
  ui.gameOverScreen.classList.remove("active");
  startLevel(DEBUG_START_LEVEL);
} else {
  state.mode = "menu";
}
installDebugTools();
runFrame(1 / 60);
window.requestAnimationFrame(loop);
