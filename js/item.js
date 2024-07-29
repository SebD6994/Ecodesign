document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour obtenir le paramètre d'ID de l'URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Fonction pour obtenir les détails d'un todo depuis l'API
    async function fetchTodoById(id) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch todo:', error);
            return null;
        }
    }

    // Fonction pour mettre à jour un todo
    async function updateTodoStatus(id, isComplete) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_complete: isComplete
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTodo = await response.json();
            console.log(`Todo ${isComplete ? 'marked as complete' : 'reopened'}:`, updatedTodo);
            return updatedTodo;
        } catch (error) {
            console.error('Failed to update todo:', error);
            return null;
        }
    }

    // Fonction pour supprimer un todo
    async function deleteTodoById(id) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Todo deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete todo:', error);
            return false;
        }
    }

    // Fonction pour afficher les détails du todo
    function displayTodoDetails(todo) {
        const titleElement = document.querySelector('.masthead-heading');
        const detailsElement = document.getElementById('app');
        
        if (todo) {
            // Afficher le titre dans l'élément <h1>
            titleElement.textContent = todo.text;
            
            // Afficher les détails dans l'élément <div id="app">
            detailsElement.innerHTML = `
            <p><strong>Date de création:</strong> ${new Date(todo.created_at).toLocaleDateString()}</p>
            <p><strong>Tags:</strong> ${todo.Tags.join(', ')}</p>
            <p><strong>Complète:</strong> ${todo.is_complete ? 'Oui' : 'Non'}</p>
            <button id="toggleCompleteBtn" class="btn btn-primary">
                ${todo.is_complete ? 'Ré-ouvrir' : 'Marquer comme complet'}
            </button>
            <button id="deleteTodoBtn" class="btn btn-danger">Supprimer</button>
            `;
            
            // Ajouter un gestionnaire d'événements pour le bouton de mise à jour
            const toggleCompleteBtn = document.getElementById('toggleCompleteBtn');
            toggleCompleteBtn.addEventListener('click', () => {
                const newStatus = !todo.is_complete;
                updateTodoStatus(todo.id, newStatus).then(updatedTodo => {
                    if (updatedTodo) {
                        displayTodoDetails(updatedTodo);
                    }
                });
            });
            
            // Ajouter un gestionnaire d'événements pour le bouton de suppression
            const deleteTodoBtn = document.getElementById('deleteTodoBtn');
            deleteTodoBtn.addEventListener('click', () => {
                const confirmDeletion = confirm('Êtes-vous sûr de vouloir supprimer ce todo ?');
                if (confirmDeletion) {
                    deleteTodoById(todo.id).then(success => {
                        if (success) {
                            window.location.href = '/tasks.html';
                        }
                    });
                }
            });
        } else {
            titleElement.textContent = 'Todo not found';
            detailsElement.innerHTML = '<p>Todo not found</p>';
        }
    }

    // Exécuter la logique pour afficher les détails du todo
    const todoId = getQueryParam('id');
    if (todoId) {
        fetchTodoById(todoId).then(todo => {
            displayTodoDetails(todo);
        });
    } else {
        document.querySelector('.masthead-heading').textContent = 'No ID provided in URL';
        document.getElementById('app').innerHTML = '<p>No ID provided in URL</p>';
    }
});
