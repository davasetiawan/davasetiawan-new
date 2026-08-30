"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

const CursorContext = createContext({
  isOverUI: false,
  registerUI: () => {},
  unregisterUI: () => {},
});

export function CursorProvider({ children }) {
  const [isOverUI, setIsOverUI] = useState(false);
  const uiRefs = useRef(new Set());

  const registerUI = (ref) => {
    uiRefs.current.add(ref);
  };

  const unregisterUI = (ref) => {
    uiRefs.current.delete(ref);
  };

  useEffect(() => {
    const onMove = (e) => {
      let overUI = false;
      uiRefs.current.forEach((ref) => {
        if (ref.current && ref.current.contains(e.target)) {
          overUI = true;
        }
      });
      setIsOverUI(overUI);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <CursorContext.Provider value={{ isOverUI, registerUI, unregisterUI }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursorContext() {
  return useContext(CursorContext);
}

export function useUIRef() {
  const { registerUI, unregisterUI } = useCursorContext();
  const ref = useRef(null);

  useEffect(() => {
    registerUI(ref);
    return () => unregisterUI(ref);
  }, [registerUI, unregisterUI]);

  return ref;
}