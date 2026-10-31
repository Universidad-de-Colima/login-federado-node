# components/ui

Componentes de interfaz de propósito general: badges, tarjetas, estados vacíos y notificaciones.

Exportados desde `@/components/ui` vía `index.ts`.

---

## BooleanBadge

Convierte un valor booleano, numérico o de texto a un badge visual "Sí" / "No".

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `value` | `string \| number \| boolean` | Valor a mostrar. `true`, `"true"` o `1` → verde "Sí"; cualquier otro → rojo "No" |

### Ejemplo

```tsx
<BooleanBadge value={true} />     // → "Sí" (verde)
<BooleanBadge value={false} />    // → "No" (rojo)
<BooleanBadge value={1} />        // → "Sí"
<BooleanBadge value={0} />        // → "No"
<BooleanBadge value="true" />     // → "Sí"
<BooleanBadge value="false" />    // → "No"
```

---

## CardExp

Tarjeta de acceso rápido con color de acento, ícono decorativo de fondo y animaciones de entrada/hover. Navega mediante React Router o redirige externamente. El acento (ícono, título, círculo del ícono) se define con `color`, o con `gradient` si es un hex; sin ninguno cae al verde de marca.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `icon` | `IconType` | — | Ícono principal. Para HugeIcons usar el adaptador `hugeIcon()` (ver abajo) |
| `title` | `string` | — | Título de la tarjeta |
| `description` | `string` | — | Descripción breve |
| `gradient` | `string` | — | Hex (`"#64B32E"`) o clase Tailwind. Si es hex se usa como acento |
| `color` | `string` | — | Hex explícito del acento; tiene prioridad sobre `gradient` |
| `badge` | `string` | `""` | Etiqueta opcional bajo la descripción, con el color de acento |
| `to` | `string` | — | Ruta de destino |
| `external` | `boolean` | `false` | Si `true`, navega con `window.location.href` en lugar de React Router |

### Íconos HugeIcons

`icon` espera el contrato `IconType` de react-icons. Los íconos de `@hugeicons/core-free-icons` se adaptan con `hugeIcon()` de `@/utils/hugeIcon`:

```tsx
import { hugeIcon } from "@/utils/hugeIcon";
import { UserGroupIcon } from "@hugeicons/core-free-icons";

// Defínelo fuera del componente para no crear un ícono nuevo en cada render
const UsersIcon = hugeIcon(UserGroupIcon);
```

### Ejemplo

```tsx
<CardExp
  icon={UsersIcon}
  title="Usuarios"
  description="Gestión de cuentas del sistema"
  gradient="#64B32E"
  color="#64B32E"
  badge="Nuevo"
  to="/admin/usuarios"
/>
```

---

## EmptyState

Estado vacío con ícono centrado y mensaje. Pensado para reemplazar el contenido de una sección cuando no hay datos que mostrar.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `message` | `string` | `"No hay datos disponibles en este momento"` | Texto informativo |
| `icon` | `ReactNode` | `<MdMenuBook />` | Ícono decorativo |

### Ejemplo

```tsx
{data.length === 0 && <EmptyState message="No hay registros." />}
```

---

## NoData

Estado vacío más compacto basado en el `EmptyState` de HeroUI. Diseñado para usar dentro de contenedores relativamente pequeños (tablas, paneles).

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | `"No hay datos disponibles"` | Texto informativo |
| `icon` | `ReactNode` | `<FaCalendar />` | Ícono decorativo |

### Diferencia respecto a EmptyState

`EmptyState` es un bloque grande de página con fondo de tarjeta. `NoData` es más compacto y se coloca dentro de contenedores con `position: relative` y altura fija.

---

## ErrorNotification

Componente de efecto. No renderiza DOM visible; al montarse o cuando cambian sus props, dispara un toast de HeroUI con el tipo de error apropiado.

| Código HTTP | Tipo de toast |
|-------------|---------------|
| 4xx | `warning` |
| 5xx | `danger` |
| otros | `info` |

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `code` | `string` | Código HTTP del error (ej. `"404"`, `"500"`) |
| `message` | `string` | Título corto del error |
| `content` | `string` | Descripción detallada del error |

### Ejemplo

```tsx
{error && (
  <ErrorNotification
    code={error.status}
    message={error.statusText}
    content={error.detail}
  />
)}
```

> Requiere que el proveedor de toasts de HeroUI esté montado en el árbol (`<ToastProvider>`).
