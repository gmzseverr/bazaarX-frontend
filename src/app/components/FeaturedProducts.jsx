"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import Link from "next/link";
import ProductCard from "./ProductCard";
import api from "@/lib/api";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await api.get("/products/random");

        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        setFeatured(selected);
      } catch (err) {
        console.error("Error fetching featured products", err);
      }
    };

    fetchRandomProducts();
  }, []);

  return (
    <section className="md:px-15 px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <Link href="/shop" className=" hover:underline text-sm ">
          More →
        </Link>
      </div>
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
