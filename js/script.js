document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour obtenir les todos depuis l'API
    async function fetchTodos() {
        try {
            const response = await fetch('http://localhost:3000/todos');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data[0].todolist; // Accédez au tableau de todos
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
            // Crée un élément de liste pour chaque todo
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = todo.text;

            // Crée un bouton pour afficher la page item.html
            const viewButton = document.createElement('button');
            viewButton.className = 'btn btn-primary btn-sm';
            viewButton.textContent = 'Détails';
            viewButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Empêche l'événement click de se propager au li
                window.location.href = `item.html?id=${todo.id}`;
            });

            // Ajoute le bouton à l'élément de liste
            listItem.appendChild(viewButton);
            
            // Ajoute un gestionnaire d'événements de clic à l'élément de liste (optionnel)
            listItem.addEventListener('click', () => {
                window.location.href = `item.html?id=${todo.id}`;
            });

            todoList.appendChild(listItem);
        });
    }

    // Fonction pour ajouter une nouvelle tâche
    async function addTodo(taskTitle) {
        try {
            const todos = await fetchTodos();
            // Trouver le prochain ID unique
            const newId = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;

            // Préparer le nouvel objet de tâche
            const newTodo = {
                id: newId,
                text: taskTitle,
                created_at: new Date().toISOString(),
                Tags: [], // Ajoutez des tags si nécessaire
                is_complete: false // La tâche est incomplète par défaut
            };

            // Envoyer la requête POST à l'API
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Recharger la liste des tâches après l'ajout
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

    // Initialisation de la page
    init();

    // Gestion de la soumission du formulaire
    const taskForm = document.getElementById('new-task-form');
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

        const taskTitle = document.getElementById('task-title').value;
        if (taskTitle.trim() !== '') {
            addTodo(taskTitle); // Ajouter la tâche
            taskForm.reset(); // Réinitialiser le formulaire
        }
    });
});
