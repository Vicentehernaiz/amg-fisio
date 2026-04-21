# Infrastructure Agent State

**Fecha:** 2026-04-20
**Agente:** 04-dev-infrastructure-agent
**Estado:** COMPLETADO

---

## Archivos Creados

### API Endpoints (Admin)
- `src/pages/full-gas/api/config.ts` — GET/POST para leer y actualizar site-config.json. Auth via cookie `amg-admin-auth`.
- `src/pages/full-gas/api/posts.ts` — GET (listar posts) / POST (crear post). Lee directorio `src/content/blog/`.
- `src/pages/full-gas/api/post/[slug].ts` — GET/PUT/DELETE para un post individual por slug.

### Panel Admin
- `src/pages/full-gas/index.astro` — REESCRITO. Incluye:
  - Dashboard con 3 cards (posts publicados, ultima actualizacion, estado online)
  - Formulario de configuracion del negocio con POST a /full-gas/api/config
  - Feedback visual (spinner + "Guardado" / "Error") en formularios
  - Lista de blog posts cargada via fetch a /full-gas/api/posts
  - Editor de posts (crear/editar) con toggle mostrar/ocultar
  - Borrado de posts con confirm dialog

### Paginas Legales
- `src/pages/aviso-legal.astro` — Aviso legal LSSICE. `prerender = true`.
- `src/pages/politica-privacidad.astro` — Politica RGPD + LOPD-GDD. `prerender = true`.
- `src/pages/politica-cookies.astro` — Politica cookies con tabla. `prerender = true`.

### Componentes
- `src/components/ui/LazyImage.astro` — Componente con lazy loading y aspect ratio configurable.
- `src/components/Analytics.astro` — Google Analytics 4 con anonymize_ip, solo en produccion. Auto-track WhatsApp y telefono clicks.

### PWA
- `public/manifest.json` — Web App Manifest con colores de marca (#77B483).
- `public/sw.js` — Service Worker con cache de assets estaticos (fuentes, logos, homepage).

### Configuracion
- `.env.example` — Actualizado con variable `PUBLIC_GA_ID`.

---

## Archivos Modificados

- `src/layouts/BaseLayout.astro` — Anadido:
  - Import de `Analytics.astro`
  - `<Analytics />` en el head
  - `<link rel="manifest" href="/manifest.json" />`
  - `<meta name="theme-color" content="#77B483" />`
  - `<link rel="preconnect" href="https://maps.googleapis.com" />`
  - Script de registro del Service Worker antes de `</body>`

- `astro.config.mjs` — Cambiado `output: 'static'` a `output: 'hybrid'` para soportar endpoints SSR + paginas estaticas. Anadido `compressHTML: true`.

---

## Notas Tecnicas

- Cookie de autenticacion del admin: `amg-admin-auth` (con guion, no subrayado). Los API endpoints verifican esta cookie.
- Las paginas legales usan `BaseLayout`, `Header` y `Footer` existentes.
- El Service Worker cachea: `/`, fuentes TTF, y logos SVG.
- Analytics solo se inyecta en produccion (`import.meta.env.PROD`).
- `output: 'hybrid'` permite que las paginas publicas con `export const prerender = true` sean estaticas y las del admin con `export const prerender = false` sean SSR.

---

## URLs nuevas disponibles

- `/aviso-legal/`
- `/politica-privacidad/`
- `/politica-cookies/`
- `/full-gas/api/config` (GET, POST)
- `/full-gas/api/posts` (GET, POST)
- `/full-gas/api/post/[slug]` (GET, PUT, DELETE)
