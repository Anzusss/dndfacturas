import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/@gruposerex/auth-module/dist/**/*.{js,mjs}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#314575",
        "on-secondary-container": "#3e5182",
        "on-surface-variant": "#434653",
        "on-tertiary-fixed-variant": "#34485e",
        "tertiary-fixed-dim": "#b3c8e3",
        "surface": "#f8f9ff",
        "border-subtle": "#E2E8F0",
        "surface-sidebar": "#132958",
        "on-primary-container": "#98b1ff",
        "danger": "#EF4444",
        "inverse-primary": "#b4c5ff",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed": "#061d31",
        "outline-variant": "#c4c6d5",
        "on-secondary-fixed": "#001847",
        "secondary-container": "#b2c5fe",
        "primary-fixed": "#dbe1ff",
        "surface-dim": "#cbdbf5",
        "surface-container-high": "#dce9ff",
        "surface-tint": "#2d58bf",
        "background": "#f8f9ff",
        "on-primary-fixed": "#00174b",
        "secondary": "#4a5d8f",
        "on-surface": "#0b1c30",
        "secondary-fixed": "#dae2ff",
        "secondary-fixed-dim": "#b2c5fe",
        "on-tertiary-container": "#a0b5cf",
        "on-error": "#ffffff",
        "surface-container": "#e5eeff",
        "inverse-on-surface": "#eaf1ff",
        "outline": "#747684",
        "surface-card": "#FFFFFF",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "surface-container-highest": "#d3e4fe",
        "tertiary-fixed": "#d0e4ff",
        "warning": "#F59E0B",
        "on-secondary": "#ffffff",
        "primary": "#002975",
        "primary-light": "#2563EB",
        "success": "#10B981",
        "on-primary": "#ffffff",
        "on-primary-fixed-variant": "#033ea6",
        "on-background": "#0b1c30",
        "primary-fixed-dim": "#b4c5ff",
        "surface-background": "#F8FAFC",
        "inverse-surface": "#213145",
        "error": "#ba1a1a",
        "primary-container": "#003da5",
        "tertiary": "#1c3145",
        "surface-container-low": "#eff4ff",
        "on-error-container": "#93000a",
        "surface-variant": "#d3e4fe",
        "surface-bright": "#f8f9ff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "container-margin": "24px",
        "sidebar-collapsed": "72px",
        "sidebar-width": "260px",
        "stack-sm": "8px",
        "gutter": "16px",
        "unit": "4px",
        "stack-md": "16px",
        "stack-lg": "24px"
      },
      fontFamily: {
        "label-bold": ["Hanken Grotesk", "sans-serif"],
        "headline-lg": ["Montserrat", "sans-serif"],
        "body-sm": ["Hanken Grotesk", "sans-serif"],
        "headline-sm": ["Montserrat", "sans-serif"],
        "label-md": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Montserrat", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "label-bold": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "body-sm": ["13px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-sm": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "label-md": ["12px", {"lineHeight": "1", "fontWeight": "500"}],
        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
};
