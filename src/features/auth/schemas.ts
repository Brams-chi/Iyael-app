import { z } from 'zod';

/** Esquemas compartidos: validan en el formulario y, más adelante, en la API. */

const email = z.string().trim().toLowerCase().pipe(z.email({ error: 'Escribe un correo válido, como nombre@correo.com' }));

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Escribe tu contraseña' }),
});

export const signUpSchema = z
  .object({
    displayName: z.string().trim().min(2, { error: 'Escribe al menos 2 caracteres' }).max(40, { error: 'Máximo 40 caracteres' }),
    email,
    password: z
      .string()
      .min(8, { error: 'Usa al menos 8 caracteres' })
      .regex(/[A-Za-z]/, { error: 'Incluye al menos una letra' })
      .regex(/\d/, { error: 'Incluye al menos un número' }),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], error: 'Las contraseñas no coinciden' });

export const passwordResetSchema = z.object({ email });
