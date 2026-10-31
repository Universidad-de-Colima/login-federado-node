# components/errors

Páginas y componentes de error.

---

## CustomError

Pantalla de error de pantalla completa con animaciones. Muestra un código de estado grande, título, subtítulo y botones de navegación.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `status` | `string` | `"404"` | Código de estado HTTP mostrado en grande |
| `title` | `string` | `"Lo sentimos, ocurrió un error"` | Título principal |
| `subtitle` | `string` | `"Página no encontrada"` | Subtítulo descriptivo |
| `message` | `string` | `""` | Si se provee, muestra una fila con "Código: X / Motivo: Y" |
| `redirectTo` | `string` | — | Ruta al hacer clic en "Regresar". Sin prop navega a `-1` (historial) |
| `showHomeButton` | `boolean` | `true` | Muestra o no el botón "Ir al inicio" |

### Ejemplo

```tsx
// En un error boundary o loader de React Router
import { CustomError } from '@/components/errors/CustomError';

<CustomError
  status="403"
  title="Acceso denegado"
  subtitle="No tienes permisos para ver esta sección."
  redirectTo="/dashboard"
/>
```

> También se puede usar como overlay con `z-50` y fondo semitransparente para demos o confirmaciones. Ver `ComponentsDemo.tsx`.

---

## NotFound

errorElement principal de la app. Mapea el status del error de la ruta a una ilustración (`assets/errors/`), un código, un título y acciones (volver, ir a inicio, recargar o iniciar sesión).

- Sin error real (ruta catch-all `*`) → 404.
- Error sin `status` (fallo de render/JS) → 500.
- Fallo al cargar un módulo con `import()` dinámico → "MOD-ERR" con botón de recargar.
- 401 muestra "Iniciar sesión" (login SAML); 401/403 muestran "Ir a inicio" (`BASE_PATH`).
- En desarrollo muestra el mensaje real del error.
- Con error real renderiza su propio `RootLayout`, porque el `errorElement` reemplaza al layout de la ruta.

```tsx
import NotFound from '@/components/errors/NotFound';

{ path: '*', element: <NotFound /> }
{ path: '/', element: <RootLayout />, errorElement: <NotFound /> }
```

No acepta props.

---

## errorMap

`errorMap.ts` exporta `errorMap` (status → `ErrorInfo`: `code`, `type`, `title`, `description`, `image`, `accent`, `showHome`) y `defaultError`. El status `-1` es el fallo de carga de módulo. Para soportar un nuevo status, agrega su ilustración en `assets/errors/` y una entrada aquí.

---

## ErrorState

Estado de error/vacío genérico (sin acceso, listas sin datos) con ícono, título, descripción y un slot de acción. Pensado para usarse dentro de una página, no de pantalla completa.

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | — | Título |
| `description` | `string` | — | Texto de apoyo |
| `icon` | `ReactNode` | `<MdErrorOutline />` | Ícono grande |
| `action` | `ReactNode` | — | Botón o enlace de acción |

```tsx
<ErrorState
  title="Sin acceso"
  description="No tienes permisos para acceder a esta sección."
  action={<Button onPress={goHome}>Volver</Button>}
/>
```

---

## ErrorBoundary

errorElement ligero basado en `CustomError`: redirige al login si el error es "No hay token", y muestra "No autorizado" o "Algo salió mal" en otros casos. Para el árbol principal de rutas usa `NotFound`.

---

## Ilustraciones

`src/assets/errors/`: `400`, `401`, `403`, `404`, `500`, `501`, `502`, `503`, `504`, `sin-conexion`, `sin-informacion` y `mantenimiento` (`.svg`). Idénticos a los de seguimiento-deportes y eventosucol. La sección "Errores" de `/components` los muestra todos.
