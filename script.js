const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const socket = io();

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = '';
let playerHealth = 100;
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let playerSpeed = 5;

// Get the player's name
document.getElementById('player-name').addEventListener('change', (e) => {
    playerName = e.target.value;
    socket.emit('new-player', { playerName });
});

// Handle movement and shooting
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') playerY -= playerSpeed;
    if (e.key === 'ArrowDown') playerY += playerSpeed;
    if (e.key === 'ArrowLeft') playerX -= playerSpeed;
    if (e.key === 'ArrowRight') playerX += playerSpeed;

    // For shooting, we need to add an event that triggers a shot
    if (e.key === ' ') {
        // Shooting logic (send data to server about the shot)
        socket.emit('shoot', { x: playerX, y: playerY });
    }
});

// Health bar and player rendering
function renderPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (red square)
    ctx.fillStyle = 'red';
    ctx.fillRect(playerX, playerY, 50, 50);

    // Draw health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(playerX, playerY - 10, playerHealth, 5);

    // Draw player name above
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(playerName, playerX, playerY - 15);
}

// Listen for updates from the server
socket.on('update', (players) => {
    renderPlayer();
});

// Handle death (tab close on death)
socket.on('death', () => {
    alert("You died!");
    window.close();  // This may not work in all browsers due to security restrictions
});
