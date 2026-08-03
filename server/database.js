import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, '../data/users_db.json');

// Ensure data directory exists
const dataDir = path.dirname(dbFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial DB Structure
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify({ users: [] }, null, 2));
}

function readDB() {
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

/**
 * Register User with Username and Password
 */
export function registerUserInDB(username, password) {
  const db = readDB();
  const cleanUsername = username ? username.trim().toLowerCase() : '';

  if (!cleanUsername) {
    throw new Error('El nombre de usuario no puede estar vacío.');
  }

  const existingUser = db.users.find(u => ((u.username || u.email || '').toLowerCase()) === cleanUsername);
  if (existingUser) {
    throw new Error('Ese nombre de usuario ya se encuentra registrado. Elige otro.');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    username: cleanUsername,
    displayName: username.trim(),
    password: password,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  return {
    success: true,
    user: { id: newUser.id, username: newUser.displayName }
  };
}

/**
 * Authenticate User with Username and Password
 */
export function authenticateUserInDB(username, password) {
  const db = readDB();
  const cleanUsername = username ? username.trim().toLowerCase() : '';

  const user = db.users.find(u => ((u.username || u.email || '').toLowerCase()) === cleanUsername);

  if (!user) {
    throw new Error('El usuario no existe. Por favor regístrate primero.');
  }

  if (user.password !== password) {
    throw new Error('Contraseña incorrecta. Verifica tus datos.');
  }

  return {
    id: user.id,
    username: user.displayName || user.username
  };
}
