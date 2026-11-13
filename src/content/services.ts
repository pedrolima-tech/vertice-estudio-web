/* Seção Serviços — o 3º item aparece como faixa "Quando o site não basta" */

export type Service = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  items: string[];
  visual: "site" | "landing" | "system";
};

export const services: Service[] = [
  {
    id: "sites",
    index: "01",
    title: "Sites personalizados",
    kicker: "Institucionais, comerciais e portfólios",
    description:
      "Um site desenhado a partir da sua marca, do seu público e do que você quer que ele faça pelo negócio. Nada de tema pronto adaptado.",
    items: [
      "Identidade visual própria",
      "Responsivo em qualquer tela",
      "SEO técnico desde a base",
      "Rápido, acessível e seguro",
    ],
    visual: "site",
  },
  {
    id: "landing",
    index: "02",
    title: "Landing pages",
    kicker: "Campanhas, lançamentos e captação",
    description:
      "Páginas com um objetivo claro: transformar visitantes em contatos e clientes. Estrutura, texto e design pensados para conversão.",
    items: [
      "Narrativa orientada à conversão",
      "Formulários e integração com WhatsApp",
      "Pronta para tráfego pago e análise",
      "Carregamento rápido no celular",
    ],
    visual: "landing",
  },
  {
    id: "sistemas",
    index: "03",
    title: "Soluções tecnológicas",
    kicker: "Quando o site não basta",
    description:
      "Sistemas web, ferramentas internas, automações e integrações sob medida para resolver problemas reais da sua operação.",
    items: [
      "Automação de processos",
      "Painéis e organização de informações",
      "Aplicações web sob medida",
      "Integrações entre ferramentas",
    ],
    visual: "system",
  },
];
