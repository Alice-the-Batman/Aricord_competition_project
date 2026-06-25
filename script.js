const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const gameOver = document.getElementById("gameOver");

const TILE_SIZE = 80;

const GRID_W = Math.ceil(window.innerWidth / TILE_SIZE) + 2;
const GRID_H = Math.ceil(window.innerHeight / TILE_SIZE) + 2;

const offsetX = (window.innerWidth - GRID_W * TILE_SIZE) / 2;
const offsetY = (window.innerHeight - GRID_H * TILE_SIZE) / 2;

let tiles = [];

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

let score = 0;
let running = false;

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {

        const tile = document.createElement("div");

        tile.classList.add("tile");

        const posX = offsetX + x * TILE_SIZE;
        const posY = offsetY + y * TILE_SIZE;

        tile.style.left = posX + "px";
        tile.style.top = posY + "px";

        game.appendChild(tile);

        tiles.push({
            element: tile,
            x,
            y,
            posX,
            posY,
            broken: false
        });
    }
}

function movePlayer() {

    const speed = 4;

    if (keys["w"]) playerY -= speed;
    if (keys["s"]) playerY += speed;
    if (keys["a"]) playerX -= speed;
    if (keys["d"]) playerX += speed;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

function getTileUnderPlayer() {

    const localX = playerX - offsetX;
    const localY = playerY - offsetY;

    const tx = Math.floor((localX + 15) / TILE_SIZE);
    const ty = Math.floor((localY + 15) / TILE_SIZE);

    return tiles.find(
        t => t.x === tx && t.y === ty
    );
}

function checkFall() {

    const tile = getTileUnderPlayer();

    if (!tile || tile.broken) {

        running = false;

        if (typeof music !== 'undefined' && music) {
            music.pause();
            music.currentTime = 0;
        }

        const finalScoreDisplay = document.querySelector("#finalScore span");
        if (finalScoreDisplay) {
            finalScoreDisplay.textContent = score;
        }

        gameOver.classList.remove("hidden");
    }
}

function breakRandomTile() {

    const available = tiles.filter(
        t => !t.broken
    );

    if (available.length < 10) return;

    const tile =
        available[
            Math.floor(
                Math.random() * available.length
            )
        ];

    tile.broken = true;

    tile.element.classList.add("broken");
}

setInterval(() => {

    if (running) {
        breakRandomTile();
    }

}, 1000);

function updateScore() {

    if (!running) return;

    score++;

    scoreDisplay.textContent = score;
}

setInterval(updateScore, 1000);

let time = 0;

function animate() {

    if (!running) return;

    time += 0.03;

    const rotation = Math.sin(time) * 3;

    game.style.transform =
        `rotate(${rotation}deg)`;

    movePlayer();

    checkFall();

    requestAnimationFrame(animate);
}

player.style.left = playerX + "px";
player.style.top = playerY + "px";

animate();

const music = document.getElementById("bgMusic");

function startMusic() {
    music.play().catch(error => {
        console.log("Autoplay blocked by browser, waiting for interaction.");
    });
    document.removeEventListener("keydown", startMusic);
    document.removeEventListener("click", startMusic);
}

document.addEventListener("keydown", startMusic);
document.addEventListener("click", startMusic);

const startMenu = document.getElementById("startMenu");
const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
       
    running = true;

    checkFall();
       
    animate();
       
    if (typeof music !== 'undefined') {
        music.play().catch(e => console.log("Muzyka czeka na kliknięcie"));
    }
});

const touchButtons = {
    "btnUp": "w",
    "btnDown": "s",
    "btnLeft": "a",
    "btnRight": "d"
};

Object.keys(touchButtons).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keys[touchButtons[btnId]] = true;
        });

        btn.addEventListener("touchend", (e) => {
            e.preventDefault();
            keys[touchButtons[btnId]] = false;
        });
    }
});

playButton.addEventListener("click", () => {
    if (window.matchMedia("(pointer: coarse)").matches) {
        document.getElementById("touchController").classList.remove("hidden");
    }
});