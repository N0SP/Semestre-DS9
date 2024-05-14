(() => {
    function obtenerUser() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        return loggedInUser ? JSON.parse(loggedInUser) : null;
    }

    function showUser() {
        const user = obtenerUser();
        if (user) {
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = user.username;
            }
        } else {
            window.location.href = 'index.html';
        }
    }

    function logout() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }

    // Función de inicialización
    function init() {
        showUser();

        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }
    }

    window.onload = init;
})();
