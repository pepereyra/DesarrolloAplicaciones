import { useState } from "react"
import FlightBookingCard from "./components/FlightBookingCard"
import "./App.css"

function App() {
  const handleReservar = (data) => {
    console.log("Reserva realizada:", data)
    alert("Reserva confirmada para " + data.nombre + " - " + data.passengerCount + " pasajero(s)")
  }

  const handleCancelar = (data) => {
    console.log("Reserva cancelada:", data)
    alert("Reserva cancelada para " + data.nombre)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Reserva de Vuelos</h1>
        <p>Selecciona tu vuelo y realiza tu reserva</p>
      </header>

      <main className="app-main">
        <div className="cards-container">
          <FlightBookingCard
            nombre="Maria Gonzalez"
            ocupacion="Directora de Marketing"
            edad={35}
            onReservar={handleReservar}
            onCancelar={handleCancelar}
          >
            <div className="flight-info">
              <h4>Buenos Aires - Madrid</h4>
              <p>Fecha: 15 Sep 2025</p>
              <p>Hora: 14:30</p>
              <p>Clase: Ejecutiva</p>
              <p>Precio: $2,450 USD</p>
            </div>
          </FlightBookingCard>

          <FlightBookingCard
            nombre="Carlos Lopez"
            ocupacion="Estudiante"
            edad={22}
            onReservar={handleReservar}
            onCancelar={handleCancelar}
          >
            <div className="flight-info">
              <h4>Cordoba - Barcelona</h4>
              <p>Fecha: 20 Sep 2025</p>
              <p>Hora: 08:15</p>
              <p>Clase: Economica</p>
              <p>Precio: $850 USD</p>
              <div className="benefits">
                <strong>Beneficios Estudiante:</strong>
                <ul>
                  <li>15% descuento</li>
                  <li>Equipaje extra gratis</li>
                </ul>
              </div>
            </div>
          </FlightBookingCard>

          <FlightBookingCard
            nombre="Ana y Roberto Fernandez"
            ocupacion="Familia"
            edad={42}
            onReservar={handleReservar}
            onCancelar={handleCancelar}
          >
            <div className="flight-info">
              <h4>Mendoza - Roma</h4>
              <p>Fecha: 25 Sep 2025</p>
              <p>Hora: 22:45</p>
              <p>Clase: Premium Economy</p>
              <p>Precio: $1,680 USD</p>
              <div className="benefits">
                <strong>Paquete Familiar:</strong>
                <ul>
                  <li>Asientos juntos garantizados</li>
                  <li>Equipaje extra sin costo</li>
                  <li>Entretenimiento para ninos</li>
                  <li>Comidas especiales</li>
                </ul>
              </div>
            </div>
          </FlightBookingCard>
        </div>
      </main>
    </div>
  )
}

export default App
