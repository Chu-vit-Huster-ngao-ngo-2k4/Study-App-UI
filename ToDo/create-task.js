document.addEventListener('DOMContentLoaded', function() {
    const createBtn = document.querySelector('.create-btn');
    const modal = document.getElementById('successModal');
    const okBtn = document.querySelector('.modal-ok-btn');

    // Default Date to Today
    const dateInput = document.getElementById('task-date');
    if (dateInput) {
        // Always default to today if user hasn't picked one (or if value is empty)
        // Since we removed the hardcoded value in HTML, this will now run correctly.
        if (!dateInput.value) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    if (createBtn) {
        createBtn.addEventListener('click', function(e) {
            e.preventDefault(); 

            // Gather Data
            const titleInput = document.getElementById('task-title');
            const categoryInput = document.getElementById('task-category');
            const dateInput = document.getElementById('task-date');
            const startTimeInput = document.getElementById('task-start-time');
            const endTimeInput = document.getElementById('task-end-time');

            const title = titleInput ? titleInput.value.trim() : 'Untitled Task';
            const category = categoryInput ? categoryInput.value : 'Daily tasks';
            const date = dateInput ? dateInput.value : '';
            const startTime = startTimeInput ? startTimeInput.value : '09:00';
            const endTime = endTimeInput ? endTimeInput.value : '10:00';

            // Validation
            if (!title) {
                alert("Please enter a Title");
                return;
            }

            // Create Task Object
            const newTask = {
                id: Date.now().toString(),
                title: title,
                category: category,
                date: date, // YYYY-MM-DD
                startTime: startTime,
                endTime: endTime,
                completed: false,
                createdAt: new Date().toISOString()
            };

            // Save to LocalStorage
            saveTask(newTask);

            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
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
                 window.location.href = 'todo.html';
            }
        });
    }
});
