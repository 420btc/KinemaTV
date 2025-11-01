import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@stackframe/stack';
import { stackClientApp } from '../lib/stack';
import CelestialSphere from '../components/ui/celestial-sphere';

export default function SignIn() {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al home
    if (user && user.id) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      // Usar el método de Stack Auth para iniciar sesión con returnTo
      await stackClientApp.signInWithOAuth('google', {
        returnTo: `${window.location.origin}/oauth-callback`
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      // Stack Auth maneja registro e inicio de sesión con el mismo método
      await stackClientApp.signInWithOAuth('google', {
        returnTo: `${window.location.origin}/oauth-callback`
      });
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <CelestialSphere 
        hue={11}
        speed={0.9}
        zoom={1.2}
        particleSize={1.5}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10 bg-[#101523] rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">KinemaTV</h1>
          <p className="text-gray-400">Descubre tu próxima película favorita</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Iniciar Sesión con Google
          </button>

          <button
            onClick={handleSignUp}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Registrarse con Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}