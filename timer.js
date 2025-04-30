document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const stopwatch = document.getElementById('stopwatch-timer');
    const toggleButton = document.getElementById('start-timer-btn'); // Renamed for clarity
    
    if (!timerDisplay || !stopwatch || !toggleButton) { 
        console.error('Timer elements or toggle button not found!');
        return;
    }

    const totalTime = 150; // Total seconds
    let remainingTime = totalTime;
    let timerInterval = null;
    window.timerState = 'idle'; // Use global variable. Possible states: 'idle', 'running', 'paused', 'gameOver'

    // Function to update display and gradient (doesn't decrease time)
    function updateDisplay() {
        timerDisplay.textContent = remainingTime;
        const progressPercentage = Math.max(0, (remainingTime / totalTime) * 100);
        const progressAngle = (progressPercentage / 100) * 360;
        stopwatch.style.setProperty('--progress-angle', `${progressAngle}deg`);
    }

    // Function to stop timer permanently and disable button
    window.stopTimerPermanently = () => {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        window.timerState = 'gameOver';
        toggleButton.textContent = 'پایان';
        toggleButton.disabled = true; // Disable the button permanently
        console.log('Timer stopped permanently.');
    };

    // Function called every second by the interval
    function timerTick() {
        if (remainingTime <= 0) { // Check before decrementing
            remainingTime = 0; // Ensure it's exactly 0
            updateDisplay(); // Final display update
            // Call game over handler (defined in game.js)
            if (typeof window.handleGameOver === 'function') {
                window.handleGameOver('time'); // Pass reason
            } else {
                window.stopTimerPermanently(); // Fallback if game over handler isn't ready
            }
            return; // Stop the tick
        }
        
        remainingTime--; // Decrease time
        updateDisplay(); // Update the display
    }

    // Event listener for the toggle button
    toggleButton.addEventListener('click', () => {
        // Prevent action if game is over
        if (window.timerState === 'gameOver') return;

        if (window.timerState === 'idle' || window.timerState === 'paused') {
            // Start or Resume
            if (remainingTime > 0) { 
                // Call startGame only when starting from idle
                if (window.timerState === 'idle') {
                    if (typeof window.startGame === 'function') {
                         window.startGame(); 
                    } else {
                        console.error('startGame function not found!');
                    }
                }

                console.log(window.timerState === 'idle' ? 'Timer started!' : 'Timer resumed!');
                timerInterval = setInterval(timerTick, 1000);
                window.timerState = 'running';
                toggleButton.textContent = 'توقف';
            }
        } else if (window.timerState === 'running') {
            // Pause
            console.log('Timer paused!');
            clearInterval(timerInterval);
            timerInterval = null;
            window.timerState = 'paused';
            toggleButton.textContent = 'ادامه';
        }
    });

    // Initial display setup when the page loads
    toggleButton.textContent = 'شروع'; // Set initial text
    updateDisplay(); 
}); 