import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Truck, Store, ShoppingCart, ChevronLeft, Clock, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products, stores } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');

  const product = products.find(p => p.id === parseInt(id));
  const store = stores.find(s => s.id === product?.storeId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Produto não encontrado</h2>
          <Link to="/catalog" className="text-primary hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const otherStoreProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, deliveryMethod);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-xl"
              />
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-xl font-bold">
                  -{discount}% OFF
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link to={`/catalog?category=${product.category}`} className="hover:text-primary">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </div>

              <h1 className="text-3xl font-bold text-dark mb-3">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="text-accent fill-accent" size={20} />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.stock} em estoque</span>
              </div>

              <Link
                to={`/map?store=${store?.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
              >
                <MapPin size={18} />
                <span>{store?.name}</span>
                <span className="text-gray-400">- {store?.address}</span>
              </Link>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-success text-sm mt-1">
                  Ganhe {Math.floor(product.price)} pontos nesta compra!
                </p>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold text-dark mb-3">Como você quer receber?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Store size={24} className={deliveryMethod === 'pickup' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Retire no SCS</span>
                    <span className="text-sm text-success">Grátis + Pontos 2x</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Truck size={24} className={deliveryMethod === 'delivery' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Delivery</span>
                    <span className="text-sm text-gray-500">A partir de R$ 9,90</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Quantidade:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
              >
                <ShoppingCart size={20} />
                Adicionar ao Carrinho - R$ {(product.price * quantity).toFixed(2)}
              </button>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <span>Disponível em até 2h</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={18} />
                  <span>Embalagem segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {otherStoreProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-dark mb-6">Produtos Relacionados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherStoreProducts.map(p => {
                const pDiscount = Math.round((1 - p.price / p.originalPrice) * 100);
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                      {pDiscount > 0 && (
                        <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-lg text-sm">
                          -{pDiscount}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-dark line-clamp-1">{p.name}</h3>
                      <p className="text-primary font-bold mt-1">R$ {p.price.toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
