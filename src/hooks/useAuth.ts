import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

export interface UserData {
  id: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
}

export function useAuth() {
  const stackAuth = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (stackAuth && stackAuth.id) {
        try {
          // Crear o actualizar usuario en la base de datos
          const dbUser = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: stackAuth.id,
              email: stackAuth.primaryEmail,
              displayName: stackAuth.displayName,
              profileImageUrl: stackAuth.profileImageUrl,
            }),
          });

          if (dbUser.ok) {
            const userData = await dbUser.json();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    };

    initializeUser();
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