// src/app/shop/page.jsx
"use client"; // ProductList Client Component ise bu da client olmalı

import ProductList from "@/app/components/ProductList";

export default function ShopPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Tüm Ürünler</h1>
      <ProductList />
    </div>
  );
}
