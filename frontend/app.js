

function addTasksListCard(taskList) {
    const card = document.createElement('div');
    card.classList.add('ui', 'card');

    card.innerHTML = `
        <div class="content">
            <div class="header">${taskList.title}</div>
        </div>
        <div class="ui divider"></div>

        <div class="content">
            <div class="ui list" id="lista-${taskList.id}"></div>
        </div>

        <div class="extra content">
            <button class="ui red mini button delete-list">Delete list</button>
        </div>
    `;

    card.querySelector('.delete-list').addEventListener('click', () => {
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

    return addCardButton;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('lists-container');
    
    const test = { id: 1, title: "Test" };
    
    const card = addTasksListCard(test);
    //container.appendChild(card);

    const addCardBtn = addListCardButton();
    container.appendChild(addCardBtn);
});
