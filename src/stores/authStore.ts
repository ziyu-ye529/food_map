import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  school: string;
  major: string;
  avatar: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isVerified: boolean;
  user: User;
  login: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  verifyIdentity: () => void;
}

const MOCK_USER: User = {
  name: "Ziyu Ye",
  email: "ziyu.ye@fudan.edu.cn",
  school: "The University of Hong Kong",
  major: "Computer Science",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ziyu"
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: true,
      isVerified: false,
      user: MOCK_USER,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      updateProfile: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),
      verifyIdentity: () => set({ isVerified: true }),
    }),
    {
      name: 'food-map-auth',
    }
  )
);
