import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Store, Truck, ShoppingBag, ChevronRight, Gift } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { stores } from '../data/mockData';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateDeliveryMethod,
    clearCart,
    cartTotal,
    loyalty,
    addPoints,
    useCashback
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [useCashbackAmount, setUseCashbackAmount] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');

  const pickupItems = cart.filter(item => item.deliveryMethod === 'pickup');
  const deliveryItems = cart.filter(item => item.deliveryMethod === 'delivery');

  const pickupTotal = pickupItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryTotal = deliveryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryItems.length > 0 ? 9.90 : 0;

  const subtotal = cartTotal;
  const finalTotal = subtotal + deliveryFee - useCashbackAmount;
  const pointsToEarn = Math.floor(pickupTotal * 2) + Math.floor(deliveryTotal);

  const handleCheckout = () => {
    const orderNum = `SCS${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    addPoints(finalTotal);
    if (useCashbackAmount > 0) {
      useCashback(useCashbackAmount);
    }
    clearCart();
    setOrderComplete(true);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Explore nossos produtos e adicione ao carrinho</p>
          <Link
            to="/catalog"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90"
          >
            Explorar Produtos
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-500 mb-6">Número do pedido: <strong>{orderNumber}</strong></p>

          {pickupItems.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-dark mb-4">QR Code para Retirada</h3>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <QRCodeSVG value={`VITRINE-SCS-${orderNumber}`} size={150} />
              </div>
              <p className="text-sm text-gray-600">
                Apresente este código na loja para retirar seu pedido
              </p>
            </div>
          )}

          <div className="bg-accent/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Gift size={20} />
              <span className="font-semibold">+{pointsToEarn} pontos ganhos!</span>
            </div>
          </div>

          <Link
            to="/"
            className="block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-dark mb-6">Meu Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const store = stores.find(s => s.id === item.storeId);
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`} className="font-semibold text-dark hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{store?.name}</p>
                      <p className="text-primary font-bold mt-2">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateDeliveryMethod(item.id, 'pickup')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                          item.deliveryMethod === 'pickup'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Store size={16} />
                        Retirar
                      </button>
                      <button
                        onClick={() => updateDeliveryMethod(item.id, 'delivery')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                          item.deliveryMethod === 'delivery'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Truck size={16} />
                        Delivery
                      </button>
                    </div>

                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-dark mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 text-sm">
                {pickupItems.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirada ({pickupItems.length} itens)</span>
                    <span>R$ {pickupTotal.toFixed(2)}</span>
                  </div>
                )}
                {deliveryItems.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery ({deliveryItems.length} itens)</span>
                      <span>R$ {deliveryTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de entrega</span>
                      <span>R$ {deliveryFee.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {(subtotal + deliveryFee).toFixed(2)}</span>
                  </div>
                </div>

                {loyalty.cashback > 0 && (
                  <div className="bg-success/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-success font-medium">Cashback disponível</span>
                      <span className="text-success font-bold">R$ {loyalty.cashback.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Usar cashback"
                        value={useCashbackAmount || ''}
                        onChange={(e) => {
                          const val = Math.min(loyalty.cashback, Math.max(0, parseFloat(e.target.value) || 0));
                          setUseCashbackAmount(Math.min(val, subtotal + deliveryFee));
                        }}
                        className="flex-1 px-3 py-1.5 border rounded text-sm"
                      />
                      <button
                        onClick={() => setUseCashbackAmount(Math.min(loyalty.cashback, subtotal + deliveryFee))}
                        className="px-3 py-1.5 bg-success text-white rounded text-sm"
                      >
                        Usar tudo
                      </button>
                    </div>
                  </div>
                )}

                {useCashbackAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Desconto cashback</span>
                    <span>-R$ {useCashbackAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-3 flex items-center gap-2">
                  <Gift size={18} className="text-accent" />
                  <span className="text-sm">
                    Você vai ganhar <strong className="text-accent">{pointsToEarn} pontos</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold mt-6 flex items-center justify-center gap-2 hover:bg-opacity-90"
              >
                Finalizar Compra
                <ChevronRight size={20} />
              </button>

              <Link
                to="/catalog"
                className="block text-center text-primary mt-4 hover:underline"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
