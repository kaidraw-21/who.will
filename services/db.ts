import { User } from '../types';

interface UserAccount {
  password: string;
  data: User[];
}

interface Database {
  users: Record<string, UserAccount>;
}

// Default database structure
const defaultDb: Database = {
  users: {
    admin: {
      password: "admin123",
      data: [
        { id: "1", name: "Alice", count: 2, color: "#4ECDC4" },
        { id: "2", name: "Bob", count: 5, color: "#FF6F61" },
        { id: "3", name: "Charlie", count: 0, color: "#FFC312" },
        { id: "4", name: "Diana", count: 1, color: "#C4E538" }
      ]
    },
    demo: {
      password: "demo123",
      data: [
        { id: "1", name: "John", count: 0, color: "#4ECDC4" },
        { id: "2", name: "Jane", count: 0, color: "#FF6F61" }
      ]
    }
  }
};

// Load database from localStorage or use default
const loadDatabase = (): Database => {
  try {
    const saved = localStorage.getItem('who-will-db');
    return saved ? JSON.parse(saved) : defaultDb;
  } catch {
    return defaultDb;
  }
};

// Save database to localStorage
const saveDatabase = (database: Database): void => {
  localStorage.setItem('who-will-db', JSON.stringify(database));
};

// Initialize database
let db: Database = loadDatabase();

export const authenticateUser = (username: string, password: string): boolean => {
  const user = db.users[username];
  if (user && user.password === password) {
    return true;
  }
  
  // If user doesn't exist, create new user
  if (!user) {
    createUser(username, password);
    return true;
  }
  
  return false;
};

export const getUserData = (username: string): User[] => {
  const user = db.users[username];
  return user ? user.data : [];
};

export const saveUserData = (username: string, data: User[]): void => {
  if (db.users[username]) {
    db.users[username].data = data;
    saveDatabase(db);
  }
};

export const createUser = (username: string, password: string): void => {
  db.users[username] = {
    password,
    data: [
      { id: "1", name: "Person 1", count: 0, color: "#4ECDC4" },
      { id: "2", name: "Person 2", count: 0, color: "#FF6F61" }
    ]
  };
  saveDatabase(db);
};
