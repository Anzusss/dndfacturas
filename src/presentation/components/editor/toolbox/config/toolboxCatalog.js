import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { LayoutGrid, Table2, Calculator, Type, Minus } from 'lucide-react';

export const TOOLBOX_CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'structures', label: 'Estructuras' },
    { id: 'shapes', label: 'Formas & Líneas' },
    { id: 'erp', label: 'Campos ERP' },
];

export const TOOLBOX_ITEMS = [
    // --- ESTRUCTURAS BASE ---
    {
        category: 'structures',
        title: 'Bloque de Datos (Grid)',
        subtitle: 'Cliente, RIF, Control Doc',
        icon: LayoutGrid,
        iconColor: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20',
        data: {
            type: ELEMENT_TYPES.GRID,
            title: 'Datos del Cliente',
            width: 440,
            height: 115,
            fields: ['cliente', 'rif', 'direccion', 'telefono'],
        },
    },
    {
        category: 'structures',
        title: 'Tabla de Renglones',
        subtitle: 'Columnas US$ / Bs.',
        icon: Table2,
        iconColor: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
        data: {
            type: ELEMENT_TYPES.TABLE,
            title: 'Detalle de Factura',
            width: 702,
            height: 140,
            columns: ['Cantidad', 'UM', 'Descripción del Bien/Servicio', 'Precio/Tarifa (US$)', 'Sub-total (US$)', 'Sub-total (Bs.)'],
            sampleRows: [{ cant: '20,000', um: 'SC25', desc: 'PURICACHAMA 25%', precio: 'US$ 28.22', subUsd: 'US$ 564.40', subBs: 'Bs 223.709,76(E)' }],
        },
    },
    {
        category: 'structures',
        title: 'Módulo de Totales',
        subtitle: 'Base, IVA, Exento, Total, IGTF',
        icon: Calculator,
        iconColor: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
        data: {
            type: ELEMENT_TYPES.TOTALS,
            title: 'Resumen de Totales',
            width: 380,
            height: 155,
        },
    },
    {
        category: 'structures',
        title: 'Texto / Leyenda Legal',
        subtitle: 'Providencia IGTF y Tasa BCV',
        icon: Type,
        iconColor: 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20',
        data: {
            type: ELEMENT_TYPES.TEXT,
            title: 'Leyenda Legal IGTF',
            width: 702,
            height: 120,
            content: 'De cancelar este documento en moneda distinta a la de curso legal en el país...',
        },
    },

    // --- FORMAS Y FIGURAS ---
    {
        category: 'shapes',
        title: 'Línea Horizontal',
        subtitle: 'Separador de tabla o secciones',
        icon: Minus,
        iconColor: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
        data: {
            type: ELEMENT_TYPES.LINE || 'LINE',
            title: 'Línea Divisoria',
            width: 702,
            height: 10,
            thickness: 1,
            color: '#000000',
        },
    },
];