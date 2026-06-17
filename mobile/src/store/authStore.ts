import { create } from 'zustand';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,

  login: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    set({ user: cred.user, token });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, token: null });
  },

  refreshToken: async () => {
    const user = get().user;
    if (!user) return null;
    const token = await user.getIdToken(true);
    set({ token });
    return token;
  }
}));

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
