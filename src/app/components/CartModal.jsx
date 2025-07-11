"use client";

import React, { useRef, useEffect } from "react";

function CartModal({ setIsCartOpen }) {
  const cartItems = [
    {
      id: "1",
      name: "ASOS Necklace",
      price: 43,
      quantity: 1,
    },
    {
      id: "2",
      name: "Cool T-Shirt",
      price: 25,
      quantity: 2,
    },
  ];

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

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

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
              <div className="w-20 h-24 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs">
                No Image
              </div>
              <div className="flex flex-col flex-1 justify-center">
                {" "}
                <div className="flex justify-between items-center mb-1">
                  {" "}
                  <h4 className="font-medium text-sm truncate pr-2">
                    {item.name}
                  </h4>{" "}
                  <p className="text-sm font-semibold text-nowrap">
                    ${item.price.toFixed(2)}
                  </p>{" "}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  <button className="text-red-500 text-xs hover:underline transition-colors">
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
            </p>{" "}
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {" "}
            <button className="w-full ring-1 ring-gray-300 bg-white text-black py-2 rounded-md hover:bg-gray-50 transition-all duration-200 text-sm">
              {" "}
              View Cart
            </button>
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all duration-200 text-sm">
              {" "}
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartModal;
