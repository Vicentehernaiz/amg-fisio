# AMG FISIOTERAPIA - Proyecto Web

## Resumen del Proyecto
Web para AMG Fisioterapia, clinica de fisioterapia premium en Valladolid Centro.
Propietario: Alberto Munoz Gonzalez, fisioterapeuta colegiado.

## Stack Tecnologico
- **Framework**: Astro 5.x (modo hybrid - paginas estaticas + SSR para admin)
- **Adaptador**: @astrojs/node (standalone)
- **Estilos**: CSS custom properties (vanilla CSS, no frameworks)
- **JS**: Vanilla JavaScript (sin frameworks frontend)
- **CMS**: File-based (JSON config + Markdown content collections)
- **SEO**: Schema markup JSON-LD, sitemap automatico, meta tags
- **Icons**: Lucide (via lucide-astro)

## Estructura del Proyecto
```
src/
  assets/          # Imagenes procesadas por Astro
  components/      # Componentes Astro reutilizables
    ui/            # Componentes UI genericos (Button, Card, etc.)
  content/
    blog/          # Posts del blog en Markdown
  data/
    site-config.json  # Configuracion del negocio (horarios, precios, contacto)
  layouts/
    BaseLayout.astro  # Layout base con SEO y estructura HTML
  pages/
    blog/          # Paginas del blog
    full-gas/      # Panel admin (SSR, noindex)
    index.astro    # Landing page principal
  styles/
    global.css     # Design tokens, reset CSS, utilidades
  utils/
    config.ts      # Helpers para leer site-config.json
    seo.ts         # Generadores de schema markup
public/
  fonts/           # Reiswar.ttf, Sora-VariableFont_wght.ttf
  images/          # Logos SVG, imagenes estaticas
```

## Branding
- **Colores**: Verde #77B483 (primario), Morado #504573 (secundario)
- **Tipografia Display**: Reiswar (headings, labels)
- **Tipografia Body**: Sora Variable (cuerpo de texto)
- **Estilo visual**: Premium, minimalista, mucho whitespace, inspirado en ClearPath template

## URLs y SEO
Seguir estrictamente el mapa de URLs del documento SEO v2:
- / (home)
- /servicios-fisioterapia/ (hub)
- /tecnicas-fisioterapia/ (hub)
- /fisioterapia-deportiva-valladolid/ (hub)
- /fisioterapia-domicilio-valladolid/
- /blog/
- Ver documento completo en: seo y business research/AMG_Fisioterapia_Arquitectura_SEO_v2.docx

## Panel Admin
- URL: /full-gas (no indexable)
- Contrasena: pogacar-es-my-dios
- Funcionalidad: editar config del negocio, gestionar blog

## Precios
- Clinica: 35 EUR/sesion
- Domicilio: 45 EUR/sesion
- Bonos: personalizados

## Comandos
```bash
npm install     # Instalar dependencias
npm run dev     # Servidor de desarrollo
npm run build   # Build para produccion
npm run preview # Preview del build
```

## Notas Importantes
- Todas las paginas publicas usan `export const prerender = true` (estaticas)
- Las paginas del admin usan `export const prerender = false` (SSR)
- El sitemap excluye automaticamente /full-gas
- robots.txt bloquea /full-gas
- Las imagenes de tratamientos estan en src/assets/ y public/images/
