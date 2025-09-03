import React, { useState } from 'react';
import './OnOff.css';

function OnOff() {
  const [isOn, setIsOn] = useState(true);

  const handleClick = () => {
    setIsOn(!isOn);
  };

  return (
    <button
      id="btn"
      className={isOn ? 'on' : 'off'}
      onClick={handleClick}
    >
      {isOn ? 'Encendido' : 'Apagado'}
    </button>
  );
}

export default OnOff;