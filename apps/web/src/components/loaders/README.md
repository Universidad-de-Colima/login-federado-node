# components/loaders

Indicadores de carga: uno de pantalla completa y uno compacto para paneles.

---

## LoaderFull

Overlay de carga de pantalla completa (`position: fixed`, `z-[1001]`). Muestra el nombre del proyecto y un spinner.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `name` | `string` | Variable global `PROJ_NAME` o `"Universidad de Colima"` | Nombre del proyecto mostrado bajo el logo |
| `logoSrc` | `string` | — | Ruta o import del logo. Sin prop muestra una "U" verde sobre fondo circular |

### Ejemplo

```tsx
import LoaderFull from '@/components/loaders/Loader';

{isLoading && <LoaderFull />}

// Con logo personalizado
import escudo from '@/assets/escudo.svg';
{isLoading && <LoaderFull logoSrc={escudo} name="SIGA" />}
```

El componente usa `position: fixed` y ocupa toda la pantalla; es suficiente con montarlo condicionalmente sin wrappers adicionales.

---

## LoadingIndicatorMini

Indicador de carga compacto (300 × 300 px) con efecto de vidrio esmerilado. Diseñado para superponerse a un contenedor con `position: relative`.

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `"Cargando contenido"` | Texto bajo el spinner |
| `logoSrc` | `string` | — | URL del logo. Sin prop muestra la "U" institucional |

### Ejemplo

```tsx
import LoadingIndicatorMini from '@/components/loaders/LoadingIndicatorMini';

// El contenedor padre debe tener position: relative y una altura definida
<div className="relative h-48">
  <MyContent />
  {isLoading && <LoadingIndicatorMini label="Actualizando..." />}
</div>
```

También es usado internamente por `MainLayout` cuando `loading={true}`.
