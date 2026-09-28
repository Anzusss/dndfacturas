/**
 * @file Edición del contenido de un bloque de texto (leyendas, notas…).
 * El texto admite variables de la factura con la sintaxis `{{campo}}`.
 */

import { FormField } from '@/presentation/components/common/FormField';

/**
 * @param {Object}   props
 * @param {Object}   props.element       Bloque de tipo TEXT.
 * @param {Function} props.updateElement Acción del store `(id, cambios) => void`.
 */
export const TextProperties = ({ element, updateElement }) => (
  <div className="space-y-1">
    <FormField label="Contenido de Texto">
      {(id) => (
        <textarea
          id={id}
          rows={6}
          value={element.content || ''}
          onChange={(e) => updateElement(element.id, { content: e.target.value })}
          className="input-field w-full font-mono text-xs leading-relaxed"
        />
      )}
    </FormField>

    {/* Ayuda sobre variables dentro del texto */}
    <p className="text-[10px] text-subtle">
      Usa <code className="font-mono text-primary-600">{'{{campo}}'}</code> para insertar datos de la factura, p.
      ej. <code className="font-mono text-primary-600">{'{{tasaCambio}}'}</code> o{' '}
      <code className="font-mono text-primary-600">{'{{totales.totalGeneralBs}}'}</code>.
    </p>
  </div>
);
