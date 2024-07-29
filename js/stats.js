document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/todos';

    // Fonction pour récupérer les todos depuis l'API
    async function fetchTodos() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const todos = await response.json();
            updateStats(todos[0].todolist);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Fonction pour compter tous les todos
    function countTodos(todos) {
        let total = 0;
        let completed = 0;

        for (const todo of todos) {
            total++;
            if (todo.is_complete) {
                completed++;
            }
        }

        return { total, completed };
    }

    // Fonction pour mettre à jour les statistiques
    function updateStats(todos) {
        const { total, completed } = countTodos(todos);
        const pending = total - completed;

        document.getElementById('total-todos').innerHTML = `<strong>Total de to dos:</strong> ${total}`;
        document.getElementById('completed-todos').innerHTML = `<strong>To dos terminés:</strong> ${completed}`;
        document.getElementById('pending-todos').innerHTML = `<strong>To dos à faire:</strong> ${pending}`;
    }

    // Appel de la fonction fetchTodos lors du chargement de la page
    fetchTodos();
});
