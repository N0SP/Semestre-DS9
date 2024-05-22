((Session) => {
    const App = {
        htmlElement: {
            formLogin: document.getElementById('form_login'),
            formRegister: document.getElementById('form_register'),
            alertLogin: document.getElementById('alert_login'),
            alertRegister: document.getElementById('alert_register'),
        },
        init() {
            App.initialValidations();
            App.bindEvents();
        },
        initialValidations() {
            if (Session.isActiveSession()) {
                window.location.href = 'profile.html';
            }
        },
        bindEvents() {
            App.htmlElement.formLogin.addEventListener('submit', App.handlers.onLoginSubmit);
            App.htmlElement.formRegister.addEventListener('submit', App.handlers.onRegisterSubmit);
        },
        handlers: {
            onLoginSubmit(event) {
                event.preventDefault();
                const { username, password } = event.target.elements;
                if (!Session.login(username.value, password.value)) {
                    App.showAlert(App.htmlElement.alertLogin, 'Credenciales incorrectas', 'error');
                }
            },
            onRegisterSubmit(event) {
                event.preventDefault();
                const { username, nickname, password } = event.target.elements;
                if (Session.register(username.value, nickname.value, password.value)) {
                    App.showAlert(App.htmlElement.alertRegister, 'Usuario registrado con éxito', 'success');
                } else {
                    App.showAlert(App.htmlElement.alertRegister, 'El usuario ya existe', 'error');
                }
            },
        },
        showAlert(element, message, type) {
            if (element) {
                element.textContent = message;
                element.className = `alert ${type}`;
                element.style.display = 'block';
                setTimeout(() => {
                    element.style.display = 'none';
                }, 3000);
            } else {
                console.error('Elemento de alerta no encontrado:', element);
            }
        }
    };

    App.init();
})(window.Session);
