import {LayoutList, Table2, LayoutGrid } from 'lucide-react';

export type ViewMode = 'list' | 'table' | 'grid';
export const VIEW_OPTIONS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
    { mode: 'list',  icon: LayoutList, label: 'Список'  },
    { mode: 'table', icon: Table2,     label: 'Таблиця' },
    { mode: 'grid',  icon: LayoutGrid, label: 'Сітка'   },
];
export const DEFAULT_VIEW: ViewMode = 'grid'