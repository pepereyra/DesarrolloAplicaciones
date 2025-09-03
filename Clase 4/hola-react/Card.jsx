import React from 'react';
import { useState } from 'react';
import './Card.css'; // Optional: Add styles for the card

const Card = ({ children, userName, onFollow='false', formatUserName }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    }

    const text = isFollowing ? 'Dejar de Seguir' : 'Seguir';
    const buttonStyle= isFollowing ? 'card__button--following' : 'card__button-not-following';

    return (
        <div className="card">
            <img src={`https://unavatar.io/${userName}`} alt={`${children}'s profile`} className="card__image" />
            <div className="card__info">
                <h2 className="card-title">{children}</h2>
                <p className="card__username">{formatUserName(userName)}</p>
                <button className={buttonStyle} onClick={handleFollow}>
                    {text}
                </button>
            </div>
        </div>  
    );
};

export default Card;