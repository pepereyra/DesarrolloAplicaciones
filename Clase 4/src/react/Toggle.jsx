// Toggle con IoC (estado externo)
// ToggleLogic.jsx
import { useState } from 'react';

function Toggle({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return children({
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  });
}
// El componente ToggleLogic no renderiza nada, solo proporciona lógica.
// El padre (App) controla:
// El estado (isOn).
// La apariencia del botón.
// Los estilos condicionales.
