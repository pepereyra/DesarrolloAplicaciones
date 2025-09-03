import React from 'react';
import { useState } from 'react';
import './Card.css'; // Optional: Add styles for the card

const Card = ({ children, userName='', formatUserName}) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleClick = () => {
        setIsFollowing(!isFollowing);
    }

    const text = isFollowing ? 'Siguiendo' : 'Seguir';
    const buttonClassName = isFollowing ? 'card-button-following' : 'card-button-not-following';

    return (
        <div className="card">
            <img src={`https://unavatar.io/${userName}`} alt={children} className="card-image" />
            <div className="card-content">
                <strong className="card-name">{children}</strong>
                <p className="card-usernamesername">{formatUserName(userName)}</p>
                <button className={buttonClassName} onClick={handleClick}>{text}</button>
            </div>
        </div>
    );

};

export default Card;