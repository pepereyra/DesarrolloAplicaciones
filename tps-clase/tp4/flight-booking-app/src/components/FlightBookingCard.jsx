import { useState } from 'react'
import './FlightBookingCard.css'

const FlightBookingCard = ({ 
  nombre, 
  ocupacion, 
  edad,
  origen = "No especificado",
  destino = "No especificado", 
  precio = 0,
  duracion = "No especificado",
  aerolinea = "No especificada",
  onReservar,
  children 
}) => {
  const [isReserved, setIsReserved] = useState(false)
  const [passengerCount, setPassengerCount] = useState(1)

  const datosVuelo = {
    nombre,
    ocupacion,
    edad,
    origen,
    destino,
    precio,
    duracion,
    aerolinea,
    passengerCount
  }

  const handleReservar = () => {
    setIsReserved(true)
    if (onReservar) {
      onReservar(datosVuelo)
    }
  }

  const handleCancelar = () => {
    setIsReserved(false)
  }

  const incrementPassengers = () => {
    if (passengerCount < 9) {
      setPassengerCount(passengerCount + 1)
    }
  }

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      setPassengerCount(passengerCount - 1)
    }
  }

  return (
    <div className={`flight-card ${isReserved ? 'reserved' : ''}`}>
      <div className="flight-card-header">
        <div className="passenger-info">
          <h3 className="passenger-name">{nombre}</h3>
          <p className="passenger-details">
            <span className="occupation">{ocupacion}</span> • <span className="age">{edad} años</span>
          </p>
        </div>
        <div className="flight-status">
          <span className={`status-badge ${isReserved ? 'reserved' : 'available'}`}>
            {isReserved ? 'Reservado' : 'Disponible'}
          </span>
        </div>
      </div>

      <div className="flight-route">
        <h4 className="route">✈️ {origen} → {destino}</h4>
        <div className="flight-info-grid">
          <div className="info-item">
            <span className="label">Duración:</span>
            <span className="value">{duracion}</span>
          </div>
          <div className="info-item">
            <span className="label">Aerolínea:</span>
            <span className="value">{aerolinea}</span>
          </div>
          <div className="info-item">
            <span className="label">Precio:</span>
            <span className="value price">${precio} USD</span>
          </div>
        </div>
      </div>

      <div className="flight-card-content">
        {/* Props children - contenido personalizable */}
        <div className="flight-details">
          {children}
        </div>

        <div className="booking-controls">
          <div className="passenger-selector">
            <label htmlFor="passengers">Pasajeros:</label>
            <div className="counter-controls">
              <button 
                onClick={decrementPassengers} 
                disabled={passengerCount <= 1}
                className="counter-btn"
              >
                -
              </button>
              <span className="passenger-count">{passengerCount}</span>
              <button 
                onClick={incrementPassengers} 
                disabled={passengerCount >= 9}
                className="counter-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            {!isReserved ? (
              <button 
                onClick={handleReservar}
                className="btn btn-primary"
              >
                Reservar Vuelo
              </button>
            ) : (
              <button 
                onClick={handleCancelar}
                className="btn btn-secondary"
              >
                Cancelar Reserva
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flight-card-footer">
        <small className="booking-info">
          {isReserved 
            ? `Reserva confirmada para ${passengerCount} pasajero${passengerCount > 1 ? 's' : ''}`
            : 'Haz clic para reservar tu vuelo'
          }
        </small>
      </div>
    </div>
  )
}

export default FlightBookingCard
