const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  username: string;
  password: string;
}

let authErrorHandler: (() => void) | null = null;

export const setAuthErrorHandler = (handler: () => void) => {
  authErrorHandler = handler;
};

export const handleAuthError = () => {
  localStorage.removeItem('token');
  if (authErrorHandler) {
    authErrorHandler(); 
  }
};

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data?.data?.token);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${API_URL}/users/logout`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout failed', error);
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/users/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        return null; 
      }
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
