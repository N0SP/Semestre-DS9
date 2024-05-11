(() => {
    const App = {
        candidatos: [],
        coloresPorCandidato: new Map(),

        init() {
            this.registrarFormulario = document.querySelector('#registrar-form');
            this.registrarFormulario.addEventListener('submit', this.registrarCandidato.bind(this));

            this.agregarPuntosFormulario = document.querySelector('#agregar-puntos-form');
            this.agregarPuntosFormulario.addEventListener('submit', (event) => {
                event.preventDefault();
                const { value: nombreCandidato } = document.querySelector('#cand-select');
                const cantidadVotos = parseInt(document.querySelector('#num').value);
                this.agregarVotos(nombreCandidato, cantidadVotos);
            });
        },

        registrarCandidato(event) {
            event.preventDefault();
            const { value: nombre } = document.querySelector('#name');
            const { value: partido } = document.querySelector('#partido-select');
            this.agregarCandidato(nombre, partido);
            this.actualizarTabla();
        },

        agregarCandidato(nombre, partido) {
            this.candidatos.push({ nombre, partido, votos: 0 });
            const color = this.generateUniqueRandomColor();
            this.coloresPorCandidato.set(nombre, color);
        },

        actualizarTabla() {
            const tabla = document.querySelector('#candidatos-table tbody');
            tabla.innerHTML = '';
            const selectCandidatos = document.getElementById('cand-select');
            selectCandidatos.innerHTML = '';
            
            this.candidatos.forEach(candidato => {
                const option = new Option(candidato.nombre, candidato.nombre);
                selectCandidatos.add(option);
                
                const row = tabla.insertRow();
                row.id = `candidato-${candidato.nombre}`;
                const color = this.coloresPorCandidato.get(candidato.nombre);
                row.innerHTML = `
                    <td>${candidato.nombre}</td>
                    <td>${candidato.partido}</td>
                    <td>
                        <div class="progress-bar" style="width: ${candidato.porcentaje || 0}%; background-color: ${color};"></div>
                        ${candidato.votos} (${candidato.porcentaje || 0}%)
                    </td>
                    <td><button class="eliminar-btn" data-candidato="${candidato.nombre}">Eliminar</button></td>
                `;
            });
            
            document.querySelectorAll('.eliminar-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const nombreCandidato = btn.getAttribute('data-candidato');
                    this.eliminarCandidato(nombreCandidato);
                });
            });
        },

        eliminarCandidato(nombre) {
            this.candidatos = this.candidatos.filter(candidato => candidato.nombre !== nombre);
            this.coloresPorCandidato.delete(nombre);
            this.actualizarTabla();
            this.actualizarPorcentajes();
        },

        agregarVotos(nombreCandidato, cantidadVotos) {
            const candidato = this.candidatos.find(c => c.nombre === nombreCandidato);
            if (candidato) {
                candidato.votos += cantidadVotos;
                this.actualizarPorcentajes();
                this.actualizarTabla();
            }
        },

        actualizarPorcentajes() {
            const totalVotos = this.candidatos.reduce((total, candidato) => total + candidato.votos, 0);
            this.candidatos.forEach(candidato => {
                candidato.porcentaje = ((candidato.votos / totalVotos) * 100 || 0).toFixed(2);
            });
        },

        generateUniqueRandomColor() {
            const letters = '0123456789ABCDEF';
            let color;
            do {
                color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
            } while (Array.from(this.coloresPorCandidato.values()).includes(color));
            return color;
        }
    };

    App.init();
})();
