document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mapeoCaravanasForm');
    const electronicaInput = document.getElementById('electronica');
    const visualInput = document.getElementById('visual');
    const senasaInput = document.getElementById('senasa');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');

    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores de los campos
        const electronicaValue = electronicaInput.value.trim();
        const visualValue = visualInput.value.trim();
        const senasaValue = senasaInput.value.trim();

        // Validar que al menos dos campos contengan información
        const filledFields = [electronicaValue, visualValue, senasaValue].filter(value => value !== '');

        if (filledFields.length < 2) {
            responseDiv.textContent = 'Debe completar al menos dos campos antes de guardar.';
            return;
        }

        const formData = {
            table: 'mapeoCaravanas',
            electronica: electronicaValue,
            visual: visualValue,
            senasa: senasaValue,
            fecha: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
        };

        // Enviar los datos al servidor
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
                limpiarFormulario(); // Limpiar el formulario después de enviar
                electronicaInput.focus();
            } else {
                responseDiv.textContent = data.message || 'Ocurrió un error al insertar el registro.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.textContent = 'Ocurrió un error al insertar el registro.';
        });
    });

    // Manejar el enter para navegar entre campos
    electronicaInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            visualInput.focus();
        }
    });

    visualInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            senasaInput.focus();
        }
    });

    // No hacer nada en SENASA al presionar Enter
    senasaInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    // Manejar el botón Limpiar
    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        electronicaInput.focus();
    });

    // Función para limpiar el formulario
    function limpiarFormulario() {
        electronicaInput.value = '';
        visualInput.value = '';
        senasaInput.value = '';
    }
});
