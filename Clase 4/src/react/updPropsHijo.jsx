import React, { useState } from 'react';

// Componente hijo: Botón que notifica al padre que incremente
function BotonIncrementar(props) {
  return (
    <button onClick={props.onIncrementar}>Incrementar desde el hijo</button>
  );
}

// Componente padre: Mantiene el estado del contador y pasa la función al hijo
function ContadorPadre() {
  const [contador, setContador] = useState(0);

  const handleIncrementar = () => {
    setContador(contador + 1);
  };

  return (
    <div>
      <p>Contador en el padre: {contador}</p>
      {/* Pasamos el estado como prop al hijo (si fuera necesario mostrarlo) */}
      {/* Pasamos la función para actualizar el estado como prop */}
      <BotonIncrementar onIncrementar={handleIncrementar} />
    </div>
  );
}

export default ContadorPadre;