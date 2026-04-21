# Directrices Generales para Agentes - AMG Fisioterapia

## Persistencia y Memoria (OBLIGATORIO)

### Por que es critico
Las sesiones pueden cerrarse inesperadamente o alcanzar el limite de contexto. Cada agente DEBE mantener un archivo de estado para no perder progreso.

### Archivo de Estado por Agente
Cada agente debe crear y mantener un archivo en `docs/agents/state/` con el formato:
```
docs/agents/state/{nombre-agente}-state.md
```

### Estructura del Archivo de Estado
```markdown
# Estado del Agente: {nombre}
Ultima actualizacion: {fecha y hora}

## Trabajo Completado
- [x] Descripcion de tarea completada
- [x] Otra tarea completada

## Trabajo en Progreso
- [ ] Tarea actual - ESTADO: {descripcion de donde se quedo}
- [ ] Archivos modificados: {lista de archivos tocados}

## Proximos Pasos
- [ ] Siguiente tarea pendiente
- [ ] Otra tarea pendiente

## Decisiones Tomadas
- Decision X: se eligio Y porque Z
- Decision A: se descarto B por motivo C

## Problemas Encontrados
- Problema 1: descripcion y solucion aplicada
- Problema 2: pendiente de resolver

## Archivos Clave
- Archivo 1: proposito
- Archivo 2: proposito
```

### Reglas de Persistencia
1. **Actualizar el archivo de estado ANTES de empezar una tarea** (marcarla como "en progreso")
2. **Actualizar el archivo de estado DESPUES de completar una tarea** (marcarla como completada)
3. **Si el agente detecta que ya existe un archivo de estado**, leerlo primero y continuar desde donde se quedo
4. **Cada 3-5 operaciones significativas**, actualizar el archivo de estado
5. **Incluir siempre la lista de archivos modificados** para poder verificar cambios
6. **Documentar decisiones de diseno** para que otro agente o sesion pueda entender el razonamiento

### Al Iniciar una Sesion
```
1. Leer docs/agents/state/{mi-nombre}-state.md
2. Si existe: revisar "Trabajo en Progreso" y continuar
3. Si no existe: crearlo con las tareas asignadas
4. Leer CLAUDE.md para contexto del proyecto
```

## Convenios del Proyecto

### Estructura de Archivos
- Componentes Astro: `src/components/` (PascalCase.astro)
- Paginas: `src/pages/` (lowercase con guiones)
- Estilos: CSS scoped en cada componente, tokens en `src/styles/global.css`
- Utilidades: `src/utils/` (camelCase.ts)
- Datos: `src/data/` (kebab-case.json)
- Blog: `src/content/blog/` (kebab-case.md)

### Convenios de Codigo
- CSS: BEM-like con prefijo del componente (`.header__nav`, `.hero__title`)
- Variables CSS: usar siempre los tokens de `global.css` (nunca hardcodear colores/fuentes)
- Responsive: mobile-first, breakpoints en 640px, 768px, 1024px
- Imagenes: usar loading="lazy" excepto hero, incluir siempre alt text descriptivo
- Links internos: siempre con trailing slash (`/blog/` no `/blog`)

### SEO
- Cada pagina debe tener: title unico, meta description, schema markup
- Seguir el mapa de URLs del documento SEO v2
- Incluir breadcrumbs en todas las paginas internas
- FAQ schema en paginas de servicios y tecnicas

### Accesibilidad
- Todos los links/botones: aria-label si no tienen texto visible
- Colores: ratio de contraste minimo 4.5:1
- Navegacion por teclado funcional
- Formularios: labels asociados

### Branding
- Verde primario: #77B483
- Morado secundario: #504573
- Display font: Reiswar (solo para labels pequenos y headings decorativos)
- Body font: Sora (todo el texto principal)
- Estilo: premium, limpio, whitespace generoso, bordes suaves
