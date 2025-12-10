import { User } from '../types';

let STORAGE_KEY = 'whowill-data-v1';

// Vibrant Brutalist Palette
const PALETTE = [
  '#4ECDC4', // Teal
  '#FF6F61', // Coral
  '#FFC312', // Yellow
  '#C4E538', // Lime
  '#12CBC4', // Cyan
  '#FDA7DF', // Lavender/Pink
  '#ED4C67', // Red
  '#F79F1F', // Orange
  '#A3CB38', // Olive
  '#1289A7', // Blue
];

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Alice', count: 2, color: '#4ECDC4' },
  { id: '2', name: 'Bob', count: 5, color: '#FF6F61' },
  { id: '3', name: 'Charlie', count: 0, color: '#FFC312' },
  { id: '4', name: 'Diana', count: 1, color: '#C4E538' },
];

export const setCurrentUser = (username: string) => {
  STORAGE_KEY = `whowill-data-${username}-v1`;
};

export const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse users from local storage", e);
  }
  return DEFAULT_USERS;
};

export const saveUsers = (users: User[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to local storage", e);
  }
};

export const calculateWeights = (users: User[]) => {
  // Formula: Weight = 1 / (TotalCount + 1)
  const usersWithWeights = users.map(u => ({
    ...u,
    weight: 1 / (u.count + 1)
  }));
  
  const totalWeight = usersWithWeights.reduce((sum, u) => sum + u.weight, 0);
  
  return usersWithWeights.map(u => ({
    ...u,
    probability: u.weight / totalWeight
  }));
};

// Returns a random color from the palette
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PALETTE.length);
  return PALETTE[randomIndex];
};