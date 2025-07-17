import React, { useEffect, useState } from "react";
import api from "@/lib/api";

import ProductCard from "./ProductCard";
import AuthModal from "./AuthModal";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/user/favorites");
        setFavorites(response.data);
      } catch (err) {
        setError("Failed to load favorites.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading)
    return <p className="text-center py-8 text-xl">Loading favorites...</p>;

  if (error)
    return <p className="text-center py-8 text-xl text-red-500">{error}</p>;

  if (favorites.length === 0)
    return (
      <p className="text-center py-8 text-xl">
        You have no favorite products yet.
      </p>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Favorite Products</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Favorites;
