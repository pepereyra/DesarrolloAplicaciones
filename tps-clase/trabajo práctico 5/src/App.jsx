import { CartProvider } from './contexts/CartContext';
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <header className="app-header">
          <h1>🛒 E-commerce React</h1>
          <p>Aplicación de ejemplo usando useState, useEffect y useContext</p>
        </header>
        
        <main className="app-main">
          <div className="content-container">
            <div className="products-section">
              <ProductList />
            </div>
            
            <div className="cart-section">
              <CartSummary />
            </div>
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Desarrollado con React Hooks - Clase 5</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
