document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const completedCounter = document.getElementById('completed-counter');
    const emptyState = document.getElementById('empty-state');
    const levelNumber = document.getElementById('level-number');
    const levelProgress = document.getElementById('level-progress');
    const powerLevel = document.getElementById('power-level');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Load tasks from server
    loadTasks();
    
    // Update counters and empty state
    updateCounters();
    updateEmptyState();
    updateLevelAndPower();

    addBtn.addEventListener('click', function() {
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            todoInput.value = '';
        }
    });

    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const taskText = todoInput.value.trim();
            if (taskText !== '') {
                addTask(taskText);
                todoInput.value = '';
            }
        }
    });

    // Filter buttons event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterTasks(filter);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    async function addTask(taskText) {
        try {
            const response = await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText })
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const result = await response.json();
            
            // Add task to the UI
            const li = createTaskElement(result.task);
            todoList.appendChild(li);
            
            // Add animation class
            setTimeout(() => {
                li.classList.add('animated');
            }, 10);

            updateCounters();
            updateEmptyState();
            updateLevelAndPower();
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    }

    async function loadTasks() {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }

            const tasks = await response.json();
            
            // Clear existing tasks
            todoList.innerHTML = '';
            
            tasks.forEach(task => {
                const li = createTaskElement(task);
                todoList.appendChild(li);
                
                // Add animation class with delay
                setTimeout(() => {
                    li.classList.add('animated');
                }, 10);
            });
            
            updateCounters();
            updateEmptyState();
            updateLevelAndPower();
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            updateCounters();
            updateEmptyState();
            updateLevelAndPower();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }

    async function toggleTaskCompletion(taskId, completed) {
        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: completed })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            updateCounters();
            updateLevelAndPower();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-completed', task.completed);

        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = task.text;
        span.addEventListener('click', function() {
            const newCompletedState = !task.completed;
            li.classList.toggle('completed');
            toggleTaskCompletion(task.id, newCompletedState);
            li.setAttribute('data-completed', newCompletedState);
            task.completed = newCompletedState;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', function() {
            // Add a fade-out animation before removing
            li.style.opacity = '0';
            li.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                deleteTask(task.id);
                li.remove();
            }, 300);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;
    }
    
    async function updateCounters() {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }

            const tasks = await response.json();
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            
            tasksCounter.textContent = totalTasks;
            completedCounter.textContent = completedTasks;
        } catch (error) {
            console.error('Error updating counters:', error);
        }
    }
    
    async function updateEmptyState() {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }

            const tasks = await response.json();
            if (tasks.length === 0) {
                emptyState.style.display = 'block';
                todoList.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                todoList.style.display = 'block';
            }
        } catch (error) {
            console.error('Error updating empty state:', error);
        }
    }
    
    async function updateLevelAndPower() {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }

            const tasks = await response.json();
            const completedTasks = tasks.filter(task => task.completed).length;
            
            // Calculate level based on completed tasks
            const level = Math.max(1, Math.floor(completedTasks / 5) + 1);
            levelNumber.textContent = level;
            
            // Calculate progress percentage for level bar
            const nextLevelTasks = level * 5;
            const progressPercent = ((completedTasks % 5) / 5) * 100;
            levelProgress.style.width = `${progressPercent}%`;
            
            // Update power level (E, D, C, B, A, S)
            const powerLevels = ['E', 'D', 'C', 'B', 'A', 'S'];
            const powerIndex = Math.min(powerLevels.length - 1, Math.floor(level / 2));
            powerLevel.textContent = powerLevels[powerIndex];
            
            // Add special effects for higher levels
            if (level >= 5) {
                document.querySelector('.container').classList.add('high-level');
            } else {
                document.querySelector('.container').classList.remove('high-level');
            }
        } catch (error) {
            console.error('Error updating level and power:', error);
        }
    }
    
    function filterTasks(filter) {
        const tasks = document.querySelectorAll('#todo-list li');
        
        tasks.forEach(task => {
            const isCompleted = task.getAttribute('data-completed') === 'true';
            
            switch(filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    task.style.display = !isCompleted ? 'flex' : 'none';
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none';
                    break;
            }
        });
    }

    // === Square Grid Background with Subtle Neighbor Lighting, No Wrapping, and Perfect Fit ===
    const bgGrid = document.getElementById('bg-grid');
    let gridSquares = [];
    let gridRows = 0;
    let gridCols = 0;

    // === Neon hover and fade effect ===
    let lastNeonIndices = [];
    let trailQueue = [];
    const TRAIL_LENGTH = 8;

    function getSquareSize() {
        if (window.innerWidth < 600) return 18;
        if (window.innerWidth < 900) return 32;
        return 56;
    }

    function clearNeonEffects() {
        for (const sq of gridSquares) {
            sq.classList.remove(
                'neon-active',
                'neon-neighbor-left', 'neon-neighbor-right', 'neon-neighbor-up', 'neon-neighbor-down',
                'neon-trail-1', 'neon-trail-2', 'neon-trail-3', 'neon-trail-4', 'neon-trail-5', 'neon-trail-6', 'neon-trail-7', 'neon-trail-8',
                'fade'
            );
        }
    }

    function fadeNeonTrail(idx, trailClass) {
        const sq = gridSquares[idx];
        if (!sq) return;
        sq.classList.remove('neon-active');
        sq.classList.add(trailClass);
        // Force reflow for transition
        void sq.offsetWidth;
        sq.classList.add('fade');
        setTimeout(() => {
            sq.classList.remove(trailClass, 'fade');
        }, 4000); // Increased for smoother fade
    }

    bgGrid.addEventListener('mousemove', (e) => {
        const rect = bgGrid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = getSquareSize();
        const c = Math.floor(x / size);
        const r = Math.floor(y / size);
        if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
            const idx = r * gridCols + c;
            // Only add to queue if new
            if (trailQueue.length === 0 || trailQueue[trailQueue.length - 1] !== idx) {
                trailQueue.push(idx);
                if (trailQueue.length > TRAIL_LENGTH) {
                    // Fade the oldest in the queue
                    const fadeIdx = trailQueue.shift();
                    fadeNeonTrail(fadeIdx, 'neon-trail-8');
                }
            }
            // Remove .neon-active from all except the current
            for (let i = 0; i < gridSquares.length; i++) {
                if (i !== idx && gridSquares[i].classList.contains('neon-active')) {
                    gridSquares[i].classList.remove('neon-active');
                }
            }
            // Remove all .neon-trail-* from all cubes
            for (let i = 0; i < gridSquares.length; i++) {
                gridSquares[i].classList.remove('neon-trail-1', 'neon-trail-2', 'neon-trail-3', 'neon-trail-4', 'neon-trail-5', 'neon-trail-6', 'neon-trail-7', 'neon-trail-8');
            }
            // Assign trail classes
            for (let i = 0; i < trailQueue.length - 1; i++) {
                const tIdx = trailQueue[i];
                const tClass = 'neon-trail-' + Math.min(i + 1, 8);
                if (gridSquares[tIdx] && tIdx !== idx) {
                    gridSquares[tIdx].classList.add(tClass);
                }
            }
            // Only the hovered cube
            const sq = gridSquares[idx];
            if (sq) {
                sq.classList.add('neon-active');
                sq.classList.remove('neon-fade');
            }
            // Neighbors movement + glow
            for (let i = 0; i < gridSquares.length; i++) {
                gridSquares[i].classList.remove('neon-neighbor-left', 'neon-neighbor-right', 'neon-neighbor-up', 'neon-neighbor-down');
            }
            if (c > 0) gridSquares[r * gridCols + (c - 1)].classList.add('neon-neighbor-left');
            if (c < gridCols - 1) gridSquares[r * gridCols + (c + 1)].classList.add('neon-neighbor-right');
            if (r > 0) gridSquares[(r - 1) * gridCols + c].classList.add('neon-neighbor-up');
            if (r < gridRows - 1) gridSquares[(r + 1) * gridCols + c].classList.add('neon-neighbor-down');
            lastNeonIndices = [idx];
        }
    });

    bgGrid.addEventListener('mouseleave', () => {
        // Fade out all remaining cubes in the trail, one by one, using their trail class
        function fadeTrailSequentially(q) {
            if (q.length === 0) return;
            const idx = q.shift();
            const tClass = 'neon-trail-' + Math.min(q.length + 1, 8);
            fadeNeonTrail(idx, tClass);
            setTimeout(() => fadeTrailSequentially(q), 200); // Stagger fade for nice effect
        }
        fadeTrailSequentially([...trailQueue]);
        trailQueue = [];
        lastNeonIndices = [];
        clearNeonEffects();
    });

    function createBgGrid() {
        bgGrid.innerHTML = '';
        gridSquares = [];
        const size = getSquareSize();
        gridCols = Math.ceil(window.innerWidth / size);
        gridRows = Math.ceil(window.innerHeight / size);
        bgGrid.style.setProperty('--bg-cols', gridCols);
        bgGrid.style.setProperty('--bg-rows', gridRows);
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const sq = document.createElement('div');
                sq.className = 'bg-square';
                sq.dataset.row = r;
                sq.dataset.col = c;
                bgGrid.appendChild(sq);
                gridSquares.push(sq);
            }
        }
    }

    createBgGrid();
    window.addEventListener('resize', createBgGrid);
});
