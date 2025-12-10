const AUTH_KEY = 'whowill-auth-v1';

export interface AuthData {
  username: string;
  loginTime: number;
}

export const saveAuth = (username: string) => {
  const authData: AuthData = {
    username,
    loginTime: Date.now()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const getAuth = (): AuthData | null => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse auth data", e);
  }
  return null;
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getUserStorageKey = (username: string) => {
  return `whowill-data-${username}-v1`;
};
