document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('parentescoForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            table: 'vinculoMadreTernero',
            madre: document.getElementById('madre').value,
            ternero: document.getElementById('ternero').value,
            fecha: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
        };

        fetch('../almacenar/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            responseDiv.textContent = data.message || 'Registro insertado con éxito';
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.textContent = 'Ocurrió un error al insertar el registro.';
        });
    });

    form.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
});
