document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour obtenir les todos depuis l'API
    async function fetchTodos() {
        try {
            const response = await fetch('https://api-todos.glitch.me/todos');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data[0].todolist; // Accédez au tableau de todos depuis la réponse API
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            return [];
        }
    }

    // Fonction pour afficher les todos dans la liste
    function displayTodos(todos) {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ''; // Efface la liste existante

        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = todo.text;

            const viewButton = document.createElement('button');
            viewButton.className = 'btn btn-primary btn-sm';
            viewButton.textContent = 'Détails';
            viewButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Empêche l'événement click de se propager
                window.location.href = `item.html?id=${todo.id}`;
            });

            listItem.appendChild(viewButton);

            todoList.appendChild(listItem);
        });
    }

    // Fonction pour ajouter une nouvelle tâche
    async function addTodo(taskTitle, tags) {
        try {
            const todos = await fetchTodos();
            const newId = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;

            const newTodo = {
                id: newId,
                text: taskTitle,
                created_at: new Date().toISOString(),
                Tags: tags,
                is_complete: false
            };

            const response = await fetch('https://api-todos.glitch.me/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedTodos = await fetchTodos();
            displayTodos(updatedTodos);

        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    }

    // Fonction principale pour récupérer et afficher les todos
    async function init() {
        const todos = await fetchTodos();
        displayTodos(todos);
    }

    // Ajouter un nouveau champ de tag
    document.getElementById('add-tag-button').addEventListener('click', () => {
        const newTagInput = document.createElement('input');
        newTagInput.setAttribute('type', 'text');
        newTagInput.setAttribute('name', 'tags[]');
        newTagInput.classList.add('form-control', 'mb-2');
        document.getElementById('tags-inputs').appendChild(newTagInput);
    });

    // Gestion de la soumission du formulaire
    const taskForm = document.getElementById('new-task-form');
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

        const taskTitle = document.getElementById('task-title').value.trim();
        const tagElements = document.querySelectorAll('input[name="tags[]"]');
        const tags = Array.from(tagElements).map(tag => tag.value.trim()).filter(tag => tag !== '');

        if (taskTitle !== '') {
            addTodo(taskTitle, tags); // Ajouter la tâche avec les tags
            taskForm.reset(); // Réinitialiser le formulaire

            // Réinitialiser les champs de tags après l'ajout de la tâche
            const tagInputs = document.querySelectorAll('input[name="tags[]"]');
            tagInputs.forEach(tagInput => tagInput.remove()); // Enlever tous les champs de tags dynamiques
        }
    });

    // Initialisation de la page
    init();
});