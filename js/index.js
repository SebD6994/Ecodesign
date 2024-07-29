// index.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut
        
        const prenomInput = document.getElementById('prenom');
        const prenom = prenomInput.value.trim();
        
        if (prenom === '') {
            alert('Veuillez entrer votre prénom.');
            return;
        }

        // Stocker le prénom dans le localStorage
        localStorage.setItem('prenom', prenom);

        window.location.href = 'tasks.html';
    });
});
