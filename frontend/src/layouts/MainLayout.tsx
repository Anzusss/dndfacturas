import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { clsx } from "clsx";

export const MainLayout: React.FC = () => {
  const { sidebarCollapsed, notifications } = useSelector(
    (state: RootState) => state.ui,
  );
  const { pathname } = useLocation();
  const isBillingModule = pathname.startsWith("/facturacion");

  return (
    <div className="min-h-screen bg-surface-background text-on-surface transition-colors flex flex-col font-body-md">
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col sidebar-transition",
          sidebarCollapsed ? "sidebar-collapsed-main" : "ml-sidebar-width",
        )}
      >
        <Header />
        <main
          className={clsx(
            "flex-1 min-h-0 w-full animate-fade-in",
            isBillingModule
              ? "overflow-hidden p-0 max-w-none"
              : "p-4 sm:p-6 lg:p-container-margin max-w-[1480px] mx-auto pb-16 lg:pb-16",
          )}
        >
          <Outlet />
        </main>

        {!isBillingModule && <Footer />}
      </div>
    </div>
  );
};
