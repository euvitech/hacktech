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

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full">
          <Navbar />

          <main className="flex-1 w-full">
            {/* CENTRALIZA O "MIOLO" EM TELAS GRANDES */}
            <div className="w-full mx-auto max-w-screen-2xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/map" element={<Map />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/loyalty" element={<Loyalty />} />
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
