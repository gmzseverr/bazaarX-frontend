"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const AuthButtons = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2 font-semibold  hover:font-bold text-black transition-colors cursor-pointer " // Font-medium ekledim
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="true"
        >
          {user.fullName || "Profile"}{" "}
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bg-white shadow-lg rounded-md top-10 right-0 text-sm z-50 min-w-[120px] border border-neutral-100">
            <Link
              href="/user/profile"
              className="block font-medium hover:bg-neutral-100 hover:text-black px-4 py-2 transition-colors"
              onClick={() => setIsProfileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setIsProfileMenuOpen(false);
              }}
              className="block w-full text-left font-medium hover:bg-neutral-100 hover:text-black px-4 py-2 transition-colors border-t border-neutral-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth"
        className=" font-semibold  hover:font-bold text-black  transition-colors "
      >
        Login/Register
      </Link>
    </div>
  );
};

export default AuthButtons;
