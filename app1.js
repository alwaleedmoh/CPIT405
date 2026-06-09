// ==============================================
// App 1 — To-Do List
// Uses localStorage so tasks persist across visits
// ==============================================

const STORAGE_KEY = 'alwaleed_todo_tasks_v1';

// DOM references
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const todoFooter = document.getElementById('todoFooter');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');

// In-memory state (mirrors localStorage)
let tasks = loadTasks();

// ----- Storage helpers -----
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to load tasks:', e);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks:', e);
    }
}

// ----- Render -----
function render() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        todoFooter.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    todoFooter.style.display = 'flex';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        // Task text
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.type = 'button';
        delBtn.textContent = '×';
        delBtn.title = 'Delete task';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    const completed = tasks.filter(t => t.done).length;
    counter.textContent = `${completed} of ${tasks.length} completed`;
}

// ----- Actions -----
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        done: false
    });

    taskInput.value = '';
    saveTasks();
    render();
    taskInput.focus();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        saveTasks();
        render();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    render();
}

// ----- Event listeners -----
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearCompleted);

// Initial render
render();
