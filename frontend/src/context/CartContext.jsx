import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Migration: Clear old cart items that don't have restaurant data
  useEffect(() => {
    const hasLegacyItems = cartItems.some(item => !item.restaurant && !item.restaurantId);
    if (hasLegacyItems && cartItems.length > 0) {
      console.warn('Clearing legacy cart items without restaurant data');
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food, restaurantData = null) => {
    if (!food || !food._id) {
        console.error('Invalid food item added to cart', food);
        return;
    }

    // Ensure restaurant data is attached
    const foodWithRestaurant = { ...food };
    if (restaurantData) {
        foodWithRestaurant.restaurant = restaurantData;
    }

    setCartItems((prev) => {
      // Check if trying to add from a different restaurant
      if (prev.length > 0) {
          const currentRestId = prev[0].restaurant?._id || prev[0].restaurantId || prev[0].restaurant;
          const newRestId = foodWithRestaurant.restaurant?._id || foodWithRestaurant.restaurantId || foodWithRestaurant.restaurant;
          
          if (currentRestId && newRestId && String(currentRestId) !== String(newRestId)) {
              if (window.confirm('Items from another restaurant already in cart. Clear cart and add this item?')) {
                  return [{ ...foodWithRestaurant, quantity: 1 }];
              }
              return prev;
          }
      }

      const foodIdStr = food._id.toString();
      const existing = prev.find((item) => item._id.toString() === foodIdStr);
      
      if (existing) {
        return prev.map((item) => 
          item._id.toString() === foodIdStr ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prev, { ...foodWithRestaurant, quantity: 1 }];
    });
  };

  const decreaseQuantity = (foodId) => {
    setCartItems((prev) => {
      const foodIdStr = foodId.toString();
      const existing = prev.find((item) => item._id.toString() === foodIdStr);
      if (existing && existing.quantity > 1) {
        return prev.map((item) => 
          item._id.toString() === foodIdStr ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item._id.toString() !== foodIdStr);
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id.toString() !== foodId.toString()));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, decreaseQuantity, removeFromCart, clearCart, totalAmount, appliedCoupon, setAppliedCoupon }}>
      {children}
    </CartContext.Provider>
  );
};
