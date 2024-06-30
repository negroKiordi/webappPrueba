document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('parentescoForm');
    const madreInput = document.getElementById('madre');
    const terneroInput = document.getElementById('ternero');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            table: 'vinculoMadreTernero',
            madre: madreInput.value,
            ternero: terneroInput.value,
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
            if (data.message && data.message.includes("success")) {
                responseDiv.textContent = 'Registro insertado con éxito';
                madreInput.value = '';
                terneroInput.value = '';
                madreInput.focus();
            } else {
                responseDiv.textContent = data.message || 'Ocurrió un error al insertar el registro.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.textContent = 'Ocurrió un error al insertar el registro.';
        });
    });

    madreInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            terneroInput.focus();
        }
    });

    terneroInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    limpiarBtn.addEventListener('click', function() {
        madreInput.value = '';
        terneroInput.value = '';
        madreInput.focus();
    });
});
