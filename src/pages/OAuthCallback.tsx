import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@stackframe/stack';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Esperar un momento para que Stack Auth procese el callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Si el usuario está autenticado, redirigir al inicio
        if (user) {
          console.log('Usuario autenticado:', user);
          navigate('/', { replace: true });
        } else {
          // Si no hay usuario después del callback, redirigir al signin
          console.log('No se pudo autenticar el usuario');
          navigate('/auth/signin', { replace: true });
        }
      } catch (error) {
        console.error('Error en el callback de OAuth:', error);
        navigate('/auth/signin', { replace: true });
      }
    };

    handleCallback();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completando autenticación...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor espera mientras procesamos tu inicio de sesión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;