import { createContext, useContext, useState, useEffect } from 'react';
import { initialLoyalty, loyaltyLevels } from '../data/mockData';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vitrine-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('vitrine-loyalty');
    return saved ? JSON.parse(saved) : initialLoyalty;
  });

  useEffect(() => {
    localStorage.setItem('vitrine-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vitrine-loyalty', JSON.stringify(loyalty));
  }, [loyalty]);

  const addToCart = (product, quantity = 1, deliveryMethod = 'pickup') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, deliveryMethod }
            : item
        );
      }
      return [...prev, { ...product, quantity, deliveryMethod }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateDeliveryMethod = (productId, method) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, deliveryMethod: method } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addPoints = (amount) => {
    const pointsEarned = Math.floor(amount);
    setLoyalty(prev => {
      const newPoints = prev.points + pointsEarned;
      const newCashback = prev.cashback + (amount * (getCurrentLevel(newPoints).cashbackRate / 100));
      return {
        ...prev,
        points: newPoints,
        cashback: Math.round(newCashback * 100) / 100,
        totalSpent: prev.totalSpent + amount,
        level: getCurrentLevel(newPoints).name
      };
    });
  };

  const getCurrentLevel = (points = loyalty.points) => {
    return loyaltyLevels.find(level => points >= level.minPoints && points <= level.maxPoints) || loyaltyLevels[0];
  };

  const useCashback = (amount) => {
    setLoyalty(prev => ({
      ...prev,
      cashback: Math.max(0, prev.cashback - amount)
    }));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateDeliveryMethod,
      clearCart,
      cartTotal,
      cartCount,
      loyalty,
      addPoints,
      useCashback,
      getCurrentLevel
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
