document.addEventListener('DOMContentLoaded', () => {
    // --- Variables ---
    let timerInterval;
    let totalSeconds = 25 * 60; // Default 25 minutes
    let initialSeconds = 25 * 60;
    let isRunning = false;

    // --- DOM Elements ---
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetPills = document.querySelectorAll('.preset-pill');
    const ambientCards = document.querySelectorAll('.ambient-card');
    const timerStatus = document.querySelector('.timer-display p'); // "Focus Time" label
    const blockAppsCard = document.getElementById('block-apps-card');
    const blockAppsToggle = document.getElementById('block-apps-toggle');
    const timerCircle = document.querySelector('.timer-circle-outer');
    const timerTicks = document.querySelector('.timer-ticks');

    // --- Format Helper ---
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // --- Update UI ---
    function updateTimerUI() {
        timerDisplay.textContent = formatTime(totalSeconds);
    }

    // --- Timer Logic ---
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.textContent = 'Pause';
        startBtn.classList.add('pause'); 
        timerStatus.textContent = "Focusing...";
        
        // Add visual effects
        if (timerCircle) timerCircle.classList.add('pulsing');
        if (timerTicks) timerTicks.classList.add('running');

        // Check auto-block logic
        if (blockAppsToggle && blockAppsToggle.classList.contains('active')) {
            // Already active, ensure UI reflects it
             if (blockAppsCard) blockAppsCard.classList.add('active');
        }

        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerUI();
            } else {
                clearInterval(timerInterval);
                timerFinished();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.textContent = 'Resume';
        startBtn.classList.remove('pause');
        timerStatus.textContent = "Paused";
        
        // Remove visual effects
        if (timerCircle) timerCircle.classList.remove('pulsing');
        if (timerTicks) timerTicks.classList.remove('running');
    }

    function resetTimer() {
        pauseTimer();
        totalSeconds = initialSeconds;
        updateTimerUI();
        startBtn.textContent = 'Start';
        timerStatus.textContent = "Focus Time";
    }

    function timerFinished() {
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('pause');
        timerStatus.textContent = "Time's Up!";
        
        if (timerCircle) timerCircle.classList.remove('pulsing');
        if (timerTicks) timerTicks.classList.remove('running');
        
        // Play notification sound (simulated)
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        alert("Focus Session Completed!");
        
        // Reset after alert
        resetTimer();
    }

    // --- Event Listeners ---

    // Start/Pause Button
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });
    }

    // Reset Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the timer?')) {
                resetTimer();
            }
        });
    }

    // Preset Pills
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const text = pill.textContent.trim();
            let minutes = 25; 
            
            if (text.includes('m')) {
                minutes = parseInt(text.replace('m', ''));
            } else if (text.includes('h')) {
                minutes = parseInt(text.replace('h', '')) * 60;
            }

            pauseTimer(); 
            initialSeconds = minutes * 60;
            totalSeconds = initialSeconds;
            startBtn.textContent = 'Start'; 
            timerStatus.textContent = "Focus Time";
            updateTimerUI();
        });
    });

    // Ambient Sounds
    ambientCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });

    // --- Block Apps Logic (Global Scope Exposure) ---
    
    // Toggle Click Event
    if (blockAppsToggle) {
        blockAppsToggle.parentElement.addEventListener('click', (e) => {
            // Prevent triggering if clicking inside the toggle itself (handled by bubble if needed)
            // Show popup based on current state
            if (blockAppsToggle.classList.contains('active')) {
                openFocusModal('unblock-confirm-popup');
            } else {
                openFocusModal('block-confirm-popup');
            }
        });
    }

    // Expose functions to window for onclick handlers in HTML
    window.openFocusModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('visible');
    }

    window.closeFocusModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('visible');
    }

    window.confirmBlockApps = function() {
        const toggle = document.getElementById('block-apps-toggle');
        const card = document.getElementById('block-apps-card');
        
        if (toggle) toggle.classList.add('active');
        if (card) card.classList.add('active');
        
        closeFocusModal('block-confirm-popup');
    }

    window.confirmUnblockApps = function() {
        const toggle = document.getElementById('block-apps-toggle');
        const card = document.getElementById('block-apps-card');
        
        if (toggle) toggle.classList.remove('active');
        if (card) card.classList.remove('active');
        
        closeFocusModal('unblock-confirm-popup');
    }

    // Initialize UI
    updateTimerUI();
});
