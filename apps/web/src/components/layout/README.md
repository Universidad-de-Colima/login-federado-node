# Layout Components Refactoring

Esta refactorización aplica el principio DRY (Don't Repeat Yourself) y mejora significativamente el diseño del layout principal de la aplicación.

## 📁 Nueva Estructura

### Types (`/types/layout.types.ts`)

- **ColorScheme**: Tipos de esquemas de colores predefinidos
- **NavButtonProps**: Propiedades para botones de navegación
- **COLOR_SCHEMES**: Configuración de colores centralizada
- **INTERACTION_CLASSES**: Clases de interacción reutilizables

### Custom Hooks

#### `useEnvironment.tsx`

Hook para detectar y configurar el entorno de ejecución:

- Detecta automáticamente si estamos en producción, pruebas o desarrollo
- Proporciona configuración del banner de entorno
- Iconos y colores específicos para cada entorno

#### `useUserNavigation.tsx`

Hook para manejar la lógica de navegación y roles:

- Procesa información del usuario (inicial, rol, permisos)
- Genera automáticamente botones de navegación según el rol
- Centraliza todas las funciones de navegación

### Components (`/components/layout/`)

#### `NavButton.tsx`

Botón de navegación mejorado:

- Esquemas de colores predefinidos (`primary`, `admin`, `attendance`, `danger`, `success`)
- Modo responsive (texto completo en desktop, solo icono en mobile)
- Efectos de hover, focus y animaciones consistentes
- Accesibilidad mejorada con ARIA labels

#### `EnvironmentBanner.tsx`

Banner informativo de entorno:

- Se muestra solo en desarrollo/pruebas
- Textos adaptativos según el tamaño de pantalla
- Iconos distintivos para cada entorno

#### `UserInfo.tsx`

Información del usuario:

- Información completa en desktop
- Avatar circular en mobile
- Diseño responsive y consistente

#### `DependencyBadge.tsx`

Badge para mostrar la dependencia organizacional:

- Se muestra solo cuando hay dependencia activa
- Diseño consistente con el tema visual

#### `RoleTitle.tsx`

Título que muestra el rol del usuario:

- Maneja múltiples roles (Administrador | Capturista)
- Colores diferenciados por rol
- Se oculta cuando no hay roles especiales

## 🎨 Mejoras de Diseño

### Sistema de Colores Unificado

```typescript
const COLOR_SCHEMES = {
  primary: { base: 'tw-bg-apple_green-500', hover: 'hover:tw-bg-apple_green-600', ... },
  admin: { base: 'tw-bg-indigo-600', hover: 'hover:tw-bg-indigo-700', ... },
  // ...
}
```

### Efectos de Interacción Consistentes

- Hover con scale y shadow
- Focus visible con rings de color
- Transiciones suaves
- Animaciones consistentes

### Responsive Design Mejorado

- Información adaptativa según el dispositivo
- Botones icon-only en mobile cuando es apropiado
- Textos cortos en pantallas pequeñas

## 🔄 Beneficios de la Refactorización

### DRY (Don't Repeat Yourself)

- ✅ Esquemas de colores centralizados
- ✅ Lógica de navegación unificada  
- ✅ Componentes reutilizables
- ✅ Hooks personalizados para lógica común

### Mantenibilidad

- ✅ Separación clara de responsabilidades
- ✅ Código modular y testeable
- ✅ Fácil extensión para nuevos roles/permisos
- ✅ Configuración centralizada

### Experiencia de Usuario

- ✅ Diseño visual más consistente
- ✅ Mejor responsive design
- ✅ Animaciones y transiciones suaves
- ✅ Mejor accesibilidad (ARIA, focus, keyboard navigation)

### Performance

- ✅ Menos re-renders innecesarios
- ✅ Memoización de configuraciones
- ✅ Componentes más ligeros

## 📱 Adaptabilidad

El nuevo sistema es completamente extensible:

### Agregar un nuevo esquema de color

```typescript
// En layout.types.ts
export const COLOR_SCHEMES = {
  // ...esquemas existentes
  warning: {
    base: 'tw-bg-yellow-500',
    hover: 'hover:tw-bg-yellow-600',
    focus: 'focus-visible:tw-ring-yellow-400',
    text: 'tw-text-white'
  }
};
```

### Agregar un nuevo botón de navegación

```typescript
// En useUserNavigation.tsx
buttons.push({
  icon: () => <NewIcon />,
  label: "Nueva Función",
  onClick: handleNewFunction,
  colorScheme: 'warning'
});
```

La refactorización mantiene toda la funcionalidad original mientras proporciona una base sólida para futuras mejoras y extensiones.