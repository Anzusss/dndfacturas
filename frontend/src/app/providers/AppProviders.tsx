import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/app/store/store";
import {
  AuthConfigProvider,
  AuthProvider,
  ToastProvider,
} from "@gruposerex/auth-module";

const API_URL = import.meta.env.VITE_AUTH_API_URL || "";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID_IDENTITY || "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthConfigProvider apiUrl={API_URL} clientId={CLIENT_ID}>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </AuthConfigProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
