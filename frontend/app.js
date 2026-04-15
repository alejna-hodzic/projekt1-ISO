let userHash = localStorage.getItem('todo_user_hash');

if (!userHash) {
    userHash = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('todo_user_hash', userHash);
}

document.addEventListener('DOMContentLoaded', () => {
    const hashDisplay = document.getElementById('user-hash-show');
    if(hashDisplay) {
        hashDisplay.innerText = "Your session code: " + userHash;

        $('#user-hash-show').popup({
            on: 'hover',
            position: 'bottom center'
        });

        hashDisplay.addEventListener('click', () => {
            navigator.clipboard.writeText(userHash);
            alert('Session code copied!');
        });
    }
});

// console.log("Trenutni User Hash:", userHash);

async function saveList(listId, title) {
    const payload = {
        id: listId,
        title: title
    };

    try {
        const response = await fetch('http://localhost:5555/api/lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Hash': userHash 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Somwthing went wrong on backend.");
        }
    } catch (error) {
        console.error("Backend error occured:", error);
    }
}

async function saveTaskToDB(listId, taskObj) {
    const payload = {
        id: taskObj.id,
        list_id: listId, 
        text: taskObj.text,
        priority: parseInt(taskObj.priority),
        completed: taskObj.completed,
        completed_at: taskObj.completedAt || null 
    };

    try {
        const response = await fetch('http://localhost:5555/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Hash': userHash
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Something went wrong on backend while saving task.");
        }
    } catch (error) {
        console.error("Backend error occured:", error);
    }
}

async function updateTaskStatusInDB(taskObj) {
    const payload = {
        id: taskObj.id,
        completed: taskObj.completed,
        completed_at: taskObj.completedAt || null 
    };

    try {
        const response = await fetch('http://localhost:5555/api/tasks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'User-Hash': userHash
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Something went wrong while updating task status on backend.");
        }
    } catch (error) {
        console.error("Backend error occured:", error);
    }
}

async function loadTasksFromDB() {
    try {
        const response = await fetch('http://localhost:5555/api/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Hash': userHash
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            
            tasks.forEach(task => {
                if (appData[task.list_id]) {
                    const exists = appData[task.list_id].tasks.some(t => t.id === task.id);
                    if (!exists) {
                        appData[task.list_id].tasks.push(task);
                    }
                }
            });

            Object.keys(appData).forEach(listId => renderTasks(listId));
        }
    } catch (error) {
        console.error("Error while loading tasks:", error);
    }
}

async function loadListsFromDB() {
    try {
        const response = await fetch('http://localhost:5555/api/lists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Hash': userHash 
            }
        });

        if (response.ok) {
            const lists = await response.json();

            const container = document.getElementById('lists-container');
            lists.forEach(list => {
                appData[list.id] = { 
                    id: list.id, 
                    title: list.title, 
                    tasks: [] 
                };
                const listCard = addTasksListCard(appData[list.id]);
                const addCardBtn = document.querySelector('.add-list-card-btn');
                if (addCardBtn) {
                    container.insertBefore(listCard, addCardBtn);
                } else {
                    container.appendChild(listCard);
                }
            });

        }
    } catch (error) {
        console.error("Couldn't connect to backend", error);
    }
}

async function deleteTaskListFromDB(listId) {
    try {
        const response = await fetch(`http://localhost:5555/api/lists/${listId}`, {
            method: 'DELETE',
            headers: {
                'User-Hash': userHash
            }
        });

        if (!response.ok) {
            console.error("Something went wrong while deleting task list on backend.");
        }
    } catch (error) {
        console.error("Something went wrong on backend:", error);
    }
}

