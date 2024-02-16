document.getElementById('add-task-button').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskDescriptionInput = document.getElementById('task-description-input');
    const taskTitle = taskInput.value;
    const taskDescription = taskDescriptionInput.value;
    taskInput.value = '';
    taskDescriptionInput.value = '';

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            is_done: 0,
            due_date: '2022-12-31',
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        addTaskToDOM(data.insertId, taskTitle, taskDescription);
        console.log('Task added successfully to the database');
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function editTask(id) {
    const taskTitle = prompt('Enter new task title');
    const taskDescription = prompt('Enter new task description');
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const taskElement = document.getElementById(`task-${id}`);
        taskElement.querySelector('h2').textContent = taskTitle;
        taskElement.querySelector('p').textContent = taskDescription;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        const taskElement = document.getElementById(`task-${id}`);
        taskElement.remove();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addTaskToDOM(id, title, description) {
    const tasksContainer = document.getElementById('tasks-container');
    const taskElement = document.createElement('div');
    taskElement.id = `task-${id}`;
    taskElement.classList.add('task-item');
    taskElement.classList.add('task-details');
    taskElement.innerHTML = `
      
    <div class="task-actions">
    <input type="radio" id="task-done-${id}" name="task-done-${id}" onclick="toggleTaskDone(${id})">
    <label for="task-done-${id}">Todo Done</label>
    <button onclick="editTask(${id})" class="edit-task-button">✏️</button>
    <button onclick="deleteTask(${id})" class="delete-task-button">❌</button>
</div>

<div class="task-details">
    <h2>${title}</h2>
    <p>${description}</p>
</div>
`;

tasksContainer.appendChild(taskElement);
}
window.onload = function() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTaskToDOM(task.id, task.title, task.description);
            });
        });
}

function toggleTaskDone(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            is_done: 1,
        }),
    })
    .then(response => response.json())
    .then(data => {
        deleteTask(id);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}