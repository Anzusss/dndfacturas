/**
 * @file Componente raíz. Solo delega en el enrutador; aquí se añadirían en el
 * futuro proveedores globales (p. ej. QueryClientProvider de TanStack Query).
 */

import { AppRouter } from './routes/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
