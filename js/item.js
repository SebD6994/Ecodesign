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

    // Fonction pour mettre à jour les tags d'un todo
    async function updateTodoTags(id, tags) {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Tags: tags
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTodo = await response.json();
            console.log('Tags updated:', updatedTodo);
            return updatedTodo;
        } catch (error) {
            console.error('Failed to update tags:', error);
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

    // Fonction pour afficher un formulaire pour éditer les tags
    function showEditTagsForm(todo) {
        // Vérifier si le formulaire est déjà présent
        if (document.getElementById('editTagsForm')) {
            return; // Ne rien faire si le formulaire est déjà présent
        }

        const formHtml = `
            <div id="editTagsForm" style="margin-top: 20px; text-align: center;">
                <h3>Modifier les tags</h3>
                <ul id="tagsList" style="list-style: none; padding: 0; margin-bottom: 10px;">
                    ${todo.Tags.map(tag => `<li>${tag} <button class="removeTagBtn btn-sm" style="margin-left: 5px;">-</button></li>`).join('')}
                </ul>
                <input type="text" id="newTagInput" placeholder="Ajouter un tag" style="display: block; margin: 0 auto 10px auto;" />
                <div id="formButtons" style="display: flex; justify-content: center; gap: 10px;">
                    <button id="addTagBtn" class="btn btn-primary">Ajouter</button>
                    <button id="saveTagsBtn" class="btn btn-secondary">Enregistrer</button>
                </div>
            </div>
        `;
        const detailsElement = document.getElementById('app');
        detailsElement.insertAdjacentHTML('beforeend', formHtml);

        // Ajouter un gestionnaire d'événements pour le bouton d'ajout de tag
        const addTagBtn = document.getElementById('addTagBtn');
        addTagBtn.addEventListener('click', () => {
            const newTag = document.getElementById('newTagInput').value.trim();
            if (newTag) {
                const tagsList = document.getElementById('tagsList');
                tagsList.insertAdjacentHTML('beforeend', `<li>${newTag} <button class="removeTagBtn btn-sm" style="margin-left: 5px;">-</button></li>`);
                document.getElementById('newTagInput').value = ''; // Clear the input field
            }
        });

        // Ajouter des gestionnaires d'événements pour les boutons de suppression des tags
        document.querySelectorAll('.removeTagBtn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.target.parentElement.remove();
            });
        });

        // Ajouter un gestionnaire d'événements pour le bouton d'enregistrement des tags
        const saveTagsBtn = document.getElementById('saveTagsBtn');
        saveTagsBtn.addEventListener('click', () => {
            const tagsListItems = document.querySelectorAll('#tagsList li');
            const newTags = Array.from(tagsListItems).map(item => item.textContent.replace(' -', '').trim());
            updateTodoTags(todo.id, newTags).then(updatedTodo => {
                if (updatedTodo) {
                    displayTodoDetails(updatedTodo);
                }
            });
        });

        // Ajouter un gestionnaire d'événements pour le bouton de fermeture
        const cancelEditTagsBtn = document.getElementById('cancelEditTagsBtn');
        cancelEditTagsBtn.addEventListener('click', () => {
            document.getElementById('editTagsForm').remove(); // Supprimer le formulaire
        });
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
                <p><strong>Tags:</strong> ${todo.Tags && todo.Tags.length > 0 ? todo.Tags.join(', ') : 'Aucun tag'}</p>
                <p><strong>Complète:</strong> ${todo.is_complete ? 'Oui' : 'Non'}</p>
                <button id="toggleCompleteBtn" class="btn btn-primary">
                    ${todo.is_complete ? 'Ré-ouvrir' : 'Marquer comme complet'}
                </button>
                <button id="editTagsBtn" class="btn" style="background-color: #2c3e50; color: #fff;">Modifier</button>
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

            // Ajouter un gestionnaire d'événements pour le bouton de modification des tags
            const editTagsBtn = document.getElementById('editTagsBtn');
            editTagsBtn.addEventListener('click', () => {
                showEditTagsForm(todo);
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
