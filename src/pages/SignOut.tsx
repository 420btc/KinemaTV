import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@stackframe/stack';
import CelestialSphere from '../components/ui/celestial-sphere';

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
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0e1a]">
      <CelestialSphere 
        hue={11}
        speed={0.9}
        zoom={1.2}
        particleSize={1.5}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Cerrando sesión...
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Por favor espera mientras cerramos tu sesión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignOut;