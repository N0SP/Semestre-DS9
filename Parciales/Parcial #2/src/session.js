function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const Session = {
    login(username, password) {
        const users = Session.getUsers();
        const hashedPassword = hashCode(password);
        const user = users.find(user => user.username === username && user.password === hashedPassword);
        if (user) {
            Session.setActiveSession(username);
            window.location.href = 'profile.html';
            return true;
        }
        return false;
    },
    register(username, name, password) {
        const users = Session.getUsers();
        if (users.some(user => user.username === username)) {
            return false; // Usuario ya existe
        }
        const hashedPassword = hashCode(password);
        const newUser = { username, name, password: hashedPassword };
        users.push(newUser);
        Session.saveUsers(users);
        return true;
    },
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },
    setActiveSession(username) {
        localStorage.setItem('activeSession', username);
    },
    clearActiveSession() {
        localStorage.removeItem('activeSession');
    },
    getActiveSession() {
        return localStorage.getItem('activeSession');
    },
    isActiveSession() {
        return !!Session.getActiveSession();
    },
    getUser() {
        const username = Session.getActiveSession();
        const users = Session.getUsers();
        return users.find(user => user.username === username);
    }
};

window.Session = Session;
