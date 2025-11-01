import { useUser } from '@stackframe/stack';
import type { StackUserExtended } from '../types/stack-user';
import { getEmailFromUser, getNameFromUser, getAvatarFromUser } from '../types/stack-user';
import { User, LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
  const stackUser = useUser();

  if (stackUser && stackUser.id) {
    // Usar funciones helper para extraer datos de forma segura
    const user = stackUser as StackUserExtended;
    const profileImage = getAvatarFromUser(user);
    const displayName = getNameFromUser(user);
    const email = getEmailFromUser(user);

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName || 'Usuario'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          <span className="text-white text-sm font-medium">
            {displayName || email}
          </span>
        </div>
        <button
          onClick={() => window.location.href = '/auth/signout'}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => window.location.href = '/auth/signin'}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium"
    >
      <LogIn size={14} />
      <span>Iniciar Sesión</span>
    </button>
  );
}