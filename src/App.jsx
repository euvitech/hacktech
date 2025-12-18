import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


import KioskShell from "./components/KioskShell";
import KioskNav from "./components/KioskNav";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Map from "./pages/Map";
import Cart from "./pages/Cart";
import Loyalty from "./pages/Loyalty";
import Rentals from "./pages/Rentals"; // sua tela de aluguéis

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <KioskShell idleSeconds={120}>
          {/* espaço inferior pra barra do totem */}
          <div className="pb-28">
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

          <KioskNav />
        </KioskShell>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
