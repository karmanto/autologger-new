import { handleAuthError } from './auth';
import { MachineStatusData, MachineDefsData } from './types';

const API_URL = import.meta.env.VITE_API_URL;
interface FetchOptions extends RequestInit {
  body?: string;
}

const safeJSONParse = <T>(jsonString: string | T): T | string => {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.warn("Failed to parse JSON string:", jsonString, e);
      return jsonString;
    }
  }
  return jsonString;
};

export const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T;
  }

  return response.json();
};

export const fetchMultipartData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T;
  }

  return response.json();
};

export const getMachineStatusData = async (): Promise<MachineStatusData> => {
  return fetchData<MachineStatusData>('machine-status');
};

export const getMachineDefData = async (): Promise<MachineDefsData> => {
  return fetchData<MachineDefsData>('machine-defs');
};
