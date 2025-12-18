import { NavLink } from "react-router-dom";
import { Home, Search, MapPin, Building2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const base =
  "flex flex-col items-center justify-center gap-1 rounded-2xl min-h-[64px] px-4 flex-1 transition";
const active = "bg-gray-900 text-white";
const idle = "bg-white text-gray-800";

export default function KioskNav() {
  const { cartCount } = useCart();

  const Item = ({ to, icon: Icon, label, badge }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${base} ${isActive ? active : idle} shadow-sm`
      }
    >
      <div className="relative">
        <Icon size={26} />
        {badge > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] px-1 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </NavLink>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-50/95 backdrop-blur border-t">
      <div className="mx-auto max-w-[1400px] px-4 py-3">
        <div className="flex gap-3">
          <Item to="/" icon={Home} label="Início" />
          <Item to="/catalog" icon={Search} label="Catálogo" />
          <Item to="/map" icon={MapPin} label="Mapa" />
          <Item to="/rentals" icon={Building2} label="Alugar" />
          <Item to="/cart" icon={ShoppingCart} label="Carrinho" badge={cartCount} />
        </div>
      </div>
    </div>
  );
}
