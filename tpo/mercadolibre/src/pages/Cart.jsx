import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

function Cart() {
  const { state, dispatch } = useApp();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id, quantity: newQuantity } 
      });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const freeShippingItems = state.cart.filter(item => item.free_shipping);
  const paidShippingItems = state.cart.filter(item => !item.free_shipping);
  const shippingCost = paidShippingItems.length > 0 ? 2500 : 0;
  const total = subtotal + shippingCost;

  if (state.cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agregá productos para comenzar a comprar!</p>
            <Link to="/" className="continue-shopping">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Carrito ({state.cart.length} {state.cart.length === 1 ? 'producto' : 'productos'})</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Vaciar carrito
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {/* Productos con envío gratis */}
            {freeShippingItems.length > 0 && (
              <div className="shipping-group">
                <div className="shipping-header free-shipping-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 3h5v5M4 20L20 4m0 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Envío gratis</span>
                </div>
                {freeShippingItems.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {/* Productos con envío pago */}
            {paidShippingItems.length > 0 && (
              <div className="shipping-group">
                <div className="shipping-header paid-shipping-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Envío a acordar con el vendedor</span>
                </div>
                {paidShippingItems.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resumen de compra */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen de compra</h3>
              
              <div className="summary-line">
                <span>Productos ({state.cart.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {shippingCost > 0 && (
                <div className="summary-line">
                  <span>Envío</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
              )}
              
              <div className="summary-line total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <button className="checkout-btn">
                Continuar compra
              </button>
              
              <div className="payment-methods">
                <p>Podés pagar con:</p>
                <div className="payment-icons">
                  <span className="payment-method">💳 Tarjetas</span>
                  <span className="payment-method">💰 Efectivo</span>
                  <span className="payment-method">📱 Mercado Pago</span>
                </div>
              </div>
            </div>

            {/* Calculadora de cuotas */}
            <div className="installments-calculator">
              <h4>Calculá el costo de financiación</h4>
              <select className="installments-select">
                <option>3 cuotas sin interés de {formatPrice(total / 3)}</option>
                <option>6 cuotas sin interés de {formatPrice(total / 6)}</option>
                <option>12 cuotas de {formatPrice(total * 1.2 / 12)}</option>
                <option>18 cuotas de {formatPrice(total * 1.4 / 18)}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="continue-shopping-link">
          <Link to="/">← Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove, formatPrice }) {
  return (
    <div className="cart-item">
      <div className="item-image">
        <Link to={`/product/${item.id}`}>
          <img src={item.thumbnail} alt={item.title} />
        </Link>
      </div>
      
      <div className="item-details">
        <Link to={`/product/${item.id}`} className="item-title">
          {item.title}
        </Link>
        
        <div className="item-features">
          {item.condition === 'new' && <span className="feature">Nuevo</span>}
          {item.free_shipping && <span className="feature">Envío gratis</span>}
        </div>
        
        <div className="seller-info">
          <span>Vendido por {item.seller.nickname}</span>
          {item.seller.reputation === 'gold' && <span className="reputation gold">⭐</span>}
        </div>
      </div>
      
      <div className="item-quantity">
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="quantity-btn"
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="quantity">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="quantity-btn"
        >
          +
        </button>
      </div>
      
      <div className="item-price">
        <span className="unit-price">{formatPrice(item.price)}</span>
        {item.quantity > 1 && (
          <span className="total-price">
            Total: {formatPrice(item.price * item.quantity)}
          </span>
        )}
      </div>
      
      <button 
        onClick={() => onRemove(item.id)}
        className="remove-btn"
        title="Eliminar producto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default Cart;
