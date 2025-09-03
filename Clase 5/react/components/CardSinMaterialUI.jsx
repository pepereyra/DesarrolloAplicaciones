import React from 'react';
import './CardSinMaterialUI.css';

const CardSinMaterialUI = ({ name, username, avatarUrl }) => {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={avatarUrl} alt={name} className="card-image"/>
      </div>
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <p className="card-username">@{username}</p>
        <button className="subscribe-button">Suscribirme</button>
      </div>
    </div>
  );
};

export default CardSinMaterialUI;