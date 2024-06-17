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
    async login(username, password) {
        try {
            const hashedPassword = hashCode(password); 
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: hashedPassword })
            });
            const data = await response.json();
    
            if (response.ok && data.loggedIn) {
                sessionStorage.setItem('sessionToken', data.token);
                Session.setActiveSession(data.token);
                window.location.href = 'profile.html';
                return { success: true };
            } else {
                return { success: false, message: data.error || 'Error al intentar loguearse.' };
            }
        } catch (error) {
            return { success: false, message: 'Error en el proceso de login: ' + error.message };
        }
    },
    
    
    async register(username, name, password) {
        try {
            const hashedPassword = hashCode(password);
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, name, password: hashedPassword })
            });
            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.error || 'Error desconocido' };
            }
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    },    
    
    async updateUser(user) {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
            },
            body: JSON.stringify({
                nombre: user.name,
                password: user.password 
            })
        };
        const response = await fetch(`http://localhost:3000/api/usuarios/${user.userId}`, options);
        return response.ok;
    },
    

    getActiveSession() {
        return sessionStorage.getItem('sessionToken');
    },

    getAuthHeaders() {
        const token = Session.getActiveSession();
        if (!token) {
            console.error("El token no esta disponible");
            return {};
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    setActiveSession(token) {
        sessionStorage.setItem('sessionToken', token); 
    },
    clearActiveSession(token) {
        sessionStorage.removeItem('sessionToken',token);
    },

    isActiveSession() {
        return !!this.getActiveSession();
    },
    async getUser() {
        const authHeaders = this.getAuthHeaders();
        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'GET',
                headers: authHeaders
            });
            if (response.ok) {
                const user = await response.json();
                return {
                    userId: user.userId,
                    name: user.name,
                    username: user.username
                };
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
        

    
};  


window.Session = Session;
