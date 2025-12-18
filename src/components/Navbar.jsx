import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, MapPin, Gift, Home, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import Container from './Container';
import { Building2 } from 'lucide-react';


export default function Navbar() {
  const { cartCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/catalog', icon: Search, label: 'Catálogo' },
    { path: '/map', icon: MapPin, label: 'Mapa' },
    { path: '/rentals', icon: Building2, label: 'Alugar Loja' },
    { path: '/loyalty', icon: Gift, label: 'Fidelidade' },
    { path: '/cart', icon: ShoppingCart, label: 'Carrinho', badge: cartCount },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/80">
      <Container>
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-apple group-hover:scale-105">
              <span className="text-white font-semibold text-lg">V</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-lg text-gray-900">
                Vitrine Digital
              </span>
              <div className="text-xs text-gray-500 font-normal">SCS</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-apple relative group min-h-[44px] ${
                  location.pathname === item.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={24} className={location.pathname === item.path ? '' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-apple min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/80">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-apple mb-2 relative min-h-[44px] ${
                  location.pathname === item.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={24} />
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[11px] font-semibold rounded-full min-w-[20px] h-5 px-2 ml-auto shadow-lg flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </nav>
  );
}
