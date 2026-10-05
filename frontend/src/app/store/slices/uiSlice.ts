import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: ThemeMode;
  dateRange: string;
  notifications: ToastNotification[];
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('serex_theme') as ThemeMode;
  return saved || 'light';
};

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: getInitialTheme(),
  dateRange: 'Últimos 30 días',
  notifications: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem('serex_theme', action.payload);
      if (action.payload === 'dark' || (action.payload === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setTheme,
  setDateRange,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
