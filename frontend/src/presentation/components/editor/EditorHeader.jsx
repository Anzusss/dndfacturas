/**
 * @file Cabecera del editor: datos del documento | zoom y vista | acciones.
 *
 * Cada sección es un componente autónomo que lee del store lo que necesita,
 * en lugar de recibir 6+ props desde aquí (prop drilling).
 */

import { DocumentInfo } from './header/DocumentInfo';
import { ZoomControls } from './header/ZoomControls';
import { EditorActions } from './header/EditorActions';

/**
 * @param {Object} props
 * @param {() => void} props.onSave Acción de guardado (la gestiona EditorPage).
 */
export const EditorHeader = ({ onSave }) => (
  <header className="no-print h-14 bg-white border-b border-neutral-200 text-neutral-800 px-4 flex items-center justify-between gap-4 select-none shadow-sm z-10">
    <DocumentInfo />
    <ZoomControls />
    <EditorActions onSave={onSave} />
  </header>
);
