let boxes = document.querySelectorAll(".box");
let resetButton = document.getElementById("reset");
let message = document.createElement("h2");
document.body.appendChild(message);

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player is "X", AI is "O"

// Winning patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Function to check for a win
function checkWinner(player) {
    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

// Function to check for a draw
function checkDraw() {
    return board.every(cell => cell !== "");
}

// Function to handle player's move
function handleClick(event) {
    let index = Array.from(boxes).indexOf(event.target);

    if (board[index] === "" && !message.textContent) {
        board[index] = "X";
        event.target.textContent = "X";

        if (checkWinner("X")) {
            message.textContent = "You Win!";
            return;
        }
        if (checkDraw()) {
            message.textContent = "It's a Draw!";
            return;
        }

        setTimeout(aiMove, 500); // AI moves after player's turn
    }
}

// Function for AI Move (Smarter AI)
function aiMove() {
    let emptyCells = board.map((val, idx) => (val === "" ? idx : null)).filter(idx => idx !== null);

    if (emptyCells.length === 0 || message.textContent) return;

    // 1️⃣ AI tries to win
    for (let idx of emptyCells) {
        board[idx] = "O";
        if (checkWinner("O")) {
            boxes[idx].textContent = "O";
            message.textContent = "AI Wins!";
            return;
        }
        board[idx] = ""; // Undo move
    }

    // 2️⃣ AI blocks the player if they are about to win
    for (let idx of emptyCells) {
        board[idx] = "X";
        if (checkWinner("X")) {
            board[idx] = "O"; // Block move
            boxes[idx].textContent = "O";
            return;
        }
        board[idx] = ""; // Undo move
    }

    // 3️⃣ AI picks the center if available
    if (board[4] === "") {
        board[4] = "O";
        boxes[4].textContent = "O";
        return;
    }

    // 4️⃣ AI picks a corner if available
    let corners = [0, 2, 6, 8].filter(idx => board[idx] === "");
    if (corners.length > 0) {
        let choice = corners[Math.floor(Math.random() * corners.length)];
        board[choice] = "O";
        boxes[choice].textContent = "O";
        return;
    }

    // 5️⃣ AI picks a random available spot
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    boxes[randomIndex].textContent = "O";

    // Check if AI won after move
    if (checkWinner("O")) {
        message.textContent = "AI Wins!";
    }
}

// Reset Game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    boxes.forEach(box => box.textContent = "");
    message.textContent = "";
}

// Event Listeners
boxes.forEach(box => box.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);