document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('razaColorForm');
    const idInput = document.getElementById('id');
    const caravanaInput = document.getElementById('caravana');
    const angusCheckbox = document.getElementById('angusCheckbox');
    const pampaCheckbox = document.getElementById('pampaCheckbox');
    const negroCheckbox = document.getElementById('negroCheckbox');
    const coloradoCheckbox = document.getElementById('coloradoCheckbox');
    const responseDiv = document.getElementById('response');
    const syncStatus = document.getElementById('syncStatus');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const registrosTabla = document.getElementById('registrosTabla').querySelector('tbody');
    const guardarTablaBtn = document.getElementById('guardarTablaBtn');
    const borrarTablaBtn = document.getElementById('borrarTablaBtn');

    // Estructuras para almacenar los datos
    let registrosTotales = JSON.parse(localStorage.getItem('registrosTotales')) || [];
    let registrosNoSincronizados = JSON.parse(localStorage.getItem('registrosNoSincronizados')) || [];

    // Cargar tabla desde el localStorage al inicio
    cargarTabla();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validar que se haya seleccionado una opción de raza y color
        if (!angusCheckbox.checked && !pampaCheckbox.checked) {
            responseDiv.textContent = 'Debe seleccionar una raza.';
            return;
        }
        if (!negroCheckbox.checked && !coloradoCheckbox.checked) {
            responseDiv.textContent = 'Debe seleccionar un color.';
            return;
        }
        if (!idInput.value && !caravanaInput.value) {
            responseDiv.textContent = 'Debe completar al menos uno de los campos: ID o Caravana.';
            return;
        }

        const formData = {
            id: idInput.value,
            caravana: caravanaInput.value,
            raza: angusCheckbox.checked ? 'Angus' : 'Pampa',
            color: negroCheckbox.checked ? 'Negro' : 'Colorado',
            fecha: new Date().toISOString().split('T')[0]
        };

        // Agregar a la estructura de registros totales y a la de no sincronizados
        registrosTotales.push(formData);
        registrosNoSincronizados.push(formData);

        // Guardar en localStorage ambas estructuras
        localStorage.setItem('registrosTotales', JSON.stringify(registrosTotales));
        localStorage.setItem('registrosNoSincronizados', JSON.stringify(registrosNoSincronizados));
        enviarDatosNoSincronizados();

        // Agregar a la tabla
        agregarRegistroTabla(formData);

        // Limpiar formulario
        limpiarFormulario();
        idInput.focus();

        actualizarEstadoSincronizacion();
    });

    function limpiarFormulario() {
        idInput.value = '';
        caravanaInput.value = '';
        angusCheckbox.checked = false;
        pampaCheckbox.checked = false;
        negroCheckbox.checked = false;
        coloradoCheckbox.checked = false;
    }

    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        idInput.focus();
    });

    // Agregar registro a la tabla
    function agregarRegistroTabla(formData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formData.id}</td>
            <td>${formData.caravana}</td>
            <td>${formData.raza}</td>
            <td>${formData.color}</td>
        `;
        registrosTabla.insertBefore(row, registrosTabla.firstChild); // Empuja hacia abajo los registros
    }

    // Cargar registros desde localStorage
    function cargarTabla() {
        registrosTotales.forEach(registro => {
            agregarRegistroTabla(registro);
        });
        actualizarEstadoSincronizacion();
    }

    // Actualizar estado de sincronización
    function actualizarEstadoSincronizacion() {
        const sincronizados = registrosNoSincronizados.length === 0;
        syncStatus.textContent = sincronizados ? 'SINCRONIZADO' : 'NO sincronizado';
    }

    // Guardar la tabla como CSV
    guardarTablaBtn.addEventListener('click', function() {
        const registros = [];
        registrosTotales.forEach(registro => {
            registros.push([
                registro.id,
                registro.caravana,
                registro.raza,
                registro.color
            ]);
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Caravana,Raza,Color", ...registros.map(e => e.join(','))].join("\n");

        const ahora = new Date();
        const nombreArchivo = `razaColor${ahora.getFullYear()}-${(ahora.getMonth()+1).toString().padStart(2, '0')}-${ahora.getDate().toString().padStart(2, '0')}_${ahora.getHours().toString().padStart(2, '0')}-${ahora.getMinutes().toString().padStart(2, '0')}-${ahora.getSeconds().toString().padStart(2, '0')}.csv`;

        const enlace = document.createElement('a');
        enlace.setAttribute('href', encodeURI(csvContent));
        enlace.setAttribute('download', nombreArchivo);
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    });

    // Borrar la tabla y limpiar el localStorage
    borrarTablaBtn.addEventListener('click', function() {
        registrosTabla.innerHTML = '';
        registrosTotales = [];
        registrosNoSincronizados = [];
        localStorage.removeItem('registrosTotales');
        localStorage.removeItem('registrosNoSincronizados');
        actualizarEstadoSincronizacion();
    });

    // Función para enviar los datos no sincronizados al servidor cada 10 segundos
    function enviarDatosNoSincronizados() {
        if (registrosNoSincronizados.length > 0) {
            // Solo enviamos los datos no sincronizados
            registrosNoSincronizados.forEach((registro, index) => {
                const formData = {
                    table: 'razaColor',
                    caravanaElectronica: registro.id,
                    caravanaVisual: registro.caravana,
                    raza: registro.raza,
                    color: registro.color,
                    fecha: registro.fecha
                };

                // Enviar datos al servidor
                fetch('../almacenar/index.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
                        // Si se envía correctamente, eliminar el registro de la lista de no sincronizados
                        registrosNoSincronizados.splice(index, 1);
                        localStorage.setItem('registrosNoSincronizados', JSON.stringify(registrosNoSincronizados));
                        actualizarEstadoSincronizacion();
                    } else {
                        console.error('Error al enviar los datos al servidor');
                    }
                })
                .catch(error => {
                    console.error('Error de red:', error);
                });
            });
        }
    }

    // Ejecutar la sincronización cada 10 segundos
    setInterval(enviarDatosNoSincronizados, 10000);
});
