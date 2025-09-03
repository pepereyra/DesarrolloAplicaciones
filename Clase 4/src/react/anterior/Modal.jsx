function Modal() {
    return (
      <Toggle>
        {({ isOpen, open, close }) => (
          <div>
            <button onClick={open}>Abrir Modal</button>
            
            {isOpen && (
              <div>
                <div>
                  <h2>Título del Modal</h2>
                  <p>Contenido del modal aquí...</p>
                  <button onClick={close}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Toggle>
    );
  }