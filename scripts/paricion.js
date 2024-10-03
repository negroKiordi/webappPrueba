document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('paricionForm');
    const fechadepartoInput = document.getElementById('fechadeparto');
    const IDvacaInput = document.getElementById('IDvaca');
    const tipoIDvacaSelect = document.getElementById('tipoIDvaca');
    const CategoriaSelect = document.getElementById('Categoria');
    const ECCSelect = document.getElementById('ECC');
    const IDcriaInput = document.getElementById('IDcria');
    const tipoIDcriaSelect = document.getElementById('tipoIDcria');
    const SexoSelect = document.getElementById('Sexo');
    const PesoInput = document.getElementById('Peso');
    const metodoPesadoSelect = document.getElementById('metodoPesado');
    const tipoPartoSelect = document.getElementById('tipoParto');
    const observacionesSelect = document.getElementById('observaciones');
    const observacionInput = document.getElementById('observacion');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');

    // Mostrar campo observacion si se selecciona 'Otro'
    observacionesSelect.addEventListener('change', function() {
        if (observacionesSelect.value === 'Otro') {
            observacionInput.style.display = 'block';
            document.getElementById('label-observacion').style.display = 'block';
        } else {
            observacionInput.style.display = 'none';
            document.getElementById('label-observacion').style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            table: 'paricion',
            fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            fechadeparto: fechadepartoInput.value,
            IDvaca: IDvacaInput.value,
            tipoIDvaca: tipoIDvacaSelect.value === 'electronica', // true para electrónica, false para manejo
            Categoria: CategoriaSelect.value,
            EstadoCorporal: ECCSelect.value,
            IDcria: IDcriaInput.value,
            tipoIDcria: tipoIDcriaSelect.value === 'electronica', // true para electrónica, false para manejo
            Sexo: SexoSelect.value,
            Peso: PesoInput.value,
            metodoPesado: metodoPesadoSelect.value === 'Balanza', // true para balanza, false para cinta
            tipoParto: tipoPartoSelect.value,
            observaciones: observacionesSelect.value === 'Otro' ? observacionInput.value : observacionesSelect.value
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
                fechadepartoInput.focus();
            } else {
                responseDiv.textContent = data.message || 'Ocurrió un error al insertar el registro.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.textContent = 'Ocurrió un error al insertar el registro.';
        });
    });

    // Manejar el botón Limpiar
    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        fechadepartoInput.focus();
    });

    // Función para limpiar el formulario
    function limpiarFormulario() {
        form.reset();
        observacionInput.style.display = 'none';
        document.getElementById('label-observacion').style.display = 'none';
    }
});
               
