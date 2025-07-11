"use client";

import ProductList from "@/app/components/ProductList";
import { Suspense } from "react";

export default function ShopPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
      <Suspense
        fallback={<div className="text-center">Loading products...</div>}
      >
        <ProductList />
      </Suspense>
    </div>
  );
}
