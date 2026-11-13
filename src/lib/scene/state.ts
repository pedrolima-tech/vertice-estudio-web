/* ==========================================================================
   SCENE STATE — alvo que as seções animam (via GSAP) e a cena 3D persegue.
   A cena faz interpolação suave a cada quadro, então trocas bruscas aqui
   continuam fluidas na tela.
   ========================================================================== */

export const sceneState = {
  /** 0 nuvem · 1 núcleo · 2 estrutura · 3 construção · 4 lapidado */
  morph: 0,
  /** Posição em fração da viewport (-0.5 … 0.5) */
  x: 0.31,
  y: 0.08,
  /** Escala relativa ao menor lado da viewport */
  scale: 0.9,
  /** 0 = presença total · 1 = recuado/discreto (atrás de conteúdo denso) */
  dim: 0,
  /** Animação de entrada (0 → 1) */
  intro: 0,
};

export type SceneState = typeof sceneState;
