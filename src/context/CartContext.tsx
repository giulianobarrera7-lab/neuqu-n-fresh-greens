import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CartProduct = {
  id: string;
  name: string;
  img: string;
  priceUnit: number;
  priceBox: number;
  boxSize: number;
};

type CartItemType = "unit" | "box";

export type CartItem = {
  product: CartProduct;
  quantity: number;
  type: CartItemType;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: CartProduct, type: CartItemType) => void;
  removeItem: (productId: string, type: CartItemType) => void;
  updateQuantity: (productId: string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const itemKey = (id: string, type: CartItemType) => `${id}-${type}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: CartProduct, type: CartItemType) => {
    setItems((prev) => {
      const key = itemKey(product.id, type);
      const existing = prev.find((i) => itemKey(i.product.id, i.type) === key);
      if (existing) {
        return prev.map((i) => itemKey(i.product.id, i.type) === key ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1, type }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, type: CartItemType) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.type === type)));
  }, []);

  const updateQuantity = useCallback((productId: string, type: CartItemType, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, type);
      return;
    }
    setItems((prev) => prev.map((i) => i.product.id === productId && i.type === type ? { ...i, quantity } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = i.type === "unit" ? i.product.priceUnit : i.product.priceBox;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
