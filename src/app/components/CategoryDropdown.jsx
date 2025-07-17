"use client";

import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CategoryDropdown({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios;
    api
      .get("/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="hover:font-semibold cursor-pointer"
      >
        Categories
      </button>

      {open && (
        <div
          className="absolute top-12 mt-2 bg-white text-black p-4 shadow-xl rounded-lg z-50 w-90"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="grid grid-cols-2 items-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/shop/?category=${encodeURIComponent(cat)}`}
                className="block px-2 py-1 hover:bg-black hover:text-white text-sm"
                onClick={() => {
                  setOpen(false);
                  if (onSelect) onSelect(cat);
                }}
              >
                {cat
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Link>
            ))}

            <Link
              href="/shop"
              className="block px-2 py-1 hover:bg-black hover:text-white text-sm col-span-2 text-center border-t mt-2 pt-2"
              onClick={() => setOpen(false)}
            >
              All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
