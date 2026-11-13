import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect no navegador (roda antes da pintura, evita “piscar” em
 * animações de entrada) e useEffect no servidor, onde layout não existe.
 */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
