"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"; // Ürün detayına gitmek için
import { toast } from "react-toastify";

function CartPage() {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user?.id) {
        setCartItems([]);
        setLoading(false);
        toast.info("Please log in to view your cart.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/user/cart");
        const itemsWithQuantity = response.data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setCartItems(itemsWithQuantity);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setError("Failed to load cart items. Please try again.");
        if (err.response && err.response.status === 401) {
          toast.error("Your session has expired. Please log in.");
        } else {
          toast.error("Error fetching cart items.");
        }
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, user]);

  // Sepetten ürün çıkarma fonksiyonu
  const handleRemoveItem = async (productId) => {
    if (!isAuthenticated || !user?.id) {
      toast.error("You must be logged in to remove items from your cart.");
      return;
    }

    try {
      const response = await api.delete(`/user/cart/${productId}`);
      if (response.data.isRemoved) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
        toast.success("Product removed from cart!");
      } else {
        toast.error("Failed to remove product from cart.");
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const openClearCartModal = () => {
    if (!isAuthenticated || !user?.id) {
      toast.error("You must be logged in to clear your cart.");
      return;
    }

    if (cartItems.length === 0) {
      toast.info("Your cart is already empty.");
      return;
    }

    setShowClearCartModal(true); // modal aç
  };

  const confirmClearCart = async () => {
    try {
      const response = await api.delete("/user/cart");
      if (response.data.isCleared) {
        setCartItems([]);
        toast.success("Your cart has been cleared!");
      } else {
        toast.error("Failed to clear cart.");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setShowClearCartModal(false); // modal kapat
    }
  };

  // Miktar artırma fonksiyonu (şimdilik sadece görsel)
  const handleQuantityIncrease = (productId) => {
    // Burada backend'e API çağrısı yapmanız gerekir (örn: /user/cart/update/{productId}?quantity=...)
    // Şimdilik sadece frontend'de görsel olarak artırıyoruz.
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    toast.info("Quantity increased (visual only). Requires backend update.");
  };

  // Miktar azaltma fonksiyonu (şimdilik sadece görsel)
  const handleQuantityDecrease = (productId) => {
    // Burada backend'e API çağrısı yapmanız gerekir
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    toast.info("Quantity decreased (visual only). Requires backend update.");
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  const calculateShipping = () => {
    const subtotal = calculateTotal();
    return subtotal >= 50 ? 0 : 10;
  };
  const calculateGrandTotal = () => {
    return calculateTotal() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
        <p className="text-gray-600">Loading your cart items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
        <p className="text-red-500">Error: {error}</p>
        <p className="text-gray-600 mt-2">
          Please try refreshing the page or logging in again.
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 text-center py-20">
        <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
        <p className="text-gray-500 text-lg">Your cart is currently empty.</p>
        <Link
          href="/"
          className="mt-8 inline-block bg-black text-white py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container  dark:text-white mx-auto p-6 md:p-10 lg:p-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        Your Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sepet Ürünleri Listesi */}
        <div className="lg:w-2/3 ">
          <h3 className="text-xl font-semibold border-b pb-4 mb-6">
            Items in Your Cart ({cartItems.length})
          </h3>
          <div className="space-y-6  bg-white p-6 rounded-lg shadow-sm">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 border-b pb-6 last:border-b-0 last:pb-0"
              >
                {/* Ürün Görseli */}
                <Link
                  href={`/product/${item.id}`}
                  className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-sm overflow-hidden flex items-center justify-center"
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      width={128} // Resim boyutlarına uygun
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center p-2">
                      No Image
                    </span>
                  )}
                </Link>

                {/* Ürün Bilgileri ve Fiyat */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold line-clamp-2 pr-4">
                      <Link
                        href={`/product/${item.id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Category: {item.category}
                    </p>
                    <p className="text-gray-600 text-sm">Brand: {item.brand}</p>
                    {/* Miktar güncelleme kontrolleri */}
                    <div className="flex items-center mt-2 border border-black rounded-sm w-fit">
                      <button
                        onClick={() => handleQuantityDecrease(item.id)}
                        className="px-3 py-1 bg-black hover:bg-neutral-700 rounded-l-sm transition-colors text-lg font-semibold text-white cursor-pointer"
                        disabled={item.quantity <= 1} // Miktar 1 ise azaltma pasif
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-base font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityIncrease(item.id)}
                        className="px-3 py-1 bg-black hover:bg-neutral-700 rounded-r-sm transition-colors text-lg font-semibold text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end mt-4 sm:mt-0">
                    {item.discount > 0 && item.discount !== null ? (
                      <div className="text-right">
                        <p className="text-xl font-bold text-black">
                          £
                          {(
                            (item.price - (item.price * item.discount) / 100) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-gray-400 line-through text-sm">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600">
                          %{item.discount} OFF
                        </p>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-gray-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-3 cursor-pointer text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sepet Özeti */}
        <div className="lg:w-1/3 dark:text-black bg-white p-6 rounded-lg shadow-sm h-fit sticky top-20">
          <h3 className="text-xl font-semibold border-b pb-4 mb-6">
            Order Summary
          </h3>
          <div className="flex justify-between text-lg font-medium mb-3">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>£{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Shipping</span>
            <span>
              {calculateShipping() === 0 ? "Free" : `£${calculateShipping()}`}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-4">
            <span>Total</span>
            <span>£{calculateGrandTotal().toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <Link
              href="/user/order"
              className="w-full bg-black text-center dark:text-white text-white py-3 rounded-sm mt-6 hover:bg-gray-800 transition-colors duration-200 text-lg font-semibold"
            >
              Proceed to Order
            </Link>
            <button
              onClick={openClearCartModal}
              className="w-full bg-red-100 text-red-700 py-2 rounded-sm mt-4 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      {showClearCartModal && (
        <div className="fixed inset-0 border-black backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Clear Cart?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowClearCartModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearCart}
                className="px-4 py-2 rounded bg-black hover:bg-neutral-800 text-white"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
