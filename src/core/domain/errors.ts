export type AppErrorCode =
  | 'invalid_credentials'
  | 'email_taken'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'rate_limited'
  | 'network'
  | 'unknown';

/** Error tipado que cualquier implementación de repositorio debe lanzar. */
export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

const fallbackMessages: Record<AppErrorCode, string> = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_taken: 'Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.',
  unauthorized: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  forbidden: 'No tienes permiso para realizar esta acción.',
  not_found: 'No encontramos lo que buscas. Puede que se haya eliminado.',
  conflict: 'Esta acción ya se realizó.',
  validation: 'Revisa los datos ingresados.',
  rate_limited: 'Demasiados intentos. Espera un momento y vuelve a intentarlo.',
  network: 'Sin conexión. Revisa tu internet y vuelve a intentarlo.',
  unknown: 'Algo salió mal. Vuelve a intentarlo.',
};

/** Mensaje apto para mostrar al usuario. Nunca expone detalles técnicos. */
export function errorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message || fallbackMessages[error.code];
  return fallbackMessages.unknown;
}
