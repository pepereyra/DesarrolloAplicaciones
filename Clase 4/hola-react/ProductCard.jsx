import React from 'react';
import './ProductCard.css';

const ProductCard = () => {
  return (
    <div className="product-card">
      <div className="recent-badge">Visto recientemente</div>
      <div className="product-image-container">
        <img 
          src="https://http2.mlstatic.com/D_NQ_NP_751447-MLA76205335677_052024-O.webp" 
          alt="Guantes Mujer Mitones" 
          className="product-image"
        />
      </div>
      <h3 className="product-title">Guantes Mujer Mitones Dedos Lana Largos...</h3>
      <div className="product-price">$ 12.890</div>
    </div>
  );
};

export default ProductCard;