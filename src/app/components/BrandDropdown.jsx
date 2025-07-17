"use client";

import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export default function BrandDropdown({ onSelect }) {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios;
    api
      .get("/products/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="hover:font-semibold cursor-pointer"
      >
        Brands
      </button>

      {open && (
        <div
          className="absolute top-12 mt-2 bg-white text-black p-4 shadow-xl rounded-lg z-50 w-[400px] max-h-60 overflow-y-auto" // Scrollable dropdown
          onMouseLeave={() => setOpen(false)}
        >
          <div className="grid grid-cols-2 items-center gap-2">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/shop/?brand=${encodeURIComponent(brand)}`}
                className="block px-2 py-1 hover:bg-black hover:text-white text-sm"
                onClick={() => {
                  setOpen(false);
                  if (onSelect) onSelect(brand);
                }}
              >
                {brand}
              </Link>
            ))}

            <Link
              href="/shop"
              className="block px-2 py-1 hover:bg-black hover:text-white text-sm col-span-2 text-center border-t mt-2 pt-2"
              onClick={() => setOpen(false)}
            >
              All Brands
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
