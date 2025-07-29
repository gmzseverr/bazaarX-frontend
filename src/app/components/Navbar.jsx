"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import NavIcons from "./NavIcons";
import CategoryDropdown from "./CategoryDropdown";
import BrandDropdown from "./BrandDropdown";

import AuthButtons from "./AuthButtons";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = async () => {
    if (isAuthenticated && user?.id) {
      try {
        const response = await api.get("/user/cart/count");
        setCartItemCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch cart count in Navbar:", error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, user?.id]);

  return (
    <div className="h-20 px-6 md:px-8 relative border-b border-gray-200">
      {/* mobile */}
      <div className="flex md:hidden items-center justify-between h-full">
        <Link href="/" className="font-extrabold tracking-wide text-xl">
          bazaarX
        </Link>
        <div className="flex items-center gap-4">
          <Menu />
        </div>
      </div>

      <div className="hidden md:flex items-center h-full justify-between gap-4 xl:gap-8">
        <div className="flex-1 flex items-center gap-8">
          <Link href="/" className="font-bold text-3xl">
            bazaarX
          </Link>
          <div className="hidden lg:flex gap-6">
            <Link href="/" className="hover:text-primary-600">
              Homepage
            </Link>
            <Link href="/shop" className="hover:text-primary-600">
              Shop
            </Link>

            <BrandDropdown />
            <CategoryDropdown />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end gap-6">
          <NavIcons
            cartItemCount={cartItemCount}
            setCartItemCount={setCartItemCount}
            fetchCartCount={fetchCartCount}
          />
          <AuthButtons />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
