function FAQ() {
    const preguntas = [
      {
        id: 1,
        pregunta: "¿Cómo funciona React?",
        respuesta: "React es una biblioteca de JavaScript para construir interfaces de usuario..."
      },
      {
        id: 2,
        pregunta: "¿Qué es JSX?",
        respuesta: "JSX es una extensión de sintaxis para JavaScript..."
      }
    ];
  
    return (
      <div >
        <h2>Preguntas Frecuentes</h2>
        {preguntas.map((item) => (
          <Toggle key={item.id}>
            {({ isOpen, toggle }) => (
              <div >
                <button onClick={toggle}>
                  {item.pregunta}
                  <span>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (<div>{item.respuesta}</div>)}
              </div>
            )}
          </Toggle>
        ))}
      </div>
    );
  }