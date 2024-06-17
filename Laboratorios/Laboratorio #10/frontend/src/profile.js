((Session) => {
    const ProfileApp = {
        htmlElement: {
            formProfile: document.getElementById('form_profile'),
            logoutButton: document.getElementById('logout_button'),
            usernameDisplay: document.getElementById('username_display'),
            alertProfile: document.getElementById('alert_profile')
        },
        init() {
            ProfileApp.initialValidations();
            ProfileApp.bindEvents();
            ProfileApp.loadUserProfile();
        },
        initialValidations() {
            if (!Session.isActiveSession()) {
                window.location.href = 'index.html';
            }
        },
        bindEvents() {
            ProfileApp.htmlElement.formProfile.addEventListener('submit', ProfileApp.handlers.onProfileSubmit);
            ProfileApp.htmlElement.logoutButton.addEventListener('click', ProfileApp.handlers.onLogout);
        },
        handlers: {
            async onProfileSubmit(event) {
                event.preventDefault();
                const { nickname, password } = event.target.elements;
                const user = await Session.getUser();
            
                if (nickname.value) user.name = nickname.value;
                if (password.value) user.password = hashCode(password.value);
            
                if (await Session.updateUser(user)) {
                    ProfileApp.showAlert(ProfileApp.htmlElement.alertProfile, 'Perfil actualizado con éxito', 'success');
                } else {
                    ProfileApp.showAlert(ProfileApp.htmlElement.alertProfile, 'Error al actualizar el perfil', 'error');
                }
                event.target.reset();
            },
        
            onLogout() {
                Session.clearActiveSession();
                window.location.href = 'index.html';
            }
        },
        
        async loadUserProfile() {
            console.log("Fetching user from session...");
            const user = await Session.getUser();
            console.log("User fetched:", user.username);
            try {
                const user = await Session.getUser();
                if (user) {
                    this.htmlElement.usernameDisplay.textContent = user.username;
                    this.htmlElement.formProfile.nickname.value = user.name;
                } else {
                    throw new Error('No se pudo cargar el perfil del usuario');
                }
            } catch (error) {
                console.error('Error al cargar el perfil del usuario:', error);
                this.showAlert(this.htmlElement.alertProfile, 'Error al cargar datos del usuario', 'error');
            }
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
    ProfileApp.init();
})(window.Session || {});
