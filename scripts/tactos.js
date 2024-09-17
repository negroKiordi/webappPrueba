document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tactosForm');
    const idInput = document.getElementById('id');
    const caravanaInput = document.getElementById('caravana');
    const resultadoInput = document.getElementById('resultado');
    const observacionInput = document.getElementById('observacion');
    const responseDiv = document.getElementById('response');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const registrosTabla = document.getElementById('registrosTabla').querySelector('tbody');
    const guardarTablaBtn = document.getElementById('guardarTablaBtn');
    const borrarTablaBtn = document.getElementById('borrarTablaBtn');

    // Cargar tabla desde el localStorage al inicio
    cargarTabla();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            id: idInput.value,
            caravana: caravanaInput.value,
            resultado: resultadoInput.value,
            observacion: observacionInput.value
        };

        // Agregar registro a la tabla
        agregarRegistroTabla(formData);

        // Limpiar formulario
        limpiarFormulario();
        idInput.focus();
    });

    function limpiarFormulario() {
        idInput.value = '';
        caravanaInput.value = '';
        resultadoInput.value = '';
        observacionInput.value = '';
    }

    limpiarBtn.addEventListener('click', function() {
        limpiarFormulario();
        idInput.focus();
    });

    // Agregar registro a la tabla y guardar en localStorage
    function agregarRegistroTabla(formData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formData.id}</td>
            <td>${formData.caravana}</td>
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
