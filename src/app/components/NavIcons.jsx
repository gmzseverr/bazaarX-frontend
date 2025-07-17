// components/NavIcons.jsx
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import CartModal from "./CartModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
// api is no longer needed here because fetchCartCount is passed as a prop from a parent
// import api from "@/lib/api";

// Receive cartItemCount, setCartItemCount, and fetchCartCount as props from a parent
function NavIcons({ cartItemCount, setCartItemCount, fetchCartCount }) {
  const { isAuthenticated } = useAuth(); // 'user' is not needed directly here as fetchCartCount handles the user logic

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // The fetchCartCount logic is now assumed to be handled by the parent
  // that passes it as a prop. So, remove the local declaration.

  // useEffect to fetch initial cart count when the component mounts
  // This useEffect will now call the 'fetchCartCount' function received via props.
  useEffect(() => {
    // Make sure fetchCartCount is actually provided before calling it
    if (fetchCartCount) {
      fetchCartCount();
    }
  }, [fetchCartCount, isAuthenticated]); // Re-run if fetchCartCount prop changes or auth status changes

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCartOpen((prev) => !prev);
      // When cart modal is opened, it might be good to re-fetch to ensure the count is fresh
      if (!isCartOpen && fetchCartCount) {
        // If opening the cart modal and fetchCartCount is provided
        fetchCartCount();
      }
    }
  };

  const handleFavoritesClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  // This handleCartItemsChange function is now less critical
  // if CartModal calls fetchCartCount directly after changes.
  // However, keeping it for flexibility or if CartModal directly manipulates count.
  const handleCartItemsChange = (count) => {
    setCartItemCount(count);
  };

  return (
    <div className="flex items-center gap-4 relative">
      <Link
        href="/user/favorites"
        className="relative cursor-pointer"
        onClick={handleFavoritesClick}
      >
        <FontAwesomeIcon
          className="text-lg hover:text-primary-600 transition-colors"
          icon={faRegularHeart}
        />
      </Link>

      <div className="relative cursor-pointer" onClick={handleCartClick}>
        <FontAwesomeIcon
          className="text-lg hover:text-primary-600 transition-colors"
          icon={faBagShopping}
        />

        {/* This is the correct placement for the cart count badge */}
        {cartItemCount > 0 && (
          <div className="absolute text-xs font-semibold text-white -top-3 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
            {cartItemCount}
          </div>
        )}

        {/* Removed the duplicate cartItemCount badge rendering */}

        {isCartOpen && isAuthenticated && (
          <CartModal
            setIsCartOpen={setIsCartOpen}
            // Now, pass the 'fetchCartCount' prop to 'onCartItemsChanged'
            // so CartModal can trigger a full re-fetch from the API if items change within it.
            onCartItemsChanged={fetchCartCount}
          />
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default NavIcons;
