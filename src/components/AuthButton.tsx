import { useUser } from '@stackframe/stack';
import { User, LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
  const stackUser = useUser();

  if (stackUser && stackUser.id) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {stackUser.profileImageUrl ? (
            <img
              src={stackUser.profileImageUrl}
              alt={stackUser.displayName || 'Usuario'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          <span className="text-white text-sm font-medium">
            {stackUser.displayName || stackUser.primaryEmail}
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
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <LogIn size={16} />
      <span>Iniciar Sesión</span>
    </button>
  );
}