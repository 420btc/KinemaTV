import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@stackframe/stack';

const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        if (user) {
          // Usar el método signOut del objeto user
          await user.signOut();
        }
        // Redirigir al inicio después de cerrar sesión
        navigate('/');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Redirigir al inicio incluso si hay error
        navigate('/');
      }
    };

    handleSignOut();
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cerrando sesión...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor espera mientras cerramos tu sesión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignOut;