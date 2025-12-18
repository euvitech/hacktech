import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Map from "./pages/Map";
import Cart from "./pages/Cart";
import Loyalty from "./pages/Loyalty";
import Rentals from './pages/Rentals';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full">
          <Navbar />

          <main className="flex-1 w-full">
            {/* CENTRALIZA O "MIOLO" EM TELAS GRANDES */}
            <div className="mx-auto w-full max-w-7xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/map" element={<Map />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/loyalty" element={<Loyalty />} />
                <Route path="/rentals" element={<Rentals />} />

              </Routes>
            </div>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
