"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import api from "@/lib/api";

function ProductList() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedBrand = searchParams.get("brand");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, selectedBrand]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let apiUrl = "/products/";

        if (selectedCategory) {
          apiUrl = `/products/categories/${encodeURIComponent(
            selectedCategory
          )}`;
        } else if (selectedBrand) {
          apiUrl = `/products/brands/${encodeURIComponent(selectedBrand)}`;
        }

        const response = await api.get(apiUrl);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand]);

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (!sortBy) return products;

    if (sortBy === "price") {
      return [...products].sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return products;
  }, [products, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    if (sortBy !== "price") {
      setSortBy("price");
      setSortOrder("asc");
    } else {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

  return (
    <div>
      <div className="flex py-4  items-center gap-4">
        <h2 className="text-2xl font-bold">
          {selectedCategory
            ? selectedCategory
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : selectedBrand
            ? selectedBrand
            : "All Products"}
        </h2>

        <button
          onClick={toggleSortOrder}
          className="px-3 ring cursor-pointer py-2 flex items-center gap-2"
        >
          Sort by Price
          {sortBy === "price" &&
            (sortOrder === "asc" ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            ))}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 ">
        {loading ? (
          <p className="col-span-full text-center text-gray-600">
            Loading products...
          </p>
        ) : error ? (
          <p className="col-span-full text-center text-red-600">{error}</p>
        ) : sortedProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No products found for this selection.
          </p>
        ) : (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
