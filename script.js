document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');
    const musicBtn = document.getElementById('musicBtn');
    const gameModeBtn = document.getElementById('gameModeBtn');
    const difficultyBtn = document.getElementById('difficultyBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const moveSound = document.getElementById('moveSound');
    const winSound = document.getElementById('winSound');
    const drawSound = document.getElementById('drawSound');
    const timerElement = document.getElementById('timer');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const drawsElement = document.getElementById('draws');
    const historyElement = document.getElementById('history');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0, draws: 0 };
    let gameHistory = [];
    let gameMode = 'player'; // player vs player or player vs ai
    let aiDifficulty = 'easy'; // easy or hard
    let timer;
    let timeLeft = 30; // 30 seconds per turn

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function startTimer() {
        clearInterval(timer);
        timeLeft = 30;
        timerElement.textContent = formatTime(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function handleTimeout() {
        if (gameActive) {
            message.textContent = `${getCurrentPlayerName()} took too long! ${getCurrentPlayerName()} loses.`;
            gameActive = false;
            updateScore(currentPlayer === 'X' ? 'O' : 'X');
            gameHistory.push(`${getCurrentPlayerName()} timed out`);
            updateHistory();
        }
    }

    function handleCellClick(event) {
        const index = event.target.getAttribute('data-index');
        if (gameBoard[index] !== '' || !gameActive) return;

        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        moveSound.play();

        if (checkWin()) {
            message.textContent = `${getCurrentPlayerName()} wins!`;
            event.target.classList.add('winning-line');
            winSound.play();
            updateScore(currentPlayer);
            gameHistory.push(`${getCurrentPlayerName()} wins`);
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            message.textContent = 'It\'s a draw!';
            scores.draws++;
            drawsElement.textContent = `Draws: ${scores.draws}`;
            drawSound.play();
            gameHistory.push('Draw');
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (gameMode === 'ai' && currentPlayer === 'O') {
                setTimeout(aiMove, 500); // Delay AI move for realism
            }
        }
        startTimer();
    }

    function aiMove() {
        let availableCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        let move;

        if (aiDifficulty === 'easy') {
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
        } else {
            // Hard AI: Minimax algorithm can be added here for a more challenging opponent
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
        }

        if (move !== undefined) {
            cells[move].click(); // Trigger cell click programmatically
        }
    }

    function checkWin() {
        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    }

    function getCurrentPlayerName() {
        return currentPlayer === 'X' ? playerXNameInput.value || 'Player X' : playerONameInput.value || 'Player O';
    }

    function updateScore(winner) {
        if (winner === 'X') {
            scores.X++;
            scoreXElement.textContent = `Player X: ${scores.X}`;
        } else if (winner === 'O') {
            scores.O++;
            scoreOElement.textContent = `Player O: ${scores.O}`;
        }
    }

    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = '';
        cells.forEach(cell => cell.textContent = '');
        cells.forEach(cell => cell.classList.remove('winning-line'));
        startTimer();
    }

    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicBtn.textContent = 'Mute Music';
        } else {
            backgroundMusic.pause();
            musicBtn.textContent = 'Play Music';
        }
    }

    function updateHistory() {
        historyElement.innerHTML = '';
        gameHistory.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            historyElement.appendChild(li);
        });
    }

    function switchGameMode() {
        if (gameMode === 'player') {
            gameMode = 'ai';
            gameModeBtn.textContent = 'Switch to Player vs Player';
            difficultyBtn.style.display = 'inline-block';
        } else {
            gameMode = 'player';
            gameModeBtn.textContent = 'Switch to Player vs AI';
            difficultyBtn.style.display = 'none';
        }
    }

    function switchDifficulty() {
        aiDifficulty = aiDifficulty === 'easy' ? 'hard' : 'easy';
        difficultyBtn.textContent = `AI Difficulty: ${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)}`;
    }

    backgroundMusic.addEventListener('canplaythrough', () => {
        musicBtn.style.display = 'inline-block'; // Show the button only after the audio can play
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', () => {
        restartGame();
        updateHistory();
    });
    musicBtn.addEventListener('click', toggleMusic);
    gameModeBtn.addEventListener('click', switchGameMode);
    difficultyBtn.addEventListener('click', switchDifficulty);

    startTimer();
});
