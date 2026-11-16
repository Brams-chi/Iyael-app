import { useQueryClient } from '@tanstack/react-query';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { AppError } from '@/core/domain/errors';
import type { User } from '@/core/domain/types';
import type { SignUpInput } from '@/core/repositories/contracts';
import { useRepositories } from '@/core/repositories/RepositoryContext';
import { tokenStore } from '@/core/storage/tokenStore';

type AuthState = { status: 'loading'; user: null } | { status: 'signedOut'; user: null } | { status: 'signedIn'; user: User };

interface AuthActions {
  signIn(email: string, password: string): Promise<void>;
  signUp(input: SignUpInput): Promise<void>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
}

/* Estado y acciones van en contextos separados: quien sólo llama a `signOut` no se re-renderiza al cambiar el usuario. */
const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

const isUnauthorized = (error: unknown) => error instanceof AppError && error.code === 'unauthorized';

export function AuthProvider({ children }: PropsWithChildren) {
  const { auth } = useRepositories();
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  const endSession = useCallback(async () => {
    await tokenStore.clear();
    queryClient.clear();
    setState({ status: 'signedOut', user: null });
  }, [queryClient]);

  // Restaurar sesión al abrir la app: token → /me → (si expiró) refresh → /me.
  useEffect(() => {
    let cancelled = false;

    async function restore(): Promise<User | null> {
      const accessToken = await tokenStore.getAccessToken();
      if (!accessToken) return null;
      try {
        return await auth.me(accessToken);
      } catch (error) {
        if (!isUnauthorized(error)) throw error;
        const refreshToken = await tokenStore.getRefreshToken();
        if (!refreshToken) return null;
        const tokens = await auth.refresh(refreshToken);
        await tokenStore.save(tokens);
        return auth.me(tokens.accessToken);
      }
    }

    restore()
      .then((user) => {
        if (cancelled) return;
        if (user) setState({ status: 'signedIn', user });
        else void endSession();
      })
      .catch(() => {
        if (!cancelled) void endSession();
      });

    return () => {
      cancelled = true;
    };
  }, [auth, endSession]);

  // Si cualquier consulta responde "no autorizado", la sesión terminó en el servidor.
  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        if (event.type === 'updated' && event.action.type === 'error' && isUnauthorized(event.action.error)) {
          void endSession();
        }
      }),
    [queryClient, endSession]
  );

  const actions = useMemo<AuthActions>(
    () => ({
      async signIn(email, password) {
        const session = await auth.signIn(email, password);
        await tokenStore.save(session.tokens);
        setState({ status: 'signedIn', user: session.user });
      },
      async signUp(input) {
        const session = await auth.signUp(input);
        await tokenStore.save(session.tokens);
        setState({ status: 'signedIn', user: session.user });
      },
      async signOut() {
        const refreshToken = await tokenStore.getRefreshToken();
        // Revocar en el servidor es best-effort: la sesión local se cierra igual.
        if (refreshToken) await auth.signOut(refreshToken).catch(() => undefined);
        await endSession();
      },
      requestPasswordReset: (email) => auth.requestPasswordReset(email),
    }),
    [auth, endSession]
  );

  return (
    <AuthActionsContext.Provider value={actions}>
      <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
    </AuthActionsContext.Provider>
  );
}

export function useAuthState(): AuthState {
  const value = use(AuthStateContext);
  if (!value) throw new Error('useAuthState debe usarse dentro de <AuthProvider>');
  return value;
}

export function useAuthActions(): AuthActions {
  const value = use(AuthActionsContext);
  if (!value) throw new Error('useAuthActions debe usarse dentro de <AuthProvider>');
  return value;
}

/** Usuario autenticado. Sólo para pantallas dentro de las rutas protegidas. */
export function useCurrentUser(): User {
  const state = useAuthState();
  if (state.status !== 'signedIn') throw new Error('useCurrentUser requiere una sesión activa');
  return state.user;
}
