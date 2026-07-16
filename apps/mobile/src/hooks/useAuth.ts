import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const store = useAuthStore();

  const isHydrated = store.isHydrated;
  const hydrate = store.hydrate;

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [isHydrated, hydrate]);

  // zustand actions 是稳定引用，直接返回即可
  const register = store.register;
  const logout = store.logout;
  const clearError = store.clearError;

  return {
    participantId: store.participantId,
    token: store.token,
    clientId: store.clientId,
    isLoading: store.isLoading,
    error: store.error,
    isHydrated,
    isLoggedIn: store.participantId !== null && store.token !== null,
    register,
    logout,
    clearError,
  };
}
