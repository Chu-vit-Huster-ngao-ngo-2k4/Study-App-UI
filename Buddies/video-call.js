document.addEventListener('DOMContentLoaded', function() {
    // Microphone Toggle
    const btnMic = document.getElementById('btn-mic');
    if (btnMic) {
        btnMic.addEventListener('click', function() {
            this.classList.toggle('off');
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
    
    if (btnCam) {
        btnCam.addEventListener('click', function() {
            this.classList.toggle('off');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('off')) {
                // Camera Off
                icon.classList.remove('fa-video');
                icon.classList.add('fa-video-slash');
                if (localPlaceholder) localPlaceholder.classList.add('active');
            } else {
                // Camera On
                icon.classList.remove('fa-video-slash');
                icon.classList.add('fa-video');
                if (localPlaceholder) localPlaceholder.classList.remove('active');
            }
        });
    }

    // Reaction Toggle
    const btnReaction = document.getElementById('btn-reaction');
    if (btnReaction) {
        btnReaction.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Chat Toggle
    const btnChat = document.getElementById('btn-chat');
    if (btnChat) {
        btnChat.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Stats Toggle
    const btnStats = document.getElementById('btn-stats');
    if (btnStats) {
        btnStats.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
});
