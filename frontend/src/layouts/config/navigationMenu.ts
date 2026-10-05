export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  to?: string;
  parent?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  };
  children?: MenuItem[];
}

export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: 'dashboard',
    children: [
      {
        id: 'dashboards-analytics',
        parent: 'dashboards',
        label: 'Analítica',
        to: '/dashboards/analytics',
        icon: 'analytics',
      },
      {
        id: 'dashboards-ecommerce',
        parent: 'dashboards',
        label: 'E-Commerce',
        to: '/dashboards/ecommerce',
        icon: 'shopping_bag',
      },
    ],
  },
  {
    id: 'apps',
    label: 'Aplicaciones',
    icon: 'inventory_2',
    children: [
      {
        id: 'apps-inventory',
        parent: 'apps',
        label: 'Gestión de Inventario',
        to: '/apps/inventory',
        icon: 'shelves',
      },
      {
        id: 'apps-sales-create',
        parent: 'apps',
        label: 'Registrar Venta',
        to: '/apps/sales/create',
        icon: 'point_of_sale',
      },
      {
        id: 'apps-sales-list',
        parent: 'apps',
        label: 'Historial de Ventas',
        to: '/apps/sales',
        icon: 'history',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Facturación',
    icon: 'receipt_long',
    children: [
      {
        id: 'billing-editor',
        parent: 'billing',
        label: 'Diseñador de plantillas',
        to: '/facturacion',
        icon: 'design_services',
      },
      {
        id: 'billing-templates',
        parent: 'billing',
        label: 'Plantillas',
        to: '/facturacion/templates',
        icon: 'layers',
      },
      {
        id: 'billing-print',
        parent: 'billing',
        label: 'Imprimir factura',
        to: '/facturacion/print',
        icon: 'print',
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administración',
    icon: 'admin_panel_settings',
    children: [
      {
        id: 'administration-audit',
        parent: 'administration',
        label: 'Auditoría',
        to: '/facturacion/audit',
        icon: 'history',
      },
    ],
  },
  {
    id: 'charts',
    label: 'Gráficos',
    icon: 'pie_chart',
    children: [
      {
        id: 'charts-apex',
        parent: 'charts',
        label: 'ApexCharts',
        to: '/charts/apex',
        icon: 'bar_chart',
      },
      {
        id: 'charts-chartjs',
        parent: 'charts',
        label: 'Chart.js',
        to: '/charts/chartjs',
        icon: 'show_chart',
      },
    ],
  },
  {
    id: 'widgets',
    label: 'Widgets',
    icon: 'grid_view',
    children: [
      {
        id: 'widgets-statistics',
        parent: 'widgets',
        label: 'Estadísticas & KPIs',
        to: '/widgets/statistics',
        icon: 'monitoring',
      },
      {
        id: 'widgets-data',
        parent: 'widgets',
        label: 'Datos & Feeds',
        to: '/widgets/data',
        icon: 'dynamic_feed',
      },
    ],
  },
  {
    id: 'forms',
    label: 'Formularios',
    icon: 'list_alt',
    children: [
      {
        id: 'forms-simple',
        parent: 'forms',
        label: 'Simples',
        to: '/forms/simple',
        icon: 'check_box_outline_blank',
      },
      {
        id: 'forms-components',
        parent: 'forms',
        label: 'Componentes',
        to: '/forms/components',
        icon: 'tune',
      },
      {
        id: 'forms-validations',
        parent: 'forms',
        label: 'Validaciones Zod',
        to: '/forms/validations',
        icon: 'fact_check',
      },
      {
        id: 'forms-wizards',
        parent: 'forms',
        label: 'Wizards Avanzados',
        to: '/forms/wizards',
        icon: 'magic_button',
      },
    ],
  },
  {
    id: 'tables',
    label: 'Tablas',
    icon: 'table',
    children: [
      {
        id: 'tables-simple',
        parent: 'tables',
        label: 'Simples',
        to: '/tables/simple',
        icon: 'grid_3x3',
      }
    ],
  },
  {
    id: 'ui-elements',
    label: 'Elementos UI',
    icon: 'widgets',
    children: [
      { id: 'ui-general', parent: 'ui-elements', label: 'General UI', to: '/ui-elements/general', icon: 'widgets' },
      { id: 'ui-alerts', parent: 'ui-elements', label: 'Alertas & Toasts', to: '/ui-elements/alerts', icon: 'warning' },
      { id: 'ui-buttons', parent: 'ui-elements', label: 'Botones & Acciones', to: '/ui-elements/buttons', icon: 'smart_button' },
      { id: 'ui-modals', parent: 'ui-elements', label: 'Modales Interactivos', to: '/ui-elements/modals', icon: 'layers' },
      { id: 'ui-images', parent: 'ui-elements', label: 'Galería de Imágenes', to: '/ui-elements/images', icon: 'image' },
      { id: 'ui-tabs-accordions', parent: 'ui-elements', label: 'Pestañas & Acordeones', to: '/ui-elements/tabs-accordions', icon: 'tab' },
      { id: 'ui-spinners', parent: 'ui-elements', label: 'Spinners & Skeletons', to: '/ui-elements/spinners', icon: 'progress_activity' },
      { id: 'ui-progress', parent: 'ui-elements', label: 'Barras de Progreso', to: '/ui-elements/progress', icon: 'align_horizontal_left' },
      { id: 'ui-offcanvas', parent: 'ui-elements', label: 'Paneles Offcanvas', to: '/ui-elements/offcanvas', icon: 'view_sidebar' },
      { id: 'ui-placeholders', parent: 'ui-elements', label: 'Placeholders', to: '/ui-elements/placeholders', icon: 'rectangle' },
      { id: 'ui-list-group', parent: 'ui-elements', label: 'Grupos de Listas', to: '/ui-elements/list-group', icon: 'format_list_bulleted' },
      { id: 'ui-icons', parent: 'ui-elements', label: 'Buscador de Iconos', to: '/ui-elements/icons', icon: 'category' },
      { id: 'ui-grid', parent: 'ui-elements', label: 'Grid Responsivo', to: '/ui-elements/grid', icon: 'grid_on' },
      { id: 'ui-feedback', parent: 'ui-elements', label: 'Feedback & Rating', to: '/ui-elements/feedback', icon: 'star' },
      { id: 'ui-embed-video', parent: 'ui-elements', label: 'Reproductores Embed', to: '/ui-elements/embed-video', icon: 'smart_display' },
      { id: 'ui-dropdowns', parent: 'ui-elements', label: 'Menús Dropdowns', to: '/ui-elements/dropdowns', icon: 'arrow_drop_down_circle' },
      { id: 'ui-carousel', parent: 'ui-elements', label: 'Carrusel de Slides', to: '/ui-elements/carousel', icon: 'view_carousel' },
      { id: 'ui-cards', parent: 'ui-elements', label: 'Tarjetas Cards', to: '/ui-elements/cards', icon: 'dashboard_customize' },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'settings',
    children: [
      { id: 'settings-general', parent: 'settings', label: 'General', to: '/settings/general', icon: 'tune' },
      { id: 'settings-appearance', parent: 'settings', label: 'Apariencia & Tema', to: '/settings/appearance', icon: 'palette' },
      { id: 'settings-account', parent: 'settings', label: 'Mi Cuenta & Perfil', to: '/settings/account', icon: 'account_circle' },
    ],
  },
  {
    id: 'errors',
    label: 'Errores',
    icon: 'error',
    children: [
      { id: 'errors-404', parent: 'errors', label: 'Página 404', to: '/errors/404', icon: 'browser_not_supported' },
      { id: 'errors-500', parent: 'errors', label: 'Error Servidor 500', to: '/errors/500', icon: 'dns' },
      { id: 'errors-maintenance', parent: 'errors', label: 'Mantenimiento', to: '/errors/maintenance', icon: 'engineering' },
    ],
  },
];
