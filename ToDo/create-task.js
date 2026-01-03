document.addEventListener('DOMContentLoaded', function() {
    const createBtn = document.querySelector('.create-btn');
    const modal = document.getElementById('successModal');
    const okBtn = document.querySelector('.modal-ok-btn');

    if (createBtn) {
        createBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission if inside a form
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    if (okBtn) {
        okBtn.addEventListener('click', function() {
            window.location.href = 'todo.html';
        });
    }

    // Close modal if clicking outside content
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
