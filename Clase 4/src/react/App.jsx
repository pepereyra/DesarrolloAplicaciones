// App.jsx
// App.jsx
import { useToggleLogic } from './Toggle';

function App() {
    // Consumimos la lógica desde ToggleLogic
    const { isOn, toggle, setOn, setOff } = useToggleLogic();

    // Vista completamente controlada por el padre
    return (
        <div >
            <h1 >
                Estado: {isOn ? 'ENCENDIDO' : 'APAGADO'}
            </h1>

            <div >
                <button onClick={toggle}>
                    {isOn ? 'Apagar' : 'Encender'}
                </button>

                <button onClick={setOn} disabled={isOn}>
                    Forzar ON
                </button>

                <button onClick={setOff} disabled={!isOn}>
                    Forzar OFF
                </button>
            </div>

            <div/>
        </div>
    );
}

