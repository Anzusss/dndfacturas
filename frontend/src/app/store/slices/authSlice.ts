import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true, // Default to true for demo admin dashboard access
  user: {
    id: 'usr_001',
    name: 'John Snow',
    email: 'john.snow@serex.com',
    role: 'Administrador de Sistema',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  token: 'mock-jwt-token-serex-2026',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
