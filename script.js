let countdownInterval;
const POPUP_DURATION = 5;

function requestJoin(friendName) {
    const popup = document.getElementById('join-popup');
    const friendNameSpan = document.getElementById('popup-friend-name');
    const countdownSpan = document.getElementById('countdown');
    
    // Set friend name
    friendNameSpan.textContent = friendName;
    
    // Reset and start countdown
    let timeLeft = POPUP_DURATION;
    countdownSpan.textContent = timeLeft;
    
    popup.classList.remove('hidden');
    
    // Clear any existing interval
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownSpan.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // Redirect to video call page
            // Check if we are in a subdirectory (like Buddies/) or root
            const currentPath = window.location.pathname;
            if (currentPath.includes('Buddies') || currentPath.includes('buddies')) {
                window.location.href = 'video-call.html';
            } else {
                window.location.href = 'Buddies/video-call.html';
            }
        }
    }, 1000);
}

function cancelJoin() {
    const popup = document.getElementById('join-popup');
    popup.classList.add('hidden');
    if (countdownInterval) clearInterval(countdownInterval);
}

// Close popup if clicking outside content
document.getElementById('join-popup').addEventListener('click', (e) => {
    if (e.target.id === 'join-popup') {
        cancelJoin();
    }
});

// Block Apps Popup Logic
function showBlockAppsPopup() {
    const blockAppsCard = document.getElementById('block-apps-card');
    
    if (blockAppsCard && blockAppsCard.classList.contains('active')) {
        // If already active, show unblock confirmation
        const unblockPopup = document.getElementById('unblock-apps-popup');
        if (unblockPopup) unblockPopup.classList.remove('hidden');
    } else {
        // If not active, show block confirmation
        const popup = document.getElementById('block-apps-popup');
        if (popup) popup.classList.remove('hidden');
    }
}

function closeBlockAppsPopup() {
    const popup = document.getElementById('block-apps-popup');
    if (popup) popup.classList.add('hidden');
    
    // Change UI to blue (active state)
    const blockAppsCard = document.getElementById('block-apps-card');
    if (blockAppsCard) {
        blockAppsCard.classList.add('active');
    }
}

function closeUnblockAppsPopup() {
    const popup = document.getElementById('unblock-apps-popup');
    if (popup) popup.classList.add('hidden');
}

function confirmUnblockApps() {
    const popup = document.getElementById('unblock-apps-popup');
    if (popup) popup.classList.add('hidden');
    
    // Revert UI to original state
    const blockAppsCard = document.getElementById('block-apps-card');
    if (blockAppsCard) {
        blockAppsCard.classList.remove('active');
    }
}

// Close block apps popup if clicking outside content
const blockAppsPopup = document.getElementById('block-apps-popup');
if (blockAppsPopup) {
    blockAppsPopup.addEventListener('click', (e) => {
        if (e.target.id === 'block-apps-popup') {
            closeBlockAppsPopup();
        }
    });
}

// Close unblock apps popup if clicking outside content
const unblockAppsPopup = document.getElementById('unblock-apps-popup');
if (unblockAppsPopup) {
    unblockAppsPopup.addEventListener('click', (e) => {
        if (e.target.id === 'unblock-apps-popup') {
            closeUnblockAppsPopup();
        }
    });
}