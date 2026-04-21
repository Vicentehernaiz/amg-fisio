# Frontend Design Agent State

## Status: COMPLETADO (implementado por coordinador)

## Archivos creados/modificados
- `src/pages/index.astro` — Rediseño completo con 8 secciones + GSAP

## Decisiones de diseño
- GSAP cargado via CDN (gsap.min.js + ScrollTrigger.min.js) en script al final
- Carousel de técnicas: CSS scroll-snap + JS para botones de navegación
- Stats counter: IntersectionObserver + animación manual (más ligero que GSAP counter plugin)
- Hero: fondo con overlay gradient oscuro, headlines con font Reiswar
- Pain points: grid 2x3 en un card glassmorphism encima del hero
- Secciones alternando fondos: blanco, crema (#FDF8F0), verde suave, morado suave
- Fisioterapeuta: layout 60/40 texto/imagen con placeholder frame
- Precio featured card: escala 1.03 + borde verde + badge "Más popular"
- prefers-reduced-motion: respetado con guard al inicio del script GSAP
