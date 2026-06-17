import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  darkMode: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  toggleDarkMode: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      darkMode: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        document.documentElement.classList.toggle('dark', next);
      },

      login: async (email, password) => {
        if (import.meta.env.VITE_FIREBASE_API_KEY) {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const token = await cred.user.getIdToken();
          set({ user: cred.user, token });
        } else {
          // MOCK LOGIN
          set({ 
            user: { uid: 'mock-123', email, displayName: 'Test User' } as User, 
            token: 'mock-token' 
          });
        }
      },

      register: async (name, email, password) => {
        if (import.meta.env.VITE_FIREBASE_API_KEY) {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: name });
          await sendEmailVerification(cred.user);
          const token = await cred.user.getIdToken();
          set({ user: cred.user, token });
        } else {
          // MOCK REGISTER
          set({ 
            user: { uid: 'mock-123', email, displayName: name } as User, 
            token: 'mock-token' 
          });
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, token: null });
      },

      refreshToken: async () => {
        const { user } = get();
        if (!user) return null;
        const token = await user.getIdToken(true);
        set({ token });
        return token;
      },
    }),
    {
      name: 'lifelink-auth',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);

// Firebase auth state listener — call once in main.tsx
export const initAuthListener = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      useAuthStore.setState({ user, token, loading: false });
    } else {
      useAuthStore.setState({ user: null, token: null, loading: false });
    }
  });
};
