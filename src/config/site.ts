/* ==========================================================================
   SITE CONFIG — dados da agência. Edite aqui; os componentes leem daqui.
   Campos vazios ("") são ocultados automaticamente no site.
   ========================================================================== */

export const site = {
  // Nome provisório — troque quando a marca estiver definida.
  name: "Vértice",
  legalName: "",
  tagline: "Estúdio de desenvolvimento web",
  description:
    "Sites personalizados, landing pages e soluções tecnológicas sob medida. Design exclusivo, código rápido e foco no resultado do seu negócio.",
  url: "https://vertice-estudio-web.netlify.app",
  locale: "pt_BR",

  contact: {
    // Somente números, com DDI + DDD. Ex.: 5511999999999
    whatsapp: "5511940569156",
    email: "",
    city: "",
  },

  social: {
    instagram: "",
    linkedin: "",
    github: "",
    behance: "",
  },

  // Ex.: "00.000.000/0001-00"
  cnpj: "",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
