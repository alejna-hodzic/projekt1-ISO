

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
        card.remove();
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

    document.getElementById('new-list-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('done-btn').click();
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

            const newList = {id: Date.now(), title: name};
            const newCListard = addTasksListCard(newList);

            const container = document.getElementById('lists-container')
            const addCardBtn = document.querySelector('.add-list-card-btn')

            container.insertBefore(newCListard, addCardBtn);
        }
    }).modal('show');
}