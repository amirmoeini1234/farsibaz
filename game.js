document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const keyboardContainer = document.getElementById('persian-keyboard');
    const tablesContainer = document.getElementById('tables-container');
    const allRows = tablesContainer.querySelectorAll('.table-row-container');
    const totalRows = allRows.length;

    // --- Game State ---
    let currentRowIndex = 0;
    let currentCellIndex = 1; // Start after the first cell (random letter)
    let gameStarted = false;
    window.isGameOver = false; // Global game over flag

    // --- Persian Letters ---
    const persianLetters = [
        'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 
        'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 
        'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'
    ];

    function getRandomPersianLetter() {
        const randomIndex = Math.floor(Math.random() * persianLetters.length);
        return persianLetters[randomIndex];
    }

    // --- Helper Functions ---
    function setActiveRow(index) {
        allRows.forEach((row, i) => {
            row.classList.toggle('active-row', i === index);
        });
    }

    function placeRandomLetter(rowIndex) {
        if (rowIndex >= totalRows) return; // Game over or out of bounds

        const firstCell = allRows[rowIndex].querySelector('.table-cell');
        if (firstCell) {
            firstCell.textContent = getRandomPersianLetter();
        }
    }

    // --- Game Over Handler ---
    window.handleGameOver = (reason) => {
        if (window.isGameOver) return; // Already handled

        console.log(`Game Over! Reason: ${reason}`);
        window.isGameOver = true;
        setActiveRow(-1); // Deactivate all rows

        // Stop timer permanently
        if (typeof window.stopTimerPermanently === 'function') {
            window.stopTimerPermanently();
        }

        // Calculate total score
        let totalScore = 0;
        allRows.forEach(row => {
            const inputField = row.querySelector('.input-field');
            if (inputField && !isNaN(parseInt(inputField.value))) {
                totalScore += parseInt(inputField.value);
            }
        });

        // Display total score
        let scoreDisplay = document.getElementById('total-score-display');
        if (!scoreDisplay) {
            // If it doesn't exist, create and append it once
            scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'total-score-display';
            document.body.appendChild(scoreDisplay); // Append to body
        }
        
        scoreDisplay.textContent = `پایان بازی! امتیاز کل: ${totalScore}`;
        scoreDisplay.style.display = 'block'; // Show the score bar
    };

    // --- Game Actions ---
    window.startGame = () => {
        // Reset game state
        console.log("Game starting / restarting...");
        gameStarted = true;
        window.isGameOver = false;
        currentRowIndex = 0;
        currentCellIndex = 1;
        // Don't set timerState here, timer.js handles it

        // Hide previous score display
        const scoreDisplay = document.getElementById('total-score-display');
        if (scoreDisplay) {
            scoreDisplay.style.display = 'none'; // Hide the score bar
        }

        // Reset UI elements
        allRows.forEach(row => {
             row.querySelectorAll('.table-cell').forEach(cell => cell.textContent = ''); // Clear all cells
             row.querySelector('.pseudo-table').classList.remove('rejected-row');
             const inputField = row.querySelector('.input-field');
             if (inputField) inputField.value = '0'; // Reset score field
        });

        placeRandomLetter(currentRowIndex);
        setActiveRow(currentRowIndex);
        
        // Ensure timer button is ready if restarting
        const toggleButton = document.getElementById('start-timer-btn');
        if(toggleButton) {
            toggleButton.disabled = false;
            toggleButton.textContent = 'شروع';
        }
        // Reset timer display visually (timer.js handles actual reset)
        const timerDisplay = document.getElementById('timer-display');
        if(timerDisplay) timerDisplay.textContent = '150';
        const stopwatch = document.getElementById('stopwatch-timer');
        if(stopwatch) stopwatch.style.setProperty('--progress-angle', `360deg`);
    };

    function handleKeyboardInput(letter) {
        // Check if game is over or not running
        if (window.isGameOver || window.timerState !== 'running') return;

        // Check if input is valid
        if (currentCellIndex >= 12 || currentRowIndex >= totalRows) {
            return;
        }
        const targetCell = allRows[currentRowIndex].querySelectorAll('.table-cell')[currentCellIndex];
        if (targetCell) {
            targetCell.textContent = letter;
            currentCellIndex++;
        }
    }

    function handleRejectAction(rowIndex) {
        // Check if game is over or not running
        if (window.isGameOver || window.timerState !== 'running' || rowIndex !== currentRowIndex || currentRowIndex >= totalRows) {
            return;
        }
        console.log(`Rejecting row: ${rowIndex}`);

        // Add rejection line
        const pseudoTable = allRows[rowIndex].querySelector('.pseudo-table');
        if (pseudoTable) {
            pseudoTable.classList.add('rejected-row');
        }

        // Move to the next row
        currentRowIndex++;
        currentCellIndex = 1; // Reset cell index for the new row

        if (currentRowIndex < totalRows) {
            placeRandomLetter(currentRowIndex);
            setActiveRow(currentRowIndex);
        } else {
            console.log("Game Over - All rows processed (reject)");
            window.handleGameOver('rows'); // Trigger game over
        }
    }

    function handleConfirmAction(rowIndex) {
        // Check if game is over or not running
        if (window.isGameOver || window.timerState !== 'running' || rowIndex !== currentRowIndex || currentRowIndex >= totalRows) {
            return;
        }
        console.log(`Confirming row: ${rowIndex}`);

        const currentRow = allRows[rowIndex];
        const cells = currentRow.querySelectorAll('.table-cell'); // New: Includes all cells
        const inputField = currentRow.querySelector('.input-field');

        // 1. Count filled cells (all 12 cells)
        let filledCount = 0;
        cells.forEach(cell => {
            if (cell.textContent.trim() !== '') {
                filledCount++;
            }
        });

        // 2. Calculate score
        const score = filledCount * 6;

        // 3. Display score
        if (inputField) {
            inputField.value = score;
        }

        // 4. Move to the next row
        currentRowIndex++;
        currentCellIndex = 1; // Reset cell index for the new row

        if (currentRowIndex < totalRows) {
            placeRandomLetter(currentRowIndex); // Place random letter in the new row
            setActiveRow(currentRowIndex); // Activate the new row
        } else {
            console.log("Game Over - All rows processed (confirm)");
            window.handleGameOver('rows'); // Trigger game over
        }
    }

    // --- Event Listeners ---

    // Keyboard Input
    if (keyboardContainer) {
        keyboardContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('keyboard-key')) {
                handleKeyboardInput(event.target.textContent);
            }
        });
    }

    // Confirm/Reject Buttons (Event Delegation)
    if (tablesContainer) {
        tablesContainer.addEventListener('click', (event) => {
            const target = event.target;
            const row = target.closest('.table-row-container');
            if (!row) return; // Clicked outside a row container

            // Find the index of the clicked row
            const rowIndex = Array.from(allRows).indexOf(row);

            if (target.classList.contains('btn-reject')) {
                handleRejectAction(rowIndex);
            } else if (target.classList.contains('btn-confirm')) {
                handleConfirmAction(rowIndex);
            }
        });
    }
}); 