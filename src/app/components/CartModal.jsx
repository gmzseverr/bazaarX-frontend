// components/CartModal.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { toast } from "react-toastify";

// Yeni prop: onCartItemsChange
function CartModal({ setIsCartOpen, onCartItemsChange }) {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsCartOpen]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user?.id) {
        setCartItems([]);
        setLoading(false);

        if (onCartItemsChange) {
          onCartItemsChange(0);
        }
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

        if (onCartItemsChange) {
          onCartItemsChange(itemsWithQuantity.length);
        }
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setError("Failed to load cart items. Please try again.");
        toast.error("Error fetching cart items.");
        setCartItems([]);

        if (onCartItemsChange) {
          onCartItemsChange(0);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, user, onCartItemsChange]);

  const handleRemoveItem = async (productId) => {
    if (!isAuthenticated || !user?.id) {
      toast.error("You must be logged in to remove items from your cart.");
      return;
    }

    try {
      const response = await api.delete(`/user/cart/${productId}`);
      if (response.data.isRemoved) {
        const updatedItems = (prevItems) =>
          prevItems.filter((item) => item.id !== productId);
        setCartItems(updatedItems);

        if (onCartItemsChange) {
          onCartItemsChange(updatedItems.length);
        }
        toast.success("Product removed from cart!");
      } else {
        toast.error("Failed to remove product from cart.");
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div
        ref={modalRef}
        className="absolute top-12 right-0 w-80 p-4 bg-white shadow-xl rounded-lg z-50 border border-gray-200 text-center text-gray-500"
      >
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={modalRef}
        className="absolute top-12 right-0 w-80 p-4 bg-white shadow-xl rounded-lg z-50 border border-gray-200 text-center text-red-500"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      ref={modalRef}
      className="absolute top-12 right-0 w-80 p-4 bg-white shadow-xl rounded-lg z-50 border border-gray-200"
    >
      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-center py-8">Your cart is empty</div>
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold border-b pb-2">Shopping Cart</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="w-20 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center p-2">
                    No Image
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
                    {item.name}
                  </h4>
                  <p className="text-sm font-semibold text-nowrap">
                    ${item.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 text-xs hover:underline transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 border-t pt-2">
            <h4 className="font-semibold">Total</h4>
            <p className="text-base font-bold">
              ${calculateTotal().toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/user/cart"
              onClick={() => setIsCartOpen(false)}
              className="w-full ring-1 ring-gray-300 bg-white text-black py-2 rounded-md hover:bg-gray-50 transition-all duration-200 text-sm text-center" // Tailwind sınıflarını koru
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartModal;
