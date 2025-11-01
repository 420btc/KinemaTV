import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@stackframe/stack';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verificar si hay parámetros de error en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        
        if (error) {
          console.error('Error en OAuth:', error, errorDescription);
          setError(`Error de autenticación: ${errorDescription || error}`);
          setIsProcessing(false);
          setTimeout(() => navigate('/auth/signin', { replace: true }), 3000);
          return;
        }

        // Esperar un poco más para que Stack Auth procese el callback
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar si el usuario está autenticado
        if (user && user.id) {
          console.log('Usuario autenticado exitosamente:', user);
          setIsProcessing(false);
          navigate('/', { replace: true });
        } else {
          // Si después de 5 segundos no hay usuario, mostrar error
          setTimeout(() => {
            if (!user) {
              console.log('Timeout: No se pudo autenticar el usuario');
              setError('No se pudo completar la autenticación. Inténtalo de nuevo.');
              setIsProcessing(false);
              setTimeout(() => navigate('/auth/signin', { replace: true }), 3000);
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Error en el callback de OAuth:', error);
        setError('Ocurrió un error durante la autenticación.');
        setIsProcessing(false);
        setTimeout(() => navigate('/auth/signin', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [user, navigate]);

  // Si el usuario se autentica después del efecto inicial
  useEffect(() => {
    if (user && user.id && isProcessing) {
      console.log('Usuario autenticado:', user);
      setIsProcessing(false);
      navigate('/', { replace: true });
    }
  }, [user, navigate, isProcessing]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="text-red-600">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error de Autenticación
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {error}
            </p>
            <p className="text-xs text-gray-500">
              Serás redirigido automáticamente...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completando autenticación...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor espera mientras procesamos tu inicio de sesión con Google.
          </p>
          <div className="mt-4">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;