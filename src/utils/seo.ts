import { getConfig } from './config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

export function generateSEOData(props: SEOProps) {
  const config = getConfig();
  return {
    title: props.title || config.seo.defaultTitle,
    description: props.description || config.seo.defaultDescription,
    image: props.image || config.seo.defaultImage,
    url: props.url || '',
    type: props.type || 'website',
    noindex: props.noindex || false,
  };
}

export function generateLocalBusinessSchema() {
  const config = getConfig();
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness', 'HealthAndBeautyBusiness'],
    '@id': 'https://amgfisio.es/#business',
    name: config.business.name,
    description: config.business.description,
    url: 'https://amgfisio.es',
    telephone: config.contact.phone,
    email: config.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.contact.address.street,
      addressLocality: config.contact.address.city,
      addressRegion: config.contact.address.region,
      postalCode: config.contact.address.postalCode,
      addressCountry: config.contact.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.6528',
      longitude: '-4.7286',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '14:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '16:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    priceRange: '35-45 EUR',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    image: 'https://amgfisio.es/images/og-default.jpg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: config.stats.googleRating,
      bestRating: '5',
      ratingCount: '200',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Valladolid',
      },
      {
        '@type': 'State',
        name: 'Castilla y Leon',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Fisioterapia',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sesion de Fisioterapia en Clinica',
            description: 'Sesion individualizada de 45-60 minutos',
          },
          price: config.pricing.clinica.price,
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fisioterapia a Domicilio',
            description: 'Sesion a domicilio de 45-60 minutos en Valladolid',
          },
          price: config.pricing.domicilio.price,
          priceCurrency: 'EUR',
        },
      ],
    },
    founder: {
      '@type': 'Person',
      name: config.business.owner,
      jobTitle: 'Fisioterapeuta y Director Clinico',
    },
    sameAs: [
      config.social.instagram,
      config.social.googleBusiness,
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://amgfisio.es${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  const config = getConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    description: service.description,
    url: `https://amgfisio.es${service.url}`,
    provider: {
      '@type': 'MedicalBusiness',
      name: config.business.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Valladolid',
        addressRegion: 'Castilla y Leon',
      },
    },
  };
}
