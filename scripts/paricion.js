document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('paricionForm');
    const fechaPartoInput = document.getElementById('fechadeparto');
    const IDvacaInput = document.getElementById('IDvaca');
    const tipoIDvacaInput = document.getElementById('tipoIDvaca');
    const categoriaInput = document.getElementById('categoria');
    const estadoCorporalInput = document.getElementById('estadoCorporal');
    const IDcriaInput = document.getElementById('IDcria');
    const tipoIDcriaInput = document.getElementById('tipoIDcria');
    const sexoInput = document.getElementById('sexo');
    const pesoInput = document.getElementById('peso');
    const metodoPesadoInput = document.getElementById('metodoPesado');
    const tipoPartoInput = document.getElementById('tipoParto');
    const observacionesInput = document.getElementById('observaciones');
    const observacionInput = document.getElementById('observacion');
    const observacionLabel = document.getElementById('observacionLabel');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');

    // Preseleccionar la fecha actual
    fechaPartoInput.value = new Date().toISOString().split('T')[0];

    // Mostrar campo "observación" si se selecciona "otro" en observaciones
    observacionesInput.addEventListener('change', function() {
        if (observacionesInput.value === 'otro') {
            observacionInput.style.display = 'block';
            observacionLabel.style.display = 'block';
        } else {
            observacionInput.style.display = 'none';
            observacionLabel.style.display = 'none';
            observacionInput.value = '';
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            table: 'paricion',
            fechadeparto: fechaPartoInput.value,
            IDvaca: IDvacaInput.value,
            tipoIDvaca: tipoIDvacaInput.value === 'electronica',
            categoria: categoriaInput.value,
            estadoCorporal: estadoCorporalInput.value,
            IDcria: IDcriaInput.value,
            tipoIDcria: tipoIDcriaInput.value === 'electronica',
            sexo: sexoInput.value,
            peso: parseFloat(pesoInput.value),
            metodoPesado: metodoPesadoInput.value === 'balanza',
            tipoParto: tipoPartoInput.value,
            observaciones: observacionesInput.value === 'otro' ? observacionInput.value : observacionesInput.value
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
                IDvacaInput.focus();
            } else {
                responseDiv.textContent = data.message || 'Ocurrió un error al insertar el registro.';
            }
        })
        .catch(error
