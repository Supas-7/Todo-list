// Generate input fields
document.querySelector('.js-inputs').innerHTML = `
<div class = "head">
    <input class="tasks js-name-input" placeholder="Task">
    <input type="date" class="js-due-date-input date">
    <input type="time" class="js-time-input time">
    <button class="btn-1 add">ADD</button>
    <button class="btn-clear-done clear">Clear Completed</button>
</div>
`;

// Global array to store tasks
let todoList = [];

// Function to handle task addition
function todo() {
    const addButton = document.querySelector('.btn-1');

    addButton.addEventListener('click', function () {
        const inputElement = document.querySelector('.js-name-input');
        const name = inputElement.value;

        const dateInputElement = document.querySelector('.js-due-date-input');
        const dueDate = dateInputElement.value;

        const timeInputElement = document.querySelector('.js-time-input');
        const dueTime = timeInputElement.value;

        // Validate inputs before adding
        if (name && dueDate && dueTime) {
            let task = { name, dueDate, dueTime, completed: false };
            todoList.push(task);

            // Save to localStorage
            localStorage.setItem('todoList', JSON.stringify(todoList));

            // Clear input fields
            inputElement.value = '';
            dateInputElement.value = '';
            timeInputElement.value = '';

            // Render updated task list
            renderTodoList();
        } else {
            alert('Please fill in all fields');
        }
    });

    // Clear completed tasks
    document.querySelector('.btn-clear-done').addEventListener('click', function () {
        todoList = todoList.filter(task => !task.completed); // Remove completed tasks
        localStorage.setItem('todoList', JSON.stringify(todoList)); // Save updated list
        renderTodoList();
    });
}

// Function to render the To-Do list
function renderTodoList() {
    // Sort by dueDate and dueTime
    todoList.sort((a, b) => {
        const dateTimeA = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
        const dateTimeB = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
        return dateTimeA - dateTimeB;
    });

    let todoListHTML = '';

    todoList.forEach((todoObject, index) => {
        const { name, dueDate, dueTime, completed } = todoObject;
        const checked = completed ? 'checked' : '';

        const html = `
        <div class="task-item">
            <input type="radio" class="task-done" data-index="${index}" ${checked}>
            <span class="${completed ? 'completed' : ''}">${name} - ${dueDate} ${dueTime}</span>
            
            <button class="edit-todo-button js-edit-button edit" data-index="${index}">Edit</button>
            <button class="delete-todo-button js-delete-button" data-index="${index}">Delete</button>
            
        </div>
        `;
        todoListHTML += html;
    });

    document.querySelector('.js-list').innerHTML = todoListHTML;

    // Attach delete event listeners
    document.querySelectorAll('.js-delete-button').forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            todoList.splice(index, 1); // Remove task from array
            localStorage.setItem('todoList', JSON.stringify(todoList)); // Save updated list
            renderTodoList();
        });
    });

    // Attach edit event listeners
    document.querySelectorAll('.js-edit-button').forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const task = todoList[index];
            
            const newName = prompt('Edit Task Name:', task.name);
            const newDate = prompt('Edit Due Date:', task.dueDate);
            const newTime = prompt('Edit Due Time:', task.dueTime);

            if (newName && newDate && newTime) {
                todoList[index] = { ...task, name: newName, dueDate: newDate, dueTime: newTime };
                localStorage.setItem('todoList', JSON.stringify(todoList));
                renderTodoList();
            }
        });
    });

    // Attach event listeners to mark tasks as completed
    document.querySelectorAll('.task-done').forEach((radio) => {
        radio.addEventListener('change', function () {
            const index = this.getAttribute('data-index');
            todoList[index].completed = this.checked; // Toggle completed state
            localStorage.setItem('todoList', JSON.stringify(todoList)); // Save updated list
            renderTodoList();
        });
    });
}

// Load the list from localStorage when the page loads
function loadTodoList() {
    const savedList = localStorage.getItem('todoList');
    if (savedList) {
        todoList = JSON.parse(savedList); // Parse the saved list into the todoList array
        renderTodoList();
    }
}

// Initialize
todo();
loadTodoList();
