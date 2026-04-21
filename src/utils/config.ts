import siteConfig from '@data/site-config.json';

export function getConfig() {
  return siteConfig;
}

export function getContact() {
  return siteConfig.contact;
}

export function getHours() {
  return siteConfig.hours;
}

export function getPricing() {
  return siteConfig.pricing;
}

export function getStats() {
  return siteConfig.stats;
}

export function getSEO() {
  return siteConfig.seo;
}

export function getBusiness() {
  return siteConfig.business;
}

export function getWhatsAppLink(message?: string) {
  const phone = siteConfig.contact.whatsapp;
  const msg = message || 'Hola, me gustaria pedir cita en AMG Fisioterapia.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export function getPhoneLink() {
  return `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`;
}

export function getEmailLink() {
  return `mailto:${siteConfig.contact.email}`;
}
