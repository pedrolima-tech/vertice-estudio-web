/* Seção Diferenciais (grade bento) — "visual" escolhe a microanimação; "span" o tamanho do card */

export type Benefit = {
  title: string;
  text: string;
  visual: "custom" | "identity" | "ux" | "responsive" | "performance" | "goals";
  span?: "wide" | "tall";
};

export const benefits: Benefit[] = [
  {
    title: "Desenvolvimento personalizado",
    text: "Código escrito para o seu projeto, sem amarras de templates ou construtores.",
    visual: "custom",
    span: "wide",
  },
  {
    title: "Identidade visual exclusiva",
    text: "Cores, tipografia e movimento que traduzem a personalidade da sua marca.",
    visual: "identity",
  },
  {
    title: "Responsivo de verdade",
    text: "Pensado para o celular, o tablet e o desktop, não apenas encolhido.",
    visual: "responsive",
    span: "tall",
  },
  {
    title: "Foco na experiência",
    text: "Navegação clara e caminhos curtos até o que o visitante procura.",
    visual: "ux",
  },
  {
    title: "Performance",
    text: "Páginas leves e otimizadas. O número acima é o tempo real que esta página levou para carregar no seu aparelho.",
    visual: "performance",
  },
  {
    title: "Alinhado aos seus objetivos",
    text: "Cada decisão é tomada olhando para a meta do negócio: vender, captar, informar ou automatizar.",
    visual: "goals",
    span: "wide",
  },
];
