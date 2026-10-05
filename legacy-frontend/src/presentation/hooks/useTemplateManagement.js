/**
 * @file Estado y acciones de la página de Plantillas.
 *
 * Carga todas las versiones y la asignación de plantillas activas, y expone
 * las acciones del flujo (enviar, aprobar, rechazar, activar, importar,
 * exportar) ya conectadas al usuario actual y con recarga automática.
 */

import { useCallback, useEffect, useState } from 'react';
import { templateService } from '@/services/templateService';
import { activeTemplateService } from '@/services/activeTemplateService';
import { templateWorkflowService } from '@/services/templateWorkflowService';
import { getLatestVersions } from '@/domain/models/templateLifecycle';
import { getExportFileName } from '@/domain/models/templateTransfer';
import { downloadJson, readFileAsText } from '@/utils/fileUtils';
import { useCurrentUser } from './useCurrentUser';

/** Lee todas las versiones y la asignación de plantillas activas. */
const fetchTemplateData = () => Promise.all([templateService.getAll(), activeTemplateService.getActiveMap()]);

/**
 * @param {(message:string, variant?:'success'|'error') => void} notify Muestra un toast.
 */
export const useTemplateManagement = (notify) => {
  const user = useCurrentUser();
  const [records, setRecords] = useState([]);  // Todas las versiones.
  const [activeMap, setActiveMap] = useState({}); // { CREDITO: {templateId, version}, … }

  /** Recarga plantillas y asignaciones desde los servicios (tras cada acción). */
  const reload = useCallback(async () => {
    const [all, active] = await fetchTemplateData();
    setRecords(all);
    setActiveMap(active);
  }, []);

  // Carga inicial. `cancelled` evita actualizar el estado si se sale de la
  // página antes de que termine la petición.
  useEffect(() => {
    let cancelled = false;
    fetchTemplateData().then(([all, active]) => {
      if (cancelled) return;
      setRecords(all);
      setActiveMap(active);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Ejecuta una acción del flujo: muestra el resultado, informa errores y recarga.
   * @param {() => Promise<any>} action
   * @param {string} successMessage
   */
  const run = async (action, successMessage) => {
    try {
      await action();
      notify(successMessage);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      await reload();
    }
  };

  return {
    records,
    latest: getLatestVersions(records),
    activeMap,

    submit: (template) =>
      run(() => templateWorkflowService.submitForReview(template, user), 'Plantilla enviada a revisión.'),

    approve: (template) => run(() => templateWorkflowService.approve(template, user), 'Plantilla aprobada.'),

    reject: (template) => {
      const comment = window.prompt('Motivo del rechazo (lo verá el diseñador):')?.trim();
      if (comment === undefined) return; // Canceló el diálogo.
      return run(() => templateWorkflowService.reject(template, user, comment), 'Plantilla devuelta a borrador.');
    },

    activate: (template) =>
      run(() => templateWorkflowService.activate(template, user), `"${template.name}" v${template.version} activada.`),

    exportTemplate: (template) =>
      run(async () => {
        const payload = await templateWorkflowService.exportTemplate(template, user);
        downloadJson(getExportFileName(template), payload);
      }, 'Plantilla exportada.'),

    /** @param {File} file Archivo elegido por el usuario. */
    importTemplate: (file) =>
      run(async () => {
        const text = await readFileAsText(file);
        await templateWorkflowService.importTemplate(text, user);
      }, 'Plantilla importada como borrador.'),
  };
};
