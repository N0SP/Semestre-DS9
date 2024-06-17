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
            async onLoginSubmit(event) {
                event.preventDefault();
                const username = event.target.elements.username.value;
                const password = event.target.elements.password.value;
            
                const result = await Session.login(username, password);
                if (result.success) {
                } else {
                    App.showAlert(App.htmlElement.alertLogin, result.message, 'error');
                }
            },
            
            async onRegisterSubmit(event) {
                event.preventDefault();
                const username = event.target.elements.username.value;
                const name = event.target.elements.name.value;
                const password = event.target.elements.password.value;
            
                const result = await Session.register(username, name, password);
                if (result.success) {
                    App.showAlert(App.htmlElement.alertRegister, 'Usuario registrado con éxito', 'success');
                } else {
                    App.showAlert(App.htmlElement.alertRegister, result.message, 'error');
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
