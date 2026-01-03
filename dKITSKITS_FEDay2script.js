
// Block Apps Popup Logic
function showBlockAppsPopup() {
    const popup = document.getElementById('block-apps-popup');
    if (popup) popup.classList.remove('hidden');
}

function closeBlockAppsPopup() {
    const popup = document.getElementById('block-apps-popup');
    if (popup) popup.classList.add('hidden');
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
