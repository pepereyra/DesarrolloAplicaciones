// Toggle sin IoC (estado interno)
// No se puede personalizar el comportamiento desde fuera.
// Difícil reutilizar en otros contextos.

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? 'Apagar' : 'Encender'}
      </button>
      {isOn && <p>¡Estoy encendido! 🔆</p>}
    </div>
  );
}

