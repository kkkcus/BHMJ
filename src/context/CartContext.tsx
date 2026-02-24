import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CartItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'checked'>) => void;
  removeItem: (id: number) => void;
  toggleCheck: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'bhmj_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // items가 바뀔 때마다 localStorage 동기화
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'id' | 'checked'>) => {
    setItems(prev => {
      // 같은 이름+단위 재료면 수량 합산
      const exists = prev.find(i => i.name === item.name && i.unit === item.unit);
      if (exists) {
        return prev.map(i =>
          i.id === exists.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: Date.now() + prev.length, checked: false }];
    });
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleCheck = (id: number) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    );
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, toggleCheck }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
