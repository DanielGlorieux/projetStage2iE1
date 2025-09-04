import { useState, useEffect } from "react";
import { useMobile } from "./useMobile";

export function useSidebar() {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Fermer automatiquement sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open,
    isMobile,
  };
}
