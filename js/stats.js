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

        // Fonction pour mettre à jour les statistiques et le graphique
        function updateStats(todos) {
            const { total, completed } = countTodos(todos);
            const pending = total - completed;

            document.getElementById('total-todos').innerHTML = `<strong>Total de tâches:</strong> ${total}`;
            document.getElementById('completed-todos').innerHTML = `<strong>Tâches terminées:</strong> ${completed}`;
            document.getElementById('pending-todos').innerHTML = `<strong>Tâches à faire:</strong> ${pending}`;

            // Mettre à jour le graphique en camembert
            updateChart(completed, pending);
        }

        // Fonction pour créer ou mettre à jour le graphique
        let tasksChart;
        function updateChart(completed, pending) {
            const ctx = document.getElementById('tasksChart').getContext('2d');

            if (tasksChart) {
                tasksChart.data.datasets[0].data = [completed, pending];
                tasksChart.update();
            } else {
                tasksChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Tâches Terminées', 'Tâches à Faire'],
                        datasets: [{
                            label: 'Statistiques des Tâches',
                            data: [completed, pending],
                            backgroundColor: ['#1abc9c', '#e27423'],
                            borderColor: ['#fff', '#fff'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return tooltipItem.label + ': ' + tooltipItem.raw;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // Appel de la fonction fetchTodos lors du chargement de la page
        fetchTodos();
    });
