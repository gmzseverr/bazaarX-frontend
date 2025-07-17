// components/AddToCartButton.jsx
"use client";

import React from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { toast } from "react-toastify";

// Receive fetchCartCount as a prop
function AddToCart({ productId, className, fetchCartCount }) {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!user || !user.id) {
      console.error(
        "User ID is missing for authenticated user during add to cart."
      );
      toast.error("User information incomplete. Please try logging in again.");
      return;
    }

    try {
      const response = await api.post(`/user/cart/${productId}`);

      if (response.data.isAdded) {
        toast.success("Product added to cart!");
        // Crucial change: After successful addition, tell the parent to re-fetch the count
        if (fetchCartCount) {
          fetchCartCount();
        }
      } else {
        toast.info("Product is already in your cart.");
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          setIsAuthModalOpen(true);
        } else if (error.response.status === 404) {
          toast.error("Product not found or user does not exist.");
        } else {
          toast.error("Failed to add product to cart. Please try again later.");
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className={
          className ||
          "bg-black ease-in-out text-white py-2 px-5  font-semibold hover:bg-neutral-800 hover:scale-110 cursor-pointer transition duration-300 shadow-md self-start "
        }
      >
        Add to Cart
      </button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default AddToCart;
