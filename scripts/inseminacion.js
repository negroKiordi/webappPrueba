document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inseminacionForm');
    const idInput = document.getElementById('id');
    const caravanaInput = document.getElementById('caravana');
    const sweepstakeCheckbox = document.getElementById('sweepstakeCheckbox');
    const topperCheckbox = document.getElementById('topperCheckbox');
    const responseDiv = document.getElementById('response');
    const syncStatus = document.getElementById('syncStatus');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const registrosTabla = document.getElementById('registrosTabla').querySelector('tbody');
    const guardarTablaBtn = document.getElementById('guardarTablaBtn');
    const borrarTablaBtn = document.getElementById('borrarTablaBtn');

    let registrosTotales = JSON.parse(localStorage.getItem('registrosTotales')) || [];
    let registrosNoSincronizados = JSON.parse(localStorage.getItem('registrosNoSincronizados')) || [];

    cargarTabla();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Limpiar mensajes de error previos
        responseDiv.textContent = '';
        
        if (!sweepstakeCheckbox.checked && !topperCheckbox.checked) {
            responseDiv.textContent = 'Debe seleccionar un toro.';
            return;
        }
        if (!idInput.value && !caravanaInput.value) {
            responseDiv.textContent = 'Debe completar al menos uno de los campos: ID o Caravana.';
            return;
        }

        const formData = {
            id: idInput.value,
            caravana: caravanaInput.value,
            toro: sweepstakeCheckbox.checked ? 'Sweepstake' : 'Topper',
            fecha: new Date().toISOString().split('T')[0]
        };

        registrosTotales.push(formData);
        registrosNoSincronizados.push(formData);

        localStorage.setItem('registrosTotales', JSON.stringify(registrosTotales));
        localStorage.setItem('registrosNoSincronizados', JSON.stringify(registrosNoSincronizados));
        enviarDatosNoSincronizados();

        agregarRegistroTabla(formData);
        limpiarFormulario();
        idInput.focus();

        actualizarEstadoSincronizacion();
    });

    function limpiarFormulario() {
        responseDiv.textContent = '';
        idInput.value = '';
        caravanaInput.value = '';
        sweepstakeCheckbox.checked = false;
        topperCheckbox.checked = false;
    }

    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        idInput.focus();
    });

    function agregarRegistroTabla(formData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formData.id}</td>
            <td>${formData.caravana}</td>
            <td>${formData.toro}</td>
        `;
        registrosTabla.insertBefore(row, registrosTabla.firstChild);
    }

    function cargarTabla() {
        registrosTotales.forEach(registro => {
            agregarRegistroTabla(registro);
        });
        actualizarEstadoSincronizacion();
    }

    function actualizarEstadoSincronizacion() {
        const sincronizados = registrosNoSincronizados.length === 0;
        syncStatus.textContent = sincronizados ? 'SINCRONIZADO' : 'NO sincronizado';
    }

    guardarTablaBtn.addEventListener('click', function() {
        const registros = [];
        registrosTotales.forEach(registro => {
            registros.push([registro.id, registro.caravana, registro.toro]);
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Caravana,Toro", ...registros.map(e => e.join(','))].join("\n");

        const ahora = new Date();
        const nombreArchivo = `inseminacion_${ahora.getFullYear()}-${(ahora.getMonth()+1).toString().padStart(2, '0')}-${ahora.getDate().toString().padStart(2, '0')}_${ahora.getHours().toString().padStart(2, '0')}-${ahora.getMinutes().toString().padStart(2, '0')}-${ahora.getSeconds().toString().padStart(2, '0')}.csv`;

        const enlace = document.createElement('a');
        enlace.setAttribute('href', encodeURI(csvContent));
        enlace.setAttribute('download', nombreArchivo);
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    });

    borrarTablaBtn.addEventListener('click', function() {
        registrosTabla.innerHTML = '';
        registrosTotales = [];
        registrosNoSincronizados = [];
        localStorage.removeItem('registrosTotales');
        localStorage.removeItem('registrosNoSincronizados');
        actualizarEstadoSincronizacion();
    });

    function enviarDatosNoSincronizados() {
        if (registrosNoSincronizados.length > 0) {
            registrosNoSincronizados.forEach((registro, index) => {
                const formData = {
                    table: 'inseminacion',
                    caravanaElectronica: registro.id,
                    caravanaVisual: registro.caravana,
                    toro: registro.toro,
                    fecha: registro.fecha
                };

                fetch('../api/almacenar.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
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

    setInterval(enviarDatosNoSincronizados, 10000);
});
