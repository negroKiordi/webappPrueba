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
            table: 'razaColor',
            caravanaElectronica: idInput.value,
            caravanaVisual: caravanaInput.value,
            raza: angusCheckbox.checked ? 'Angus' : 'Pampa',
            color: negroCheckbox.checked ? 'Negro' : 'Colorado',
            fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            sincronizado: false
        };

        // Agregar a la tabla local y al localStorage
        agregarRegistroTabla(formData);

        // Limpiar formulario
        limpiarFormulario();
        idInput.focus();
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

    // Agregar registro a la tabla y guardar en localStorage
    function agregarRegistroTabla(formData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formData.caravanaElectronica}</td>
            <td>${formData.caravanaVisual}</td>
            <td>${formData.raza}</td>
            <td>${formData.color}</td>
        `;
        registrosTabla.insertBefore(row, registrosTabla.firstChild); // Empuja hacia abajo los registros

        guardarEnLocalStorage();
        actualizarEstadoSincronizacion();
    }

    // Guardar registros en localStorage
    function guardarEnLocalStorage() {
        const registros = [];
        registrosTabla.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            registros.push({
                id: cells[0].textContent,
                caravana: cells[1].textContent,
                raza: cells[2].textContent,
                color: cells[3].textContent,
                sincronizado: false
            });
        });
        localStorage.setItem('registrosRazaColor', JSON.stringify(registros));
    }

    // Cargar registros desde localStorage
    function cargarTabla() {
        const registros = JSON.parse(localStorage.getItem('registrosRazaColor')) || [];
        registros.forEach(registro => {
            agregarRegistroTabla(registro);
        });
    }

    // Actualizar estado de sincronización
    function actualizarEstadoSincronizacion() {
        const registros = JSON.parse(localStorage.getItem('registrosRazaColor')) || [];
        const sincronizados = registros.every(registro => registro.sincronizado);
        syncStatus.textContent = sincronizados ? 'SINCRONIZADO' : 'NO sincronizado';
    }

    // Guardar la tabla como CSV
    guardarTablaBtn.addEventListener('click', function() {
        const registros = [];
        registrosTabla.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            registros.push([
                cells[0].textContent, // ID
                cells[1].textContent, // Caravana
                cells[2].textContent, // Raza
                cells[3].textContent  // Color
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
        localStorage.removeItem('registrosRazaColor');
        actualizarEstadoSincronizacion();
    });

    // Función para enviar los datos no sincronizados al servidor cada 10 segundos
    function enviarDatosNoSincronizados() {
        const registros = JSON.parse(localStorage.getItem('registrosRazaColor')) || [];
        const registrosNoSincronizados = registros.filter(registro => !registro.sincronizado);

        if (registrosNoSincronizados.length > 0) {
            registrosNoSincronizados.forEach((registro, index) => {
                const formData = {
                    table: 'razaColor',
                    caravanaElectronica: registro.id,
                    caravanaVisual: registro.caravana,
                    raza: registro.raza,
                    color: registro.color,
                    fecha: new Date().toISOString().split('T')[0]
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
                        // Si se envía correctamente, actualizar el flag de sincronización
                        registros[index].sincronizado = true;
                        localStorage.setItem('registrosRazaColor', JSON.stringify(registros));
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
