document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tactosForm');
    const idInput = document.getElementById('id');
    const caravanaInput = document.getElementById('caravana');
    const resultadoSelect = document.getElementById('resultado');
    const observacionInput = document.getElementById('observacion');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            table: 'practicaVeterinaria',
            caravanaElectronica: idInput.value,
            caravanaVisual: caravanaInput.value,
            observacion: observacionInput.value,
            practica: 'Tacto',
            resultado: resultadoSelect.value,
            fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            fechaResultado: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
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
                limpiarFormulario();
                idInput.focus();
            } else {
                responseDiv.textContent = data.message || 'Ocurrió un error al insertar el registro.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.textContent = 'Ocurrió un error al insertar el registro.';
        });
    });

    function limpiarFormulario() {
        idInput.value = '';
        caravanaInput.value = '';
        resultadoSelect.value = '';
        observacionInput.value = '';
    }

    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        idInput.focus();
    });

    // Navegar entre campos con Enter
    idInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            caravanaInput.focus();
        }
    });

    caravanaInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            resultadoSelect.focus();
        }
    });

    resultadoSelect.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            observacionInput.focus();
        }
    });
});
