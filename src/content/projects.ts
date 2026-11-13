/* ==========================================================================
   PROJECTS — cada item vira um case na seção Projetos.
   Para adicionar um case: copie o objeto, troque os dados e coloque as
   imagens em /public/projects. Use apenas informações reais.
   ========================================================================== */

export type Project = {
  slug: string;
  client: string;
  type: string;
  segment: string;
  location?: string;
  year?: string;
  summary: string;
  delivered: string[];
  image: { src: string; alt: string; width: number; height: number };
  url?: string;
  accent: string; // cor do brilho do card (CSS)
};

export const projects: Project[] = [
  {
    slug: "fcar-garage",
    client: "Fcar Garage",
    type: "Landing page",
    segment: "Estética automotiva",
    location: "Santo André · SP",
    summary:
      "Landing page escura e premium para uma estética automotiva, com foco em levar o visitante a pedir orçamento pelo WhatsApp.",
    delivered: [
      "Orçamento interativo que monta a mensagem no WhatsApp",
      "Galeria com ampliação de fotos",
      "Avaliações do Google e perguntas frequentes",
      "Selo de horário de funcionamento em tempo real",
    ],
    image: {
      src: "/projects/fcar-desktop.webp",
      alt: "Primeira dobra do site da Fcar Garage: título 'Seu carro impecável em cada detalhe' ao lado da foto de um Porsche preto",
      width: 1440,
      height: 900,
    },
    accent: "oklch(0.62 0.22 25)",
  },
];
