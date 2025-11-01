import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';
import { createOrUpdateUserAPI, type UserData } from '../services/userService';
import type { StackUserExtended } from '../types/stack-user';
import { getEmailFromUser, getNameFromUser, getAvatarFromUser } from '../types/stack-user';

export function useAuth() {
  const stackAuth = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async (stackUser: StackUserExtended) => {
      try {
        console.log('Inicializando usuario:', stackUser);
        
        const email = getEmailFromUser(stackUser);
        const name = getNameFromUser(stackUser);
        const avatar = getAvatarFromUser(stackUser);

        const userData = await createOrUpdateUserAPI({
          id: stackUser.id,
          email: email || 'No email',
          name: name || null,
          avatar: avatar || null
        });

        console.log('Usuario creado/actualizado:', userData);
        setUserData(userData);
      } catch (error) {
        console.error('Error al inicializar usuario:', error);
        // Establecer datos básicos incluso si falla la creación en DB
        const email = getEmailFromUser(stackUser);
        const name = getNameFromUser(stackUser);
        const avatar = getAvatarFromUser(stackUser);
        
        setUserData({
          id: stackUser.id,
          email: email || 'No email',
          name: name || null,
          avatar: avatar || null
        });
      }
    };

    if (stackAuth && stackAuth.id) {
      initializeUser(stackAuth as StackUserExtended);
    } else {
      setUserData(null);
    }
    setIsLoading(false);
  }, [stackAuth]);

  return {
    user: userData,
    stackUser: stackAuth,
    isAuthenticated: !!stackAuth,
    isLoading,
    signIn: () => {
      // Implementar navegación a página de login
      window.location.href = '/auth/signin';
    },
    signOut: () => {
      // Implementar logout
      window.location.href = '/auth/signout';
    },
  };
}