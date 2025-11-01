// Interfaz extendida para Stack User que incluye todas las propiedades posibles
export interface StackUserExtended {
  id: string;
  // Propiedades de email
  email?: string;
  primaryEmail?: string;
  primaryEmailAddress?: string;
  // Propiedades de nombre
  name?: string;
  displayName?: string;
  fullName?: string;
  // Propiedades de imagen/avatar
  avatar?: string;
  profileImageUrl?: string;
  profilePictureUrl?: string;
  avatarUrl?: string;
  // Otras propiedades comunes
  createdAt?: Date;
  updatedAt?: Date;
  // Índice para propiedades adicionales no tipadas
  [key: string]: unknown;
}

// Función helper para extraer email de forma segura
export function getEmailFromUser(user: StackUserExtended): string {
  return user.email || user.primaryEmail || user.primaryEmailAddress || '';
}

// Función helper para extraer nombre de forma segura
export function getNameFromUser(user: StackUserExtended): string {
  return user.name || user.displayName || user.fullName || '';
}

// Función helper para extraer avatar de forma segura
export function getAvatarFromUser(user: StackUserExtended): string {
  return user.avatar || user.profileImageUrl || user.profilePictureUrl || user.avatarUrl || '';
}