(() => {
    // Simulación de usuarios
    const users = [
        { username: 'usuario1', password: '123' },
        { username: 'usuario2', password: '12345' },
        { username: 'Norman', password: 'pass1' },
    ];

    function login(event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById('loginForm'));
        const username = formData.get('username');
        const password = formData.get('password');

        // Verificar credenciales
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            console.log('Inicio de sesión exitoso. Usuario:', user);
            console.log('Usuario guardado en localStorage:', localStorage.getItem('loggedInUser'));
            window.location.href = 'perfil.html';
        } else {
            document.getElementById('error-message').innerText = 'Usuario o contraseña incorrectos';
        }
    }

    function init() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            window.location.href = 'perfil.html';
        }

        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', login);
    }

    window.onload = init;
})();
