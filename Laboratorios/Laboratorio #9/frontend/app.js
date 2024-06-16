(() => {
    const App = {
        HTMLElements: {
            form: document.querySelector('#formulario'),
            tarjetasContenedor: document.getElementById('tarjetas')
        },
        init: () => {
            App.bindEvents();
        },
        bindEvents: () => {
            App.HTMLElements.form.addEventListener('submit', App.events.submitEvent);
        },
        events: {
            async submitEvent(event) {
                event.preventDefault();
                const numero = document.getElementById('numero').value;
                const body = JSON.stringify({ numero: parseInt(numero, 10) });
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                };
                try {
                    const response = await fetch('http://localhost:3000/', options);
                    const data = await response.json();
                    if (data && Array.isArray(data.secuencia)) {
                        App.utils.displayFibonacciCards(data.secuencia);
                    } else {
                        console.error('Error en la respuesta del servidor:', data);
                        alert('Se recibió una respuesta inesperada del servidor.');
                    }
                } catch (error) {
                    console.error('Error al conectar con el servidor:', error);
                }
            }
        },
        utils: {
            displayFibonacciCards(secuencia) {
                App.HTMLElements.tarjetasContenedor.innerHTML = ''; // Limpiar tarjetas existentes
                secuencia.forEach((num, index) => {
                    const tarjeta = App.utils.createCardHTML(index, num);
                    App.HTMLElements.tarjetasContenedor.appendChild(tarjeta);
                });
            },
            createCardHTML(index, number) {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.innerHTML = `<span class="close-btn">&times;</span><h3>${number}</h3>`;
                const closeButton = tarjeta.querySelector('.close-btn');
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`¿Desea eliminar la tarjeta ${index + 1}?`)) {
                        App.HTMLElements.tarjetasContenedor.removeChild(tarjeta);
                    }
                });
                return tarjeta;
            }
        }
    };
    App.init();
})();
