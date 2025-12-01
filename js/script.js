// ====== CONFIGURACIÓN DE GRID ======
const GRID_SIZE = 10;
const gridElement = document.getElementById("word-grid");
const statusText = document.getElementById("status-text");
const resetBtn = document.getElementById("reset-btn");
const exitBtn = document.getElementById("exit-btn");
const timeLeftSpan = document.getElementById("time-left");

let grid = [];
let cells = [];
let selectedStart = null;
let selectedEnd = null;
let wordsState = []; // { word, hint, found }
let timerId = null;
let timeLeft = 60;

// --- Ir a la página anterior / hub de retos ---
function goBackToChallenges() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Cambia "index.html" por la página donde tengas tus pistas/challenges
    window.location.href = "index.html";
  }
}

// Inicializar
function init() {
  buildWordState();
  generateGrid();
  renderGrid();
  statusText.textContent =
    "Click a letter to start, then click another letter in a straight line (horizontal, vertical or diagonal).";
  startTimer();
}

// Crear estado de palabras
function buildWordState() {
  wordsState = wordList.map(w => ({
    word: w.word.toUpperCase(),
    hint: w.hint,
    found: false
  }));
}

// Generar grid y colocar palabras
function generateGrid() {
  grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = new Array(GRID_SIZE).fill(null);
    grid.push(row);
  }

  // Colocar manualmente las palabras
  // WERK vertical
  placeWordAt("WERK", 0, 0, 1, 0);

  // RUPAUL horizontal
  placeWordAt("RUPAUL", 2, 1, 0, 1);

  // HELLO diagonal
  placeWordAt("HELLO", 4, 4, 1, 1);

  // Rellenar con letras aleatorias
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) {
        const randomLetter =
          alphabet[Math.floor(Math.random() * alphabet.length)];
        grid[r][c] = randomLetter;
      }
    }
  }
}

// Colocar palabra
function placeWordAt(word, startRow, startCol, dRow, dCol) {
  word = word.toUpperCase();
  for (let i = 0; i < word.length; i++) {
    const r = startRow + i * dRow;
    const c = startCol + i * dCol;
    grid[r][c] = word[i];
  }
}

// Renderizar grid
function renderGrid() {
  gridElement.innerHTML = "";
  cells = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener("click", () => handleCellClick(cell));
      gridElement.appendChild(cell);
      cells.push(cell);
    }
  }
}

// Timer de 60s
function startTimer() {
  clearInterval(timerId);
  timeLeft = 60;
  timeLeftSpan.textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      alert("Time's up! You did not find all the words in time.");
      goBackToChallenges();
    }
  }, 1000);
}

// Manejo de clic en celda
function handleCellClick(cell) {
  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  // Si no hay inicio seleccionado
  if (!selectedStart) {
    clearSelection();
    selectedStart = { row, col, cell };
    cell.classList.add("selected");
    statusText.textContent =
      "Now click another letter in a straight line to select a word.";
    return;
  }

  // Si clic de nuevo en la misma celda, limpiar selección
  if (selectedStart && selectedStart.row === row && selectedStart.col === col) {
    clearSelection();
    statusText.textContent =
      "Selection cleared. Click a starting letter again.";
    return;
  }

  // Tratar como fin
  selectedEnd = { row, col, cell };
  const path = getPathBetween(selectedStart, selectedEnd);

  if (!path) {
    statusText.textContent =
      "Selection must be horizontal, vertical, or diagonal in a straight line.";
    clearSelection();
    return;
  }

  const letters = path.map(p => grid[p.row][p.col]).join("");
  const reversed = letters.split("").reverse().join("");

  const match = wordsState.find(
    w => !w.found && (w.word === letters || w.word === reversed)
  );

  if (match) {
    match.found = true;
    path.forEach(p => {
      const cellEl = getCellAt(p.row, p.col);
      cellEl.classList.remove("selected");
      cellEl.classList.add("found");
    });

    statusText.textContent = `You found: ${match.word}!`;

    const remaining = wordsState.filter(w => !w.found).length;
    if (remaining === 0) {
      clearInterval(timerId);
      statusText.textContent =
        "You found all the words! Condragulations, queen! 👑";
      setTimeout(() => {
        alert("You found all the words! Condragulations, queen! 👑");
        goBackToChallenges();
      }, 400);
    }
  } else {
    statusText.textContent = "That selection is not a valid word. Try again.";
  }

  clearSelection();
}

// Obtener celda por fila/columna
function getCellAt(row, col) {
  return gridElement.querySelector(
    `.grid-cell[data-row="${row}"][data-col="${col}"]`
  );
}

// Camino entre inicio y fin si es recta
function getPathBetween(start, end) {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  if (dRow === 0 && dCol === 0) return null;

  const stepRow = Math.sign(dRow);
  const stepCol = Math.sign(dCol);

  // Horizontal
  if (stepRow === 0 && stepCol !== 0) {
    const length = Math.abs(dCol) + 1;
    const path = [];
    for (let i = 0; i < length; i++) {
      path.push({
        row: start.row,
        col: start.col + i * stepCol
      });
    }
    return path;
  }

  // Vertical
  if (stepCol === 0 && stepRow !== 0) {
    const length = Math.abs(dRow) + 1;
    const path = [];
    for (let i = 0; i < length; i++) {
      path.push({
        row: start.row + i * stepRow,
        col: start.col
      });
    }
    return path;
  }

  // Diagonal
  if (Math.abs(dRow) === Math.abs(dCol)) {
    const length = Math.abs(dRow) + 1;
    const path = [];
    for (let i = 0; i < length; i++) {
      path.push({
        row: start.row + i * stepRow,
        col: start.col + i * stepCol
      });
    }
    return path;
  }

  return null;
}

// Limpiar selección visual
function clearSelection() {
  selectedStart = null;
  selectedEnd = null;
  cells.forEach(c => c.classList.remove("selected"));
}

// Botón reset: nueva sopa y reiniciar timer
resetBtn.addEventListener("click", () => {
  clearSelection();
  buildWordState();
  generateGrid();
  renderGrid();
  statusText.textContent =
    "New puzzle! Click a letter to start selecting a word.";
  startTimer();
});

// Botón exit: salir sin terminar
exitBtn.addEventListener("click", () => {
  clearInterval(timerId);
  goBackToChallenges();
});

// Inicializar al cargar
init();
