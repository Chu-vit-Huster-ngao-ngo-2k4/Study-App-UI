document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentDate = new Date(); // Default to today
    let currentCategory = 'All';

    // Elements
    const dateStrip = document.getElementById('dateStrip');
    const monthLabel = document.querySelector('.month-selector span');
    const inProgressList = document.getElementById('inprogress-list');
    const completedList = document.getElementById('completed-list');
    const categoryBtns = document.querySelectorAll('.cat-btn');

    // --- Format Date Helpers ---
    function formatDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // --- Date Strip Logic ---
    function renderDateStrip() {
        if (!dateStrip || !monthLabel) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed
        
        // Update Header
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthLabel.textContent = `${monthNames[month]} ${year}`;

        // Get number of days in this month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        let html = '';
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dayName = days[dateObj.getDay()];
            
            // Check if selected
            const dateKey = formatDateKey(dateObj);
            const selectedKey = formatDateKey(currentDate);
            const isSelected = dateKey === selectedKey ? 'today' : '';
            
            html += `
                <div class="date-item ${isSelected}" data-full-date="${dateKey}" onclick="selectDate('${dateKey}')">
                    <span class="day-name">${dayName}</span>
                    <span class="day-num">${i}</span>
                </div>
            `;
        }
        dateStrip.innerHTML = html;
        scrollToSelectedDate();
    }

    // Initialize Global Function for OnClick
    window.selectDate = function(dateStr) {
        // Fix timezone issue by using parts
        const parts = dateStr.split('-');
        currentDate = new Date(parts[0], parts[1]-1, parts[2]);
        
        renderDateStrip();
        renderTasks();
    }

    function scrollToSelectedDate() {
        const selected = document.querySelector('.date-item.today');
        if (selected) {
            selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    // --- Category Logic ---
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.textContent.trim();
            renderTasks();
        });
    });

    // --- Task Rendering Logic ---
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        const tasks = getTasks();
        const dateKey = formatDateKey(currentDate);

        // Filter by Date
        let filtered = tasks.filter(t => t.date === dateKey);

        // Filter by Category
        if (currentCategory !== 'All') {
            filtered = filtered.filter(t => t.category === currentCategory);
        }

        // Split
        const todo = filtered.filter(t => !t.completed);
        const done = filtered.filter(t => t.completed);

        // Render In Progress
        if (todo.length === 0) {
            inProgressList.innerHTML = '<div class="empty-state" style="text-align:center; padding:20px; color:#aaa;">No tasks for this day.</div>';
        } else {
            inProgressList.innerHTML = todo.map(t => createTaskHTML(t, false)).join('');
        }

        // Render Completed
        if (done.length === 0) {
            completedList.innerHTML = '';
        } else {
            completedList.innerHTML = done.map(t => createTaskHTML(t, true)).join('');
        }
    }

    function createTaskHTML(task, isCompleted) {
        const checkedClass = isCompleted ? 'checked' : '';
        const completedClass = isCompleted ? 'completed' : '';
        const checkIcon = isCompleted ? '<i class="fa-solid fa-check"></i>' : '';

        return `
            <div class="task-card ${completedClass}">
                <div class="task-check" onclick="toggleTask('${task.id}')">
                    <div class="circle-check ${checkedClass}">${checkIcon}</div>
                </div>
                <div class="task-info">
                    <h3>${task.title}</h3>
                    <p>${task.startTime} - ${task.endTime} • ${task.category}</p>
                </div>
                <button class="task-menu" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }

    // --- Task Actions ---
    window.toggleTask = function(id) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            renderTasks();
        }
    }

    // Modal Logic
    let taskIdToDelete = null;
    const deleteModal = document.getElementById('deleteModal');

    window.deleteTask = function(id) {
        taskIdToDelete = id;
        deleteModal.classList.add('visible');
    }

    window.closeDeleteModal = function() {
        deleteModal.classList.remove('visible');
        taskIdToDelete = null;
    }

    window.confirmDelete = function() {
        if (!taskIdToDelete) return;

        let tasks = getTasks();
        tasks = tasks.filter(t => t.id !== taskIdToDelete);
        saveTasks(tasks);
        renderTasks();
        
        closeDeleteModal();
    }

    // --- Init ---
    renderDateStrip();
    renderTasks();
});