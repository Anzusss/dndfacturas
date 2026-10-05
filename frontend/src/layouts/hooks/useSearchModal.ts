import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Emulating data coming from an API or external source
export const DUMMY_SEARCH_RESULTS = [
  {
    to: "/dashboards/analytics",
    icon: "analytics",
    title: "Dashboard Analítica",
    desc: "Ver métricas y rendimiento global",
    colorClass: "bg-primary/10 text-primary dark:text-inverse-primary",
    activeTextClass: "text-primary dark:text-inverse-primary",
    hoverTextClass:
      "group-hover:text-primary dark:group-hover:text-inverse-primary",
  },
  {
    to: "/apps/sales/create",
    icon: "point_of_sale",
    title: "Registrar Nueva Venta",
    desc: "Crear una factura o recibo rápido",
    colorClass: "bg-emerald-500/10 text-emerald-600",
    activeTextClass: "text-emerald-500",
    hoverTextClass: "group-hover:text-emerald-500",
  },
  {
    to: "/settings/general",
    icon: "settings",
    title: "Configuración General",
    desc: "Ajustes del sistema y preferencias",
    colorClass:
      "bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300",
    activeTextClass: "text-primary dark:text-inverse-primary",
    hoverTextClass:
      "group-hover:text-primary dark:group-hover:text-inverse-primary",
  },
  {
    to: "/ui-elements/general",
    icon: "widgets",
    title: "Catálogo de UI",
    desc: "Explorar todos los componentes visuales",
    colorClass: "bg-sky-500/10 text-sky-600",
    activeTextClass: "text-sky-500",
    hoverTextClass: "group-hover:text-sky-500",
  },
];

export const useSearchModal = (isOpen: boolean, onClose: () => void) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState(DUMMY_SEARCH_RESULTS);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      // Here you could fetch from an API and setSearchResults
    }
  }, [isOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        navigate(searchResults[selectedIndex].to);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleItemSelect = (index: number) => {
    navigate(searchResults[index].to);
    onClose();
  };

  return {
    searchResults,
    selectedIndex,
    setSelectedIndex,
    handleSearchKeyDown,
    handleItemSelect
  };
};
