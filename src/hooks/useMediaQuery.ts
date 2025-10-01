"use client";

import { useState, useEffect } from "react";

type LegacyMQL = MediaQueryList & {
  addListener?: (cb: (e: MediaQueryListEvent) => void) => void;
  removeListener?: (cb: (e: MediaQueryListEvent) => void) => void;
}

const useMediaQuery = (query: string) => {
  const getInitial = () => 
    typeof window !== "undefined" ? window.matchMedia(query).matches : false

  const [ matches, setMatches ] = useState<boolean>(getInitial);

  useEffect(() => {
    const mql: LegacyMQL = window.matchMedia(query);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    if(typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener?.("change", onChange);
    }

    mql.addListener?.(onChange);
    return () => mql.removeListener?.(onChange);
  }, [query]);

  return matches;
}

export { useMediaQuery };