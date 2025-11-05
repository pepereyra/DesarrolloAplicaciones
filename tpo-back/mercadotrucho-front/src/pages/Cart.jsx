
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './Cart.css';
import { useState, useMemo } from 'react';

function Cart() {

  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    formatPrice 
  } = useCart();

  // Handlers async para operaciones del carrito
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setSelected({}); // Limpiar selección también
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  // Estado de selección
  const [selected, setSelected] = useState(() => {
    // Por defecto, todos seleccionados
    const sel = {};
    cart.forEach(item => {
      sel[item.id] = true;
    });
    return sel;
  });

  // Si cambia el carrito (agrega/quita productos), sincronizar selección
  // (agrega los nuevos como seleccionados, mantiene los existentes)
  useMemo(() => {
    setSelected(prev => {
      const next = { ...prev };
      cart.forEach(item => {
        if (!(item.id in next)) next[item.id] = true;
      });
      // Elimina ids que ya no existen
      Object.keys(next).forEach(id => {
        if (!cart.find(item => String(item.id) === id)) delete next[id];
      });
      return next;
    });
    // eslint-disable-next-line
  }, [cart]);

  // Agrupar productos por vendedor

  if (cart.length === 0) {
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

  // Agrupar productos por vendedor
  function groupBySeller(cart) {
    return cart.reduce((groups, item) => {
      const seller = item.seller?.nickname || 'Otro vendedor';
      if (!groups[seller]) {
        groups[seller] = [];
      }
      groups[seller].push(item);
      return groups;
    }, {});
  }
  const grouped = groupBySeller(cart);
  const sellers = Object.keys(grouped);

  // Productos seleccionados
  const selectedProducts = cart.filter(item => selected[item.id]);

  // Resumen de compra solo con seleccionados
  const subtotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Shipping: sumar solo si hay productos seleccionados de ese vendedor
  const getShippingCost = () => {
    let total = 0;
    sellers.forEach(seller => {
      const sellerItems = grouped[seller].filter(item => selected[item.id]);
      if (sellerItems.length > 0) {
        // Simulación: si algún producto tiene free_shipping, es gratis
        total += sellerItems.some(item => item.free_shipping) ? 0 : 4610.99;
      }
    });
    return total;
  };
  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-content">
          {/* Título del carrito eliminado para evitar columna extra innecesaria */}
          <div className="cart-items">
            {/* Productos agrupados por vendedor */}
            {sellers.map(seller => {
              const freeShippingThreshold = 20000;
              const sellerItems = grouped[seller];
              const sellerSelected = sellerItems.every(item => selected[item.id]);
              const someSelected = sellerItems.some(item => selected[item.id]);
              const sellerSubtotal = sellerItems.filter(item => selected[item.id]).reduce((sum, item) => sum + item.price * item.quantity, 0);
              const shippingCost = sellerItems.filter(item => selected[item.id]).some(item => item.free_shipping) ? 0 : 4610.99;
              const amountToFreeShipping = Math.max(0, freeShippingThreshold - sellerSubtotal);
              const shippingProgress = Math.min(100, (sellerSubtotal / freeShippingThreshold) * 100);
              // Handler para check vendedor
              const handleSellerCheck = e => {
                const checked = e.target.checked;
                setSelected(prev => {
                  const next = { ...prev };
                  sellerItems.forEach(item => {
                    next[item.id] = checked;
                  });
                  return next;
                });
              };
              return (
                <div key={seller} className="cart-seller-card">
                  <div className="cart-seller-header-row">
                    <input
                      type="checkbox"
                      checked={sellerSelected}
                      indeterminate={someSelected && !sellerSelected ? 'true' : undefined}
                      onChange={handleSellerCheck}
                      className="cart-seller-checkbox"
                    />
                    <span className="cart-seller-title">Productos de <b>{seller}</b></span>
                    <span className="cart-seller-arrow">&gt;</span>
                  </div>
                  <div className="cart-seller-products">
                    {sellerItems.map(item => (
                      <div key={item.id} className="cart-seller-product-row">
                        <input
                          type="checkbox"
                          checked={!!selected[item.id]}
                          onChange={e => {
                            const checked = e.target.checked;
                            setSelected(prev => ({ ...prev, [item.id]: checked }));
                          }}
                          className="cart-product-checkbox"
                        />
                        <CartItem
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={handleRemoveFromCart}
                          formatPrice={formatPrice}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="cart-seller-shipping">
                    <div className="shipping-label-row">
                      <span>Envío</span>
                      <span className="shipping-cost">{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="shipping-progress-bar">
                      <div className="shipping-progress" style={{width: `${shippingProgress}%`}}></div>
                    </div>
                    {amountToFreeShipping > 0 ? (
                      <div className="shipping-threshold-msg">
                        Agregá {formatPrice(amountToFreeShipping)} para tener envío gratis en productos de <b>{seller}</b>.
                        <a href="#" className="shipping-see-products">Ver productos &gt;</a>
                      </div>
                    ) : (
                      <div className="shipping-threshold-msg free">¡Ya tenés envío gratis en productos de <b>{seller}</b>!</div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Botón para vaciar carrito debajo de los productos */}
            <button onClick={handleClearCart} className="clear-cart-btn below-list">
              Vaciar carrito
            </button>
          </div>
          {/* Resumen de compra */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen de compra</h3>
              <div className="summary-line">
                <span>Productos ({selectedProducts.reduce((total, item) => total + item.quantity, 0)})</span>
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
  const maxStock = item.stock || 999;
  const canIncrease = item.quantity < maxStock;
  
  return (
    <div className="cart-item-card">
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
            {item.stock && (
              <span className={`feature stock ${item.stock < 5 ? 'low' : ''}`}>
                Stock: {item.stock}
              </span>
            )}
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
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className={`quantity-btn ${!canIncrease ? 'disabled' : ''}`}
            disabled={!canIncrease}
            title={!canIncrease ? `Stock máximo: ${maxStock}` : 'Aumentar cantidad'}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
          {!canIncrease && (
            <small className="stock-warning">Máximo: {maxStock}</small>
          )}
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
          aria-label="Eliminar producto del carrito"
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
    </div>
  );
}

export default Cart;
