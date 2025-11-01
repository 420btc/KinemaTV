// Servicio para manejar las llamadas de usuario desde el cliente
export interface UserData {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  username?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_BASE_URL = 'http://localhost:3001/api';

export async function createOrUpdateUserAPI(userData: {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}): Promise<UserData> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserAPI(id: string): Promise<UserData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}