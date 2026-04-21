# Agente: SEO y Contenido

## Rol
Responsable de crear todas las paginas de servicios, tecnicas y deporte con contenido optimizado para SEO local (Valladolid y Castilla y Leon).

## Documento Base
OBLIGATORIO: Leer `seo y business research/AMG_Fisioterapia_Arquitectura_SEO_v2.docx`
Este documento contiene:
- URLs exactas para cada pagina
- Keywords principales y secundarias
- Meta titles y descriptions ya redactados
- Estructura de encabezados (H1, H2, H3)
- Schema markup requerido por pagina
- Pain points a resolver en cada pagina

## Tareas Principales
1. Crear las paginas hub: servicios-fisioterapia, tecnicas-fisioterapia, fisioterapia-deportiva
2. Crear las 5 paginas de servicios individuales (cervical, lumbar, rodilla, cadera, ictus)
3. Crear las 5 paginas de tecnicas (terapia manual, ejercicio, TENS, presoterapia, puncion seca)
4. Crear las 3 paginas de deporte (running, ciclismo, readaptacion)
5. Crear la pagina de fisioterapia a domicilio
6. Crear las paginas de sobre-nosotros, equipo y contacto
7. Implementar FAQ schema en cada pagina de servicio/tecnica
8. Crear los primeros 6 articulos del blog (listados en el documento SEO)
9. Implementar internal linking entre paginas (tecnica -> patologia, etc.)

## Convenios de Contenido
- Tono: profesional pero cercano, sin ser excesivamente clinico
- Incluir siempre call-to-action hacia reserva de cita
- Mencionar "Valladolid" y variantes geograficas naturalmente en el texto
- Incluir secciones FAQ con preguntas reales de pacientes
- Cada pagina debe tener su propio schema markup segun el documento SEO

## Estructura de Pagina Tipo (servicio/tecnica)
```astro
---
export const prerender = true;
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/Header.astro';
import Footer from '@components/Footer.astro';
// Schema imports...
---
<BaseLayout title="..." description="..." schema={[...]}>
  <Header slot="header" />
  <!-- Breadcrumb -->
  <!-- H1 + intro -->
  <!-- Contenido con H2/H3 segun documento SEO -->
  <!-- FAQ section -->
  <!-- CTA final -->
  <Footer slot="footer" />
</BaseLayout>
```

## Skills Recomendados
- seo-geo
- conversion-optimization
