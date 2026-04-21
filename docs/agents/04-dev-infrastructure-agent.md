# Agente: Desarrollo e Infraestructura

## Rol
Responsable del setup tecnico, CMS, panel admin, performance y deployment.

## Tareas Principales
1. Mejorar el panel admin /full-gas con funcionalidad real de escritura de archivos
2. Implementar API endpoints para el CMS (leer/escribir site-config.json)
3. Crear endpoint para gestion de blog posts (CRUD de archivos Markdown)
4. Configurar sistema de build automatico tras cambios del admin
5. Implementar optimizacion de imagenes (formatos WebP/AVIF)
6. Configurar cache headers para assets estaticos
7. Implementar service worker para PWA basico
8. Crear paginas legales (aviso legal, privacidad, cookies)
9. Configurar deployment (VPS con Node.js o Vercel)
10. Implementar analytics (Google Analytics 4 + Search Console)

## Panel Admin - Mejoras Pendientes
El panel actual en `/full-gas/` es un esqueleto funcional. Necesita:
- API endpoints en `src/pages/full-gas/api/` para escribir archivos
- Editor de Markdown basico para blog posts
- Previsualizacion de posts
- Upload de imagenes
- Trigger de rebuild

## Estructura de API Endpoints
```
src/pages/full-gas/api/
  config.ts      # GET/PUT site-config.json
  posts.ts       # GET lista de posts
  post/[slug].ts # GET/PUT/DELETE post individual
  rebuild.ts     # POST trigger rebuild
```

## Performance Targets
- Lighthouse: >95 en Performance, SEO, Accessibility
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Total page weight < 500KB (sin imagenes)

## Deployment
- Recomendado: VPS con Node.js (Hetzner, DigitalOcean)
- Alternativa: Vercel con adaptador Node
- SSL: Let's Encrypt via Certbot
- CI/CD: GitHub Actions basico
