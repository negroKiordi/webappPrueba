document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tactosForm');
    const idInput = document.getElementById('id');
    const caravanaInput = document.getElementById('caravana');
    const observacionInput = document.getElementById('observacion');
    const noAptaCheckbox = document.getElementById('noAptaCheckbox');
    const aptaServicioCheckbox = document.getElementById('aptaServicioCheckbox');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const registrosTabla = document.getElementById('registrosTabla').querySelector('tbody');
    const guardarTablaBtn = document.getElementById('guardarTablaBtn');
    const borrarTablaBtn = document.getElementById('borrarTablaBtn');

    // Desmarcar la opción contraria al seleccionar una
    noAptaCheckbox.addEventListener('change', function() {
        if (noAptaCheckbox.checked) {
            aptaServicioCheckbox.checked = false;
        }
    });

    aptaServicioCheckbox.addEventListener('change', function() {
        if (aptaServicioCheckbox.checked) {
            noAptaCheckbox.checked = false;
        }
    });

    // Cargar tabla desde el localStorage al inicio
    cargarTabla();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validar que se haya seleccionado una opción de resultado
        if (!noAptaCheckbox.checked && !aptaServicioCheckbox.checked) {
            responseDiv.textContent = 'Debe seleccionar un resultado.';
            return;
        }

        const formData = {
            table: 'practicaVeterinaria',
            caravanaElectronica: idInput.value,
            caravanaVisual: caravanaInput.value,
            observacion: observacionInput.value,
            practica: 'Tacto preservicio',
            resultado: noAptaCheckbox.checked ? 'No Apta' : 'Apta Servicio',
            fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            fechaResultado: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
        };

        // Enviar datos al servidor
        fetch('../api/almacenar.php', {
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
                agregarRegistroTabla(formData); // Si se guardó en la base de datos, agregar a la tabla local
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
        observacionInput.value = '';
        noAptaCheckbox.checked = false;
        aptaServicioCheckbox.checked = false;
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
            <td>${formData.resultado}</td>
            <td>${formData.observacion}</td>
        `;
        registrosTabla.insertBefore(row, registrosTabla.firstChild); // Empuja hacia abajo los registros

        guardarEnLocalStorage();
    }

    // Guardar registros en localStorage
    function guardarEnLocalStorage() {
        const registros = [];
        registrosTabla.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            registros.push({
                id: cells[0].textContent,
                caravana: cells[1].textContent,
                resultado: cells[2].textContent,
                observacion: cells[3].textContent
            });
        });
        localStorage.setItem('registrosTactos', JSON.stringify(registros));
    }

    // Cargar registros desde localStorage
    function cargarTabla() {
        const registros = JSON.parse(localStorage.getItem('registrosTactos')) || [];
        registros.forEach(registro => {
            agregarRegistroTabla(registro);
        });
    }

    // Exportar la tabla a CSV
    guardarTablaBtn.addEventListener('click', function() {
        const registros = [];
        registrosTabla.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            registros.push([
                cells[0].textContent, // ID
                cells[1].textContent, // Caravana
                cells[2].textContent, // Resultado
                cells[3].textContent  // Observación
            ]);
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Caravana,Resultado,Observación", ...registros.map(e => e.join(','))].join("\n");

        const ahora = new Date();
        const nombreArchivo = `tactos${ahora.getFullYear()}-${(ahora.getMonth()+1).toString().padStart(2, '0')}-${ahora.getDate().toString().padStart(2, '0')}_${ahora.getHours().toString().padStart(2, '0')}-${ahora.getMinutes().toString().padStart(2, '0')}-${ahora.getSeconds().toString().padStart(2, '0')}.csv`;

        const enlace = document.createElement('a');
        enlace.setAttribute('href', encodeURI(csvContent));
        enlace.setAttribute('download', nombreArchivo);
        document.body.appendChild(enlace); // Requerido para Firefox
        enlace.click();
        document.body.removeChild(enlace);
    });

    // Borrar registros de la tabla y del localStorage
    borrarTablaBtn.addEventListener('click', function() {
        registrosTabla.innerHTML = '';
        localStorage.removeItem('registrosTactos');
    });
});
