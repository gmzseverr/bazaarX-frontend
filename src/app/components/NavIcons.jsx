// components/NavIcons.jsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import CartModal from "./CartModal";
// import SearchBar from "./SearchBar"; // SearchBar'ı burada kullanmıyoruz, Navbar yönetecek
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons"; // Sepet ikonu
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons"; // Kalp ikonu (regular)
// Eğer solid kalp istiyorsanız: import { faHeart } from "@fortawesome/free-solid-svg-icons";

function NavIcons() {
  // isProfileOpen ve isSearchOpen state'leri burada kullanılmayacak,
  // çünkü AuthButtons ve Navbar bunları yönetecek.
  // const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false); // Sadece sepet modalı durumu

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-4 relative">
      <Link href="/favorites" className="relative cursor-pointer">
        <FontAwesomeIcon
          className="text-lg hover:text-primary-600 transition-colors"
          icon={faRegularHeart}
        />
      </Link>

      <div className="relative cursor-pointer" onClick={toggleCart}>
        <FontAwesomeIcon
          className="text-lg hover:text-primary-600 transition-colors"
          icon={faBagShopping}
        />
        <div className="absolute text-xs font-semibold text-white -top-3 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
          2
        </div>
        {isCartOpen && <CartModal setIsCartOpen={setIsCartOpen} />}
      </div>
    </div>
  );
}

export default NavIcons;
