import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { stores } from '../data/mockData';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const store = stores.find(s => s.id === product.storeId);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-3xl shadow-base overflow-hidden hover:shadow-lg transition-apple">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/4 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
          {discount > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-white text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-md">
                -{discount}%
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <MapPin size={16} className="text-gray-400" />
          <span className="font-medium">{store?.name}</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-lg mb-4 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-semibold text-gray-900">
              R$ {product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition-apple font-medium text-[17px] min-h-[44px]"
        >
          <ShoppingCart size={20} />
          Adicionar
        </button>
      </div>
    </div>
  );
}
