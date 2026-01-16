document.addEventListener('DOMContentLoaded', function() {
    // Dynamic Title from URL
    const urlParams = new URLSearchParams(window.location.search);
    const meetingTitle = urlParams.get('title');
    if (meetingTitle) {
        const titleEl = document.querySelector('.meeting-title h2');
        const subtitleEl = document.querySelector('.meeting-title p');
        if (titleEl) titleEl.textContent = meetingTitle;
        if (subtitleEl) subtitleEl.textContent = "Study Session";
    }

    // Meeting Timer
    const timerEl = document.querySelector('.timer');
    if (timerEl) {
        let seconds = 0;
        // Parse initial text if it's not 00:00 (mock start)
        const parts = timerEl.textContent.split(':');
        if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        
        setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    // Microphone Toggle
    const btnMic = document.getElementById('btn-mic');
    if (btnMic) {
        btnMic.addEventListener('click', function() {
            this.classList.toggle('off');
            this.classList.toggle('white');
            this.classList.toggle('red');
            
            const icon = this.querySelector('i');
            if (this.classList.contains('off')) {
                icon.classList.remove('fa-microphone');
                icon.classList.add('fa-microphone-slash');
            } else {
                icon.classList.remove('fa-microphone-slash');
                icon.classList.add('fa-microphone');
            }
        });
    }

    // Camera Toggle
    const btnCam = document.getElementById('btn-cam');
    const localPlaceholder = document.getElementById('local-video-placeholder');
    const localVideoFeed = document.getElementById('local-video-feed');
    
    if (btnCam) {
        btnCam.addEventListener('click', function() {
            this.classList.toggle('off');
            this.classList.toggle('white');
            this.classList.toggle('red');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('off')) {
                // Camera Off
                icon.classList.remove('fa-video');
                icon.classList.add('fa-video-slash');
                if (localPlaceholder) {
                     localPlaceholder.style.display = 'flex';
                     localPlaceholder.classList.add('active');
                }
                if (localVideoFeed) localVideoFeed.style.display = 'none';
            } else {
                // Camera On
                icon.classList.remove('fa-video-slash');
                icon.classList.add('fa-video');
                if (localPlaceholder) {
                    localPlaceholder.style.display = 'none';
                    localPlaceholder.classList.remove('active');
                }
                if (localVideoFeed) localVideoFeed.style.display = 'block';
            }
        });
    }

    // Reaction Toggle
    const btnReaction = document.getElementById('btn-reaction');
    const localCard = document.querySelector('.video-card.local');

    if (btnReaction) {
        btnReaction.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Show floating emoji
            showFloatingEmoji(localCard);
        });
    }

    function showFloatingEmoji(container) {
        if (!container) return;
        
        const emoji = document.createElement('div');
        emoji.textContent = '👍'; // Default reaction
        emoji.style.position = 'absolute';
        emoji.style.bottom = '20px';
        emoji.style.right = '20px';
        emoji.style.fontSize = '30px';
        emoji.style.zIndex = '100';
        emoji.style.animation = 'floatUp 2s ease-out forwards';
        
        container.appendChild(emoji);
        
        // Remove after animation
        setTimeout(() => {
            emoji.remove();
        }, 2000);
    }
    
    // Add keyframes for float up animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            50% { opacity: 1; transform: translateY(-50px) scale(1.2); }
            100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Chat Toggle
    const btnChat = document.getElementById('btn-chat');
    if (btnChat) {
        btnChat.addEventListener('click', function() {
            // Get current meeting title to pass along
            const urlParams = new URLSearchParams(window.location.search);
            const currentTitle = urlParams.get('title') || 'Study Session';
            
            // Build chat URL with source info
            let chatUrl = 'chat.html?name=Group%20Chat&from=call&returnTitle=' + encodeURIComponent(currentTitle);
            window.location.href = chatUrl;
        });
    }
    
    // Stats Button (Mock functionality)
    const btnStats = document.getElementById('btn-stats');
    if (btnStats) {
        btnStats.addEventListener('click', function() {
            alert("Meeting Duration: 05:12\nParticipants: 2\nConnection: Strong");
        });
    }

    // End Call Modal Logic
    const btnEndCall = document.getElementById('btn-end-call');
    const btnHeaderBack = document.getElementById('header-back-btn'); // Top-left back button
    const endCallModal = document.getElementById('end-call-modal');
    const btnCancelEnd = document.getElementById('cancel-end-call');
    const btnConfirmEnd = document.getElementById('confirm-end-call');

    // Show modal on End Call button click
    if (btnEndCall && endCallModal) {
        btnEndCall.addEventListener('click', function() {
            endCallModal.classList.remove('hidden');
        });
    }

    // Header Back Button Logic -> Minimize Call
    if (btnHeaderBack) {
        btnHeaderBack.addEventListener('click', function() {
            // Save state to sessionStorage
            const title = document.querySelector('.meeting-title h2').textContent || 'Study Session';
            const timer = document.querySelector('.timer').textContent || '00:00';
            
            const sessionData = {
                active: true,
                title: title,
                lastTime: timer,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem('activeVideoCall', JSON.stringify(sessionData));
            
            // Redirect to buddies page
            window.location.href = 'buddies.html';
        });
    }

    if (btnCancelEnd && endCallModal) {
        btnCancelEnd.addEventListener('click', function() {
            endCallModal.classList.add('hidden');
        });
    }

    if (btnConfirmEnd) {
        btnConfirmEnd.addEventListener('click', function() {
            // Redirect to buddies page
            window.location.href = 'buddies.html';
        });
    }

    // Close modal if clicking outside
    if (endCallModal) {
        endCallModal.addEventListener('click', function(e) {
            if (e.target === endCallModal) {
                endCallModal.classList.add('hidden');
            }
        });
    }
});
