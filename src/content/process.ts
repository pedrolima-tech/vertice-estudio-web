/* Seção Processo — cada etapa ocupa uma “tela” da rolagem fixada */

export type Step = {
  index: string;
  title: string;
  verb: string;
  description: string;
};

export const steps: Step[] = [
  {
    index: "01",
    verb: "Entender",
    title: "Começamos pelo seu negócio",
    description:
      "Antes de qualquer tela, conversamos sobre o que você faz, quem é o seu cliente e o que precisa mudar.",
  },
  {
    index: "02",
    verb: "Identificar",
    title: "Objetivos, desafios e oportunidades",
    description:
      "Mapeamos o que o projeto precisa alcançar, o que pode atrapalhar e onde estão as chances de se destacar.",
  },
  {
    index: "03",
    verb: "Planejar",
    title: "Uma solução desenhada para você",
    description:
      "Definimos estrutura, conteúdo, direção visual e tecnologia. Você aprova o plano antes do desenvolvimento.",
  },
  {
    index: "04",
    verb: "Desenvolver",
    title: "Design e código com atenção",
    description:
      "Construímos cada detalhe com foco em desempenho, usabilidade e acabamento, e você acompanha a evolução.",
  },
  {
    index: "05",
    verb: "Entregar",
    title: "Pronto para gerar valor",
    description:
      "Testamos em diferentes dispositivos, publicamos e entregamos uma solução profissional, pronta para trabalhar pelo seu negócio.",
  },
];
