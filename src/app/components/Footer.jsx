"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/brands") // Your brand API endpoint
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Error fetching brands for footer:", err));
  }, []);

  return (
    <footer className="bg-black text-white py-10 px-4 md:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link
            href="/"
            className="text-3xl font-bold mb-4 text-white hover:text-neutral-300 transition-colors"
          >
            bazaarX
          </Link>
          <p className="text-sm text-neutral-400 max-w-xs mb-4">
            Discover, Shop, Make a Statement. Find the best brands and latest
            trends at BazaarX.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-400 transition-colors"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-400 transition-colors"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-400 transition-colors"
              aria-label="YouTube"
            >
              <FontAwesomeIcon icon={faYoutube} size="2x" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop/products"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Shop All
              </Link>
            </li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

        {/* Right Section: Popular Brands (Optional and Dynamic) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4">Popular Brands</h3>
          {brands.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
              {brands.slice(0, 10).map(
                (
                  brand // Display first 10 brands, or all if less
                ) => (
                  <li key={brand}>
                    <Link
                      href={`/shop/products?brand=${encodeURIComponent(brand)}`}
                      className="text-neutral-400 hover:text-white transition-colors"
                      // Add any specific onClick handling if needed for analytics or menu closing
                    >
                      {brand}
                    </Link>
                  </li>
                )
              )}
              {brands.length > 10 && (
                <li>
                  <Link
                    href="/shop/products"
                    className="text-neutral-400 hover:text-white transition-colors text-sm italic"
                  >
                    View All Brands...
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-neutral-400 text-sm">Loading brands...</p>
          )}
        </div>
      </div>

      {/* Copyright (Bottom Section) */}
      <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} BazaarX. All rights reserved.
      </div>
    </footer>
  );
}
