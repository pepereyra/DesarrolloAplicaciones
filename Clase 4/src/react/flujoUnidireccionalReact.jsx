// El input recibe su valor (value) desde el estado nombre.
// Cuando el usuario escribe en el input html, onChange dispara handleChange, que actualiza el estado con setNombre.
// React re-renderiza el componente con el nuevo valor.

// El flujo es explícito: Estado → Vista (y los cambios en la vista requieren una función).
// No hay sincronización automática como en Angular con ngModules.


import { useState } from 'react';

function App() {
  const [nombre, setNombre] = useState('');

  const handleChange = (e) => {
    setNombre(e.target.value); // Actualización manual del estado
  };

  return (
    <div>
      <input 
        value={nombre} 
        onChange={handleChange} 
        placeholder="Escribe tu nombre" 
      />
      <p>Hola, {nombre}!</p>
    </div>
  );
}