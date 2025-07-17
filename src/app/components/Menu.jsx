"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Menu() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    axios;
    api
      .get("/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories", err));

    axios;
    api
      .get("/products/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Failed to fetch brands", err));
  }, []);

  useEffect(() => {
    if (!isMainMenuOpen) {
      setIsCategoriesMenuOpen(false);
      setIsBrandsMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  }, [isMainMenuOpen]);

  const closeAllSubMenus = () => {
    setIsCategoriesMenuOpen(false);
    setIsBrandsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const closeAllMenusAndSubMenus = () => {
    setIsMainMenuOpen(false);
    closeAllSubMenus();
  };

  const handleLogout = () => {
    logout();
    closeAllMenusAndSubMenus();
    const handleUserMenuToggle = () => {
      closeAllSubMenus();
      setIsUserMenuOpen((prev) => !prev);
    };

    const handleCategoriesMenuToggle = () => {
      closeAllSubMenus();
      setIsCategoriesMenuOpen((prev) => !prev);
    };

    const handleBrandsMenuToggle = () => {
      closeAllSubMenus();
      setIsBrandsMenuOpen((prev) => !prev);
    };

    return (
      <div>
        <div
          onClick={() => setIsMainMenuOpen((prev) => !prev)}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28px"
            viewBox="0 -960 960 960"
            width="28px"
            fill="#000000"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </div>

        {isMainMenuOpen && (
          <div className="py-12 absolute bg-black font-semibold dark:bg-white text-white flex flex-col items-center gap-8 left-0 top-20 w-full h-[calc(100vh-80px)] overflow-y-auto z-10">
            {isAuthenticated && user ? (
              <div className="flex flex-col items-center w-full">
                <button
                  onClick={handleUserMenuToggle}
                  className="text-white hover:text-neutral-300 mb-2"
                >
                  Hi, {user.fullName || "User"}! {isUserMenuOpen ? "▲" : "▼"}
                </button>
                {isUserMenuOpen && (
                  <div className="flex flex-col items-center gap-4 mt-2">
                    <Link
                      href="/profile"
                      className="text-sm text-neutral-400 hover:text-white hover:underline"
                      onClick={closeAllMenusAndSubMenus}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-neutral-400 hover:text-white hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" onClick={closeAllMenusAndSubMenus}>
                Login/Register
              </Link>
            )}

            <Link href="/" onClick={closeAllMenusAndSubMenus}>
              Homepage
            </Link>
            <Link href="/shop/products" onClick={closeAllMenusAndSubMenus}>
              Shop
            </Link>
            <Link href="/" onClick={closeAllMenusAndSubMenus}>
              Deals
            </Link>

            <button
              onClick={handleCategoriesMenuToggle}
              className="text-white hover:text-neutral-300"
            >
              Categories {isCategoriesMenuOpen ? "▲" : "▼"}
            </button>
            {isCategoriesMenuOpen && (
              <div className="flex flex-col items-center gap-4 mt-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/shop/products?category=${encodeURIComponent(
                      category
                    )}`}
                    className="text-sm text-neutral-400 hover:text-white hover:underline"
                    onClick={closeAllMenusAndSubMenus}
                  >
                    {category
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Link>
                ))}
                <Link
                  href="/shop/products"
                  className="text-sm text-neutral-400 hover:text-white hover:underline border-t border-neutral-700 pt-2 mt-2 w-full text-center"
                  onClick={closeAllMenusAndSubMenus}
                >
                  All Categories
                </Link>
              </div>
            )}

            <button
              onClick={handleBrandsMenuToggle}
              className="text-white hover:text-neutral-300"
            >
              Brands {isBrandsMenuOpen ? "▲" : "▼"}
            </button>
            {isBrandsMenuOpen && (
              <div className="grid grid-cols-2 items-center justify-between gap-4 mt-2">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/shop/products?brand=${encodeURIComponent(brand)}`}
                    className="text-sm text-neutral-400 hover:text-white hover:underline"
                    onClick={closeAllMenusAndSubMenus}
                  >
                    {brand}
                  </Link>
                ))}
                <Link
                  href="/shop/products"
                  className="text-sm text-neutral-400 hover:text-white hover:underline border-t border-neutral-700 pt-2 mt-2 w-full text-center"
                  onClick={closeAllMenusAndSubMenus}
                >
                  All Brands
                </Link>
              </div>
            )}

            <Link href="/" onClick={closeAllMenusAndSubMenus}>
              Cart(1)
            </Link>
          </div>
        )}
      </div>
    );
  };
}
