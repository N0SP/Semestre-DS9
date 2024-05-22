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
            onProfileSubmit(event) {
                event.preventDefault();
                const { nickname, password } = event.target.elements;
                const user = Session.getUser();

                if (nickname.value) user.name = nickname.value;
                if (password.value) user.password = hashCode(password.value);

                const users = Session.getUsers();
                const userIndex = users.findIndex(u => u.username === user.username);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    Session.saveUsers(users);
                }

                ProfileApp.showAlert(ProfileApp.htmlElement.alertProfile, 'Perfil actualizado con éxito', 'success');
                event.target.reset();
            },
            onLogout() {
                Session.clearActiveSession();
                window.location.href = 'index.html';
            }
        },
        loadUserProfile() {
            const user = Session.getUser();
            ProfileApp.htmlElement.usernameDisplay.textContent = user.username;
            ProfileApp.htmlElement.formProfile.nickname.value = user.name;
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
