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
            // Redirect to video call page with title param
            const param = '?title=' + encodeURIComponent(friendNameSpan.textContent);
            
            // Check if we are in a subdirectory (like Buddies/) or root
            const currentPath = window.location.pathname;
            if (currentPath.includes('Buddies') || currentPath.includes('buddies')) {
                window.location.href = 'video-call.html' + param;
            } else {
                window.location.href = 'Buddies/video-call.html' + param;
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
const joinPopup = document.getElementById('join-popup');
if (joinPopup) {
    joinPopup.addEventListener('click', (e) => {
        if (e.target.id === 'join-popup') {
            cancelJoin();
        }
    });
}

// Group Join Buttons Logic
document.addEventListener('DOMContentLoaded', () => {
    const groupJoinBtns = document.querySelectorAll('.join-group-btn');
    groupJoinBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find group title
            const card = e.target.closest('.group-card');
            const title = card.querySelector('.group-title').textContent;
            requestJoin(title); // Reuse requestJoin logic for groups
        });
    });
});


// Mini Player Logic (Shared)
document.addEventListener('DOMContentLoaded', () => {
    checkActiveCall();
});

function checkActiveCall() {
    const miniPlayer = document.getElementById('mini-player');
    if (!miniPlayer) return;

    const data = sessionStorage.getItem('activeVideoCall');
    if (data) {
        try {
            const session = JSON.parse(data);
            if (session && session.active) {
                // Show player
                miniPlayer.classList.remove('hidden');
                
                // Set info
                const titleEl = document.getElementById('mini-player-title');
                const timerEl = document.getElementById('mini-player-timer');
                
                if (titleEl) titleEl.textContent = session.title;
                if (timerEl) {
                    // Estimate current time based on elapsed
                    // Simple mock for now: just show last time
                    timerEl.textContent = session.lastTime; 
                }

                // Add event listeners
                const content = document.getElementById('mini-player-content');
                if (content) {
                    content.onclick = () => {
                        window.location.href = 'video-call.html?title=' + encodeURIComponent(session.title);
                    };
                }

                const endBtn = document.getElementById('mini-player-end-btn');
                if (endBtn) {
                    endBtn.onclick = (e) => {
                        e.stopPropagation(); // Prevent card click
                        sessionStorage.removeItem('activeVideoCall');
                        miniPlayer.classList.add('hidden');
                    };
                }
            }
        } catch (e) {
            console.error("Error parsing call session", e);
        }
    }
}

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

/* --- Filter Modal Logic --- */
function openFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) modal.classList.add('hidden');
}

// Close filter modal if clicking outside content
const filterModal = document.getElementById('filter-modal');
if (filterModal) {
    filterModal.addEventListener('click', (e) => {
        if (e.target.id === 'filter-modal') {
            closeFilterModal();
        }
    });
}

// Filter Chips Selection
const filterChips = document.querySelectorAll('.filter-chip');
filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
        // If inside the same group, remove active from others
        const siblings = this.parentElement.querySelectorAll('.filter-chip');
        siblings.forEach(sib => sib.classList.remove('active'));
        this.classList.add('active');
    });
});

function resetFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => chip.classList.remove('active'));
    
    // Set first chip in each group to active
    const groups = document.querySelectorAll('.filter-chips');
    groups.forEach(group => {
        const firstChip = group.querySelector('.filter-chip');
        if (firstChip) firstChip.classList.add('active');
    });
}

function applyFilters() {
    // In a real app, this would filter data. 
    // For UI demo, we just close the modal.
    closeFilterModal();
}

/* --- Search Logic --- */
const searchInput = document.getElementById('main-search-input');
const searchModal = document.getElementById('search-results-modal');
const searchResultsContainer = document.getElementById('search-results-container');

function closeSearchModal() {
    if (searchModal) searchModal.classList.add('hidden');
}

if (searchInput && searchModal && searchResultsContainer) {
    // Define searchable data
    const searchData = [
        { name: 'Start Focus Session', type: 'Action', icon: 'fa-brain', color: 'blue-bg', link: './Focus/focus.html' },
        { name: 'Leader Board', type: 'Action', icon: 'fa-bullseye', color: 'orange-bg', link: './LeaderBoard/leaderboard.html' },
        { name: 'Block Apps', type: 'Action', icon: 'fa-ban', color: 'purple-bg', action: 'showBlockAppsPopup' },
        { name: 'Course', type: 'Action', icon: 'fa-lock', color: 'red-bg', link: './Courses/courses.html' },
        { name: 'Nick Wilde', type: 'Friend', img: 'https://preview.redd.it/the-concept-of-nick-wilde-wearing-a-tank-top-still-keeps-me-v0-uinb7rv514yf1.jpeg?width=640&crop=smart&auto=webp&s=21fa6813f20b54ee7e595c81c6c8506adb5b28ec', link: '#' },
        { name: 'Judy Hopps', type: 'Friend', img: 'https://i.pinimg.com/736x/26/86/53/26865383692da2c33e489a675802d201.jpg', link: '#' },
        { name: 'Flash', type: 'Friend', img: 'https://i.pinimg.com/736x/5a/36/5e/5a365e42d8be25368104e3c9f16e9c9b.jpg', link: '#' },
        { name: 'Gazelle', type: 'Friend', img: 'https://i.pinimg.com/736x/62/14/20/621420c5c07e1bc367756f8da9b5ead2.jpg', link: '#' },
        { name: 'Chief Bogo', type: 'Friend', img: 'https://i.pinimg.com/736x/c2/30/10/c230105794175a21ecab7a3590e8aed8.jpg', link: '#' }
    ];

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length === 0) {
                return;
            }

            const results = searchData.filter(item => item.name.toLowerCase().includes(searchTerm));

            // Render Results
            searchResultsContainer.innerHTML = '';
            
            if (results.length > 0) {
                results.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    
                    // Text only as requested
                    div.innerHTML = `
                        <div class="result-info">
                            <div class="result-name">${item.name}</div>
                            <div class="result-type">${item.type}</div>
                        </div>
                    `;

                    // Click Event
                    div.addEventListener('click', () => {
                        // UI Demo only - just close modal
                        closeSearchModal();
                        searchInput.value = ''; 
                    });

                    searchResultsContainer.appendChild(div);
                });
            } else {
                searchResultsContainer.innerHTML = '<div class="no-result-item">No results found</div>';
            }
            
            // Show Modal
            searchModal.classList.remove('hidden');
        }
    });

    // Close modal if clicking outside content
    searchModal.addEventListener('click', (e) => {
        if (e.target.id === 'search-results-modal') {
            closeSearchModal();
        }
    });
}