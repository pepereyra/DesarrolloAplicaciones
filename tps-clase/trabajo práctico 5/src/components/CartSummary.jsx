import { useCart } from '../contexts/CartContext';
import './CartSummary.css';

const CartSummary = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  // Si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="cart-summary">
        <h3>Carrito de Compras</h3>
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <p>¡Agrega algunos productos para comenzar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-header">
        <h3>Carrito de Compras</h3>
        <span className="cart-count">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img 
                src={item.image} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/60x60?text=Producto';
                }}
              />
            </div>
            
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-price">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="item-quantity">
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
              title="Eliminar del carrito"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
        </div>
        
        <div className="cart-actions">
          <button 
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Vaciar Carrito
          </button>
          <button className="checkout-btn">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
