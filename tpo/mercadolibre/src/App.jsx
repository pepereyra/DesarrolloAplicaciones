import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';
import SellerPanel from './pages/SellerPanel';
import SellerProfile from './pages/SellerProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/producto/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/carrito" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/favoritos" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/vender" 
                    element={
                      <ProtectedRoute>
                        <SellerPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/vendedor/:sellerId" element={<SellerProfile />} />
                  <Route path="/category/:category" element={<Category />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AppProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
