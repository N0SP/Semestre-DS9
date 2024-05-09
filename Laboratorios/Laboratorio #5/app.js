(() => {
    const App = {
        candidatos: [],

        init() {
            this.registrarFormulario = document.querySelector('form');
            this.registrarFormulario.addEventListener('submit', this.registrarCandidato.bind(this));

            this.agregarPuntosFormulario = document.querySelector('#agregar-puntos-form');
            this.agregarPuntosFormulario.addEventListener('submit', (event) => {
                event.preventDefault(); // Aquí se maneja el evento
                const nombreCandidato = document.querySelector('#cand-select').value;
                const cantidadVotos = parseInt(document.querySelector('#num').value);
                this.agregarPuntos(nombreCandidato, cantidadVotos);
            });
        },

        registrarCandidato(event) {
            event.preventDefault();
            const nombre = document.querySelector('#name').value;
            const partido = document.querySelector('#partido-select').value;
            this.agregarCandidato(nombre, partido);
            this.actualizarTabla();
        },

        agregarCandidato(nombre, partido) {
            this.candidatos.push({ nombre, partido, votos: 0 });
        },

        actualizarTabla() {
            const tabla = document.querySelector('#candidatos-table tbody');
            tabla.innerHTML = '';
        
            // Limpiamos y actualizamos las opciones del select para agregar votos
            const selectCandidatos = document.getElementById('cand-select');
            selectCandidatos.innerHTML = '';
            this.candidatos.forEach(candidato => {
                const option = document.createElement('option');
                option.value = candidato.nombre;
                option.textContent = candidato.nombre;
                selectCandidatos.appendChild(option);
            });
        
            this.candidatos.forEach((candidato, index) => {
                const row = tabla.insertRow();
                row.setAttribute('id', `candidato-${candidato.nombre}`); // Usamos el nombre del candidato como identificador único
                row.innerHTML = `
                    <td>${candidato.nombre}</td>
                    <td>${candidato.partido}</td>
                    <td>
                        <div class="progress-bar" style="width: ${candidato.porcentaje}%;"></div>
                        ${candidato.votos} (${candidato.porcentaje}%)
                    </td>
                    <td><button class="eliminar-btn" data-candidato="${candidato.nombre}">Eliminar</button></td>
                `;
            });
        
            // Asignar evento de clic a los botones "Eliminar" después de insertar todas las filas
            const eliminarBtns = document.querySelectorAll('.eliminar-btn');
            eliminarBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const nombreCandidato = btn.getAttribute('data-candidato');
                    this.eliminarCandidato(nombreCandidato);
                });
            });
        },
        

        eliminarCandidato(nombre) {
            this.candidatos = this.candidatos.filter(candidato => candidato.nombre !== nombre);
            this.actualizarTabla();
            this.actualizarPorcentajes();
        },

        agregarPuntos(event) {
            event.preventDefault();
            const nombreCandidato = document.querySelector('#cand-select').value;
            const cantidadVotos = parseInt(document.querySelector('#num').value);
            this.agregarPuntos(nombreCandidato, cantidadVotos);
        },

        actualizarPorcentajes() {
            const totalVotos = this.candidatos.reduce((total, candidato) => total + candidato.votos, 0);
            this.candidatos.forEach(candidato => {
                candidato.porcentaje = (candidato.votos / totalVotos) * 100 || 0; // Evitar división por cero
            });
            this.actualizarBarrasDeProgreso();
        },

        actualizarBarrasDeProgreso() {
            const maxPorcentaje = Math.max(...this.candidatos.map(candidato => candidato.porcentaje));
            const barWidthMultiplier = 100 / maxPorcentaje;
            this.candidatos.forEach(candidato => {
                const row = document.querySelector(`#candidato-${candidato.nombre}`);
                if (row) {
                    const progressCell = row.querySelector('.progress-cell');
                    if (progressCell) {
                        progressCell.innerHTML = `<div class="progress-bar" style="width: ${candidato.porcentaje * barWidthMultiplier}%;"></div>`;
                    }
                }
            });
        }

    };

    App.init();
})();
