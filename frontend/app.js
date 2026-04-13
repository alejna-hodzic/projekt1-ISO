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
                    card.remove();
                }
            }).modal('show');
        } else {
            card.remove();
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
        }
    });

    document.getElementById('new-list-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('done-btn').click();
        }
    });

    document.getElementById('task-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('done-task-btn').click();
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
            }
        });

        container.appendChild(item);
    });
}