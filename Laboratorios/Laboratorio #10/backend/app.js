import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const PORT = 3000;
const db = {
  usuarios: [],
  ingresos: [],
  egresos: []
};

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

app.use(cors({
  credentials: true, // Permite cookies / Authorization headers
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello Worlds!');
});

 
//Controlador de Usurios
app.post('/api/usuarios', (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    return res.status(400).send({ error: "Todos los campos son requeridos." });
}

const existeuser = db.usuarios.find(user => user.usuario === username);
if (existeuser) {
    return res.status(400).send({ error: "El usuario ya existe." });
}
  const usuario = { 
    id: db.usuarios.length + 1, 
    nombre: name, 
    usuario: username, 
    password: password
  };
  db.usuarios.push(usuario);
  res.status(201).send(usuario);
});

app.get('/api/usuarios', (req, res) => {
  res.json(db.usuarios);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.usuarios.find(u => u.usuario === username && u.password === password);
  if (user) {
      const token = jwt.sign({ userId: user.id, username: user.usuario }, SECRET_KEY, { expiresIn: '1h' });
      console.log("Token generado JWT:", token);
      res.json({ loggedIn: true, token });
  } else {
      res.status(401).json({ loggedIn: false, error: "Usuario o contraseña incorrectos" });
  }
});



app.get('/api/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Failed to authenticate token' });
      }
      const user = db.usuarios.find(u => u.usuario === decoded.username);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json({ username: user.username, name: user.name });
  });
});


app.post('/api/profile', (req, res) => {
  const username = req.session.username; 
  const { name, password } = req.body;
  const user = db.usuarios.find(u => u.username === username);
  if (user) {
      user.name = name;
      user.password = password; 
      res.json({ success: true });
  } else {
      res.status(404).send({ error: 'Usuario no encontrado' });
  }
});

app.patch('/api/usuarios/:username', (req, res) => {
    const { username } = req.params;
    const { nombre, password } = req.body;  // Asumiendo que la contraseña ya viene hasheada si es necesario
    const userIndex = db.usuarios.findIndex(u => u.usuario === username);

    if (userIndex !== -1) {
        db.usuarios[userIndex].nombre = nombre;
        db.usuarios[userIndex].password = password;  // Guardar directamente si ya viene hasheada
        res.json({ success: true, message: 'Usuario actualizado con éxito.' });
    } else {
        res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }
});


// Generar un ID único

const generarId = (() => {
  let id = 0;
  return () => id++;
})();

// Controlador para almanecenar un ingreso
app.use('/api/ingresos', authenticateToken);
app.post('/api/ingresos', (req ,res) => {
  const userId = req.userId;
  const ingreso = { id: generarId(), userId, ...req.body };
  db.ingresos.push(ingreso);
  res.status(201).send(ingreso);
});

// Controlador para leer ingresos
app.get('/api/ingresos', (req, res) => {
  const ingresos = db.ingresos.filter(ingreso => ingreso.userId === req.userId);
  res.json(ingresos);
});

// Controlador para leer un egreso

app.get('/api/egresos', (req, res) => {
  const egresos = db.egresos.filter(egreso => egreso.userId === req.userId);
  res.json(egresos);
});


// Controlador para almacenar un egreso
app.use('/api/egresos', authenticateToken);
app.post('/api/egresos', (req, res) => {
  const userId = req.userId;  // Asegúrate de que este userId se está decodificando correctamente del token
  const egreso = { id: generarId(), userId, ...req.body };
  db.egresos.push(egreso);
  res.status(201).send(egreso);
});


// Eliminar la última entrada
app.delete('/api/lastentry', (req, res) => {
  const lastEntryIndex = db.ingresos.length - 1;
  if (lastEntryIndex >= 0) {
      db.ingresos.splice(lastEntryIndex, 1);
      res.status(200).send({ message: 'Última entrada eliminada con éxito' });
  } else {
      res.status(404).send({ error: 'No hay entradas para eliminar' });
  }
});

// Eliminar la última salida
app.delete('/api/lastexit', (req, res) => {
  const lastExitIndex = db.egresos.length - 1;
  if (lastExitIndex >= 0) {
      db.egresos.splice(lastExitIndex, 1);
      res.status(200).send({ message: 'Última salida eliminada con éxito' });
  } else {
      res.status(404).send({ error: 'No hay salidas para eliminar' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
