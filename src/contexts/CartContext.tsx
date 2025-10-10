import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string; // Add variant to distinguish different options
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, quantity: number, variant?: string) => void;
  removeFromCart: (id: number, variant?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      // Create unique key combining id and variant
      const uniqueKey = `${item.id}-${item.variant || 'default'}`;
      const existingItem = prev.find(cartItem => 
        `${cartItem.id}-${cartItem.variant || 'default'}` === uniqueKey
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          `${cartItem.id}-${cartItem.variant || 'default'}` === uniqueKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && (item.variant || 'default') === (variant || 'default')
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (id: number, variant?: string) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.id === id && (item.variant || 'default') === (variant || 'default'))
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