async function deleteTaskFromDB(taskId) {
    try {
        const response = await fetch(`http://localhost:5555/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'User-Hash': userHash
            }
        });

        if (!response.ok) {
            console.error("Something went wrong on backend while deleting task from database.");
        }
    } catch (error) {
        console.error("Something went wrong on backend:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadListsFromDB();
    await loadTasksFromDB();
});

const appData = {};
let currentListId = null;

function addTasksListCard(taskList) {
    const card = document.createElement('div');
    card.classList.add('ui', 'card');

    card.innerHTML = `
        <div class="content list-header-content">
            <div class="header center aligned task-list-title">${taskList.title}</div>
            <div class="ui divider task-list-divider"></div>
            <div class="add-task-wrapper">
                <button class="ui secondary basic teal button add-task-btn">
                    <i class="plus icon"></i> Add Task
                </button>
            </div>
        </div>

        <div class="content list-items-content">
            <div class="ui list" id="lista-${taskList.id}"></div>
        </div>

        <div class="extra content list-footer">
            <i class="trash alternate outline big icon delete-list-icon" title="Delete list"></i>
        </div>
    `;

    card.querySelector('.delete-list-icon').addEventListener('click', () => {
        const listItemsContainer = card.querySelector('.ui.list');
        const hasTasks = listItemsContainer && listItemsContainer.children.length > 0;

        if (hasTasks) {
            document.getElementById('delete-message').textContent = "This list contains tasks. Are you sure you want to delete it?";
            $('#confirm-delete-modal').modal({
                onApprove: function() {
                    delete appData[taskList.id];
                    card.remove();
                    tFromDB(taskList.id);
                }
            }).modal('show');
        } else {
            delete appData[taskList.id];
            card.remove();
            deleteTaskListFromDB(taskList.id);
        }
    });

    card.querySelector('.add-task-btn').addEventListener('click', () => {
        currentListId = taskList.id;
        document.getElementById('task-input').value = ''; 
        $('#task-priority').dropdown('set selected', '3');
        $('#create-task-modal').modal('show');
    });

    return card;
}

function addListCardButton() {
    const addCardButton = document.createElement('div');
    addCardButton.className = 'add-list-card-btn ui card';

    addCardButton.innerHTML = `
        <div class="content">
            <i class="huge plus icon"></i> <p>Add Task List</p>
        </div>
    `;

    addCardButton.addEventListener('click', handleAddNewList)

    return addCardButton;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('lists-container');
    
    const addCardBtn = addListCardButton();
    container.appendChild(addCardBtn);

    document.getElementById('fab-add-btn').addEventListener('click', handleAddNewList);

    $('.ui.dropdown').dropdown();

    $('#create-task-modal').modal({
        autofocus: true,
        onApprove: function() {
            const taskText = document.getElementById('task-input').value.trim();
            if (!taskText) return false;

            const priority = parseInt(document.getElementById('task-priority').value);
            
            const newTask = {
                id: Date.now(),
                text: taskText,
                priority: priority,
                completed: false,
                completedAt: null
            };

            appData[currentListId].tasks.push(newTask);
            renderTasks(currentListId);
            saveTaskToDB(currentListId, newTask);
        }
    });

});

function handleAddNewList() {
    const inputElement = document.getElementById('new-list-input');
    inputElement.value = '';

    $('#create-task-list-modal').modal({
        autofocus: true,
        onApprove: function() {

            const listName = inputElement.value;
            const name = listName.trim()

            if (name === "") return false;

            const existingListNames = Array.from(document.querySelectorAll('.ui.card .header')).map(header => header.textContent.trim().toLowerCase());

            if (existingListNames.includes(name.toLowerCase())) {
                alert("The list with this name already exists!")
                return false;
            }

            const newList = {id: Date.now(), title: name, tasks: []};
            appData[newList.id] = newList;

            const newCListard = addTasksListCard(newList);

            const container = document.getElementById('lists-container')
            const addCardBtn = document.querySelector('.add-list-card-btn')

            container.insertBefore(newCListard, addCardBtn);
            
            saveList(newList.id, name);
        }
    }).modal('show');
}

function renderTasks(listId) {
    const container = document.getElementById(`lista-${listId}`);
    container.innerHTML = '';

    const tasks = appData[listId].tasks;

    tasks.sort((a, b) => {
        if (a.completed === b.completed) {
            if (!a.completed) {
                return a.priority - b.priority; 
            } else {
                return b.completedAt - a.completedAt; 
            }
        }
        return a.completed ? 1 : -1; 
    });

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `item task-item ${task.completed ? 'completed' : ''}`;

        let priorityHtml = '';
        if (!task.completed) {
            if (task.priority === 1) priorityHtml = '<div class="ui red horizontal label mini">Highest</div>';
            else if (task.priority === 2) priorityHtml = '<div class="ui pink horizontal label mini">High</div>';
            else if (task.priority === 3) priorityHtml = '<div class="ui orange horizontal label mini">Medium</div>';
            else if (task.priority === 4) priorityHtml = '<div class="ui yellow horizontal label mini">Low</div>';
            else if (task.priority === 5) priorityHtml = '<div class="ui green horizontal label mini">Lowest</div>';
        }

        item.innerHTML = `
            <div class="task-left">
                <div class="ui checkbox task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <label class="task-text">${task.text}</label>
                </div>
            </div>
            <div class="task-right">
                ${priorityHtml}
                <i class="times icon delete-task-icon" title="Delete task"></i>
            </div>
        `;

        item.querySelector('.delete-task-icon').addEventListener('click', () => {
            document.getElementById('delete-message').textContent = "Are you sure you want to delete this task?";
            $('#confirm-delete-modal').modal({
                onApprove: function() {
                    deleteTaskFromDB(task.id);
                    appData[listId].tasks = appData[listId].tasks.filter(t => t.id !== task.id);
                    renderTasks(listId); 
                }
            }).modal('show');
        });

        const checkboxElement = item.querySelector('.task-checkbox');
        $(checkboxElement).checkbox({
            onChange: function() {
                task.completed = !task.completed;
                task.completedAt = task.completed ? Date.now() : null;
                renderTasks(listId); 

                updateTaskStatusInDB(task);
            }
        });

        container.appendChild(item);
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        
        const activeModal = document.querySelector('.ui.modal.active');
        
        if (activeModal) {
            event.preventDefault();
            
            const approveBtn = activeModal.querySelector('.approve.button');
            if (approveBtn) {
                approveBtn.click();
            }
        }
    }
});

document.getElementById('reload-tasks-btn').addEventListener('click', () => {
    document.getElementById('session-hash-input').value = '';

    $('#reload-session-modal').modal({
        onApprove: async function() {
            const enteredHash = document.getElementById('session-hash-input').value.trim();
            
            if (enteredHash !== "") {
                localStorage.setItem('todo_user_hash', enteredHash);
                window.location.reload();    
            }
        }
    }).modal('show');
});