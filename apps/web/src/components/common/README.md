# components/common

Componentes reutilizables para tablas CRUD con búsqueda, filtrado de columnas y paginación.

---

## SuperCrud\<T\>

Componente "todo en uno" para listas con datos paginados. Combina `CrudTableControls` + `CrudDataTable` + controles de paginación en un único contenedor.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Título de la sección |
| `subtitle` | `ReactNode` | — | Subtítulo opcional bajo el título |
| `searchTerm` | `string` | — | Valor del campo de búsqueda (controlado) |
| `onSearchTermChange` | `(value: string) => void` | — | Callback al escribir en la búsqueda |
| `searchPlaceholder` | `string` | — | Placeholder del campo de búsqueda |
| `columnOptions` | `CrudTableColumnOption[]` | — | Columnas para el toggle de visibilidad |
| `onToggleColumn` | `(key, visible) => void` | — | Callback al activar/desactivar columna |
| `toolbarActions` | `ReactNode` | — | Slot de botones extra en la barra (ej. "Nuevo") |
| `onReload` | `() => void` | — | Muestra botón de recarga y llama este callback |
| `tableColumns` | `CrudDataTableColumn<T>[]` | — | Definición de columnas de la tabla |
| `data` | `T[]` | — | Registros a mostrar en la página actual |
| `isLoading` | `boolean` | — | Si `true`, muestra filas skeleton |
| `rowKey` | `(row: T, index: number) => string` | — | Key única por fila |
| `loadingRows` | `number` | `5` | Filas skeleton durante carga |
| `emptyMessage` | `string` | `"No hay datos disponibles"` | Mensaje cuando el arreglo está vacío |
| `pagination` | `SuperCrudPagination` | — | Estado y callbacks de paginación |

#### SuperCrudPagination

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `page` | `number` | Página actual (1-indexed) |
| `pageSize` | `number` | Registros por página |
| `total` | `number` | Total de registros sin paginar |
| `totalPages` | `number` | Total de páginas |
| `from` | `number` | Índice del primer registro en la página |
| `to` | `number` | Índice del último registro en la página |
| `onPageChange` | `(page: number) => void` | Navegar de página |
| `onPageSizeChange` | `(size: number) => void` | Cambiar tamaño de página |
| `pageSizeOptions` | `number[]` | Opciones del selector (default `[10, 20, 50]`) |

### Uso mínimo

```tsx
import SuperCrud from '@/components/common/SuperCrud';

const [search, setSearch] = useState('');
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [cols, setCols] = useState([
  { key: 'nombre', label: 'Nombre', visible: true },
  { key: 'email',  label: 'Email',  visible: true },
]);

const filtered  = data.filter(r => r.nombre.toLowerCase().includes(search.toLowerCase()));
const total     = filtered.length;
const totalPages = Math.ceil(total / pageSize);
const pageData  = filtered.slice((page - 1) * pageSize, page * pageSize);

<SuperCrud<MyRow>
  title="Usuarios"
  searchTerm={search}
  onSearchTermChange={(v) => { setSearch(v); setPage(1); }}
  columnOptions={cols}
  onToggleColumn={(key, vis) =>
    setCols(prev => prev.map(c => c.key === key ? { ...c, visible: vis } : c))
  }
  onReload={fetchData}
  tableColumns={[
    { key: 'nombre', header: 'Nombre' },
    { key: 'email',  header: 'Email'  },
  ].filter(c => cols.find(o => o.key === c.key)?.visible)}
  data={pageData}
  isLoading={isLoading}
  rowKey={(r) => String(r.id)}
  pagination={{ page, pageSize, total, totalPages,
    from: (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total),
    onPageChange: setPage,
    onPageSizeChange: (s) => { setPageSize(s); setPage(1); },
  }}
/>
```

> El playground interactivo está en `/components` → **SuperCrud — Playground**.

---

## CrudDataTable\<T\>

Tabla genérica con soporte para skeletons de carga y mensaje de vacío.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `CrudDataTableColumn<T>[]` | — | Definición de columnas |
| `data` | `T[]` | — | Registros a renderizar |
| `isLoading` | `boolean` | — | Muestra skeletons cuando es `true` |
| `rowKey` | `(row: T, index: number) => string` | — | Key única por fila |
| `loadingRows` | `number` | `5` | Cantidad de filas skeleton |
| `emptyMessage` | `string` | `"No hay datos disponibles"` | Mensaje cuando `data` está vacío |

#### CrudDataTableColumn\<T\>

```ts
interface CrudDataTableColumn<T> {
  key: string;          // identificador único
  header: ReactNode;    // contenido de la cabecera
  render?: (row: T) => ReactNode; // si se omite, muestra row[key] como string
  className?: string;   // clases aplicadas a <TableColumn> y <TableCell>
}
```

---

## CrudTableControls

Barra de herramientas con campo de búsqueda, panel de toggle de columnas y slot de acciones.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `searchTerm` | `string` | — | Valor actual de la búsqueda |
| `onSearchTermChange` | `(value: string) => void` | — | Callback al cambiar la búsqueda |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder |
| `columns` | `CrudTableColumnOption[]` | — | Columnas para el toggle |
| `onToggleColumn` | `(key, visible) => void` | — | Callback al cambiar visibilidad |
| `actions` | `ReactNode` | — | Slot de botones adicionales (derecha) |

#### CrudTableColumnOption

```ts
interface CrudTableColumnOption {
  key: string;
  label: string;
  visible: boolean;
}
```

El panel de columnas es un dropdown que se cierra al hacer clic fuera.  
Si `columns` está vacío, el botón "Columnas" no se renderiza.
